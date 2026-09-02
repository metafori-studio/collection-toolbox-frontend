import {
  describe, it, expect, vi,
} from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import ArtworkDetailView from './ArtworkDetailView.vue';
import { type ArtworkDetail } from '../../../types/artwork';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'Explore', component: { template: '<div />' } },
  ],
});

const artworkDetail: ArtworkDetail = {
  id: 1,
  title: 'Guernica',
  author: 'Pablo Picasso',
  dating: '1937',
  dimensions: { width: '349.3', height: '776.6' },
  artistic_types: ['painting'],
  material: 'Oil',
  technique: 'Painting',
  acquisition: { method: 'Gift', year: '1981' },
  location_origin: 'Madrid',
  inventory_number: 'INV-001',
  copyright: 'Public domain',
  collections: [
    {
      id: 10,
      name: '20th Century Art',
      about: 'A collection of 20th century artworks.',
      image: 'https://example.com/collection.jpg',
      date: '2020',
      artwork_count: 42,
    },
  ],
};

const mountView = (props: { id?: string, getById?: (id: string) => Promise<ArtworkDetail> } = {}) => mount(ArtworkDetailView, {
  props: {
    id: '1',
    getById: vi.fn().mockResolvedValue(artworkDetail),
    ...props,
  },
  global: { plugins: [router] },
});

describe('ArtworkDetailView', () => {
  it('does not render detail content before loading resolves', () => {
    const wrapper = mountView({ getById: vi.fn(() => new Promise<ArtworkDetail>(() => {})) });
    expect(wrapper.find('h1').exists()).toBe(false);
  });

  it('calls getById with the provided id on mount', () => {
    const getById = vi.fn().mockResolvedValue(artworkDetail);
    mountView({ getById });
    expect(getById).toHaveBeenCalledWith('1');
  });

  it('renders the title and author once loaded', async () => {
    const wrapper = mountView();
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Guernica');
    expect(wrapper.text()).toContain('Pablo Picasso');
  });

  it('renders metadata rows once loaded', async () => {
    const wrapper = mountView();
    await flushPromises();
    const text = wrapper.text();
    expect(text).toContain('1937');
    expect(text).toContain('349.3 x 776.6');
    expect(text).toContain('Madrid');
    expect(text).toContain('INV-001');
  });

  it('renders one ArtworkCollectionCard per collection once loaded', async () => {
    const wrapper = mountView();
    await flushPromises();
    expect(wrapper.findAllComponents({ name: 'ArtworkCollectionCard' })).toHaveLength(1);
  });

  it('reloads the detail when the id prop changes', async () => {
    const getById = vi.fn().mockResolvedValue(artworkDetail);
    const wrapper = mountView({ getById });
    await flushPromises();
    expect(getById).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ id: '2' });
    await flushPromises();
    expect(getById).toHaveBeenCalledTimes(2);
    expect(getById).toHaveBeenLastCalledWith('2');
  });
});
