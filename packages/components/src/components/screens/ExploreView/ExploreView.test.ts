import {
  describe, it, expect, vi,
} from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import ExploreView from './ExploreView.vue';
import { type Artwork, type ArtworkListResponse } from '../../../types/artwork';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/artwork/:id', name: 'ArtworkDetail', component: { template: '<div />' } },
  ],
});

const makeArtwork = (id: number): Artwork => ({
  id,
  image: 'https://example.com/image.jpg',
  title: `Artwork ${id}`,
  author: 'Pablo Picasso',
  year: '1937',
});

const listResponse = (data: Artwork[], total: number): ArtworkListResponse => ({
  data,
  meta: { total },
});

const mountView = (getList = vi.fn().mockResolvedValue(listResponse([makeArtwork(1), makeArtwork(2)], 2))) => {
  const wrapper = mount(ExploreView, {
    props: { getList },
    global: { plugins: [router] },
  });
  return { wrapper, getList };
};

const findLoadMoreButton = (wrapper: ReturnType<typeof mount>) => wrapper
  .findAll('button')
  .find((button) => button.text() === 'Zobraziť ďalšie');

describe('ExploreView', () => {
  it('calls getList on mount with the default order and first page', () => {
    const { getList } = mountView();
    expect(getList).toHaveBeenCalledWith('age', 1);
  });

  it('renders one ArtworkCard per returned item', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(2);
  });

  it('renders the total artwork count', async () => {
    const getList = vi.fn().mockResolvedValue(listResponse([makeArtwork(1)], 5));
    const { wrapper } = mountView(getList);
    await flushPromises();
    expect(wrapper.text()).toContain('5');
  });

  it('reloads items from page 1 when the order changes', async () => {
    const { wrapper, getList } = mountView();
    await flushPromises();
    getList.mockClear();

    await wrapper.find('select').setValue('-age');
    await flushPromises();

    expect(getList).toHaveBeenCalledWith('-age', 1);
  });

  it('appends the next page of items when "Zobraziť ďalšie" is clicked', async () => {
    const getList = vi.fn()
      .mockResolvedValueOnce(listResponse([makeArtwork(1)], 2))
      .mockResolvedValueOnce(listResponse([makeArtwork(2)], 2));
    const { wrapper } = mountView(getList);
    await flushPromises();

    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(1);

    await findLoadMoreButton(wrapper)?.trigger('click');
    await flushPromises();

    expect(getList).toHaveBeenCalledTimes(2);
    expect(getList).toHaveBeenLastCalledWith('age', 2);
    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(2);
  });

  it('hides the "load more" button once all items are loaded', async () => {
    const { wrapper } = mountView(vi.fn().mockResolvedValue(listResponse([makeArtwork(1), makeArtwork(2)], 2)));
    await flushPromises();
    expect(findLoadMoreButton(wrapper)).toBeUndefined();
  });
});
