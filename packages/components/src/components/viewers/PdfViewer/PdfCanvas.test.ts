import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import PdfCanvas from './PdfCanvas.vue';

describe('PdfCanvas display sizing', () => {
  let wrapper: VueWrapper | undefined;
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
  });
  afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function fixture() {
    const page = {
      getViewport: vi.fn(({ scale }: { scale: number }) => ({ width: 600 * scale, height: 800 * scale })),
      render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
    };
    const getPage = vi.fn().mockResolvedValue(page);
    return { page, getPage, document: { getPage } as unknown as PDFDocumentProxy };
  }

  it('leaves fit dimensions to CSS instead of overriding inline sizes', async () => {
    const { document } = fixture();
    wrapper = mount(PdfCanvas, { props: { document, pageNumber: 1, fit: true } });
    await flushPromises();
    const canvas = wrapper.get('canvas').element;
    expect(canvas.style.width).toBe('');
    expect(canvas.style.height).toBe('');
    expect(canvas.style.getPropertyValue('--pdf-page-width')).toBe('600px');
    expect(canvas.style.getPropertyValue('--pdf-page-aspect')).toBe('0.75');
  });

  it('updates display zoom immediately, without waiting for PDF rendering', async () => {
    vi.useFakeTimers();
    const { document, getPage, page } = fixture();
    wrapper = mount(PdfCanvas, { props: { document, pageNumber: 1, scale: 1 } });
    await flushPromises();
    let resolvePage!: (value: typeof page) => void;
    getPage.mockReturnValueOnce(new Promise((resolve) => { resolvePage = resolve; }));
    await wrapper.setProps({ scale: 1.5 });
    const canvas = wrapper.get('canvas').element;
    expect(canvas.style.width).toBe('900px');
    expect(canvas.style.height).toBe('1200px');
    expect(getPage).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(120);
    resolvePage(page);
    await flushPromises();
    expect(page.render).toHaveBeenLastCalledWith(expect.objectContaining({
      viewport: { width: 900, height: 1200 },
    }));
    await wrapper.setProps({ fit: true });
    expect(canvas.style.width).toBe('');
    expect(canvas.style.height).toBe('');
  });

  it('renders only the final scale during continuous zoom input', async () => {
    vi.useFakeTimers();
    const { document, getPage, page } = fixture();
    wrapper = mount(PdfCanvas, { props: { document, pageNumber: 1, scale: 1 } });
    await flushPromises();

    await wrapper.setProps({ scale: 1.1 });
    await wrapper.setProps({ scale: 1.2 });
    await wrapper.setProps({ scale: 1.3 });
    expect(wrapper.get('canvas').element.style.width).toBe('780px');
    expect(getPage).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(120);
    await flushPromises();
    expect(getPage).toHaveBeenCalledTimes(2);
    expect(page.render).toHaveBeenLastCalledWith(expect.objectContaining({
      viewport: { width: 780, height: 1040 },
    }));
  });

  it('keeps thumbnails proportional within their square tile', async () => {
    const { document } = fixture();
    wrapper = mount(PdfCanvas, { props: { document, pageNumber: 1, fitSize: 60 } });
    await flushPromises();
    const canvas = wrapper.get('canvas').element;
    expect(canvas.style.width).toBe('45px');
    expect(canvas.style.height).toBe('60px');
  });
});
