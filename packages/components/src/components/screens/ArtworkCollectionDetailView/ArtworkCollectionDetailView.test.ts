import {
  describe, it, expect, vi,
} from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import ArtworkCollectionDetailView from './ArtworkCollectionDetailView.vue';
import {
  type Artwork,
  type ArtworkCollectionDetail,
  type ArtworkListResponse,
} from '../../../types/artwork';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/collections', name: 'CollectionList', component: { template: '<div />' } },
    { path: '/artwork/:id', name: 'ArtworkDetail', component: { template: '<div />' } },
  ],
});

const collection: ArtworkCollectionDetail = {
  id: 10,
  name: '20th Century Art',
  about: 'A collection of 20th century artworks.',
  summary: 'Selected works of the 20th century.',
  images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  date: '2020',
  artwork_count: 42,
};

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

const mountView = ({
  id = '10',
  getCollectionById = vi.fn().mockResolvedValue(collection),
  getCollectionArtworks = vi.fn().mockResolvedValue(listResponse([makeArtwork(1), makeArtwork(2)], 2)),
} = {}) => {
  const wrapper = mount(ArtworkCollectionDetailView, {
    props: { id, getCollectionById, getCollectionArtworks },
    global: { plugins: [router] },
  });
  return { wrapper, getCollectionById, getCollectionArtworks };
};

const findButton = (wrapper: ReturnType<typeof mount>, text: string) => wrapper
  .findAll('button')
  .find((button) => button.text() === text);

describe('ArtworkCollectionDetailView', () => {
  it('loads the collection and the first page of artworks on mount', () => {
    const { getCollectionById, getCollectionArtworks } = mountView();
    expect(getCollectionById).toHaveBeenCalledWith('10');
    expect(getCollectionArtworks).toHaveBeenCalledWith('10', 1);
  });

  it('renders the title and summary', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    expect(wrapper.get('h1').text()).toBe('20th Century Art');
    expect(wrapper.text()).toContain('Selected works of the 20th century.');
  });

  it('renders a breadcrumb back to the collection list', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    const breadcrumb = wrapper.findComponent({ name: 'BreadcrumbList' });
    expect(breadcrumb.props('items')).toEqual([
      { label: 'collectionDetail.breadcrumbCollections', to: { name: 'CollectionList' } },
      { label: '20th Century Art' },
    ]);
  });

  it('passes the collection to the image grid and meta list', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    const grid = wrapper.findComponent({ name: 'ArtworkCollectionImageGrid' });
    expect(grid.props('images')).toEqual(collection.images);
    expect(grid.props('title')).toBe('20th Century Art');
    expect(wrapper.findComponent({ name: 'ArtworkCollectionMeta' }).props('collection')).toEqual(collection);
  });

  it('renders one ArtworkCard per returned artwork', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(2);
  });

  it('does not render a sort select', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    expect(wrapper.find('select').exists()).toBe(false);
  });

  it('hides load more when all artworks are shown', async () => {
    const { wrapper } = mountView();
    await flushPromises();
    expect(findButton(wrapper, 'explore.loadMore')).toBeUndefined();
  });

  it('loads the next page and appends artworks on load more', async () => {
    const getCollectionArtworks = vi.fn()
      .mockResolvedValueOnce(listResponse([makeArtwork(1)], 2))
      .mockResolvedValueOnce(listResponse([makeArtwork(2)], 2));
    const { wrapper } = mountView({ getCollectionArtworks });
    await flushPromises();

    await findButton(wrapper, 'explore.loadMore')!.trigger('click');
    await flushPromises();

    expect(getCollectionArtworks).toHaveBeenLastCalledWith('10', 2);
    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(2);
    expect(findButton(wrapper, 'explore.loadMore')).toBeUndefined();
  });

  it('shows an error state and retries when the collection fails to load', async () => {
    const getCollectionById = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(collection);
    const { wrapper } = mountView({ getCollectionById });
    await flushPromises();

    expect(wrapper.findComponent({ name: 'ErrorState' }).props('title')).toBe('collectionDetail.error.title');

    await findButton(wrapper, 'common.retry')!.trigger('click');
    await flushPromises();

    expect(getCollectionById).toHaveBeenCalledTimes(2);
    expect(wrapper.get('h1').text()).toBe('20th Century Art');
  });

  it('shows an error state and retries when artworks fail to load', async () => {
    const getCollectionArtworks = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(listResponse([makeArtwork(1)], 1));
    const { wrapper } = mountView({ getCollectionArtworks });
    await flushPromises();

    expect(wrapper.findComponent({ name: 'ErrorState' }).props('title')).toBe('explore.error.title');

    await findButton(wrapper, 'common.retry')!.trigger('click');
    await flushPromises();

    expect(getCollectionArtworks).toHaveBeenCalledTimes(2);
    expect(wrapper.findAllComponents({ name: 'ArtworkCard' })).toHaveLength(1);
  });

  it('reloads everything when the id changes', async () => {
    const { wrapper, getCollectionById, getCollectionArtworks } = mountView();
    await flushPromises();

    await wrapper.setProps({ id: '11' });
    await flushPromises();

    expect(getCollectionById).toHaveBeenLastCalledWith('11');
    expect(getCollectionArtworks).toHaveBeenLastCalledWith('11', 1);
  });
});
