import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import MediaViewerFrame from '../MediaViewerFrame.vue';
import ImageViewer from './ImageViewer.vue';
import ImageThumbnailStrip from './ImageThumbnailStrip.vue';

type EventHandler = (event: Record<string, unknown>) => void;

const osdMock = vi.hoisted(() => {
  const instances: Array<{
    handlers: Record<string, EventHandler[]>;
    options: Record<string, unknown>;
    panHorizontal: boolean;
    viewport: {
      defaultZoomLevel?: number;
      minZoomImageRatio?: number;
      applyConstraints: ReturnType<typeof vi.fn>;
      deltaPointsFromPixels: ReturnType<typeof vi.fn>;
      getBounds: ReturnType<typeof vi.fn>;
      getCenter: ReturnType<typeof vi.fn>;
      setMargins: ReturnType<typeof vi.fn>;
      getContainerSize: ReturnType<typeof vi.fn>;
      getHomeZoom: ReturnType<typeof vi.fn>;
      getZoom: ReturnType<typeof vi.fn>;
      goHome: ReturnType<typeof vi.fn>;
      panBy: ReturnType<typeof vi.fn>;
      panTo: ReturnType<typeof vi.fn>;
      zoomTo: ReturnType<typeof vi.fn>;
    };
    forceResize: ReturnType<typeof vi.fn>;
    forceRedraw: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    addTiledImage: ReturnType<typeof vi.fn>;
  }> = [];

  const factory = vi.fn((options: Record<string, unknown>) => {
    let zoom = 0.4;
    const handlers: Record<string, EventHandler[]> = {};
    const viewport = {
      applyConstraints: vi.fn(),
      deltaPointsFromPixels: vi.fn((delta: { x: number; y: number }) => delta),
      getBounds: vi.fn(() => ({ width: 1 })),
      getCenter: vi.fn(() => ({ x: 0.5, y: 0.5 })),
      setMargins: vi.fn(),
      getContainerSize: vi.fn(() => ({ x: 0, y: 0 })),
      getHomeZoom: vi.fn(() => 0.4),
      getZoom: vi.fn(() => zoom),
      goHome: vi.fn(() => { zoom = 0.4; }),
      panBy: vi.fn(),
      panTo: vi.fn(),
      zoomTo: vi.fn((value: number) => { zoom = value; }),
    };
    const instance = {
      handlers,
      options,
      panHorizontal: true,
      viewport,
      world: {
        getItemAt: vi.fn(() => ({
          getBounds: () => ({ width: 0.3 }),
          imageToViewportZoom: (value: number) => value,
          viewportToImageZoom: (value: number) => value,
        })),
      },
      addHandler: vi.fn((name: string, handler: EventHandler) => {
        (handlers[name] ??= []).push(handler);
      }),
      destroy: vi.fn(),
      addTiledImage: vi.fn(),
      forceResize: vi.fn(),
      forceRedraw: vi.fn(),
    };
    instances.push(instance);
    return instance;
  });

  return { factory, instances };
});

vi.mock('./loadOpenSeadragon', () => ({
  loadOpenSeadragon: async () => osdMock.factory,
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => ({
      'viewer.loading': 'Loading...',
      'viewer.previous': 'Previous',
      'viewer.next': 'Next',
      'viewer.zoomOut': 'Zoom out',
      'viewer.zoomIn': 'Zoom in',
      'viewer.resetZoom': 'Reset zoom',
      'viewer.image.errorLoad': 'Failed to load image',
    })[key] ?? key,
  }),
}));

describe('ImageViewer', () => {
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    osdMock.factory.mockClear();
    osdMock.instances.length = 0;
    vi.unstubAllGlobals();
  });

  it('opens a DZI source and drives OpenSeadragon with the shared toolbar', async () => {
    wrapper = mount(ImageViewer, {
      props: { images: [{ url: 'https://example.com/image.dzi' }] },
    });
    await flushPromises();

    const instance = osdMock.instances[0];
    expect(instance?.options.tileSources).toBe('https://example.com/image.dzi');
    expect(instance?.options.showNavigationControl).toBe(false);
    expect(instance?.options.minZoomImageRatio).toBe(1);
    expect(instance?.options.loadTilesWithAjax).toBe(true);
    expect(instance?.options.immediateRender).toBe(false);
    expect(instance?.options.minScrollDeltaTime).toBe(16);
    expect(instance?.options.drawer).toBeUndefined();
    expect(wrapper.get('[data-media-viewport]').classes()).toContain('overflow-hidden');
    expect(instance?.options.gestureSettingsMouse).toEqual({
      clickToZoom: false,
      dblClickToZoom: false,
    });
    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.get('[title="Zoom in"]').attributes('disabled')).toBeDefined();

    instance?.handlers.open?.[0]?.({ source: { dimensions: { x: 2712, y: 4556 } } });
    await flushPromises();
    expect(wrapper.text()).toContain('40%');
    expect(instance?.panHorizontal).toBe(true);
    expect(instance?.forceResize).toHaveBeenCalledOnce();
    expect(instance?.forceRedraw).toHaveBeenCalledOnce();

    const dragEvent = {
      pointerType: 'mouse',
      preventDefaultAction: false,
      delta: {
        plus: (other: { x: number; y: number }) => other,
        negate: () => ({ x: -12, y: 4 }),
      },
    };
    instance?.handlers['canvas-drag']?.[0]?.(dragEvent);
    expect(dragEvent.preventDefaultAction).toBe(true);
    expect(instance?.viewport.panBy).toHaveBeenCalledWith({ x: -12, y: 4 }, true);

    instance?.viewport.zoomTo.mockClear();
    instance?.viewport.goHome.mockClear();
    instance?.handlers.zoom?.[0]?.({ zoom: 0.4, immediately: false });
    expect(instance?.viewport.goHome).not.toHaveBeenCalled();

    wrapper.findComponent(MediaViewerFrame).vm.$emit('toolbar-resize', 78);
    expect(instance?.viewport.setMargins).toHaveBeenLastCalledWith({
      top: 16,
      right: 16,
      bottom: 78,
      left: 16,
    });

    await wrapper.get('button[title="Zoom in"]').trigger('click');
    expect(instance?.viewport.zoomTo).toHaveBeenCalledWith(0.5, undefined, false);
    expect(wrapper.text()).toContain('50%');
  });

  it('loads a regular image without building a client-side pyramid', async () => {
    wrapper = mount(ImageViewer, {
      props: {
        images: [{
          url: 'https://example.com/preview.jpg',
          mime_type: 'image/jpeg',
        }],
      },
    });
    await flushPromises();

    const instance = osdMock.instances[0];
    expect(instance?.options.tileSources).toEqual({
      type: 'image',
      url: 'https://example.com/preview.jpg',
      buildPyramid: false,
      crossOriginPolicy: false,
      ajaxWithCredentials: false,
    });
    expect(instance?.options.loadTilesWithAjax).toBe(false);
    expect(instance?.options.immediateRender).toBe(true);
    expect(instance?.options.drawer).toBe('canvas');

    instance?.viewport.getHomeZoom.mockReturnValue(2.5);
    instance?.handlers.open?.[0]?.({ source: { dimensions: { x: 160, y: 120 } } });
    expect(instance?.viewport.defaultZoomLevel).toBe(1);
    expect(instance?.viewport.minZoomImageRatio).toBe(1);
    expect(instance?.viewport.goHome).toHaveBeenCalledWith(true);

    instance?.handlers['tile-loaded']?.[0]?.({});
    expect(instance?.forceRedraw).toHaveBeenCalledTimes(2);
  });

  it('creates OpenSeadragon only for the selected image, never for thumbnails', async () => {
    wrapper = mount(ImageViewer, { props: { images: [
      { url: 'one.dzi', conversions: { thumbnail: 'one-thumb.jpg' } },
      { url: 'two.dzi' },
      { url: 'three.dzi', conversions: { thumbnail: 'broken-thumb.jpg' } },
    ] } });
    await flushPromises();
    expect(osdMock.factory).toHaveBeenCalledOnce();
    const strip = wrapper.findComponent(ImageThumbnailStrip);
    expect(strip.findAll('img').map((img) => img.attributes('src')))
      .toEqual(['one-thumb.jpg', 'broken-thumb.jpg']);
    await strip.get('img[src="broken-thumb.jpg"]').trigger('error');
    await flushPromises();
    expect(osdMock.factory).toHaveBeenCalledOnce();
    expect(strip.findAll('img')).toHaveLength(1);
    await wrapper.get('button[title="Next"]').trigger('click');
    await flushPromises();
    expect(osdMock.factory).toHaveBeenCalledTimes(2);
    expect(osdMock.instances[1]?.options.tileSources).toBe('two.dzi');
  });

  it('uses detail media directly for names, thumbnails, and image selection', async () => {
    wrapper = mount(ImageViewer, {
      props: {
        detail: { media: { images: [
          { name: 'First image', url: 'https://example.com/one.dzi', conversions: { thumbnail: 'one.jpg' } },
          { file_name: 'two.dzi', url: 'https://example.com/two.dzi', conversions: { thumbnail: 'two.jpg' } },
        ] } },
      },
    });
    await flushPromises();
    const firstViewerElement = wrapper.get('[role="img"]').element;
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('First image');
    expect(wrapper.get('img[src="one.jpg"]').attributes('alt')).toBe('First image');

    await wrapper.get('button[title="Next"]').trigger('click');
    await flushPromises();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    expect(wrapper.emitted('selectImage')?.[0]).toEqual([1]);
    expect(osdMock.instances[osdMock.instances.length - 1]?.options.tileSources)
      .toBe('https://example.com/two.dzi');
    expect(wrapper.get('[role="img"]').element).not.toBe(firstViewerElement);
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('two.dzi');
    expect(osdMock.instances[0]?.destroy).toHaveBeenCalledOnce();
  });

  it('navigates with left/right from the viewer area and retains focus across image changes', async () => {
    wrapper = mount(ImageViewer, {
      attachTo: document.body,
      props: { images: [{ url: 'one.jpg' }, { url: 'two.jpg' }, { url: 'three.dzi' }] },
    });
    await flushPromises();
    const viewerArea = wrapper.get('[data-media-viewport]');
    await wrapper.get('[role="img"]').trigger('keydown', { key: 'ArrowRight' });
    await flushPromises();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    expect(document.activeElement).toBe(viewerArea.element);
    await viewerArea.trigger('keydown', { key: 'ArrowRight' });
    await flushPromises();
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([3]);
    await viewerArea.trigger('keydown', { key: 'ArrowLeft' });
    await flushPromises();
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([2]);
  });

  it('refreshes an expired descriptor once and ignores the failed source', async () => {
    const onRefreshUrl = vi.fn().mockResolvedValue('https://example.com/refreshed.dzi');
    wrapper = mount(ImageViewer, {
      props: {
        images: [{ url: 'https://example.com/expired.dzi' }],
        onRefreshUrl,
      },
    });
    await flushPromises();

    osdMock.instances[0]?.handlers['open-failed']?.[0]?.({ message: '403' });
    await flushPromises();

    expect(onRefreshUrl).toHaveBeenCalledExactlyOnceWith('https://example.com/expired.dzi');
    expect(osdMock.instances).toHaveLength(1);
    const refreshed = osdMock.instances[osdMock.instances.length - 1];
    expect(refreshed?.addTiledImage).toHaveBeenCalledWith(expect.objectContaining({
      tileSource: 'https://example.com/refreshed.dzi', preload: true, opacity: 0,
    }));
    expect(refreshed?.destroy).not.toHaveBeenCalled();
    expect(refreshed?.viewport.panTo).not.toHaveBeenCalled();
    expect(refreshed?.viewport.zoomTo).not.toHaveBeenCalled();
    expect(wrapper.text()).not.toContain('Failed to load image');
  });

  it('keeps the loaded image when selecting its active thumbnail again', async () => {
    wrapper = mount(ImageViewer, { props: { images: [{ url: 'one.jpg' }, { url: 'two.jpg' }] } });
    await flushPromises();
    osdMock.instances[0]?.handlers.open?.[0]?.({});
    await flushPromises();
    wrapper.findComponent(ImageThumbnailStrip).vm.$emit('select-image', 0);
    await flushPromises();
    expect(wrapper.text()).not.toContain('Loading...');
    expect(osdMock.factory).toHaveBeenCalledOnce();
    expect(wrapper.emitted('selectImage')).toBeUndefined();
  });

  it('ignores old refresh results while allowing the new selection to refresh', async () => {
    let resolveOld!: (url: string) => void;
    const onRefreshUrl = vi.fn()
      .mockImplementationOnce(() => new Promise<string>((resolve) => { resolveOld = resolve; }))
      .mockResolvedValueOnce('two-new.dzi');
    wrapper = mount(ImageViewer, { props: {
      images: [
        { url: 'one.dzi', conversions: { thumbnail: 'one.jpg' } },
        { url: 'two.dzi', conversions: { thumbnail: 'two.jpg' } },
      ],
      onRefreshUrl,
    } });
    await flushPromises();
    const old = osdMock.instances[0];
    old?.handlers['open-failed']?.[0]?.({ message: '403' });
    await flushPromises();
    await wrapper.get('button[title="Next"]').trigger('click');
    await flushPromises();
    expect(osdMock.instances).toHaveLength(2);
    expect(osdMock.instances[1]?.options.tileSources).toBe('two.dzi');
    osdMock.instances[1]?.handlers['open-failed']?.[0]?.({ message: '403' });
    await flushPromises();
    expect(onRefreshUrl).toHaveBeenCalledTimes(2);
    expect(osdMock.instances[1]?.addTiledImage).toHaveBeenCalledWith(expect.objectContaining({ tileSource: 'two-new.dzi' }));
    osdMock.instances[1]?.handlers.open?.[0]?.({});
    resolveOld('one-new.dzi');
    old?.handlers.open?.[0]?.({});
    await flushPromises();
    expect(osdMock.instances).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.text()).not.toContain('Failed to load image');
  });

  it('does not replenish retries when a refreshed descriptor opens but its tiles fail', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const onRefreshUrl = vi.fn().mockResolvedValue('refreshed.dzi');
      wrapper = mount(ImageViewer, { props: { images: [{ url: 'expired.dzi' }], onRefreshUrl } });
      await flushPromises();
      osdMock.instances[0]?.handlers['open-failed']?.[0]?.({ message: '403' });
      await flushPromises();
      const refreshed = osdMock.instances[0];
      refreshed?.handlers.open?.[0]?.({});
      refreshed?.handlers['tile-load-failed']?.[0]?.({ maxReached: true, message: '403' });
      await flushPromises();
      expect(onRefreshUrl).toHaveBeenCalledOnce();
      expect(wrapper.text()).toContain('Failed to load image');
    } finally {
      error.mockRestore();
    }
  });

  it('recomputes the raster home cap after resizing without resetting explicit zoom', async () => {
    wrapper = mount(ImageViewer, { props: { images: [{ url: 'small.jpg' }] } });
    await flushPromises();
    const instance = osdMock.instances[0]!;
    instance.handlers.open?.[0]?.({});
    instance.viewport.getHomeZoom.mockReturnValue(2.5);
    instance.handlers['after-resize']?.[0]?.({});
    await flushPromises();
    expect(instance.viewport.defaultZoomLevel).toBe(1);
    instance.viewport.getHomeZoom.mockReturnValue(0.4);
    instance.handlers['after-resize']?.[0]?.({});
    await flushPromises();
    expect(instance.viewport.defaultZoomLevel).toBe(0);
    await wrapper.get('button[title="Zoom in"]').trigger('click');
    instance.viewport.goHome.mockClear();
    instance.handlers['after-resize']?.[0]?.({});
    await flushPromises();
    expect(instance.viewport.goHome).not.toHaveBeenCalled();
  });
});
