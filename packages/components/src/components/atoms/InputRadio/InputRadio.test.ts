import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputRadio from './InputRadio.vue';
import InputRadioList from './InputRadioList.vue';

describe('InputRadio', () => {
  // Props
  it('renders with provided id', () => {
    const wrapper = mount(InputRadio, {
      props: { label: 'Option A', name: 'group', value: 'a', id: 'radio-1' },
    });
    expect(wrapper.find('input').attributes('id')).toBe('radio-1');
    expect(wrapper.find('label').attributes('for')).toBe('radio-1');
  });

  it('renders with provided name and value', () => {
    const wrapper = mount(InputRadio, {
      props: { label: 'Option A', name: 'my-group', value: 'option-val' },
    });
    expect(wrapper.find('input[type="radio"]').attributes('name')).toBe('my-group');
    expect(wrapper.find('input[type="radio"]').attributes('value')).toBe('option-val');
  });

  it('renders with provided count', () => {
    const wrapper = mount(InputRadio, {
      props: { label: 'Option A', name: 'group', value: 'a', count: 10 },
    });
    expect(wrapper.text()).toContain('10');
  });

  // Model
  it('is checked when modelValue matches value', () => {
    const wrapper = mount(InputRadio, {
      props: { label: 'Option A', name: 'group', value: 'a', modelValue: 'a' },
    });
    expect((wrapper.find('input[type="radio"]').element as HTMLInputElement).checked).toBe(true);
  });

  it('updates model when radio is changed', async () => {
    const wrapper = mount(InputRadio, {
      props: { label: 'Option A', name: 'group', value: 'a', modelValue: '' },
    });
    await wrapper.find('input[type="radio"]').trigger('change');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['a']);
  });
});

describe('InputRadioList', () => {
  const options = [
    { label: 'Option 1', value: 'one' },
    { label: 'Option 2', value: 'two' },
    { label: 'Option 3', value: 'three', count: 7 },
  ];

  // Props
  it('renders one radio per option', () => {
    const wrapper = mount(InputRadioList, { props: { name: 'group', options, modelValue: '' } });
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3);
  });

  // Model
  it('marks the correct radio as checked based on modelValue', () => {
    const wrapper = mount(InputRadioList, { props: { name: 'group', options, modelValue: 'two' } });
    const radios = wrapper.findAll('input[type="radio"]');
    expect((radios[0]!.element as HTMLInputElement).checked).toBe(false);
    expect((radios[1]!.element as HTMLInputElement).checked).toBe(true);
    expect((radios[2]!.element as HTMLInputElement).checked).toBe(false);
  });

  it('updates model when a radio is selected', async () => {
    const wrapper = mount(InputRadioList, { props: { name: 'group', options, modelValue: '' } });
    await wrapper.findAllComponents({ name: 'InputRadio' })[0]!.find('input[type="radio"]').trigger('change');
    expect(wrapper.emitted('update:modelValue')).toBeDefined();
  });
});
