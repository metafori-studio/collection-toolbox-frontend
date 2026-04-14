import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton', () => {
  // Basics
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } });
    expect(wrapper.text()).toContain('Click me');
  });

  it('renders as a button element', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  // Sizes
  it('applies regular size class by default', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.classes()).toContain('h-10');
  });

  it('applies small size class when size is small', () => {
    const wrapper = mount(BaseButton, { props: { size: 'small' } });
    expect(wrapper.classes()).toContain('h-8');
  });

  // Variants
  it('applies primary variant classes by default', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.classes()).toContain('bg-primary-500');
  });

  it('applies secondary variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'secondary' } });
    expect(wrapper.classes()).toContain('bg-neutral-0');
  });

  it('applies danger-primary variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'danger-primary' } });
    expect(wrapper.classes()).toContain('bg-status-error');
  });

  it('applies danger-secondary variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'danger-secondary' } });
    expect(wrapper.classes()).toContain('text-status-error');
  });

  // Block
  it('applies w-full class when block is true', () => {
    const wrapper = mount(BaseButton, { props: { block: true } });
    expect(wrapper.classes()).toContain('w-full');
  });

  it('does not apply w-full class when block is false', () => {
    const wrapper = mount(BaseButton, { props: { block: false } });
    expect(wrapper.classes()).not.toContain('w-full');
  });

  // Disabled
  it('sets disabled attribute when disabled is true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('does not set disabled attribute by default', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.attributes('disabled')).toBeUndefined();
  });

  // Interaction
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } });
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(button.element.disabled).toBe(true);
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
