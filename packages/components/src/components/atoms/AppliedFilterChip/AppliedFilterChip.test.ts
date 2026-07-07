import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppliedFilterChip from './AppliedFilterChip.vue';

describe('AppliedFilterChip', () => {
  it('renders as a button', () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('displays the label', () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    expect(wrapper.text()).toContain('Category');
  });

  it('displays the value', () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    expect(wrapper.text()).toContain('Paintings');
  });

  it('sets aria-label with label and value', () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    expect(wrapper.attributes('aria-label')).toBe('Clear filter Category Paintings');
  });

  it('emits clear event when clicked', async () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('updates aria-label when props change', async () => {
    const wrapper = mount(AppliedFilterChip, { props: { label: 'Category', value: 'Paintings' } });
    expect(wrapper.attributes('aria-label')).toBe('Clear filter Category Paintings');

    await wrapper.setProps({ label: 'Artist', value: 'Monet' });
    expect(wrapper.attributes('aria-label')).toBe('Clear filter Artist Monet');
  });
});
