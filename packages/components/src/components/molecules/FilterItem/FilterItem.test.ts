import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterItem from './FilterItem.vue';

describe('FilterItem', () => {
  it('renders the label', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    expect(wrapper.text()).toContain('City');
  });

  it('renders the open button with correct aria-label', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    const btn = wrapper.find('button[aria-label="Open City"]');
    expect(btn.exists()).toBe(true);
  });

  it('emits open event when the button is clicked', async () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    await wrapper.find('button[aria-label="Open City"]').trigger('click');
    expect(wrapper.emitted('open')).toHaveLength(1);
  });

  it('does not render FilterChip when selectedCount is not set', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    expect(wrapper.findComponent({ name: 'FilterChip' }).exists()).toBe(false);
  });

  it('renders FilterChip when selectedCount is provided', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City', selectedCount: 3 } });
    expect(wrapper.findComponent({ name: 'FilterChip' }).exists()).toBe(true);
  });

  it('shows selected count in FilterChip', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City', selectedCount: 4 } });
    expect(wrapper.findComponent({ name: 'FilterChip' }).text()).toContain('4');
  });

  it('emits clear event when FilterChip emits clear', async () => {
    const wrapper = mount(FilterItem, { props: { label: 'City', selectedCount: 2 } });
    const chip = wrapper.findComponent({ name: 'FilterChip' });
    await chip.vm.$emit('clear');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('applies active border class when active is true', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City', active: true } });
    expect(wrapper.classes()).toContain('border-primary-500');
  });

  it('does not apply active border class by default', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    expect(wrapper.classes()).not.toContain('border-primary-500');
  });

  it('renders a caretRight icon', () => {
    const wrapper = mount(FilterItem, { props: { label: 'City' } });
    // The last BaseIcon child should be the caret
    const icons = wrapper.findAllComponents({ name: 'BaseIcon' });
    const caretIcon = icons.find((i) => i.props('icon') === 'caretRight');
    expect(caretIcon).toBeDefined();
  });
});
