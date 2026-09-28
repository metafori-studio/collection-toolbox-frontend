import {
  describe, it, expect, vi,
} from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import ArtworkCollectionListView from './ArtworkCollectionListView.vue';
import {
  type ArtworkCollection,
  type ArtworkCollectionListResponse,
} from '../../../types/artwork';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const makeRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/collections', name: 'CollectionList', component: { template: '<div />' } },
    { path: '/collections/:id', name: 'CollectionDetail', component: { template: '<div />' } },
  ],
});

const makeCollection = (id: number): ArtworkCollection => ({
  id,
  name: `Collection ${id}`,
  about: 'About',
  images: ['https://example.com/1.jpg'],
  date: '2024-03-01',
  artwork_count: 10,
});

const response: ArtworkCollectionListResponse = {
  highlighted: [makeCollection(1)],
  rest: [makeCollection(2), makeCollection(3)],
};

const mountView = (getCollections = vi.fn().mockResolvedValue(response)) => {
  const router = makeRouter();
  const wrapper = mount(ArtworkCollectionListView, {
    props: { getCollections },
    global: { plugins: [router] },
  });
  return { wrapper, getCollections, router };
};

const findCards = (wrapper: ReturnType<typeof mount>) => wrapper
  .findAllComponents({ name: 'ArtworkCollectionCard' });

describe('ArtworkCollectionListView', () => {
  it('calls getCollections on mount with the default order', () => {
    const { getCollections } = mountView();
    expect(getCollections).toHaveBeenCalledWith('-date');
  });

  it('renders highlighted collections horizontally and the rest vertically', async () => {
    const { wrapper } = mountView();
    await flushPromises();

    const cards = findCards(wrapper);
    expect(cards).toHaveLength(3);
    expect(cards[0]!.props('collection')).toEqual(response.highlighted[0]);
    expect(cards[0]!.props('layout')).toBe('horizontal');
    expect(cards.slice(1).map((card) => card.props('layout'))).toEqual(['vertical', 'vertical']);
  });

  it('offers the sort options', () => {
    const { wrapper } = mountView();
    const values = wrapper.findAll('option').map((option) => option.attributes('value'));
    expect(values).toEqual(expect.arrayContaining(['-date', 'date', 'name', '-artwork_count']));
  });

  it('reloads collections when the order changes', async () => {
    const { wrapper, getCollections } = mountView();
    await flushPromises();
    getCollections.mockClear();

    await wrapper.find('select').setValue('name');
    await flushPromises();

    expect(getCollections).toHaveBeenCalledWith('name');
  });

  it('navigates to the collection detail when a card is opened', async () => {
    const { wrapper, router } = mountView();
    await flushPromises();
    const push = vi.spyOn(router, 'push');

    await findCards(wrapper)[1]!.get('button').trigger('click');

    expect(push).toHaveBeenCalledWith({ name: 'CollectionDetail', params: { id: 2 } });
  });
});
