import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import InputRadio from './InputRadio.vue';

const meta = {
  title: 'Atoms/InputRadio',
  component: InputRadio,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    count: { control: 'number' },
  },
} satisfies Meta<typeof InputRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Placeholder',
    name: 'radio',
    value: 'option1',
  },
  render: (args) => ({
    components: { InputRadio },
    setup() {
      const selected = ref<string>('');
      return { args, selected };
    },
    template: '<InputRadio v-bind="args" v-model="selected" />',
  }),
};

export const Selected: Story = {
  args: {
    label: 'Placeholder',
    name: 'radio',
    value: 'option1',
  },
  render: (args) => ({
    components: { InputRadio },
    setup() {
      const selected = ref<string>('option1');
      return { args, selected };
    },
    template: '<InputRadio v-bind="args" v-model="selected" />',
  }),
};
