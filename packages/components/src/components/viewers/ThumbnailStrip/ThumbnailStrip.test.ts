import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ThumbnailStrip from './ThumbnailStrip.vue';
import ThumbnailStripThumb from './ThumbnailStripThumb.vue';

describe('ThumbnailStrip Component Suite', () => {
  it('renders slot content inside strip container', () => {
    const wrapper = mount(ThumbnailStrip, {
      slots: {
        default: '<div class="test-item">Item 1</div>',
      },
    });

    expect(wrapper.find('.test-item').exists()).toBe(true);
    expect(wrapper.find('.test-item').text()).toBe('Item 1');
  });

  it('renders ThumbnailStripThumb components when passed in slot', () => {
    const wrapper = mount(ThumbnailStrip, {
      global: {
        components: { ThumbnailStripThumb },
      },
      slots: {
        default: '<ThumbnailStripThumb :page="1" label="Localized item 1"><img src="https://example.com/thumb1.jpg" class="test-img" /></ThumbnailStripThumb>',
      },
    });

    const thumb = wrapper.findComponent(ThumbnailStripThumb);
    expect(thumb.exists()).toBe(true);
    expect(thumb.props('page')).toBe(1);
    expect(wrapper.find('.test-img').exists()).toBe(true);
  });

  it('renders responsive classes for mobile horizontal and desktop vertical layouts', () => {
    const wrapper = mount(ThumbnailStrip);
    expect(wrapper.classes()).toContain('flex-row');
    expect(wrapper.classes()).toContain('w-full');
    expect(wrapper.classes()).toContain('overflow-x-auto');
    expect(wrapper.classes()).toContain('border-t');
    expect(wrapper.classes()).toContain('p-3');
    expect(wrapper.classes()).toContain('gap-2');
    expect(wrapper.classes()).toContain('lg:flex-col');
    expect(wrapper.classes()).toContain('lg:w-auto');
    expect(wrapper.classes()).toContain('lg:h-full');
    expect(wrapper.classes()).toContain('lg:overflow-y-auto');
    expect(wrapper.classes()).toContain('lg:border-r');
  });

  it('renders a spaced, rounded square thumbnail tile', () => {
    const wrapper = mount(ThumbnailStripThumb, {
      props: { page: 12, label: 'Localized item 12' },
    });
    const button = wrapper.get('button');
    const tile = button.get('div');
    const badge = tile.get('div');

    expect(button.classes()).toEqual(expect.arrayContaining(['h-16', 'w-16']));
    expect(tile.classes()).toEqual(expect.arrayContaining(['h-full', 'w-full']));
    expect(tile.classes()).toContain('rounded-sm');
    expect(badge.classes()).toEqual(expect.arrayContaining(['bottom-0', 'right-0', 'h-4', 'min-w-4']));
    expect(badge.classes()).not.toContain('rounded-xs');
    expect(button.attributes('aria-label')).toBe('Localized item 12');
  });

  it('scrolls active thumbnail into view when active becomes true', async () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const wrapper = mount(ThumbnailStripThumb, {
      props: {
        page: 2,
        label: 'Localized item 2',
        active: false,
      },
    });

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    await wrapper.setProps({ active: true });
    await nextTick();

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
