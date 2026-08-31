import { computed, ref, type ShallowRef } from 'vue';
import type OpenSeadragon from 'openseadragon';
import { getNextViewerZoom, getPreviousViewerZoom } from '../zoom';

/** Bridges shared toolbar zoom steps to OpenSeadragon's image scale. */
export function useOpenSeadragonZoom(
  viewer: ShallowRef<OpenSeadragon.Viewer | null>,
  maxScale = 2,
) {
  const imageScale = ref<number | null>(null);
  const homeScale = ref<number | null>(null);
  const isFit = computed(() => (
    imageScale.value === null
    || homeScale.value === null
    || imageScale.value <= homeScale.value + 0.001
  ));
  const displayedZoomPercentage = computed(() => (
    imageScale.value === null ? null : Math.round(imageScale.value * 100)
  ));
  const canZoomIn = computed(() => imageScale.value !== null && imageScale.value < maxScale - 0.001);
  const canZoomOut = computed(() => !isFit.value);
  const canResetZoom = computed(() => !isFit.value);

  function getTiledImage() {
    return viewer.value?.world.getItemAt(0) ?? null;
  }

  function syncZoom() {
    const currentViewer = viewer.value;
    const tiledImage = getTiledImage();
    if (!currentViewer || !tiledImage) {
      imageScale.value = null;
      homeScale.value = null;
      return;
    }
    imageScale.value = tiledImage.viewportToImageZoom(currentViewer.viewport.getZoom());
    homeScale.value = tiledImage.viewportToImageZoom(currentViewer.viewport.getHomeZoom());
  }

  function zoomToImageScale(scale: number, immediately = false) {
    const currentViewer = viewer.value;
    const tiledImage = getTiledImage();
    if (!currentViewer || !tiledImage) return;
    currentViewer.viewport.zoomTo(tiledImage.imageToViewportZoom(scale), undefined, immediately);
    currentViewer.viewport.applyConstraints(immediately);
    syncZoom();
  }

  /** Recompute native fit after layout changes, then cap raster previews at 1:1. */
  function updateHomeZoom(capAtOriginalSize: boolean) {
    const currentViewer = viewer.value;
    const tiledImage = getTiledImage();
    if (!currentViewer || !tiledImage) return;
    const viewport = currentViewer.viewport as OpenSeadragon.Viewport & {
      defaultZoomLevel: number;
      minZoomImageRatio: number;
    };
    // Clear the previous override first: it describes the old viewport size.
    viewport.defaultZoomLevel = 0;
    viewport.minZoomImageRatio = 1;
    if (capAtOriginalSize && tiledImage.viewportToImageZoom(viewport.getHomeZoom()) > 1) {
      viewport.defaultZoomLevel = tiledImage.imageToViewportZoom(1);
    }
  }

  function zoomIn() {
    const currentScale = imageScale.value;
    if (currentScale === null) return;
    zoomToImageScale(getNextViewerZoom(currentScale, maxScale) ?? maxScale);
  }

  function zoomOut() {
    const currentViewer = viewer.value;
    if (!currentViewer || imageScale.value === null || homeScale.value === null) return;
    const previousScale = getPreviousViewerZoom(imageScale.value);
    if (previousScale === undefined || previousScale <= homeScale.value) {
      currentViewer.viewport.goHome();
      syncZoom();
      return;
    }
    zoomToImageScale(previousScale);
  }

  function resetZoom() {
    viewer.value?.viewport.goHome();
    syncZoom();
  }

  function resetZoomState() {
    imageScale.value = null;
    homeScale.value = null;
  }

  return {
    canResetZoom,
    canZoomIn,
    canZoomOut,
    displayedZoomPercentage,
    isFit,
    resetZoom,
    resetZoomState,
    syncZoom,
    updateHomeZoom,
    zoomIn,
    zoomOut,
  };
}
