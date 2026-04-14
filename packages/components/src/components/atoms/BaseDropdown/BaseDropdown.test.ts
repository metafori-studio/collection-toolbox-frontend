import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseDropdown from './BaseDropdown.vue';

describe('BaseDropdown', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrappers: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = (...args: Parameters<typeof mount>): any => {
    const w = mount(...args);
    wrappers.push(w);
    return w;
  };
  afterEach(() => { wrappers.forEach((w) => w.unmount()); wrappers.length = 0; });

  it('renders the trigger button', () => {
    const wrapper = m(BaseDropdown);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('does not show dropdown content by default', () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div class="menu-item">Option 1</div>' },
    });
    expect(wrapper.find('.menu-item').exists()).toBe(false);
  });

  it('shows dropdown content after trigger button is clicked', async () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div class="menu-item">Option 1</div>' },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.menu-item').exists()).toBe(true);
  });

  it('hides dropdown content after second click (toggle)', async () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div class="menu-item">Option 1</div>' },
    });
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.menu-item').exists()).toBe(false);
  });

  it('renders custom trigger slot content', () => {
    const wrapper = m(BaseDropdown, {
      slots: { trigger: 'Open Menu' },
    });
    expect(wrapper.find('button').text()).toContain('Open Menu');
  });

  it('exposes close() method that hides the dropdown', async () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div class="menu-item">Option</div>' },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.menu-item').exists()).toBe(true);

    wrapper.vm.close();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.menu-item').exists()).toBe(false);
  });

  it('exposes isOpen ref that reflects open state', async () => {
    const wrapper = m(BaseDropdown);
    expect(wrapper.vm.isOpen).toBe(false);

    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('applies bottom-left direction class by default', async () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div>item</div>' },
    });
    await wrapper.find('button').trigger('click');
    const dropdown = wrapper.find('.absolute.z-10');
    expect(dropdown.classes()).toContain('right-0');
  });

  it('applies bottom-right direction class', async () => {
    const wrapper = m(BaseDropdown, {
      props: { direction: 'bottom-right' },
      slots: { default: '<div>item</div>' },
    });
    await wrapper.find('button').trigger('click');
    const dropdown = wrapper.find('.absolute.z-10');
    expect(dropdown.classes()).toContain('left-0');
  });

  it('closes on outside click', async () => {
    const wrapper = m(BaseDropdown, {
      slots: { default: '<div class="menu-item">Option</div>' },
      attachTo: document.body,
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.menu-item').exists()).toBe(true);

    const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(outsideEvent);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.menu-item').exists()).toBe(false);
  });
});
