import type OpenSeadragon from 'openseadragon';
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
import { isDeepZoomImage, type ViewerMediaResource } from '../media';
import { useMediaRefresh, type RefreshUrlHandler } from '../useMediaRefresh';
import { loadOpenSeadragon } from './loadOpenSeadragon';
import { useOpenSeadragonZoom } from './useOpenSeadragonZoom';

interface OpenSeadragonViewerOptions {
  element: Ref<HTMLElement | null>;
  image: ComputedRef<ViewerMediaResource | null>;
  /** Original selection identity, unchanged by a refreshed URL. */
  source: ComputedRef<ViewerMediaResource | undefined>;
  refreshHandler: ComputedRef<RefreshUrlHandler | undefined>;
  onUrlRefreshed: (url: string) => void;
}

/** Owns one renderer at a time; async work may only affect its active load. */
export function useOpenSeadragonViewer(options: OpenSeadragonViewerOptions) {
  const viewerElement = options.element;
  const currentImage = options.image;
  const viewer = shallowRef<OpenSeadragon.Viewer | null>(null);
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const toolbarHeight = ref(0);
  const { refreshAndRetry, resetRefreshAttempts, markLoadSuccess } = useMediaRefresh(options.refreshHandler);
  let loadVersion = 0;
  let failedVersion = 0;
  let activeUrl = '';
  let panFrame: number | null = null;
  let pendingPanDelta: OpenSeadragon.Point | null = null;
  const zoom = useOpenSeadragonZoom(viewer);
  const { resetZoomState, syncZoom, updateHomeZoom } = zoom;
  const viewportMargins = computed(() => ({
    top: 16,
    right: 16,
    bottom: Math.max(16, toolbarHeight.value),
    left: 16,
  }));

  // A refreshed URL is still the same source session and must not replenish
  // the retry budget. A different selected item starts an independent session.
  watch(options.source, resetRefreshAttempts, { flush: 'sync' });

  function updateLayout(mode: 'fit' | 'preserve' = zoom.isFit.value ? 'fit' : 'preserve') {
    const target = viewer.value;
    if (!target?.world.getItemAt(0) || !currentImage.value) return;
    target.viewport.setMargins(viewportMargins.value);
    updateHomeZoom(!isDeepZoomImage(currentImage.value));
    if (mode === 'fit') target.viewport.goHome(true);
    else target.viewport.applyConstraints(true);
    syncZoom();
  }

  function handleToolbarResize(height: number) {
    toolbarHeight.value = height;
    updateLayout();
  }

  function destroyViewer() {
    if (panFrame !== null) cancelAnimationFrame(panFrame);
    panFrame = null;
    pendingPanDelta = null;
    viewer.value?.destroy();
    viewer.value = null;
    resetZoomState();
  }

  function scheduleMousePan(target: OpenSeadragon.Viewer, event: OpenSeadragon.CanvasDragEvent) {
    if (event.pointerType !== 'mouse') return;
    event.preventDefaultAction = true;
    const delta = event.delta.negate();
    pendingPanDelta = pendingPanDelta ? pendingPanDelta.plus(delta) : delta;
    if (panFrame !== null) return;
    panFrame = requestAnimationFrame(() => {
      panFrame = null;
      const pixels = pendingPanDelta;
      pendingPanDelta = null;
      if (!pixels || viewer.value !== target) return;
      target.viewport.panBy(target.viewport.deltaPointsFromPixels(pixels), true);
      target.viewport.applyConstraints(true);
    });
  }

  function getTileSource(image: ViewerMediaResource) {
    if (isDeepZoomImage(image)) return image.url;
    return {
      type: 'image',
      url: image.url,
      // A regular preview has no server-side tile pyramid. Avoid allocating a
      // full in-memory pyramid and let OpenSeadragon scale the source directly.
      buildPyramid: false,
      // Plain previews may redirect through CDNs without CORS headers. Since no
      // canvas pyramid is built, a normal image request is cheaper and safer.
      crossOriginPolicy: false,
      ajaxWithCredentials: false,
    };
  }

  async function handleLoadError(version: number, failedUrl: string, error: unknown) {
    if (version !== loadVersion || version === failedVersion) return;
    failedVersion = version;
    const refreshed = await refreshAndRetry(failedUrl, async (refreshedUrl) => {
      if (version !== loadVersion || currentImage.value?.url !== failedUrl) {
        return false;
      }
      options.onUrlRefreshed(refreshedUrl);
      return true;
    });
    if (refreshed || version !== loadVersion) return;
    console.error('[ImageViewer] OpenSeadragon failed to load the image:', error);
    status.value = 'error';
  }

  async function createViewer(image: ViewerMediaResource, preserveView = false) {
    const url = image.url;
    const deepZoom = isDeepZoomImage(image);
    if (preserveView && viewer.value) {
      const instance = viewer.value;
      const version = loadVersion;
      activeUrl = url;
      failedVersion = 0;
      const previousItem = instance.world.getItemAt(0);
      instance.addTiledImage({
        tileSource: getTileSource(image),
        opacity: previousItem ? 0 : 1,
        preload: true,
        success: (event) => {
          if (viewer.value !== instance) return;
          const item = (event as unknown as { item: OpenSeadragon.TiledImage }).item;
          const reveal = () => {
            if (viewer.value !== instance || !item.getFullyLoaded()) return;
            item.removeHandler('fully-loaded-change', reveal);
            item.setOpacity(1);
            if (previousItem) instance.world.removeItem(previousItem);
            status.value = 'ready';
            failedVersion = 0;
            markLoadSuccess();
            syncZoom();
          };
          item.addHandler('fully-loaded-change', reveal);
          reveal();
        },
        error: (event) => { void handleLoadError(version, url, event); },
      });
      return;
    }
    activeUrl = url;
    const version = ++loadVersion;
    failedVersion = 0;
    destroyViewer();
    status.value = 'loading';
    try {
      await nextTick();
      if (version !== loadVersion || !viewerElement.value) return;
      const createOpenSeadragon = await loadOpenSeadragon();
      if (version !== loadVersion || !viewerElement.value) return;

      const instance = createOpenSeadragon({
        element: viewerElement.value,
        tileSources: getTileSource(image),
        showNavigationControl: false,
        keyboardNavEnabled: false,
        crossOriginPolicy: 'Anonymous',
        loadTilesWithAjax: deepZoom,
        ajaxWithCredentials: false,
        constrainDuringPan: true,
        visibilityRatio: 1,
        viewportMargins: viewportMargins.value,
        // A non-pyramidal raster can exceed the GPU's maximum texture size.
        // Canvas draws the source directly, while DZI keeps OpenSeadragon's native
        // drawer selection for efficient tiled rendering.
        drawer: deepZoom ? undefined : 'canvas',
        // Keep native wheel/pinch zoom from going below OpenSeadragon's home (fit) zoom.
        minZoomImageRatio: 1,
        maxZoomPixelRatio: 2,
        immediateRender: !deepZoom,
        // Preserve the established zoom animation timing.
        animationTime: 0.2,
        // OpenSeadragon's 50 ms default feels jerky on trackpads. Keep input
        // processing aligned with a typical display frame instead.
        minScrollDeltaTime: 16,
        tileRetryMax: 1,
        gestureSettingsMouse: {
          clickToZoom: false,
          dblClickToZoom: false,
        },
      });
      viewer.value = instance;

      instance.addHandler('open', () => {
        if (version !== loadVersion || viewer.value !== instance) return;
        status.value = 'ready';
        instance.forceResize();
        updateLayout('fit');
        instance.forceRedraw();
      });
      instance.addHandler('tile-loaded', () => {
        if (deepZoom || version !== loadVersion || viewer.value !== instance) return;
        // ImageTileSource can finish its single tile during the initial update.
        // Explicitly invalidate the canvas so a cached raster does not stay blank
        // until the first zoom or pan interaction.
        instance.forceRedraw();
      });
      instance.addHandler('open-failed', (event) => {
        void handleLoadError(version, activeUrl, event.message);
      });
      instance.addHandler('tile-load-failed', (event) => {
        if (event.maxReached) void handleLoadError(version, activeUrl, event.message);
      });
      instance.addHandler('canvas-drag', (event) => {
        if (version === loadVersion) scheduleMousePan(instance, event);
      });
      const syncCurrentViewer = () => {
        if (version === loadVersion) syncZoom();
      };
      instance.addHandler('zoom', syncCurrentViewer);
      instance.addHandler('animation-finish', syncCurrentViewer);
      let wasFitBeforeResize: boolean | undefined;
      instance.addHandler('resize', () => { wasFitBeforeResize = zoom.isFit.value; });
      instance.addHandler('after-resize', () => {
        const stayAtHome = wasFitBeforeResize ?? zoom.isFit.value;
        wasFitBeforeResize = undefined;
        // OSD restores center/zoom after Viewport's after-resize event.
        // Apply the home policy after that native resize transaction finishes.
        queueMicrotask(() => {
          if (version !== loadVersion) return;
          updateLayout(stayAtHome ? 'fit' : 'preserve');
        });
      });
    } catch (error) {
      await handleLoadError(version, url, error);
    }
  }

  watch(
    currentImage,
    (image) => {
      if (image) {
        void createViewer(image, image.url !== options.source.value?.url);
      } else {
        loadVersion += 1;
        destroyViewer();
        status.value = 'idle';
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    resetRefreshAttempts();
    loadVersion += 1;
    destroyViewer();
  });

  return { ...zoom, status, handleToolbarResize };
}
