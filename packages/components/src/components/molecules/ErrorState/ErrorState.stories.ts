import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ErrorState from './ErrorState.vue';
import { icons } from '../../../components/atoms/BaseIcon/BaseIcon.vue';

const meta = {
  title: 'Molecules/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    icon: { control: 'select', options: Object.keys(icons) },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Custom: Story = {
  args: {
    title: 'No results',
    text: 'Remove filters or try a different search term.',
    icon: 'magnifyingGlass',
  },
};
