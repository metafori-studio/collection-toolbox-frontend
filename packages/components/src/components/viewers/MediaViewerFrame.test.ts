import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import MediaViewerFrame from './MediaViewerFrame.vue';

describe('MediaViewerFrame keyboard navigation', () => {
  let wrapper: VueWrapper | undefined;

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  });
  afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals(); });

  function mountFrame() {
    wrapper = mount(MediaViewerFrame, {
      attachTo: document.body,
      slots: {
        default: '<div data-renderer tabindex="0"><canvas /></div>',
        thumbnails: '<button data-thumbnail>Thumbnail</button>',
        source: '<select><option>Source</option></select><input /><div contenteditable="true">Caption</div>',
        toolbar: '<button data-toolbar>Zoom in</button>',
      },
    });
    return wrapper;
  }

  it('leaves focus on source controls', () => {
    const frame = mountFrame();
    const input = frame.get('input');
    (input.element as HTMLElement).focus();
    input.element.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true }));
    expect(document.activeElement).toBe(input.element);
  });

  it('handles navigation keys and keeps focus on the viewport', async () => {
    const frame = mountFrame();
    const viewport = frame.get('[data-media-viewport]');
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    viewport.element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(frame.emitted('next')).toHaveLength(1);
    expect(document.activeElement).toBe(viewport.element);
    await viewport.trigger('keydown', { key: 'ArrowLeft' });
    expect(frame.emitted('previous')).toHaveLength(1);
  });

  it('does not handle keyboard events from the thumbnail strip', async () => {
    const frame = mountFrame();
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageDown']) {
      await frame.get('[data-thumbnail]').trigger('keydown', { key });
    }
    expect(frame.emitted('previous')).toBeUndefined();
    expect(frame.emitted('next')).toBeUndefined();
    expect(frame.emitted('first')).toBeUndefined();
    expect(frame.emitted('last')).toBeUndefined();
  });

  it('leaves editable controls, modified shortcuts and vertical arrows alone', async () => {
    const frame = mountFrame();
    for (const selector of ['input', 'select', '[contenteditable]', '[data-toolbar]']) {
      await frame.get(selector).trigger('keydown', { key: 'ArrowRight' });
      await frame.get(selector).trigger('keydown', { key: 'Home' });
    }
    const body = frame.get('[data-media-viewport]');
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'isComposing']) {
      await body.trigger('keydown', { key: 'ArrowRight', [modifier]: true });
    }
    const vertical = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    body.element.dispatchEvent(vertical);
    expect(vertical.defaultPrevented).toBe(false);
    expect(frame.emitted('previous')).toBeUndefined();
    expect(frame.emitted('next')).toBeUndefined();
    expect(frame.emitted('first')).toBeUndefined();
    expect(frame.emitted('last')).toBeUndefined();
  });

  it('translates page and endpoint keys into semantic navigation events', async () => {
    const frame = mountFrame();
    const body = frame.get('[data-media-viewport]');
    for (const key of ['PageUp', 'PageDown', 'Home', 'End']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      body.element.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    for (const name of ['previous', 'next', 'first', 'last']) {
      expect(frame.emitted(name)).toHaveLength(1);
    }
  });
});
