import {
  describe, it, expect, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import ArtworkCollectionImageGrid from './ArtworkCollectionImageGrid.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => (params ? `${key}:${JSON.stringify(params)}` : key),
  }),
}));

const images = [
  'https://example.com/1.jpg',
  'https://example.com/2.jpg',
  'https://example.com/3.jpg',
];

describe('ArtworkCollectionImageGrid', () => {
  it('renders one image per source', () => {
    const wrapper = mount(ArtworkCollectionImageGrid, {
      props: { images, title: 'Collection' },
    });
    const imgs = wrapper.findAll('img');
    expect(imgs).toHaveLength(3);
    expect(imgs.map((img) => img.attributes('src'))).toEqual(images);
  });

  it('builds numbered alt text from the title via i18n', () => {
    const wrapper = mount(ArtworkCollectionImageGrid, {
      props: { images, title: 'Collection' },
    });
    expect(wrapper.findAll('img').map((img) => img.attributes('alt'))).toEqual([
      'collectionImageGrid.imageAlt:{"title":"Collection","index":1}',
      'collectionImageGrid.imageAlt:{"title":"Collection","index":2}',
      'collectionImageGrid.imageAlt:{"title":"Collection","index":3}',
    ]);
  });

  it('renders no images for an empty list', () => {
    const wrapper = mount(ArtworkCollectionImageGrid, {
      props: { images: [], title: 'Collection' },
    });
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('passes classes to the root element', () => {
    const wrapper = mount(ArtworkCollectionImageGrid, {
      props: { images, title: 'Collection' },
      attrs: { class: 'h-[213px]' },
    });
    expect(wrapper.classes()).toContain('h-[213px]');
  });
});
