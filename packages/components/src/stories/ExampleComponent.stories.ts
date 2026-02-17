import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ExampleComponent from '../components/ExampleComponent.vue';

const meta = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  tags: ['autodocs'],
  argTypes: {
    char: { control: 'text' },
    count: { control: 'range' },
  },
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    char: '👁️',
    count: 5,
  },
};

export const SingleChar: Story = {
  args: {
    char: 'A',
    count: 1,
  },
};

export const ManyChars: Story = {
  args: {
    char: 'B',
    count: 10,
  },
};
