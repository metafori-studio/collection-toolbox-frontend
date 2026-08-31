import { computed, onScopeDispose, ref, watch, type Ref } from 'vue';
import { getNextViewerZoom, getPreviousViewerZoom } from '../zoom';

interface ViewerDimension {
  width: number;
  height: number;
}

const ZOOM_EPSILON = 0.001;

export interface UseZoomOptions {
  maxScale?: number;
  renderedElement?: Readonly<Ref<HTMLElement | null>>;
  contentDimension?: Readonly<Ref<ViewerDimension | null>>;
}

export function useZoom(options: UseZoomOptions = {}) {
  const { maxScale = 2 } = options;
  const customScale = ref<number | null>(null);
  const renderedSize = ref<ViewerDimension | null>(null);
  const isFit = computed(() => customScale.value === null);
  const scale = computed(() => customScale.value ?? 1);
  const renderedScale = computed(() => {
    const size = renderedSize.value;
    const intrinsic = options.contentDimension?.value;
    if (!size?.width || !size.height || !intrinsic?.width || !intrinsic.height) return null;
    return Math.min(size.width / intrinsic.width, size.height / intrinsic.height);
  });
  const displayedZoomPercentage = computed(() => {
    const currentScale = isFit.value ? renderedScale.value : scale.value;
    return currentScale === null ? null : Math.round(currentScale * 100);
  });
  const canZoomIn = computed(() => {
    const currentScale = isFit.value ? renderedScale.value : scale.value;
    return currentScale !== null && currentScale < maxScale - ZOOM_EPSILON;
  });
  const canZoomOut = computed(() => renderedScale.value !== null && !isFit.value);
  const canResetZoom = computed(() => !isFit.value);

  let resizeObserver: ResizeObserver | null = null;
  if (options.renderedElement) {
    watch(
      options.renderedElement,
      (element) => {
        resizeObserver?.disconnect();
        resizeObserver = null;
        if (isFit.value) renderedSize.value = null;
        if (!element) return;

        resizeObserver = new ResizeObserver(([entry]) => {
          // Explicit zoom also resizes the observed media. Keep the last CSS-fit
          // measurement so zooming out can traverse the intervening boundaries.
          if (!entry || !isFit.value) return;
          renderedSize.value = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        });
        resizeObserver.observe(element);
      },
      { immediate: true, flush: 'post' },
    );
    onScopeDispose(() => resizeObserver?.disconnect());
  }

  function setScale(newScale: number | null) {
    customScale.value = newScale;
  }

  function zoomIn() {
    if (!canZoomIn.value) return;
    const currentScale = customScale.value ?? renderedScale.value;
    if (currentScale === null) return;
    setScale(getNextViewerZoom(currentScale, maxScale) ?? maxScale);
  }

  function zoomOut() {
    const fitScale = renderedScale.value;
    if (fitScale === null) return;
    const previousScale = getPreviousViewerZoom(scale.value);
    if (previousScale === undefined || previousScale <= fitScale) {
      setScale(null);
      return;
    }
    setScale(previousScale);
  }

  function zoomByFactor(factor: number) {
    const fitScale = renderedScale.value;
    if (fitScale === null) return;
    const currentScale = customScale.value ?? fitScale;
    const nextScale = Math.min(maxScale, currentScale * factor);
    if (nextScale <= fitScale + 0.001) {
      setScale(null);
      return;
    }
    setScale(nextScale);
  }

  function zoomByWheel(deltaY: number) {
    // Many small trackpad deltas produce many small scale changes, while a
    // mouse-wheel notch remains useful. Pinch gestures share zoomByFactor.
    zoomByFactor(Math.exp(-deltaY * 0.0015));
  }

  function resetZoom() {
    setScale(null);
  }

  return {
    customScale,
    isFit,
    scale,
    renderedScale,
    displayedZoomPercentage,
    canZoomIn,
    canZoomOut,
    canResetZoom,
    zoomIn,
    zoomOut,
    zoomByFactor,
    zoomByWheel,
    resetZoom,
    setScale,
  };
}
