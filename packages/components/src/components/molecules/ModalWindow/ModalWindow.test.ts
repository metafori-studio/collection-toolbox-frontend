import { describe, it, expect, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ModalWindow from './ModalWindow.vue';

describe('ModalWindow', () => {
  let wrapper: VueWrapper;

  afterEach(() => wrapper?.unmount());

  const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]');
  const closeBtn = () => document.body.querySelector<HTMLElement>('button[aria-label="Close window"]');

  // Props
  it('renders dialog when isOpen is true', () => {
    wrapper = mount(ModalWindow, { props: { isOpen: true } });
    expect(dialog()).not.toBeNull();
  });

  it('does not render dialog when isOpen is false', () => {
    wrapper = mount(ModalWindow, { props: { isOpen: false } });
    expect(dialog()).toBeNull();
  });

  it('sets aria-label from title prop', () => {
    wrapper = mount(ModalWindow, { props: { isOpen: true, title: 'My Modal' } });
    expect(dialog()?.getAttribute('aria-label')).toBe('My Modal');
  });

  it('renders slot content', () => {
    wrapper = mount(ModalWindow, {
      props: { isOpen: true },
      slots: { default: '<p>Modal body</p>' },
    });
    expect(dialog()?.textContent).toContain('Modal body');
  });

  // Close button
  it('shows close button when allowClose is true', () => {
    wrapper = mount(ModalWindow, { props: { isOpen: true, allowClose: true } });
    expect(closeBtn()).not.toBeNull();
  });

  it('hides close button when allowClose is false', () => {
    wrapper = mount(ModalWindow, { props: { isOpen: true, allowClose: false } });
    expect(closeBtn()).toBeNull();
  });

  // Interaction
  it('emits close when close button is clicked', async () => {
    wrapper = mount(ModalWindow, { props: { isOpen: true } });
    closeBtn()!.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
