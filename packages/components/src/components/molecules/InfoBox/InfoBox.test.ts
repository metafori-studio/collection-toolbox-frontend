import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InfoBox from './InfoBox.vue';

describe('InfoBox', () => {
  it('renders default slot content', () => {
    const wrapper = mount(InfoBox, {
      slots: { default: '<span class="msg">Some info</span>' },
    });
    expect(wrapper.find('.msg').exists()).toBe(true);
    expect(wrapper.text()).toContain('Some info');
  });

  it('renders actions slot content', () => {
    const wrapper = mount(InfoBox, {
      slots: { actions: '<button class="action-btn">Dismiss</button>' },
    });
    expect(wrapper.find('.action-btn').exists()).toBe(true);
    expect(wrapper.text()).toContain('Dismiss');
  });

  it('renders both default and actions slots', () => {
    const wrapper = mount(InfoBox, {
      slots: {
        default: 'Info message',
        actions: '<button>OK</button>',
      },
    });
    expect(wrapper.text()).toContain('Info message');
    expect(wrapper.text()).toContain('OK');
  });

  it('renders the info icon', () => {
    const wrapper = mount(InfoBox);
    const icon = wrapper.findComponent({ name: 'BaseIcon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props('icon')).toBe('info');
  });

  it('renders without slots without errors', () => {
    const wrapper = mount(InfoBox);
    expect(wrapper.exists()).toBe(true);
  });
});
