import {
  describe, it, expect, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import ArtworkCollectionCard from './ArtworkCollectionCard.vue';
import { type ArtworkCollection } from '../../../types/artwork';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const collection: ArtworkCollection = {
  id: 1,
  name: 'Collection',
  about: 'About the collection',
  images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  date: '2024-03-01',
  artwork_count: 42,
};

const mountCard = (props: Record<string, unknown> = {}) => mount(ArtworkCollectionCard, {
  props: { collection, ...props },
});

describe('ArtworkCollectionCard', () => {
  it('renders the name and description', () => {
    const wrapper = mountCard();
    expect(wrapper.get('h3').text()).toBe('Collection');
    expect(wrapper.text()).toContain('About the collection');
  });

  it('passes images and name to the image grid', () => {
    const grid = mountCard().findComponent({ name: 'ArtworkCollectionImageGrid' });
    expect(grid.props('images')).toEqual(collection.images);
    expect(grid.props('title')).toBe('Collection');
  });

  it('passes the collection to the meta list', () => {
    const meta = mountCard().findComponent({ name: 'ArtworkCollectionMeta' });
    expect(meta.props('collection')).toEqual(collection);
  });

  it('uses the vertical layout by default', () => {
    const wrapper = mountCard();
    expect(wrapper.classes()).not.toContain('md:flex-row');
    expect(wrapper.findComponent({ name: 'ArtworkCollectionImageGrid' }).classes()).toContain('h-[213px]');
  });

  it('switches to a row on desktop in the horizontal layout', () => {
    const wrapper = mountCard({ layout: 'horizontal' });
    expect(wrapper.classes()).toContain('md:flex-row');
    const grid = wrapper.findComponent({ name: 'ArtworkCollectionImageGrid' });
    expect(grid.classes()).toContain('md:w-[300px]');
    expect(grid.classes()).not.toContain('h-[213px]');
  });

  it('hides the button by default', () => {
    expect(mountCard().find('button').exists()).toBe(false);
  });

  it('emits open when the button is clicked', async () => {
    const wrapper = mountCard({ showButton: true });
    const button = wrapper.get('button');
    expect(button.text()).toBe('collectionCard.view');

    await button.trigger('click');

    expect(wrapper.emitted('open')).toHaveLength(1);
  });
});
