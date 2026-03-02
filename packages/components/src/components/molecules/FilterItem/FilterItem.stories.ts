import type { Meta, StoryObj } from '@storybook/vue3-vite';

import FilterItem from './FilterItem.vue';
import { icons } from '@/components/atoms/BaseIcon/BaseIcon.vue';

const meta = {
  title: 'Molecules/FilterItem',
  component: FilterItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'select', options: Object.keys(icons) },
    selectedCount: { control: 'number' },
    onOpen: { action: 'open' },
  },
} satisfies Meta<typeof FilterItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Town',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Town',
    icon: 'stack',
  },
};


export const WithSelection: Story = {
  args: {
    label: 'Town',
    selectedCount: 3,
  },
};

