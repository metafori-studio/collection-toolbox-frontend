import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { createPdfTransport } from './createPdfTransport';

function partial(begin: number, end: number, total = 32, etag = '"pdf-v1"') {
  return new Response(new Uint8Array(end - begin).fill(begin), {
    status: 206,
    headers: { 'Content-Range': `bytes ${begin}-${end - 1}/${total}`, ETag: etag },
  });
}

function fixture() {
  const fetchMock = vi.fn().mockResolvedValueOnce(partial(0, 8));
  vi.stubGlobal('fetch', fetchMock);
  const controller = new AbortController();
  const onError = vi.fn();
  const refreshUrl = vi.fn().mockResolvedValueOnce('second.pdf').mockResolvedValueOnce('third.pdf');
  const open = () => createPdfTransport({
    url: 'first.pdf', chunkSize: 8, signal: controller.signal, onError, refreshUrl,
  });
  return { fetchMock, controller, onError, refreshUrl, open };
}

afterEach(() => { vi.unstubAllGlobals(); });

describe('refreshable PDF range transport', () => {
  it('retries only the failed ranges across repeated expirations without repeating initialization', async () => {
    const { fetchMock, open, onError, refreshUrl } = fixture();
    const { range } = await open();
    const receive = vi.fn();
    range!.addRangeListener(receive);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(partial(8, 16))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(partial(16, 24));
    range!.requestDataRange(8, 16);
    await flushPromises();
    range!.requestDataRange(16, 24);
    await flushPromises();
    expect(fetchMock.mock.calls.map(([url, init]) => [url, init.headers.Range])).toEqual([
      ['first.pdf', 'bytes=0-7'],
      ['first.pdf', 'bytes=8-15'], ['second.pdf', 'bytes=8-15'],
      ['second.pdf', 'bytes=16-23'], ['third.pdf', 'bytes=16-23'],
    ]);
    expect(refreshUrl.mock.calls).toEqual([['first.pdf'], ['second.pdf']]);
    expect(receive.mock.calls.map(([begin, data]) => [begin, data.length])).toEqual([[8, 8], [16, 8]]);
    expect(onError).not.toHaveBeenCalled();
    range!.abort();
  });

  it('shares a refresh between concurrent ranges, including a late failure from the old URL', async () => {
    const { fetchMock, open, refreshUrl, onError } = fixture();
    let resolveRefresh!: (url: string) => void;
    let resolveLate!: (response: Response) => void;
    refreshUrl.mockReset().mockImplementation(() => new Promise<string>((resolve) => { resolveRefresh = resolve; }));
    const { range } = await open();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveLate = resolve; }))
      .mockResolvedValueOnce(partial(8, 16)).mockResolvedValueOnce(partial(16, 24))
      .mockResolvedValueOnce(partial(24, 32));
    range!.requestDataRange(8, 16);
    range!.requestDataRange(16, 24);
    range!.requestDataRange(24, 32);
    await flushPromises();
    expect(refreshUrl).toHaveBeenCalledOnce();
    resolveRefresh('second.pdf');
    await flushPromises();
    resolveLate(new Response(null, { status: 403 }));
    await flushPromises();
    expect(refreshUrl).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls.slice(4).map(([url]) => url)).toEqual(['second.pdf', 'second.pdf', 'second.pdf']);
    expect(onError).not.toHaveBeenCalled();
    range!.abort();
  });

  it('bounds retries if the replacement URL also fails', async () => {
    const { fetchMock, open, refreshUrl, onError } = fixture();
    const { range } = await open();
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }));
    range!.requestDataRange(8, 16);
    await flushPromises();
    expect(refreshUrl).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('cancels a pending refresh on source change without issuing a retry', async () => {
    const { fetchMock, open, refreshUrl, controller, onError } = fixture();
    let resolve!: (url: string) => void;
    refreshUrl.mockReset().mockImplementation(() => new Promise<string>((done) => { resolve = done; }));
    const { range } = await open();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    range!.requestDataRange(8, 16);
    await flushPromises();
    controller.abort();
    resolve('second.pdf');
    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onError).not.toHaveBeenCalled();
  });

  it('accepts a complete initial response from a server without range support', async () => {
    const { fetchMock, open } = fixture();
    fetchMock.mockReset().mockResolvedValue(new Response(new Uint8Array([1, 2, 3])));
    expect(await open()).toEqual({ data: new Uint8Array([1, 2, 3]) });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it.each([
    () => partial(7, 15),
    () => partial(8, 16, 40),
    () => partial(8, 16, 32, '"different-pdf"'),
    () => new Response(new Uint8Array(2), { status: 206, headers: { 'Content-Range': 'bytes 8-15/32' } }),
    () => new Response(new Uint8Array(8), { status: 206 }),
    () => new Response(new Uint8Array(32)),
  ])('rejects inconsistent range data without reopening the document', async (response) => {
    const { fetchMock, open, onError, refreshUrl } = fixture();
    const { range } = await open();
    fetchMock.mockResolvedValueOnce(response());
    range!.requestDataRange(8, 16);
    await flushPromises();
    expect(onError).toHaveBeenCalledOnce();
    expect(refreshUrl).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
