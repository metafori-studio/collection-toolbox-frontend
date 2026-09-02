import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DetailSection from './DetailSection.vue';

describe('DetailSection', () => {
  // Rendering
  it('renders as a section element', () => {
    const wrapper = mount(DetailSection, { props: { title: 'Údaje o diele' } });
    expect(wrapper.element.tagName).toBe('SECTION');
  });

  it('renders the title', () => {
    const wrapper = mount(DetailSection, { props: { title: 'Údaje o diele' } });
    expect(wrapper.find('h3').text()).toBe('Údaje o diele');
  });

  // Slots
  it('renders default slot content', () => {
    const wrapper = mount(DetailSection, {
      props: { title: 'Údaje o diele' },
      slots: { default: '<div class="child">Content</div>' },
    });
    expect(wrapper.find('.child').exists()).toBe(true);
  });

  it('renders actions slot content', () => {
    const wrapper = mount(DetailSection, {
      props: { title: 'Údaje o diele' },
      slots: { actions: '<button class="action">Edit</button>' },
    });
    expect(wrapper.find('.action').exists()).toBe(true);
  });

  it('does not render actions content when slot is not provided', () => {
    const wrapper = mount(DetailSection, { props: { title: 'Údaje o diele' } });
    expect(wrapper.find('.action').exists()).toBe(false);
  });
});
