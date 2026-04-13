import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterChip from './FilterChip.vue';

describe('FilterChip', () => {
  it('renders as a button', () => {
    const wrapper = mount(FilterChip, { props: { count: 3 } });
    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('displays the count', () => {
    const wrapper = mount(FilterChip, { props: { count: 5 } });
    expect(wrapper.text()).toContain('5');
  });

  it('displays count of 0', () => {
    const wrapper = mount(FilterChip, { props: { count: 0 } });
    expect(wrapper.text()).toContain('0');
  });

  it('sets aria-label with count', () => {
    const wrapper = mount(FilterChip, { props: { count: 2 } });
    expect(wrapper.attributes('aria-label')).toBe('Clear 2 selected');
  });

  it('emits clear event when clicked', async () => {
    const wrapper = mount(FilterChip, { props: { count: 3 } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('updates aria-label when count changes', async () => {
    const wrapper = mount(FilterChip, { props: { count: 1 } });
    expect(wrapper.attributes('aria-label')).toBe('Clear 1 selected');

    await wrapper.setProps({ count: 7 });
    expect(wrapper.attributes('aria-label')).toBe('Clear 7 selected');
  });
});
