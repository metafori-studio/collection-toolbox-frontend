import type { Meta, StoryObj } from '@storybook/vue3-vite';

import FilterChip from './FilterChip.vue';

const meta = {
  title: 'Atoms/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'number' },
    onClear: { action: 'clear' },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 5,
  },
  render: (args) => ({
    components: { FilterChip },
    setup() { return { args }; },
    template: '<FilterChip v-bind="args" @clear="args.count = 0" />',
  }),
};

export const SingleSelected: Story = {
  args: {
    count: 1,
  },
};
