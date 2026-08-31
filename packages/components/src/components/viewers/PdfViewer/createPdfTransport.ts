import { PDFDataRangeTransport } from 'pdfjs-dist';
import type { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import type { RefreshUrlHandler } from '../useMediaRefresh';

interface PdfTransportOptions {
  url: string;
  chunkSize: number;
  signal: AbortSignal;
  refreshUrl?: RefreshUrlHandler;
  onError: (error: unknown) => void;
}

/** Own the network session independently of PDF.js's document and range cache. */
export async function createPdfTransport(options: PdfTransportOptions): Promise<DocumentInitParameters> {
  const controller = new AbortController();
  const { signal } = controller;
  const abort = () => controller.abort();
  options.signal.throwIfAborted();
  options.signal.addEventListener('abort', abort, { once: true });
  let url = options.url;
  let refreshPromise: Promise<void> | null = null;
  let canRefresh = true;
  let length: number | undefined;
  let etag: string | null = null;

  function dispose() {
    options.signal.removeEventListener('abort', abort);
    controller.abort();
  }

  async function refresh(failedUrl: string) {
    signal.throwIfAborted();
    // Another range may already have renewed this URL.
    if (url !== failedUrl) return;
    if (refreshPromise) return refreshPromise;
    const refreshUrl = options.refreshUrl;
    if (!refreshUrl || !canRefresh) throw new Error('Unable to refresh the PDF URL.');
    canRefresh = false;
    refreshPromise = (async () => {
      const replacement = (await refreshUrl(failedUrl))?.trim();
      signal.throwIfAborted();
      if (!replacement || replacement === failedUrl) throw new Error('No fresh PDF URL was returned.');
      url = replacement;
    })();
    try { await refreshPromise; } finally { refreshPromise = null; }
  }

  async function readRange(begin: number, end: number): Promise<Uint8Array> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      signal.throwIfAborted();
      const requestUrl = url;
      const response = await fetch(requestUrl, {
        headers: { Range: `bytes=${begin}-${end - 1}` },
        signal,
      });
      if (attempt === 0 && (response.status === 401 || response.status === 403) && options.refreshUrl) {
        await response.body?.cancel();
        await refresh(requestUrl);
        continue;
      }
      if (response.status !== 206 && !(response.status === 200 && length === undefined)) {
        await response.body?.cancel();
        throw new Error(`PDF range request failed (${response.status}).`);
      }

      let expectedLength: number | undefined;
      if (response.status === 206) {
        const range = /^bytes (\d+)-(\d+)\/(\d+)$/i.exec(response.headers.get('Content-Range') ?? '');
        if (!range) {
          await response.body?.cancel();
          throw new Error('The PDF server must expose a valid Content-Range header for range requests.');
        }
        const first = Number(range[1]);
        const last = Number(range[2]);
        const total = Number(range[3]);
        if (!Number.isSafeInteger(total) || total <= 0 || first !== begin
          || last !== Math.min(end, total) - 1 || (length !== undefined && total !== length)) {
          await response.body?.cancel();
          throw new Error('The PDF range or document length changed.');
        }
        length = total;
        expectedLength = last - first + 1;
      }
      const responseEtag = response.headers.get('ETag');
      if (etag && responseEtag && etag !== responseEtag) {
        await response.body?.cancel();
        throw new Error('The PDF content changed while it was open.');
      }
      etag ??= responseEtag;
      const data = new Uint8Array(await response.arrayBuffer());
      signal.throwIfAborted();
      if ((expectedLength !== undefined && data.length !== expectedLength) || data.length === 0) {
        throw new Error('The PDF server returned an incomplete byte range.');
      }
      if (requestUrl === url) canRefresh = true;
      return data;
    }
    throw new Error('Unable to load the PDF byte range.');
  }

  try {
    // Obtain length and useful initial bytes in one request, without a HEAD probe.
    const initialData = await readRange(0, options.chunkSize);
    if (length === undefined || initialData.length === length) {
      dispose();
      return { data: initialData };
    }

    class RefreshablePdfTransport extends PDFDataRangeTransport {
      override requestDataRange(begin: number, end: number) {
        void readRange(begin, end).then((data) => {
          if (!signal.aborted) this.onDataRange(begin, data);
        }).catch((error: unknown) => {
          if (signal.aborted) return;
          dispose();
          // PDFDataRangeTransport has no error channel; the owner terminates
          // the loading task and displays terminal failures instead of hanging.
          options.onError(error);
        });
      }

      override abort() { dispose(); }
    }

    return { range: new RefreshablePdfTransport(length, initialData, true) };
  } catch (error) {
    dispose();
    throw error;
  }
}
