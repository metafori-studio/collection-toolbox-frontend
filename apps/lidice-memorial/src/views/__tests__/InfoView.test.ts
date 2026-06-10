import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import InfoView from '@/views/InfoView.vue';
import i18n from '@/i18n';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/info', component: InfoView }],
});

describe('InfoView', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(InfoView, {
      global: { plugins: [router, i18n] },
    });
    await router.isReady();
  });

  it('mounts without errors', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the main heading', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
  });

  it('renders the hero image', () => {
    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('renders multiple sections', () => {
    expect(wrapper.findAll('h2').length).toBeGreaterThan(0);
  });
});
