import { afterEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowReactive } from 'vue';
import { useImageCollection } from './useImageCollection';
import type { ViewerDetail, ViewerMediaResource } from './media';

describe('useImageCollection', () => {
  let scope = effectScope();
  afterEach(() => {
    scope.stop();
    scope = effectScope();
  });

  it('uses media objects and their collection without normalizing or copying them', () => {
    const images: ViewerMediaResource[] = [
      { id: 0, name: 'Original name', url: 'one.jpg', conversions: { thumbnail: 'thumb.jpg' } },
      { url: 'two.dzi' },
    ];
    const emit = vi.fn();
    const collection = scope.run(() => useImageCollection({ modelValue: 1, detail: { media: { images } } }, emit))!;

    expect(collection.images.value).toBe(images);
    expect(collection.currentImage.value).toBe(images[0]);
    collection.nextImage();
    expect(collection.currentImage.value).toBe(images[1]);
    expect(collection.currentImage.value).toEqual({ url: 'two.dzi' });
    expect(emit).toHaveBeenCalledWith('update:modelValue', 2);
  });

  it('accepts explicit media objects ahead of the detail collection', () => {
    const images = [{ url: 'explicit.jpg' }];
    const collection = scope.run(() => useImageCollection({
      modelValue: 1, images, detail: { media: { images: [{ url: 'detail.jpg' }] } },
    }, vi.fn()))!;

    expect(collection.images.value).toBe(images);
    expect(collection.currentImage.value).toBe(images[0]);
  });

  it('keeps refreshed URLs separate from source media and resets them on collection replacement', async () => {
    const images = [{ url: 'expired.jpg', conversions: { thumbnail: 'thumb.jpg' } }, { url: 'two.jpg' }];
    const props = shallowReactive<{ modelValue: number; detail: ViewerDetail }>({ modelValue: 1, detail: { media: { images } } });
    const collection = scope.run(() => useImageCollection(props, vi.fn()))!;

    collection.overrideImageUrl(0, 'fresh.jpg');
    expect(collection.currentImage.value?.url).toBe('fresh.jpg');
    expect(collection.currentImage.value?.conversions).toBe(images[0]!.conversions);
    expect(images[0]!.url).toBe('expired.jpg');

    collection.nextImage();
    const replacement = [{ url: 'replacement.jpg' }];
    props.detail = { media: { images: replacement } };
    await nextTick();

    expect(collection.currentIndex.value).toBe(0);
    expect(collection.images.value).toBe(replacement);
    expect(collection.currentImage.value).toBe(replacement[0]);
  });
});
