import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputCheckbox from './InputCheckbox.vue';
import InputCheckboxList from './InputCheckboxList.vue';

describe('InputCheckbox', () => {
  // Props
  it('renders with provided id', () => {
    const wrapper = mount(InputCheckbox, { props: { label: 'Option A', id: 'custom-id' } });
    expect(wrapper.find('input').attributes('id')).toBe('custom-id');
    expect(wrapper.find('label').attributes('for')).toBe('custom-id');
  });

  it('renders with provided label', () => {
    const wrapper = mount(InputCheckbox, { props: { label: 'Option A' } });
    expect(wrapper.text()).toContain('Option A');
  });

  it('renders with provided count', () => {
    const wrapper = mount(InputCheckbox, { props: { label: 'Option A', count: 42 } });
    expect(wrapper.text()).toContain('42');
  });

  // Model
  it('is checked when modelValue is true', () => {
    const wrapper = mount(InputCheckbox, { props: { label: 'Option A', modelValue: true } });
    expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true);
  });

  it('updates model when checkbox is toggled', async () => {
    const wrapper = mount(InputCheckbox, { props: { label: 'Option A', modelValue: false } });
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(true);
  });
});

describe('InputCheckboxList', () => {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry', count: 5 },
  ];

  // Props
  it('renders one checkbox per option', () => {
    const wrapper = mount(InputCheckboxList, { props: { name: 'fruits', options, modelValue: [] } });
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3);
  });

  // Model
  it('marks correct checkboxes as checked based on modelValue', () => {
    const wrapper = mount(InputCheckboxList, {
      props: { name: 'fruits', options, modelValue: ['apple', 'cherry'] },
    });
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect((checkboxes[0]!.element as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[1]!.element as HTMLInputElement).checked).toBe(false);
    expect((checkboxes[2]!.element as HTMLInputElement).checked).toBe(true);
  });

  it('adds value to model when a checkbox is checked', async () => {
    const wrapper = mount(InputCheckboxList, { props: { name: 'fruits', options, modelValue: [] } });
    await wrapper.findAllComponents({ name: 'InputCheckbox' })[0]!.vm.$emit('update:modelValue', true);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toContain('apple');
  });

  it('removes value from model when a checkbox is unchecked', async () => {
    const wrapper = mount(InputCheckboxList, {
      props: { name: 'fruits', options, modelValue: ['apple'] },
    });
    await wrapper.findAllComponents({ name: 'InputCheckbox' })[0]!.vm.$emit('update:modelValue', false);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0] as string[]).not.toContain('apple');
  });
});
