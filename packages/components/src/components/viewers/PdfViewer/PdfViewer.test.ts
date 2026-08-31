import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import PdfViewer from './PdfViewer.vue';

const { getDocument } = vi.hoisted(() => ({ getDocument: vi.fn() }));

vi.mock('vue-i18n', () => {
  const dictionary: Record<string, string> = {
    'viewer.loading': 'Loading...',
    'viewer.previous': 'Previous',
    'viewer.next': 'Next',
    'viewer.zoomOut': 'Zoom out',
    'viewer.zoomIn': 'Zoom in',
    'viewer.resetZoom': 'Reset zoom',
    'viewer.pdf.page': 'PDF page {page}',
    'viewer.pdf.thumbnail': 'PDF page {page} thumbnail',
  };
  return {
    useI18n: () => ({
      t: (key: string, values?: Record<string, unknown> | string) => {
        let msg = dictionary[key] ?? (typeof values === 'string' ? values : key);
        if (values && typeof values === 'object') {
          for (const [k, v] of Object.entries(values)) {
            msg = msg.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
          }
        }
        return msg;
      },
    }),
  };
});
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: '/pdf.worker.mjs' }));
vi.mock('pdfjs-dist', async (importOriginal) => ({
  ...await importOriginal<typeof import('pdfjs-dist')>(),
  getDocument,
  GlobalWorkerOptions: {},
}));

function mockDocument() {
  const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
  getDocument.mockReturnValue({
    promise: Promise.resolve({
      numPages: 3,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    }),
    destroy: vi.fn(),
  });
  return render;
}

describe('PdfViewer', () => {
  let wrapper: VueWrapper | null = null;
  let getContextSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      disconnect() {}
    });
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response(
      new Uint8Array(5 * 1024 * 1024),
      { status: 206, headers: { 'Content-Range': `bytes 0-${5 * 1024 * 1024 - 1}/${10 * 1024 * 1024}` } },
    ))));
    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 600, bottom: 800, width: 600, height: 800, x: 0, y: 0, toJSON: () => ({}),
    });
    vi.stubGlobal('ResizeObserver', class {
      constructor(private callback: ResizeObserverCallback) {}
      observe(target: Element) {
        this.callback([{
          target, borderBoxSize: [{ blockSize: 800, inlineSize: 600 }], contentRect: { width: 600, height: 800 },
        } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
      }
      disconnect() {}
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    getContextSpy?.mockRestore();
    getContextSpy = null;
    getDocument.mockReset();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads the first page through PDF.js range requests', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/document.pdf' } });
    await flushPromises();

    expect(getDocument).toHaveBeenCalledWith({
      range: expect.objectContaining({ length: 10 * 1024 * 1024 }),
      rangeChunkSize: 5 * 1024 * 1024,
      disableRange: false,
      disableStream: true,
      disableAutoFetch: true,
    });
  });

  it('renders a source selector for multiple PDFs', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, {
      props: { sources: [{ label: 'One', url: 'https://example.com/one.pdf' }, { label: 'Two', url: 'https://example.com/two.pdf' }] },
    });
    await flushPromises();

    expect(wrapper.findAll('option')).toHaveLength(2);
  });

  it('resets to the first page when switching documents', async () => {
    const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
    const createDocument = (numPages: number) => ({
      numPages,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    });
    const firstDoc = createDocument(3);
    const secondDoc = createDocument(2);
    getDocument
      .mockReturnValueOnce({ promise: Promise.resolve(firstDoc), destroy: vi.fn() })
      .mockReturnValueOnce({ promise: Promise.resolve(secondDoc), destroy: vi.fn() });

    wrapper = mount(PdfViewer, {
      props: {
        modelValue: 3,
        sources: [
          { label: 'One', url: 'https://example.com/one.pdf' },
          { label: 'Two', url: 'https://example.com/two.pdf' },
        ],
      },
    });
    await flushPromises();
    expect(wrapper.find('[aria-label="PDF page 3"]').exists()).toBe(true);

    await wrapper.get('select').setValue('https://example.com/two.pdf');
    await flushPromises();

    expect(secondDoc.getPage).toHaveBeenCalledWith(1);
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);
  });

  it('changes the rendered page through the media toolbar arrows', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/document.pdf' } });
    await flushPromises();

    await wrapper.get('[title="Next"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[aria-label="PDF page 2"]').exists()).toBe(true);

    await wrapper.get('[title="Previous"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);
  });

  it('selects a page from the thumbnail strip', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/document.pdf' } });
    await flushPromises();

    await wrapper.get('[aria-label="PDF page 3 thumbnail"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[aria-label="PDF page 3"]').exists()).toBe(true);
  });

  it('waits for a real fit measurement before enabling zoom', async () => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'doc.pdf' } });
    await flushPromises();
    expect(wrapper.get('[title="Zoom in"]').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).not.toContain('100%');
    await wrapper.get('[title="Zoom in"]').trigger('click');
    expect(wrapper.find('[data-pdf-stage].h-full').exists()).toBe(true);
  });

  it('waits for page dimensions without displaying a guessed page size', async () => {
    let resolvePage!: (page: unknown) => void;
    const pagePromise = new Promise((resolve) => { resolvePage = resolve; });
    getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 1, getPage: vi.fn(() => pagePromise), destroy: vi.fn() }),
      destroy: vi.fn(),
    });
    wrapper = mount(PdfViewer, { props: { url: 'doc.pdf' } });
    await flushPromises();
    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.find('[data-pdf-stage]').exists()).toBe(false);
    expect(wrapper.get('[title="Zoom in"]').attributes('disabled')).toBeDefined();
    resolvePage({
      getViewport: () => ({ width: 1000, height: 500 }),
      render: () => ({ promise: Promise.resolve(), cancel: vi.fn() }),
    });
    await flushPromises();
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.get('canvas.h-auto').attributes('style')).toContain('--pdf-page-width: 1000px');
  });

  it('shows a page-dimension failure instead of marking an unsized document ready', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1, getPage: vi.fn().mockRejectedValue(new Error('Page unavailable')), destroy: vi.fn(),
      }),
      destroy: vi.fn(),
    });
    wrapper = mount(PdfViewer, { props: { url: 'doc.pdf' } });
    await flushPromises();
    expect(wrapper.text()).toContain('Page unavailable');
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.find('[data-pdf-stage]').exists()).toBe(false);
  });

  it('adjusts zoom through the media toolbar controls', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/document.pdf' } });
    await flushPromises();

    expect(wrapper.text()).not.toContain('Fit');
    await wrapper.get('[title="Zoom in"]').trigger('click');
    expect(wrapper.text()).toContain('200%');
    await wrapper.get('[title="Zoom out"]').trigger('click');
    expect(wrapper.text()).not.toContain('Fit');

    await wrapper.get('[title="Zoom in"]').trigger('click');
    expect(wrapper.text()).toContain('200%');
    await wrapper.get('[title="Reset zoom"]').trigger('click');
    expect(wrapper.text()).not.toContain('Fit');
  });

  it('uses CSS fit mode without measuring the viewport in JavaScript', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/doc.pdf' } });
    await flushPromises();

    expect(wrapper.text()).not.toContain('Fit');
    expect(wrapper.find('[data-pdf-stage].h-full').exists()).toBe(true);
    expect(wrapper.get('[data-pdf-stage].h-full').element.getAttribute('style')).toBeFalsy();
    expect(wrapper.get('canvas.h-auto').element.getAttribute('style')).not.toMatch(/(?:^|;)\s*(?:width|height):/);
    expect(wrapper.get('[title="Zoom out"]').attributes('disabled')).toBeDefined();

    await wrapper.get('[title="Zoom in"]').trigger('click');
    expect(wrapper.text()).toContain('200%');
    expect(wrapper.find('[data-pdf-stage].h-full').exists()).toBe(false);
    expect(wrapper.get('[title="Zoom out"]').attributes('disabled')).toBeUndefined();
    await flushPromises();
    expect((wrapper.get('[data-media-viewport] canvas').element as HTMLCanvasElement).style.width).not.toBe('');
    await wrapper.get('[title="Reset zoom"]').trigger('click');
    expect((wrapper.get('[data-media-viewport] canvas').element as HTMLCanvasElement).style.width).toBe('');
    expect((wrapper.get('[data-media-viewport] canvas').element as HTMLCanvasElement).style.height).toBe('');
  });

  it('preserves thumbnail strip visibility while switching between multi-page documents', async () => {
    let resolveSecondDoc: (value: unknown) => void;
    const secondDocPromise = new Promise((resolve) => {
      resolveSecondDoc = resolve;
    });

    const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
    const firstDoc = {
      numPages: 3,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    };
    const secondDoc = {
      numPages: 4,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    };

    getDocument
      .mockReturnValueOnce({ promise: Promise.resolve(firstDoc), destroy: vi.fn() })
      .mockReturnValueOnce({ promise: secondDocPromise, destroy: vi.fn() });

    wrapper = mount(PdfViewer, {
      props: {
        sources: [
          { label: 'Doc 1', url: 'https://example.com/one.pdf' },
          { label: 'Doc 2', url: 'https://example.com/two.pdf' },
        ],
      },
    });
    await flushPromises();

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(true);

    await wrapper.find('select').setValue('https://example.com/two.pdf');

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(true);

    resolveSecondDoc!(secondDoc);
    await flushPromises();

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(true);
  });

  it('hides thumbnail strip only when loaded document has 1 page', async () => {
    let resolveSecondDoc: (value: unknown) => void;
    const secondDocPromise = new Promise((resolve) => {
      resolveSecondDoc = resolve;
    });

    const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
    const firstDoc = {
      numPages: 3,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    };
    const singlePageDoc = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render,
      }),
      destroy: vi.fn(),
    };

    getDocument
      .mockReturnValueOnce({ promise: Promise.resolve(firstDoc), destroy: vi.fn() })
      .mockReturnValueOnce({ promise: secondDocPromise, destroy: vi.fn() });

    wrapper = mount(PdfViewer, {
      props: {
        sources: [
          { label: 'Doc 1', url: 'https://example.com/one.pdf' },
          { label: 'Doc 2', url: 'https://example.com/two.pdf' },
        ],
      },
    });
    await flushPromises();

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(true);

    await wrapper.find('select').setValue('https://example.com/two.pdf');

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(true);

    resolveSecondDoc!(singlePageDoc);
    await flushPromises();

    expect(wrapper.findComponent({ name: 'PdfThumbnailStrip' }).exists()).toBe(false);
  });

  it('displays toolbar with zoom controls but without page controls for a single-page document', async () => {
    const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
    getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
          render,
        }),
        destroy: vi.fn(),
      }),
      destroy: vi.fn(),
    });

    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/single.pdf' } });
    await flushPromises();

    expect(wrapper.findComponent({ name: 'MediaToolbar' }).exists()).toBe(true);
    expect(wrapper.find('[title="Zoom in"]').exists()).toBe(true);
    expect(wrapper.find('[title="Zoom out"]').exists()).toBe(true);
    expect(wrapper.find('[title="Reset zoom"]').exists()).toBe(true);
    expect(wrapper.find('[title="Next"]').exists()).toBe(false);
    expect(wrapper.find('[title="Previous"]').exists()).toBe(false);
  });

  it('supports keyboard navigation shortcuts', async () => {
    mockDocument();
    wrapper = mount(PdfViewer, { props: { url: 'https://example.com/document.pdf' } });
    await flushPromises();

    const viewerArea = wrapper.get('[data-media-viewport]');
    await viewerArea.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.find('[aria-label="PDF page 2"]').exists()).toBe(true);
    await viewerArea.trigger('keydown', { key: 'ArrowLeft' });
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);

    await viewerArea.trigger('keydown', { key: 'PageDown' });
    expect(wrapper.find('[aria-label="PDF page 2"]').exists()).toBe(true);

    await viewerArea.trigger('keydown', { key: 'PageUp' });
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);

    // End navigates to the last page (page 3)
    await viewerArea.trigger('keydown', { key: 'End' });
    expect(wrapper.find('[aria-label="PDF page 3"]').exists()).toBe(true);

    // Home navigates to the first page (page 1)
    await viewerArea.trigger('keydown', { key: 'Home' });
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);
  });

  it('switches documents gracefully when in-flight render or destroy rejects with RenderingCancelledException', async () => {
    const cancelledError = {
      message: 'Rendering cancelled, page 910',
      name: 'RenderingCancelledException',
      extraDelay: 0,
    };
    const firstDocRender = vi.fn(() => ({
      promise: Promise.reject(cancelledError),
      cancel: vi.fn(),
    }));
    const secondDocRender = vi.fn(() => ({
      promise: Promise.resolve(),
      cancel: vi.fn(),
    }));

    const firstDoc = {
      numPages: 2,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render: firstDocRender,
      }),
      destroy: vi.fn().mockRejectedValue(cancelledError),
    };

    const secondDoc = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render: secondDocRender,
      }),
      destroy: vi.fn(),
    };

    getDocument
      .mockReturnValueOnce({ promise: Promise.resolve(firstDoc), destroy: vi.fn() })
      .mockReturnValueOnce({ promise: Promise.resolve(secondDoc), destroy: vi.fn() });

    wrapper = mount(PdfViewer, {
      props: {
        sources: [
          { label: 'Doc 1', url: 'https://example.com/one.pdf' },
          { label: 'Doc 2', url: 'https://example.com/two.pdf' },
        ],
      },
    });
    await flushPromises();

    // Switch to Doc 2
    await wrapper.find('select').setValue('https://example.com/two.pdf');
    await flushPromises();

    // Should successfully load Doc 2 without showing error
    expect(wrapper.text()).not.toContain('Rendering cancelled');
    expect(wrapper.text()).not.toContain('Unable to load the PDF document.');
    expect(wrapper.findComponent({ name: 'MediaToolbar' }).exists()).toBe(true);
  });

  it('switches documents gracefully when in-flight getPage or destroy rejects with Transport destroyed', async () => {
    const transportError = new Error('Transport destroyed');
    const firstDoc = {
      numPages: 3,
      getPage: vi.fn().mockRejectedValue(transportError),
      destroy: vi.fn().mockRejectedValue(transportError),
    };

    const secondDoc = {
      numPages: 2,
      getPage: vi.fn().mockResolvedValue({
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
      }),
      destroy: vi.fn(),
    };

    getDocument
      .mockReturnValueOnce({ promise: Promise.resolve(firstDoc), destroy: vi.fn() })
      .mockReturnValueOnce({ promise: Promise.resolve(secondDoc), destroy: vi.fn() });

    wrapper = mount(PdfViewer, {
      props: {
        sources: [
          { label: 'Doc 1', url: 'https://example.com/one.pdf' },
          { label: 'Doc 2', url: 'https://example.com/two.pdf' },
        ],
      },
    });
    await flushPromises();

    // Switch to Doc 2
    await wrapper.find('select').setValue('https://example.com/two.pdf');
    await flushPromises();

    // Should successfully load Doc 2 without showing error
    expect(wrapper.text()).not.toContain('Transport destroyed');
    expect(wrapper.text()).not.toContain('Unable to load the PDF document.');
    expect(wrapper.findComponent({ name: 'MediaToolbar' }).exists()).toBe(true);
  });

  it('does not let a pending refresh overwrite a newly selected document', async () => {
    mockDocument();
    let resolveRefresh!: (url: string) => void;
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    const onRefreshUrl = vi.fn(() => new Promise<string>((resolve) => { resolveRefresh = resolve; }));
    wrapper = mount(PdfViewer, { props: {
      sources: [{ label: 'One', url: 'one.pdf' }, { label: 'Two', url: 'two.pdf' }],
      onRefreshUrl,
    } });
    await flushPromises();
    expect(onRefreshUrl).toHaveBeenCalledExactlyOnceWith('one.pdf');
    await wrapper.get('select').setValue('two.pdf');
    await flushPromises();
    resolveRefresh('one-refreshed.pdf');
    await flushPromises();
    expect(getDocument).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith('two.pdf', expect.anything());
    expect(wrapper.text()).not.toContain('Expired');
    expect(wrapper.find('[aria-label="PDF page 1"]').exists()).toBe(true);
  });

  it('refreshes an expired initial request before creating the PDF.js document', async () => {
    mockDocument();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    const onRefreshUrl = vi.fn().mockResolvedValue('https://example.com/fresh-signed.pdf');

    wrapper = mount(PdfViewer, {
      props: {
        url: 'https://example.com/expired.pdf',
        onRefreshUrl,
      },
    });
    await flushPromises();

    expect(onRefreshUrl).toHaveBeenCalledWith('https://example.com/expired.pdf');
    expect(getDocument).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenLastCalledWith('https://example.com/fresh-signed.pdf', expect.anything());
    expect(wrapper.text()).not.toContain('403 Forbidden');
    expect(wrapper.findComponent({ name: 'MediaToolbar' }).exists()).toBe(true);
  });

  it('keeps the document, canvas, page, zoom and scroll through repeated range URL refreshes', async () => {
    mockDocument();
    const initial = await getDocument.getMockImplementation()!().promise;
    let resolveUrl!: (url: string) => void;
    const onRefreshUrl = vi.fn(() => new Promise<string>((resolve) => { resolveUrl = resolve; }));
    wrapper = mount(PdfViewer, { props: { url: 'expired.pdf', onRefreshUrl } });
    await flushPromises();
    await wrapper.get('[title="Zoom in"]').trigger('click');
    await flushPromises();
    const canvas = wrapper.get('[data-media-viewport] canvas').element;
    const viewport = wrapper.get('[data-media-viewport]').element;
    viewport.scrollTop = 150;
    viewport.scrollLeft = 80;
    await wrapper.get('[title="Next"]').trigger('click');
    await flushPromises();
    const { range } = getDocument.mock.calls[0]![0];
    const begin = 5 * 1024 * 1024;
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    range.requestDataRange(begin, begin + 8);
    await flushPromises();
    expect(onRefreshUrl).toHaveBeenCalledOnce();
    expect(wrapper.get('[data-media-viewport] canvas').element).toBe(canvas);
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.text()).not.toContain('403 Forbidden');
    vi.mocked(fetch).mockResolvedValueOnce(new Response(new Uint8Array(8), {
      status: 206, headers: { 'Content-Range': `bytes ${begin}-${begin + 7}/${10 * 1024 * 1024}` },
    }));
    resolveUrl('fresh.pdf');
    await flushPromises();
    expect(wrapper.get('[data-media-viewport] canvas').element).toBe(canvas);
    expect(wrapper.text()).toContain('2/3');
    expect(wrapper.text()).toContain('200%');
    expect(viewport.scrollTop).toBe(150);
    expect(viewport.scrollLeft).toBe(80);
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    range.requestDataRange(begin + 8, begin + 16);
    await flushPromises();
    expect(onRefreshUrl).toHaveBeenLastCalledWith('fresh.pdf');
    vi.mocked(fetch).mockResolvedValueOnce(new Response(new Uint8Array(8), {
      status: 206, headers: { 'Content-Range': `bytes ${begin + 8}-${begin + 15}/${10 * 1024 * 1024}` },
    }));
    resolveUrl('third.pdf');
    await flushPromises();
    expect(getDocument).toHaveBeenCalledOnce();
    expect(initial.destroy).not.toHaveBeenCalled();
    expect(wrapper.get('[data-media-viewport] canvas').element).toBe(canvas);
    expect(fetch).toHaveBeenCalledTimes(5);
    expect(fetch).toHaveBeenLastCalledWith('third.pdf', expect.objectContaining({
      headers: { Range: `bytes=${begin + 8}-${begin + 15}` },
    }));
  });

  it('returns to idle when the source is removed during loading', async () => {
    let resolveLoad!: (value: unknown) => void;
    const destroyed = vi.fn();
    getDocument.mockReturnValue({
      promise: new Promise((resolve) => { resolveLoad = resolve; }), destroy: vi.fn(),
    });
    wrapper = mount(PdfViewer, { props: { url: 'pending.pdf' } });
    await flushPromises();
    expect(wrapper.text()).toContain('Loading...');
    await wrapper.setProps({ url: '' });
    await flushPromises();
    expect(wrapper.text()).not.toContain('Loading...');
    resolveLoad({ numPages: 4, destroy: destroyed });
    await flushPromises();
    expect(destroyed).toHaveBeenCalledOnce();
    expect(wrapper.find('canvas').exists()).toBe(false);
  });

  it('shows rendering failures without reopening the document or refreshing a valid URL', async () => {
    mockDocument();
    const onRefreshUrl = vi.fn();
    wrapper = mount(PdfViewer, { props: { url: 'doc.pdf', onRefreshUrl } });
    await flushPromises();
    wrapper.findComponent({ name: 'PdfCanvas' }).vm.$emit('renderError', new Error('Invalid PDF page'));
    await flushPromises();
    expect(onRefreshUrl).not.toHaveBeenCalled();
    expect(getDocument).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('Invalid PDF page');
  });

  it('terminates failed range reads with a visible error instead of hanging or reloading', async () => {
    mockDocument();
    const task = getDocument.getMockImplementation()!();
    wrapper = mount(PdfViewer, { props: {
      url: 'first.pdf', onRefreshUrl: vi.fn().mockResolvedValue('second.pdf'),
    } });
    await flushPromises();
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 403 }));
    getDocument.mock.calls[0]![0].range.requestDataRange(5 * 1024 * 1024, 5 * 1024 * 1024 + 8);
    await flushPromises();
    expect(wrapper.text()).toContain('PDF range request failed (403)');
    expect(wrapper.text()).not.toContain('Loading...');
    expect(task.destroy).toHaveBeenCalledOnce();
    expect(getDocument).toHaveBeenCalledOnce();
  });
});
