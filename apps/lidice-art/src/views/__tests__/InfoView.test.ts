import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import InfoView from '@/views/InfoView.vue';
import i18n from '@/i18n';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/info', component: InfoView }],
});

describe('InfoView', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(InfoView, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.exists()).toBe(true);
  });

  it('renders the main heading', async () => {
    const wrapper = mount(InfoView, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.find('h1').exists()).toBe(true);
  });

  it('renders the hero image', async () => {
    const wrapper = mount(InfoView, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('renders multiple sections', async () => {
    const wrapper = mount(InfoView, {
      global: { plugins: [router, i18n] },
    });

    await router.isReady();

    expect(wrapper.findAll('h2').length).toBeGreaterThan(0);
  });
});
