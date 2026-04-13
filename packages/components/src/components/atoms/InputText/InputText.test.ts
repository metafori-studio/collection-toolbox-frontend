import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputText from './InputText.vue';

describe('InputText', () => {
  // Basics
  it('renders with provided type', () => {
    const wrapper = mount(InputText, { props: { type: 'email' } });
    expect(wrapper.find('input').attributes('type')).toBe('email');
  });

  it('renders with provided id', () => {
    const wrapper = mount(InputText, { props: { id: 'my-input' } });
    expect(wrapper.find('input').attributes('id')).toBe('my-input');
  });

  it('renders with provided placeholder', () => {
    const wrapper = mount(InputText, { props: { placeholder: 'Search...' } });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search...');
  });

  it('disables the input when disabled prop is set', () => {
    const wrapper = mount(InputText, { props: { disabled: true } });
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true);
  });

  // Clearing
  it('shows clear button when input has a value', () => {
    const wrapper = mount(InputText, { props: { modelValue: 'some text' } });
    expect(wrapper.find('button[aria-label="Clear this value"]').exists()).toBe(true);
  });

  it('hides clear button when disabled with a value', () => {
    const wrapper = mount(InputText, { props: { modelValue: 'text', disabled: true } });
    expect(wrapper.find('button[aria-label="Clear this value"]').exists()).toBe(false);
  });

  // Interaction
  it('updates model when input value changes', async () => {
    const wrapper = mount(InputText, { props: { modelValue: '' } });
    await wrapper.find('input').setValue('hello');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('hello');
  });

  it('emits empty string when clear button is clicked', async () => {
    const wrapper = mount(InputText, { props: { modelValue: 'hello' } });
    await wrapper.find('button[aria-label="Clear this value"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('');
  });
});
