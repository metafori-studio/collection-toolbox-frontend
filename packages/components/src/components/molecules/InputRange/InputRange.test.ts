import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InputRange from './InputRange.vue';

describe('InputRange', () => {
  it('renders two range inputs', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect(ranges).toHaveLength(2);
  });

  it('renders two text inputs for manual entry', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    const textInputs = wrapper.findAll('input[type="text"]');
    expect(textInputs).toHaveLength(2);
  });

  it('sets min/max attributes on range inputs', () => {
    const wrapper = mount(InputRange, {
      props: { min: 200, max: 500, modelValue: { min: 250, max: 450 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect(ranges[0].attributes('min')).toBe('200');
    expect(ranges[0].attributes('max')).toBe('500');
    expect(ranges[1].attributes('min')).toBe('200');
    expect(ranges[1].attributes('max')).toBe('500');
  });

  it('reflects modelValue.min in the min range input', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 30, max: 70 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect((ranges[0].element as HTMLInputElement).value).toBe('30');
  });

  it('reflects modelValue.max in the max range input', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 30, max: 70 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect((ranges[1].element as HTMLInputElement).value).toBe('70');
  });

  it('renders "Začiatok" label for min input', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    expect(wrapper.text()).toContain('Začiatok');
  });

  it('renders "Koniec" label for max input', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    expect(wrapper.text()).toContain('Koniec');
  });

  it('applies default step of 1', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect(ranges[0].attributes('step')).toBe('1');
  });

  it('applies custom step', () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, step: 5, modelValue: { min: 10, max: 90 } },
    });
    const ranges = wrapper.findAll('input[type="range"]');
    expect(ranges[0].attributes('step')).toBe('5');
  });

  it('uses default modelValue of { min: 1920, max: 2025 } when not provided', () => {
    const wrapper = mount(InputRange, { props: { min: 1900, max: 2030 } });
    const ranges = wrapper.findAll('input[type="range"]');
    expect((ranges[0].element as HTMLInputElement).value).toBe('1920');
    expect((ranges[1].element as HTMLInputElement).value).toBe('2025');
  });

  it('clamps min value to prop min when range input goes below min', async () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    const minRange = wrapper.findAll('input[type="range"]')[0]!;
    (minRange.element as HTMLInputElement).value = '-5';
    await minRange.trigger('input');
    await nextTick();
    // The watcher clamps in place; verify the DOM reflects the clamped value
    expect(Number((minRange.element as HTMLInputElement).value)).toBeGreaterThanOrEqual(0);
  });

  it('clamps max value to prop max when range input exceeds max', async () => {
    const wrapper = mount(InputRange, {
      props: { min: 0, max: 100, modelValue: { min: 10, max: 90 } },
    });
    const maxRange = wrapper.findAll('input[type="range"]')[1]!;
    (maxRange.element as HTMLInputElement).value = '150';
    await maxRange.trigger('input');
    await nextTick();
    // The watcher clamps in place; verify the DOM reflects the clamped value
    expect(Number((maxRange.element as HTMLInputElement).value)).toBeLessThanOrEqual(100);
  });
});
