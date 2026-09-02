import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import InputMultiselect from './InputMultiselect.vue';

const sampleOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const meta = {
  title: 'Atoms/InputMultiselect',
  component: InputMultiselect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof InputMultiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: sampleOptions,
    label: 'Fruit',
    disabled: false,
  },
  render: (args) => ({
    components: { InputMultiselect },
    setup() {
      const value = ref<string[]>([]);
      return { args, value };
    },
    template: '<InputMultiselect v-bind="args" v-model="value" />',
  }),
};

export const WithValue: Story = {
  args: {
    options: sampleOptions,
    label: 'Fruit',
    disabled: false,
  },
  render: (args) => ({
    components: { InputMultiselect },
    setup() {
      const value = ref<string[]>(['banana', 'cherry']);
      return { args, value };
    },
    template: '<InputMultiselect v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    label: 'Fruit',
    disabled: true,
  },
  render: (args) => ({
    components: { InputMultiselect },
    setup() {
      const value = ref<string[]>([]);
      return { args, value };
    },
    template: '<InputMultiselect v-bind="args" v-model="value" />',
  }),
};
