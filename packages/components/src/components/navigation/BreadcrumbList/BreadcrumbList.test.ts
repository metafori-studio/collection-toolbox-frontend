import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import BreadcrumbList from './BreadcrumbList.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div />' } },
  ],
});

const mountWithRouter = (props: InstanceType<typeof BreadcrumbList>['$props']) => mount(BreadcrumbList, {
  props,
  global: { plugins: [router] },
});

describe('BreadcrumbList', () => {
  // Props
  it('renders one item per breadcrumb', () => {
    const wrapper = mountWithRouter({
      items: [
        { label: 'Katalóg', to: { name: 'Home' } },
        { label: 'Detail diela' },
      ],
    });
    expect(wrapper.findAll('li').filter((li) => !li.findComponent({ name: 'BaseIcon' }).exists())).toHaveLength(2);
  });

  it('renders item labels', () => {
    const wrapper = mountWithRouter({
      items: [
        { label: 'Katalóg', to: { name: 'Home' } },
        { label: 'Detail diela' },
      ],
    });
    expect(wrapper.text()).toContain('Katalóg');
    expect(wrapper.text()).toContain('Detail diela');
  });

  // Links
  it('renders a RouterLink when item has a to destination', () => {
    const wrapper = mountWithRouter({
      items: [{ label: 'Katalóg', to: { name: 'Home' } }],
    });
    const link = wrapper.findComponent({ name: 'RouterLink' });
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('Katalóg');
  });

  it('renders plain text (no link) when item has no to destination', () => {
    const wrapper = mountWithRouter({
      items: [{ label: 'Detail diela' }],
    });
    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(false);
    expect(wrapper.find('span').text()).toBe('Detail diela');
  });

  it('resolves the href from the to destination', async () => {
    const wrapper = mountWithRouter({
      items: [{ label: 'Katalóg', to: { name: 'Home' } }],
    });
    await router.isReady();
    expect(wrapper.get('a').attributes('href')).toBe('/');
  });

  // Separators
  it('renders a separator icon between items but not after the last one', () => {
    const wrapper = mountWithRouter({
      items: [
        { label: 'Katalóg', to: { name: 'Home' } },
        { label: 'Kategória' },
        { label: 'Detail diela' },
      ],
    });
    expect(wrapper.findAllComponents({ name: 'BaseIcon' })).toHaveLength(2);
  });

  it('renders no separator icon for a single item', () => {
    const wrapper = mountWithRouter({
      items: [{ label: 'Detail diela' }],
    });
    expect(wrapper.findComponent({ name: 'BaseIcon' }).exists()).toBe(false);
  });
});
