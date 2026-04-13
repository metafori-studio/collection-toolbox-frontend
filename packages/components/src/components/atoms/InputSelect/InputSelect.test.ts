import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputSelect from './InputSelect.vue';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('InputSelect', () => {
  // Props
  it('renders with provided id', () => {
    const wrapper = mount(InputSelect, { props: { options, id: 'my-select' } });
    expect(wrapper.find('select').attributes('id')).toBe('my-select');
  });

  it('renders all options with correct values', () => {
    const wrapper = mount(InputSelect, { props: { options } });
    const [optA, optB, optC] = wrapper.findAll('option');
    expect(optA!.attributes('value')).toBe('a');
    expect(optB!.attributes('value')).toBe('b');
    expect(optC!.attributes('value')).toBe('c');
  });

  // Disabled
  it('marks disabled option as disabled', () => {
    const wrapper = mount(InputSelect, { props: { options } });
    const [,, optC] = wrapper.findAll('option');
    expect((optC!.element as HTMLOptionElement).disabled).toBe(true);
  });

  it('disables the select when disabled prop is set', () => {
    const wrapper = mount(InputSelect, { props: { options, disabled: true } });
    expect((wrapper.find('select').element as HTMLSelectElement).disabled).toBe(true);
  });

  // Error
  it('applies error class when hasError is true', () => {
    const wrapper = mount(InputSelect, { props: { options, hasError: true } });
    expect(wrapper.find('select').classes()).toContain('border-status-error');
  });

  // Model
  it('reflects modelValue in the selected option', () => {
    const wrapper = mount(InputSelect, { props: { options, modelValue: 'b' } });
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('b');
  });

  it('updates model when selection changes', async () => {
    const wrapper = mount(InputSelect, { props: { options, modelValue: 'a' } });
    await wrapper.find('select').setValue('b');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('b');
  });
});
