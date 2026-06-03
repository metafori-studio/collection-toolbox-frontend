import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', component: HomeView }],
});

describe('App', () => {
  it('mounts and renders the home view', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router] },
    });

    await router.isReady();

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello World');
  });
});
