import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MediaToolbar from './MediaToolbar.vue';
import MediaViewerButton from './MediaViewerButton.vue';
import MediaToolbarSeparator from './MediaToolbarSeparator.vue';
import ViewerToolbar from './ViewerToolbar.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('MediaToolbar Component Suite', () => {
  describe('MediaToolbar (Wrapper Container)', () => {
    it('renders pill variant by default with rounded-full and w-fit', () => {
      const wrapper = mount(MediaToolbar, {
        slots: {
          default: '<span class="test-content">Toolbar Item</span>',
        },
      });

      expect(wrapper.find('.test-content').exists()).toBe(true);
      expect(wrapper.find('.test-content').text()).toBe('Toolbar Item');
      expect(wrapper.classes()).toContain('rounded-full');
      expect(wrapper.classes()).toContain('w-fit');
      expect(wrapper.classes()).toContain('inline-flex');
    });

    it('renders full variant with rounded-none and w-full', () => {
      const wrapper = mount(MediaToolbar, {
        props: { variant: 'full' },
      });
      expect(wrapper.classes()).toContain('rounded-none');
      expect(wrapper.classes()).toContain('w-full');
    });
  });

  describe('ViewerToolbar', () => {
    it('keeps the zoom slot while its percentage is pending', async () => {
      const wrapper = mount(ViewerToolbar, { props: {
        current: 1, total: 1, zoomPercentage: null, canZoomIn: false, canZoomOut: false, canResetZoom: false,
      } });
      const slot = wrapper.get('.tabular-nums').element;
      expect(slot.textContent?.trim()).toBe('');
      await wrapper.setProps({ zoomPercentage: 75 });
      expect(wrapper.get('.tabular-nums').element).toBe(slot);
      expect(slot.textContent?.trim()).toBe('75%');
      wrapper.unmount();
    });

    it('renders paging and zoom controls and emits actions', async () => {
      const wrapper = mount(ViewerToolbar, {
        props: {
          current: 2,
          total: 5,
          zoomPercentage: 150,
          canZoomIn: true,
          canZoomOut: true,
          canResetZoom: true,
        },
      });

      expect(wrapper.text()).toContain('2/5');
      expect(wrapper.text()).toContain('150%');

      const buttons = wrapper.findAllComponents(MediaViewerButton);
      expect(buttons).toHaveLength(5);

      await buttons[0]?.trigger('click');
      expect(wrapper.emitted('previous')).toBeTruthy();

      await buttons[1]?.trigger('click');
      expect(wrapper.emitted('next')).toBeTruthy();

      await buttons[2]?.trigger('click');
      expect(wrapper.emitted('zoom-out')).toBeTruthy();

      await buttons[3]?.trigger('click');
      expect(wrapper.emitted('zoom-in')).toBeTruthy();

      await buttons[4]?.trigger('click');
      expect(wrapper.emitted('reset-zoom')).toBeTruthy();
    });
  });

  describe('MediaViewerButton', () => {
    it('wraps BaseButton with media variant and renders slot content', async () => {
      const wrapper = mount(MediaViewerButton, {
        props: {
          title: 'Previous Page',
        },
        slots: {
          default: '<span class="icon-slot">Icon</span>',
        },
      });

      expect(wrapper.attributes('title')).toBe('Previous Page');
      expect(wrapper.classes()).toContain('rounded-full');
      expect(wrapper.find('.icon-slot').text()).toBe('Icon');
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('applies the disabled state', () => {
      const wrapperDisabled = mount(MediaViewerButton, {
        props: { disabled: true },
      });
      expect(wrapperDisabled.attributes('disabled')).toBeDefined();
    });
  });

  describe('MediaToolbarSeparator', () => {
    it('renders vertical separator line', () => {
      const wrapper = mount(MediaToolbarSeparator);
      expect(wrapper.element.tagName).toBe('DIV');
      expect(wrapper.classes()).toContain('w-px');
    });
  });
});
