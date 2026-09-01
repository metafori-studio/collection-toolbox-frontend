const ZOOM_EPSILON = 0.001;

export function getNextViewerZoom(currentScale: number, maxScale = 2): number | undefined {
  if (currentScale <= 0) return undefined;
  const nextScale = 2 ** Math.ceil(Math.log2(currentScale + ZOOM_EPSILON));
  return nextScale <= maxScale ? nextScale : undefined;
}

export function getPreviousViewerZoom(currentScale: number): number | undefined {
  const adjustedScale = currentScale - ZOOM_EPSILON;
  if (adjustedScale <= 0) return undefined;
  return 2 ** Math.floor(Math.log2(adjustedScale));
}
