import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorState from './ErrorState.vue';

describe('ErrorState', () => {
  it('renders without errors', () => {
    const wrapper = mount(ErrorState);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders default title and text', () => {
    const wrapper = mount(ErrorState);
    expect(wrapper.text()).toContain('Error');
    expect(wrapper.text()).toContain('Unknown error occurred.');
  });

  it('renders custom title and text props', () => {
    const wrapper = mount(ErrorState, {
      props: { title: 'Page not found', text: 'The page does not exist.' },
    });
    expect(wrapper.text()).toContain('Page not found');
    expect(wrapper.text()).toContain('The page does not exist.');
  });

  it('renders the icon with default bug icon', () => {
    const wrapper = mount(ErrorState);
    const icon = wrapper.findComponent({ name: 'BaseIcon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props('icon')).toBe('bug');
  });

  it('renders a custom icon prop', () => {
    const wrapper = mount(ErrorState, { props: { icon: 'magnifyingGlass' } });
    const icon = wrapper.findComponent({ name: 'BaseIcon' });
    expect(icon.props('icon')).toBe('magnifyingGlass');
  });

  it('renders action slot content', () => {
    const wrapper = mount(ErrorState, {
      slots: { action: '<button class="retry-btn">Try again</button>' },
    });
    expect(wrapper.find('.retry-btn').exists()).toBe(true);
    expect(wrapper.text()).toContain('Try again');
  });
});
