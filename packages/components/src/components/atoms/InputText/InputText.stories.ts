import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import InputText from './InputText.vue';
import { icons } from '@/components/atoms/BaseIcon/BaseIcon.vue';

const meta = {
  title: 'Atoms/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    icon: { control: 'select', options: Object.keys(icons) },
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    placeholder: 'Type something...',
    disabled: false,
    hasError: false,
    icon: 'magnifyingGlass',
  },
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputText v-bind="args" v-model="value" />',
  }),
};

export const NoIcon: Story = {
  args: {
    placeholder: 'Type something...',
    disabled: false,
    hasError: false,
    icon: undefined,
  },
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputText v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    hasError: false,
  },
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<InputText v-bind="args" v-model="value" />',
  }),
};

export const WithError: Story = {
  args: {
    placeholder: 'Invalid input',
    disabled: false,
    hasError: true,
  },
  render: (args) => ({
    components: { InputText },
    setup() {
      const value = ref('bad value');
      return { args, value };
    },
    template: '<InputText v-bind="args" v-model="value" />',
  }),
};
