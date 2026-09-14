import { afterEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { useZoom } from './useZoom';

describe('useZoom', () => {
  const scopes: ReturnType<typeof effectScope>[] = [];
  afterEach(() => {
    scopes.splice(0).forEach((scope) => scope.stop());
    vi.unstubAllGlobals();
  });

  function measuredZoom() {
    let resizeCallback: ResizeObserverCallback;
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resizeCallback = callback; }
      observe = vi.fn();
      disconnect = vi.fn();
    });
    const renderedElement = ref<HTMLElement | null>(document.createElement('canvas'));
    const contentDimension = ref<{ width: number; height: number } | null>({ width: 600, height: 800 });
    const scope = effectScope();
    scopes.push(scope);
    const zoom = scope.run(() => useZoom({ renderedElement, contentDimension }))!;
    const measure = (width = 600, height = 800) => resizeCallback([
      { contentRect: { width, height } } as ResizeObserverEntry,
    ], {} as ResizeObserver);
    measure();
    return { zoom, measure, renderedElement, contentDimension };
  }

  it('starts in CSS-controlled fit mode', () => {
    const zoom = useZoom({ maxScale: 2 });

    expect(zoom.isFit.value).toBe(true);
    expect(zoom.displayedZoomPercentage.value).toBeNull();
    expect(zoom.canZoomOut.value).toBe(false);
    expect(zoom.canResetZoom.value).toBe(false);
    expect(zoom.canZoomIn.value).toBe(false);
    zoom.zoomIn();
    zoom.zoomByWheel(-100);
    zoom.zoomByFactor(2);
    expect(zoom.isFit.value).toBe(true);
  });

  it('switches from fit mode to exact zoom levels', () => {
    const { zoom } = measuredZoom();

    zoom.zoomIn();
    expect(zoom.isFit.value).toBe(false);
    expect(zoom.displayedZoomPercentage.value).toBe(200);

    zoom.zoomIn();
    expect(zoom.displayedZoomPercentage.value).toBe(200);

    zoom.zoomOut();
    expect(zoom.isFit.value).toBe(true);
    expect(zoom.displayedZoomPercentage.value).toBe(100);
  });

  it('caps explicit zoom at the configured maximum', () => {
    const { zoom } = measuredZoom();

    for (let index = 0; index < 10; index += 1) zoom.zoomIn();

    expect(zoom.scale.value).toBe(2);
    expect(zoom.displayedZoomPercentage.value).toBe(200);
    expect(zoom.canZoomIn.value).toBe(false);
  });

  it('resets to fit mode', () => {
    const { zoom } = measuredZoom();

    zoom.zoomIn();
    expect(zoom.scale.value).toBe(2);

    zoom.resetZoom();
    expect(zoom.isFit.value).toBe(true);
    expect(zoom.customScale.value).toBeNull();
  });

  it('applies wheel input as a continuous zoom curve and returns to fit', () => {
    const { zoom } = measuredZoom();

    zoom.zoomByWheel(-100);
    expect(zoom.isFit.value).toBe(false);
    expect(zoom.scale.value).toBeCloseTo(Math.exp(0.15));

    zoom.zoomByWheel(10_000);
    expect(zoom.isFit.value).toBe(true);
  });

  it('applies continuous pinch scale factors within the shared limits', () => {
    const { zoom } = measuredZoom();

    zoom.zoomByFactor(1.25);
    expect(zoom.scale.value).toBe(1.25);

    zoom.zoomByFactor(10);
    expect(zoom.scale.value).toBe(2);

    zoom.zoomByFactor(0.1);
    expect(zoom.isFit.value).toBe(true);
  });

  it('retains the measured fit size when a zoomed canvas is replaced', async () => {
    const { zoom, renderedElement } = measuredZoom();
    zoom.zoomIn();
    renderedElement.value = document.createElement('canvas');
    await nextTick();
    expect(zoom.canZoomOut.value).toBe(true);
    zoom.zoomOut();
    expect(zoom.isFit.value).toBe(true);
  });

  it('waits for both nonzero rendered size and page dimensions', () => {
    const { zoom, measure, contentDimension } = measuredZoom();
    measure(0, 0);
    expect(zoom.canZoomIn.value).toBe(false);
    expect(zoom.displayedZoomPercentage.value).toBeNull();
    measure(300, 400);
    expect(zoom.displayedZoomPercentage.value).toBe(50);
    contentDimension.value = null;
    expect(zoom.canZoomIn.value).toBe(false);
    zoom.zoomIn();
    expect(zoom.isFit.value).toBe(true);
  });

  it('derives the fit percentage from the rendered element size', () => {
    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe = observe;
      disconnect = disconnect;
    });

    const element = document.createElement('img');
    const renderedElement = ref<HTMLElement | null>(element);
    const contentDimension = ref({ width: 1200, height: 800 });
    const scope = effectScope();
    const zoom = scope.run(() => useZoom({ renderedElement, contentDimension }));

    expect(observe).toHaveBeenCalledWith(element);
    resizeCallback?.([{
      contentRect: { width: 831, height: 554 },
    } as ResizeObserverEntry], {} as ResizeObserver);

    expect(zoom?.displayedZoomPercentage.value).toBe(69);

    zoom?.zoomIn();
    expect(zoom?.displayedZoomPercentage.value).toBe(100);
    zoom?.zoomIn();
    expect(zoom?.displayedZoomPercentage.value).toBe(200);

    // Ignore observer updates caused by explicit zoom; 200% is not the Fit scale.
    resizeCallback?.([{
      contentRect: { width: 1200, height: 800 },
    } as ResizeObserverEntry], {} as ResizeObserver);

    zoom?.zoomOut();
    expect(zoom?.displayedZoomPercentage.value).toBe(100);
    zoom?.zoomOut();
    expect(zoom?.displayedZoomPercentage.value).toBe(69);

    resizeCallback?.([{
      contentRect: { width: 1440, height: 960 },
    } as ResizeObserverEntry], {} as ResizeObserver);
    expect(zoom?.displayedZoomPercentage.value).toBe(120);
    zoom?.zoomIn();
    expect(zoom?.displayedZoomPercentage.value).toBe(200);

    scope.stop();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
