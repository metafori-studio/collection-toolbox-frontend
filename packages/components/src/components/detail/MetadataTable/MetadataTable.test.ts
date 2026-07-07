import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MetadataTable from './MetadataTable.vue';

const items = [
  { label: 'Materiál', value: 'Plátno' },
  { label: 'Rok akvizície', value: 1967 },
];

describe('MetadataTable', () => {
  // Rendering
  it('renders as a table element', () => {
    const wrapper = mount(MetadataTable, { props: { items: [] } });
    expect(wrapper.element.tagName).toBe('TABLE');
  });

  it('renders one row per item', () => {
    const wrapper = mount(MetadataTable, { props: { items } });
    expect(wrapper.findAll('tr')).toHaveLength(2);
  });

  it('renders no rows when items is empty', () => {
    const wrapper = mount(MetadataTable, { props: { items: [] } });
    expect(wrapper.findAll('tr')).toHaveLength(0);
  });

  // Content
  it('renders the label for each item', () => {
    const wrapper = mount(MetadataTable, { props: { items } });
    const headers = wrapper.findAll('th');
    expect(headers[0]!.text()).toBe('Materiál');
    expect(headers[1]!.text()).toBe('Rok akvizície');
  });

  it('renders the value for each item', () => {
    const wrapper = mount(MetadataTable, { props: { items } });
    const cells = wrapper.findAll('td');
    expect(cells[0]!.text()).toBe('Plátno');
    expect(cells[1]!.text()).toBe('1967');
  });

  it('supports numeric values', () => {
    const wrapper = mount(MetadataTable, { props: { items: [{ label: 'Count', value: 42 }] } });
    expect(wrapper.find('td').text()).toBe('42');
  });
});
