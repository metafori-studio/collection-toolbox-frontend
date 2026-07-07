import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import i18n from './i18n';
import { routes } from './router';
import LidiceArtHeader from './components/LidiceArtHeader.vue';
import LidiceArtFooter from './components/LidiceArtFooter.vue';

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
    expect(wrapper.text()).toContain('Filtrovať výsledky');
  });

  it('renders the header', () => {
    expect(wrapper.findComponent(LidiceArtHeader).exists()).toBe(true);
  });

  it('renders the footer', () => {
    expect(wrapper.findComponent(LidiceArtFooter).exists()).toBe(true);
  });
});
