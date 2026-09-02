import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Error404View from './Error404View.vue';

const mountView = () => mount(Error404View, {
  global: { mocks: { $t: (key: string) => key } },
});

describe('Error404View', () => {
  it('renders the ErrorState component', () => {
    const wrapper = mountView();
    expect(wrapper.findComponent({ name: 'ErrorState' }).exists()).toBe(true);
  });

  it('passes translated title and text to ErrorState', () => {
    const wrapper = mountView();
    const errorState = wrapper.findComponent({ name: 'ErrorState' });
    expect(errorState.props('title')).toBe('error404.title');
    expect(errorState.props('text')).toBe('error404.text');
  });
});
