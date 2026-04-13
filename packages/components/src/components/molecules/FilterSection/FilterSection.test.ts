import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterSection from './FilterSection.vue';

describe('FilterSection', () => {
  it('renders as a section element', () => {
    const wrapper = mount(FilterSection);
    expect(wrapper.element.tagName).toBe('SECTION');
  });

  it('renders slot content', () => {
    const wrapper = mount(FilterSection, {
      slots: { default: '<div class="child">Item</div>' },
    });
    expect(wrapper.find('.child').exists()).toBe(true);
  });

  it('does not render header when label is not provided', () => {
    const wrapper = mount(FilterSection);
    expect(wrapper.find('h3').exists()).toBe(false);
  });

  it('renders label when provided', () => {
    const wrapper = mount(FilterSection, { props: { label: 'Locations' } });
    expect(wrapper.find('h3').text()).toBe('Locations');
  });

  it('renders BaseIcon when label is provided', () => {
    const wrapper = mount(FilterSection, { props: { label: 'Locations' } });
    expect(wrapper.findComponent({ name: 'BaseIcon' }).exists()).toBe(true);
  });

  it('uses stack as default icon', () => {
    const wrapper = mount(FilterSection, { props: { label: 'Locations' } });
    const icon = wrapper.findComponent({ name: 'BaseIcon' });
    expect(icon.props('icon')).toBe('stack');
  });

  it('uses custom icon when provided', () => {
    const wrapper = mount(FilterSection, { props: { label: 'Tags', icon: 'tag' } });
    const icon = wrapper.findComponent({ name: 'BaseIcon' });
    expect(icon.props('icon')).toBe('tag');
  });

  it('does not render icon when label is not provided', () => {
    const wrapper = mount(FilterSection);
    expect(wrapper.findComponent({ name: 'BaseIcon' }).exists()).toBe(false);
  });
});
