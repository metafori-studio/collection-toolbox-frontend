import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import i18n from './i18n';
import LidiceArtHeader from './components/LidiceArtHeader.vue';
import LidiceArtFooter from './components/LidiceArtFooter.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', component: HomeView }],
});

describe('App', () => {
  it('mounts and renders the home view', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello World');
  });

  it('renders the header', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.findComponent(LidiceArtHeader).exists()).toBe(true);
  });

  it('renders the footer', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.findComponent(LidiceArtFooter).exists()).toBe(true);
  });
});
