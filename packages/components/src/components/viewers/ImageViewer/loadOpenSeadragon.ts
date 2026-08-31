import type OpenSeadragon from 'openseadragon';

/** Loads the viewer implementation only when an image viewer is mounted. */
export async function loadOpenSeadragon(): Promise<typeof OpenSeadragon> {
  const { default: createOpenSeadragon } = await import('openseadragon');
  return createOpenSeadragon;
}
