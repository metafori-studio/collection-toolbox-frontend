import { afterEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import ImageThumbnail from './ImageThumbnail.vue';
import ImageThumbnailStrip from './ImageThumbnailStrip.vue';
import type { ViewerMediaResource } from '../media';

describe('ImageThumbnail', () => {
  let wrapper: VueWrapper | undefined;
  afterEach(() => wrapper?.unmount());

  it('lazily loads the supplied raster thumbnail', () => {
    wrapper = mount(ImageThumbnail, { props: { src: 'thumb.jpg', alt: 'Page one' } });
    expect(wrapper.get('img').attributes()).toMatchObject({
      src: 'thumb.jpg', alt: 'Page one', loading: 'lazy', decoding: 'async',
    });
  });

  it('shows a placeholder without a conversion', () => {
    wrapper = mount(ImageThumbnail);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get('[aria-hidden="true"]').element.children).toHaveLength(0);
  });

  it('shows a placeholder on failure and recovers when the URL changes', async () => {
    wrapper = mount(ImageThumbnail, { props: { src: 'expired.jpg' } });
    await wrapper.get('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);
    await wrapper.setProps({ src: 'fresh.jpg' });
    expect(wrapper.get('img').attributes('src')).toBe('fresh.jpg');
  });

  it('ignores errors from a replaced thumbnail element', async () => {
    wrapper = mount(ImageThumbnail, { props: { src: 'old.jpg' } });
    const old = wrapper.get('img').element;
    await wrapper.setProps({ src: 'new.jpg' });
    old.dispatchEvent(new Event('error'));
    expect(wrapper.get('img').attributes('src')).toBe('new.jpg');
  });

  it('uses only the thumbnail conversion, without falling back to other conversions or the media source', () => {
    const images: ViewerMediaResource[] = [
      { url: 'one.dzi', name: 'First image', conversions: { thumbnail: 'one-thumb.jpg', thumb: 'other.jpg' } },
      { url: 'two.dzi', conversions: { thumbnail: 'two-thumb.jpg' } },
      { url: 'three.dzi', file_name: 'three.jpg', conversions: { thumbnail: 'three-thumb.jpg' } },
      { url: 'four.dzi' },
      { url: 'large-original.jpg' },
      { url: 'six.dzi', conversions: { thumb: 'six-thumb.jpg' } },
    ];
    wrapper = mount(ImageThumbnailStrip, { props: { images, currentIndex: 0 } });
    expect(wrapper.findAll('img').map((image) => image.attributes('src')))
      .toEqual(['one-thumb.jpg', 'two-thumb.jpg', 'three-thumb.jpg']);
    expect(wrapper.findAll('img').map((image) => image.attributes('alt')))
      .toEqual(['First image', '', 'three.jpg']);
  });
});
