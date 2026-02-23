import type { Meta, StoryObj } from '@storybook/vue3-vite';

import FilterItem from './FilterItem.vue';

const meta = {
  title: 'Molecules/FilterItem',
  component: FilterItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    selectedCount: { control: 'number' },
    onOpen: { action: 'open' },
  },
} satisfies Meta<typeof FilterItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Color',
  },
};

export const WithSelection: Story = {
  args: {
    label: 'Color',
    selectedCount: 3,
  },
};

export const SingleSelected: Story = {
  args: {
    label: 'Size',
    selectedCount: 1,
  },
};
