import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHashHistory, RouterView } from 'vue-router';
import { routes } from '../../router';
import Error404View from '../Error404View.vue';
import i18n from '../../i18n';

describe('Error404View', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(Error404View, {
      global: { plugins: [i18n] },
    });
  });

  it('mounts without errors', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the translated title', () => {
    expect(wrapper.text()).toContain('Chyba 404');
  });

  it('renders the translated description text', () => {
    expect(wrapper.text()).toContain('V případě přetrvávajících potíží');
  });
});

describe('Error404View — router', () => {
  it('renders Error404View for an unknown route', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    await router.push('/this-does-not-exist');
    await router.isReady();

    const wrapper = mount(RouterView, {
      global: { plugins: [router, i18n] },
    });

    expect(wrapper.findComponent(Error404View).exists()).toBe(true);
    expect(wrapper.text()).toContain('Chyba 404');
  });

  it('renders Error404View for a deeply nested unknown route', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    await router.push('/some/deeply/nested/path');
    await router.isReady();

    const wrapper = mount(RouterView, {
      global: { plugins: [router, i18n] },
    });

    expect(wrapper.findComponent(Error404View).exists()).toBe(true);
    expect(wrapper.text()).toContain('Chyba 404');
  });

  it('resolves known routes without hitting the 404 catch-all', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    await router.push('/');
    await router.isReady();

    const resolved = router.resolve('/');
    expect(resolved.name).toBe('Explore');

    const resolvedInfo = router.resolve('/info');
    expect(resolvedInfo.name).toBe('Info');
  });

  it('resolves an unknown route to the Error404 catch-all', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    const resolved = router.resolve('/random-page-xyz');
    expect(resolved.name).toBe('Error404');
  });
});
