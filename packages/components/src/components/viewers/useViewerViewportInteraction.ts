import { nextTick, ref, type Ref } from 'vue';

interface UseViewerViewportInteractionOptions {
  canPan: Readonly<Ref<boolean>>;
  renderedElement: Readonly<Ref<HTMLElement | null>>;
  zoomByFactor: (factor: number) => void;
  zoomByWheel: (deltaY: number) => void;
}

interface TouchPoint {
  x: number;
  y: number;
}

/** Shared mouse-drag panning and discrete wheel zoom for overflow-based media. */
export function useViewerViewportInteraction(options: UseViewerViewportInteractionOptions) {
  const isPanning = ref(false);
  let activePointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;
  let zoomVersion = 0;
  const touchPoints = new Map<number, TouchPoint>();
  let pinchDistance = 0;

  function getPinchGeometry() {
    const [first, second] = [...touchPoints.values()];
    if (!first || !second) return null;
    return {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };
  }

  async function zoomAtPoint(
    viewport: HTMLElement,
    clientX: number,
    clientY: number,
    zoom: () => void,
  ) {
    const version = ++zoomVersion;
    const media = options.renderedElement.value;
    if (!media) return;
    const mediaRect = media.getBoundingClientRect();
    if (!mediaRect.width || !mediaRect.height) return;
    const anchorX = Math.min(1, Math.max(0, (clientX - mediaRect.left) / mediaRect.width));
    const anchorY = Math.min(1, Math.max(0, (clientY - mediaRect.top) / mediaRect.height));

    zoom();
    await nextTick();
    if (version !== zoomVersion || media !== options.renderedElement.value) return;
    const resizedRect = media.getBoundingClientRect();
    viewport.scrollLeft += resizedRect.left + resizedRect.width * anchorX - clientX;
    viewport.scrollTop += resizedRect.top + resizedRect.height * anchorY - clientY;
  }

  async function zoomAtViewportCenter(zoom: () => void) {
    const media = options.renderedElement.value;
    const viewport = media?.closest<HTMLElement>('[data-media-viewport]');
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    await zoomAtPoint(viewport, viewportRect.left + viewportRect.width / 2, viewportRect.top + viewportRect.height / 2, zoom);
  }

  async function onViewportWheel(event: WheelEvent) {
    event.preventDefault();
    await zoomAtPoint(event.currentTarget as HTMLElement, event.clientX, event.clientY, () => options.zoomByWheel(event.deltaY));
  }

  function onViewportPointerDown(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      const viewport = event.currentTarget as HTMLElement;
      touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
      viewport.setPointerCapture(event.pointerId);
      if (touchPoints.size === 1) {
        isPanning.value = options.canPan.value;
      } else if (touchPoints.size === 2) {
        pinchDistance = getPinchGeometry()?.distance ?? 0;
        isPanning.value = false;
        event.preventDefault();
      }
      return;
    }
    if (!options.canPan.value || event.button !== 0 || event.pointerType !== 'mouse') return;
    const viewport = event.currentTarget as HTMLElement;
    viewport.focus({ preventScroll: true });
    activePointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = viewport.scrollLeft;
    startScrollTop = viewport.scrollTop;
    isPanning.value = true;
    viewport.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onViewportPointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch' && touchPoints.has(event.pointerId)) {
      const viewport = event.currentTarget as HTMLElement;
      const previousPoint = touchPoints.get(event.pointerId);
      touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchPoints.size === 1 && previousPoint && options.canPan.value) {
        viewport.scrollLeft -= event.clientX - previousPoint.x;
        viewport.scrollTop -= event.clientY - previousPoint.y;
        isPanning.value = true;
        event.preventDefault();
        return;
      }
      const geometry = getPinchGeometry();
      if (!geometry || !pinchDistance) return;
      const factor = geometry.distance / pinchDistance;
      pinchDistance = geometry.distance;
      void zoomAtPoint(
        viewport,
        geometry.x,
        geometry.y,
        () => options.zoomByFactor(factor),
      );
      event.preventDefault();
      return;
    }
    if (!isPanning.value || activePointerId !== event.pointerId) return;
    const viewport = event.currentTarget as HTMLElement;
    viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    viewport.scrollTop = startScrollTop - (event.clientY - startY);
    event.preventDefault();
  }

  function onViewportPointerUp(event: PointerEvent) {
    if (event.pointerType === 'touch' && touchPoints.has(event.pointerId)) {
      const viewport = event.currentTarget as HTMLElement;
      touchPoints.delete(event.pointerId);
      pinchDistance = touchPoints.size === 2 ? (getPinchGeometry()?.distance ?? 0) : 0;
      isPanning.value = touchPoints.size === 1 && options.canPan.value;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      return;
    }
    if (activePointerId !== event.pointerId) return;
    const viewport = event.currentTarget as HTMLElement;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    activePointerId = null;
    isPanning.value = false;
  }

  return {
    isPanning,
    onViewportWheel,
    onViewportPointerDown,
    onViewportPointerMove,
    onViewportPointerUp,
    zoomAtViewportCenter,
  };
}
