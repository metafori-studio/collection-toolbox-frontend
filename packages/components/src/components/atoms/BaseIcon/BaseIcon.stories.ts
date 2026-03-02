import type { Meta, StoryObj } from '@storybook/vue3-vite';

import BaseIcon, { icons } from './BaseIcon.vue';

const meta = {
  title: 'Atoms/BaseIcon',
  component: BaseIcon,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: Object.keys(icons) },
    size: { control: 'inline-radio', options: [16, 20, 24, 32] },
    weight: { control: 'inline-radio', options: ['regular', 'fill'] },
  },
} satisfies Meta<typeof BaseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'placeholder',
    size: 24,
    weight: 'regular',
  },
};

export const AllIcons: Story = {
  render: () => ({
    components: { BaseIcon },
    setup() { return { icons }; },
    template: `
      <div class="flex gap-4">
        <BaseIcon
          v-for="icon in Object.keys(icons)"
          :key="icon"
          :icon="icon"
        />
      </div>
    `,
  }),
};
