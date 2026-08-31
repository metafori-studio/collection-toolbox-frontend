import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useViewerViewportInteraction } from './useViewerViewportInteraction';

describe('useViewerViewportInteraction', () => {
  it('keeps the media point under the pointer fixed while wheel zooming', async () => {
    let zoomed = false;
    const media = {
      getBoundingClientRect: vi.fn(() => (
        zoomed
          ? { left: -30, top: -15, width: 400, height: 300 }
          : { left: 20, top: 30, width: 200, height: 150 }
      )),
    } as unknown as HTMLElement;
    const viewport = {
      querySelector: vi.fn(() => media),
      scrollLeft: 100,
      scrollTop: 80,
    } as unknown as HTMLElement;
    const zoomByWheel = vi.fn(() => { zoomed = true; });
    const interaction = useViewerViewportInteraction({
      canPan: ref(true),
      renderedElement: ref(media),
      zoomByWheel,
      zoomByFactor: vi.fn(),
    });
    const preventDefault = vi.fn();

    await interaction.onViewportWheel({
      currentTarget: viewport,
      clientX: 120,
      clientY: 105,
      deltaY: -100,
      preventDefault,
    } as unknown as WheelEvent);

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(zoomByWheel).toHaveBeenCalledWith(-100);
    expect(viewport.scrollLeft).toBe(150);
    expect(viewport.scrollTop).toBe(110);
  });

  it('keeps the viewport center fixed during toolbar zoom', async () => {
    let zoomed = false;
    const viewport = {
      getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0, width: 300, height: 200 })),
      scrollLeft: 0,
      scrollTop: 0,
    } as unknown as HTMLElement;
    const media = {
      closest: vi.fn(() => viewport),
      getBoundingClientRect: vi.fn(() => (
        zoomed
          ? { left: 0, top: 0, width: 400, height: 300 }
          : { left: 50, top: 25, width: 200, height: 150 }
      )),
    } as unknown as HTMLElement;
    const interaction = useViewerViewportInteraction({
      canPan: ref(false),
      renderedElement: ref(media),
      zoomByWheel: vi.fn(),
      zoomByFactor: vi.fn(),
    });

    await interaction.zoomAtViewportCenter(() => { zoomed = true; });

    expect(viewport.scrollLeft).toBe(50);
    expect(viewport.scrollTop).toBe(50);
  });

  it('does not zoom without a rendered element or measurable bounds', async () => {
    const renderedElement = ref<HTMLElement | null>(null);
    const viewport = { querySelector: vi.fn(), getBoundingClientRect: vi.fn(), scrollLeft: 0, scrollTop: 0 };
    const zoom = vi.fn();
    const interaction = useViewerViewportInteraction({
      renderedElement, canPan: ref(true), zoomByWheel: zoom, zoomByFactor: vi.fn(),
    });
    const wheel = { currentTarget: viewport, preventDefault: vi.fn(), deltaY: -100 } as unknown as WheelEvent;
    await interaction.onViewportWheel(wheel);
    await interaction.zoomAtViewportCenter(zoom);
    renderedElement.value = {
      closest: () => viewport,
      getBoundingClientRect: () => ({ width: 0, height: 0 }),
    } as unknown as HTMLElement;
    viewport.getBoundingClientRect.mockReturnValue({ width: 600, height: 800 });
    await interaction.onViewportWheel(wheel);
    await interaction.zoomAtViewportCenter(zoom);
    expect(zoom).not.toHaveBeenCalled();
    expect(viewport.querySelector).not.toHaveBeenCalled();
  });

  it('pinch-zooms around the midpoint of two touch pointers', async () => {
    let zoomed = false;
    const viewport = {
      querySelector: vi.fn(),
      scrollLeft: 0,
      scrollTop: 0,
      setPointerCapture: vi.fn(),
    } as unknown as HTMLElement;
    const media = {
      getBoundingClientRect: vi.fn(() => (
        zoomed
          ? { left: 50, top: 0, width: 400, height: 400 }
          : { left: 50, top: 0, width: 200, height: 200 }
      )),
    } as unknown as HTMLElement;
    vi.mocked(viewport.querySelector).mockReturnValue(media);
    const zoomByFactor = vi.fn(() => { zoomed = true; });
    const interaction = useViewerViewportInteraction({
      canPan: ref(false),
      renderedElement: ref(media),
      zoomByFactor,
      zoomByWheel: vi.fn(),
    });
    const pointer = (pointerId: number, clientX: number, clientY: number) => ({
      currentTarget: viewport,
      pointerType: 'touch',
      pointerId,
      clientX,
      clientY,
      preventDefault: vi.fn(),
    }) as unknown as PointerEvent;

    interaction.onViewportPointerDown(pointer(1, 50, 100));
    interaction.onViewportPointerDown(pointer(2, 150, 100));
    interaction.onViewportPointerMove(pointer(2, 200, 100));
    await nextTick();

    expect(zoomByFactor).toHaveBeenCalledWith(1.5);
    expect(viewport.scrollLeft).toBe(75);
    expect(viewport.scrollTop).toBe(100);
  });
});
