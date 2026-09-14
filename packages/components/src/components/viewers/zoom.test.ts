import { describe, expect, it } from 'vitest';
import { getNextViewerZoom, getPreviousViewerZoom } from './zoom';

describe('zoom', () => {
  it('derives zoom boundaries from powers of two', () => {
    expect([0.17, 0.25, 0.4, 0.5, 0.69, 1, 1.5, 2].map((scale) => getNextViewerZoom(scale)))
      .toEqual([0.25, 0.5, 0.5, 1, 1, 2, 2, undefined]);
    expect([2, 1.5, 1, 0.69, 0.5, 0.4, 0.25].map((scale) => getPreviousViewerZoom(scale)))
      .toEqual([1, 1, 0.5, 0.5, 0.25, 0.25, 0.125]);
  });
});
