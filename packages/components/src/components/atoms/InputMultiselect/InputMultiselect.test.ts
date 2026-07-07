import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import InputMultiselect from './InputMultiselect.vue';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('InputMultiselect', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrappers: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = (...args: Parameters<typeof mount>): any => {
    const w = mount(...args);
    wrappers.push(w);
    return w;
  };
  afterEach(() => { wrappers.forEach((w) => w.unmount()); wrappers.length = 0; });

  // Props
  it('renders with provided id', () => {
    const wrapper = m(InputMultiselect, { props: { options, id: 'my-multiselect' } });
    expect(wrapper.find('button').attributes('id')).toBe('my-multiselect');
  });

  it('shows the label when no value selected', () => {
    const wrapper = m(InputMultiselect, { props: { options, label: 'Fruit' } });
    expect(wrapper.find('button').text()).toBe('Fruit');
  });

  it('does not show a count badge when no value selected', () => {
    const wrapper = m(InputMultiselect, { props: { options, label: 'Fruit' } });
    expect(wrapper.find('button').text()).not.toMatch(/\d/);
  });

  it('shows a count badge reflecting the number of selected options', () => {
    const wrapper = m(InputMultiselect, { props: { options, label: 'Fruit', modelValue: ['a', 'c'] } });
    expect(wrapper.find('button').text()).toContain('2');
    expect(wrapper.find('button').text()).toContain('Fruit');
  });

  // Disabled
  it('disables the trigger button when disabled prop is set', () => {
    const wrapper = m(InputMultiselect, { props: { options, disabled: true } });
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not open when disabled', async () => {
    const wrapper = m(InputMultiselect, { props: { options, disabled: true } });
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(0);
  });

  // Opening / closing
  it('does not show the options panel by default', () => {
    const wrapper = m(InputMultiselect, { props: { options } });
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(0);
  });

  it('shows the options panel after clicking the trigger', async () => {
    const wrapper = m(InputMultiselect, { props: { options } });
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(3);
  });

  it('hides the options panel after second click (toggle)', async () => {
    const wrapper = m(InputMultiselect, { props: { options } });
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(0);
  });

  it('closes on outside click', async () => {
    const wrapper = m(InputMultiselect, { props: { options }, attachTo: document.body });
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(3);

    const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(outsideEvent);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(0);
  });

  // Model
  it('marks correct checkboxes as checked based on modelValue', async () => {
    const wrapper = m(InputMultiselect, { props: { options, modelValue: ['a', 'c'] } });
    await wrapper.find('button').trigger('click');
    const checkboxes = wrapper.findAllComponents({ name: 'InputCheckbox' });
    expect(checkboxes[0]!.props('modelValue')).toBe(true);
    expect(checkboxes[1]!.props('modelValue')).toBe(false);
    expect(checkboxes[2]!.props('modelValue')).toBe(true);
  });

  it('adds value to model when a checkbox is checked', async () => {
    const wrapper = m(InputMultiselect, { props: { options, modelValue: [] } });
    await wrapper.find('button').trigger('click');
    await wrapper.findAllComponents({ name: 'InputCheckbox' })[0]!.vm.$emit('update:modelValue', true);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toContain('a');
  });

  it('removes value from model when a checkbox is unchecked', async () => {
    const wrapper = m(InputMultiselect, { props: { options, modelValue: ['a'] } });
    await wrapper.find('button').trigger('click');
    await wrapper.findAllComponents({ name: 'InputCheckbox' })[0]!.vm.$emit('update:modelValue', false);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0] as string[]).not.toContain('a');
  });

  // Search
  it('filters options based on search query', async () => {
    const wrapper = m(InputMultiselect, { props: { options } });
    await wrapper.find('button').trigger('click');
    await wrapper.find('input[type="search"]').setValue('B');
    const checkboxes = wrapper.findAllComponents({ name: 'InputCheckbox' });
    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]!.props('label')).toBe('Option B');
  });

  it('shows no results message when search matches nothing', async () => {
    const wrapper = m(InputMultiselect, { props: { options } });
    await wrapper.find('button').trigger('click');
    await wrapper.find('input[type="search"]').setValue('zzz');
    expect(wrapper.findAllComponents({ name: 'InputCheckbox' })).toHaveLength(0);
    expect(wrapper.text().toLowerCase()).toContain('no results');
  });
});
