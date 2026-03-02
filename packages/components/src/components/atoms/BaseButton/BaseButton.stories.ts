import type { Meta, StoryObj } from '@storybook/vue3-vite';

import BaseButton from './BaseButton.vue';
import BaseIcon from '@/components/atoms/BaseIcon';

const meta = {
  title: 'Atoms/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['regular', 'small'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'danger-primary', 'danger-secondary'] },
  },
} satisfies Meta<typeof BaseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    disabled: false,
  },
  render: (args) => ({
    components: { BaseButton },
    setup() { return { args }; },
    template: '<BaseButton v-bind="args">Button</BaseButton>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'regular',
    disabled: false,
  },
  render: (args) => ({
    components: { BaseButton },
    setup() { return { args }; },
    template: '<BaseButton v-bind="args">Button</BaseButton>',
  }),
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    size: 'regular',
    disabled: false,
  },
  render: (args) => ({
    components: { BaseButton, BaseIcon },
    setup() { return { args }; },
    template: '<BaseButton v-bind="args"><BaseIcon />Button<BaseIcon /></BaseButton>',
  }),
};
