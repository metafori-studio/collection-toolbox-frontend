import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import i18n from './i18n';
import { routes } from './router';
import LidiceMemorialHeader from './components/LidiceMemorialHeader.vue';
import LidiceMemorialFooter from './components/LidiceMemorialFooter.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

describe('App', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(App, {
      global: { plugins: [router, i18n] },
    });
    await router.isReady();
  });

  it('mounts and renders the home view', () => {
    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello World');
  });

  it('renders the header', () => {
    expect(wrapper.findComponent(LidiceMemorialHeader).exists()).toBe(true);
  });

  it('renders the footer', () => {
    expect(wrapper.findComponent(LidiceMemorialFooter).exists()).toBe(true);
  });
});
