import { afterEach, expect, it, vi } from 'vitest';
import { getDocument } from 'pdfjs-dist';
import { createPdfTransport } from './createPdfTransport';

// Separate page streams so real PDF.js must request uncached ranges as we navigate.
function pdfFixture() {
  let pdf = '%PDF-1.7\n';
  const offsets = [0];
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 5 0 R 7 0 R] /Count 3 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << >> /Contents 4 0 R >>',
    'stream',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << >> /Contents 6 0 R >>',
    'stream',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << >> /Contents 8 0 R >>',
    'stream',
  ];
  for (const [index, object] of objects.entries()) {
    pdf += `%${' '.repeat(64 * 1024)}\n`;
    offsets.push(pdf.length);
    const contents = `0 0 ${index + 1} 10 re f\n`;
    pdf += `${index + 1} 0 obj\n${object === 'stream'
      ? `<< /Length ${contents.length} >>\nstream\n${contents}endstream`
      : object}\nendobj\n`;
  }
  pdf += `%${' '.repeat(64 * 1024)}\n`;
  const xref = pdf.length;
  pdf += 'xref\n0 9\n0000000000 65535 f \n';
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size 9 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}

afterEach(() => { vi.unstubAllGlobals(); });

it('keeps a real PDF.js document and its cached ranges across two URL expirations', async () => {
  // PDF.js supports a worker handler on the main thread for environments without Workers.
  // @ts-expect-error PDF.js does not ship type declarations for the worker entry point.
  vi.stubGlobal('pdfjsWorker', await import('pdfjs-dist/build/pdf.worker.mjs'));
  const bytes = pdfFixture();
  let validUrl = 'first.pdf';
  const requests: Array<{ url: string; begin: number; end: number; status: number }> = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
    const range = new Headers(init.headers).get('Range')!;
    const [begin, inclusiveEnd] = range.slice('bytes='.length).split('-').map(Number) as [number, number];
    const end = Math.min(inclusiveEnd + 1, bytes.length);
    const status = url === validUrl ? 206 : 403;
    requests.push({ url, begin, end, status });
    return status === 403 ? new Response(null, { status }) : new Response(bytes.slice(begin, end), {
      status, headers: { 'Content-Range': `bytes ${begin}-${end - 1}/${bytes.length}` },
    });
  }));
  const controller = new AbortController();
  const onError = vi.fn();
  const refreshUrl = vi.fn(async () => validUrl);
  const source = await createPdfTransport({
    url: validUrl, chunkSize: 1024, signal: controller.signal, refreshUrl, onError,
  });
  const task = getDocument({ ...source, rangeChunkSize: 1024, disableStream: true, disableAutoFetch: true });
  try {
    const document = await task.promise;
    expect(document.numPages).toBe(3);
    await (await document.getPage(1)).getOperatorList();
    const initialRequests = requests.length;
    validUrl = 'second.pdf';
    await (await document.getPage(2)).getOperatorList();
    expect(refreshUrl).toHaveBeenCalledTimes(1);
    validUrl = 'third.pdf';
    await (await document.getPage(3)).getOperatorList();
    expect(refreshUrl).toHaveBeenCalledTimes(2);
    expect(onError).not.toHaveBeenCalled();
    expect(requests.slice(initialRequests).every(({ begin }) => begin !== 0)).toBe(true);
    const loadedRanges = requests.filter(({ status }) => status === 206).map(({ begin, end }) => `${begin}-${end}`);
    expect(new Set(loadedRanges).size).toBe(loadedRanges.length);
    const afterNavigation = requests.length;
    await (await document.getPage(1)).getOperatorList();
    expect(requests).toHaveLength(afterNavigation);
  } finally {
    controller.abort();
    await task.destroy();
  }
});
