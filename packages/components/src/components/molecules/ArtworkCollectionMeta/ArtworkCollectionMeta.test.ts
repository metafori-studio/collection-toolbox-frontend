import {
  describe, it, expect, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import ArtworkCollectionMeta from './ArtworkCollectionMeta.vue';
import { type ArtworkCollection } from '../../../types/artwork';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => (params ? `${key}:${JSON.stringify(params)}` : key),
  }),
}));

const collection: ArtworkCollection = {
  id: 1,
  name: 'Collection',
  about: 'About',
  thumbnail: 'https://example.com/1.jpg',
  date: '2024-03-01',
  author: 'Jane Doe',
  category: 'Painting',
  datespan: '1918-1945',
  artwork_count: 42,
};

const mountMeta = (overrides: Partial<ArtworkCollection> = {}) => mount(ArtworkCollectionMeta, {
  props: { collection: { ...collection, ...overrides } },
});

const iconNames = (wrapper: ReturnType<typeof mountMeta>) => wrapper
  .findAllComponents({ name: 'BaseIcon' })
  .map((icon) => icon.props('icon'));

describe('ArtworkCollectionMeta', () => {
  it('renders all metadata items when every field is set', () => {
    const wrapper = mountMeta();
    const items = wrapper.findAll('li');
    expect(items).toHaveLength(5);
    expect(items[0]!.text()).toBe('Painting');
    expect(items[1]!.text()).toBe('2024-03-01');
    expect(items[2]!.text()).toBe('artwork.count:{"count":42}');
    expect(items[3]!.text()).toBe('Jane Doe');
    expect(items[4]!.text()).toBe('1918-1945');
  });

  it('renders the matching icons', () => {
    expect(iconNames(mountMeta())).toEqual(['calendar', 'image', 'user', 'arrowsHorizontal']);
  });

  it('omits the category when it is missing', () => {
    const wrapper = mountMeta({ category: undefined });
    expect(wrapper.text()).not.toContain('Painting');
    expect(wrapper.findAll('li')).toHaveLength(4);
  });

  it('omits the datespan and its icon when missing', () => {
    const wrapper = mountMeta({ datespan: undefined });
    expect(wrapper.text()).not.toContain('1918-1945');
    expect(iconNames(wrapper)).not.toContain('arrowsHorizontal');
    expect(wrapper.findAll('li')).toHaveLength(4);
  });

  it('omits the author and its icon when missing', () => {
    const wrapper = mountMeta({ author: undefined });
    expect(wrapper.text()).not.toContain('Jane Doe');
    expect(iconNames(wrapper)).not.toContain('user');
  });

  it('omits the date and its icon when empty', () => {
    const wrapper = mountMeta({ date: '' });
    expect(iconNames(wrapper)).not.toContain('calendar');
  });

  it('always renders the artwork count', () => {
    const wrapper = mountMeta({
      category: undefined, datespan: undefined, author: undefined, date: '',
    });
    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.text()).toContain('artwork.count');
  });
});
