import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import InputSelect from './InputSelect.vue';

const sampleOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const meta = {
  title: 'Atoms/InputSelect',
  component: InputSelect,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
  },
} satisfies Meta<typeof InputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select an option...',
    disabled: false,
    hasError: false,
  },
  render: (args) => ({
    components: { InputSelect },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputSelect v-bind="args" v-model="value" />',
  }),
};

export const WithValue: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select an option...',
    disabled: false,
    hasError: false,
  },
  render: (args) => ({
    components: { InputSelect },
    setup() {
      const value = ref('banana');
      return { args, value };
    },
    template: '<InputSelect v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Disabled select',
    disabled: true,
    hasError: false,
  },
  render: (args) => ({
    components: { InputSelect },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputSelect v-bind="args" v-model="value" />',
  }),
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select an option...',
    disabled: false,
    hasError: true,
  },
  render: (args) => ({
    components: { InputSelect },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputSelect v-bind="args" v-model="value" />',
  }),
};
