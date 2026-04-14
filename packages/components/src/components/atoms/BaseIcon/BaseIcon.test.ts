import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseIcon, { icons } from './BaseIcon.vue';

describe('BaseIcon', () => {
  it('renders without errors with default props', () => {
    const wrapper = mount(BaseIcon);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a valid icon component for a known icon name', () => {
    const wrapper = mount(BaseIcon, { props: { icon: 'info' } });
    expect(wrapper.exists()).toBe(true);
  });

  it('falls back to placeholder icon for unknown icon name', () => {
    // @ts-expect-error intentionally passing unknown icon
    const wrapper = mount(BaseIcon, { props: { icon: 'nonexistent-icon' } });
    expect(wrapper.findComponent(icons.placeholder).exists()).toBe(true);
  });

  it('accepts all defined icon names without errors', () => {
    for (const icon of Object.keys(icons) as (keyof typeof icons)[]) {
      const wrapper = mount(BaseIcon, { props: { icon } });
      expect(wrapper.exists()).toBe(true);
    }
  });

  // Sizes
  it('accepts size prop of 16', () => {
    const wrapper = mount(BaseIcon, { props: { icon: 'info', size: 16 } });
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts size prop of 32', () => {
    const wrapper = mount(BaseIcon, { props: { icon: 'info', size: 32 } });
    expect(wrapper.exists()).toBe(true);
  });

  // Weights
  it('accepts weight fill', () => {
    const wrapper = mount(BaseIcon, { props: { icon: 'checkSquare', weight: 'fill' } });
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts weight regular', () => {
    const wrapper = mount(BaseIcon, { props: { icon: 'checkSquare', weight: 'regular' } });
    expect(wrapper.exists()).toBe(true);
  });
});
