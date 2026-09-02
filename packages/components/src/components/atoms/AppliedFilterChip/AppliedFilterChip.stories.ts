import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AppliedFilterChip from './AppliedFilterChip.vue';

const meta = {
  title: 'Atoms/AppliedFilterChip',
  component: AppliedFilterChip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    onClear: { action: 'clear' },
  },
} satisfies Meta<typeof AppliedFilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Category',
    value: 'Paintings',
  },
};

export const LongValue: Story = {
  args: {
    label: 'Artist',
    value: 'Cyprián Majerník',
  },
};
