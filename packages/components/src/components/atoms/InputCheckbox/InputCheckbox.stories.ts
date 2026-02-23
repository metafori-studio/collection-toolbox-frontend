import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import InputCheckbox from './InputCheckbox.vue';

const meta = {
  title: 'Atoms/InputCheckbox',
  component: InputCheckbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    count: { control: 'number' },
  },
} satisfies Meta<typeof InputCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Placeholder',
    count: 77,
  },
  render: (args) => ({
    components: { InputCheckbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: '<InputCheckbox v-bind="args" v-model="checked" />',
  }),
};

export const CheckedWithCount: Story = {
  args: {
    label: 'Placeholder',
    count: 77,
  },
  render: (args) => ({
    components: { InputCheckbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: '<InputCheckbox v-bind="args" v-model="checked" />',
  }),
};
