import type { Meta, StoryObj } from '@storybook/vue3-vite';

import BaseDropdown from './BaseDropdown.vue';

const meta = {
  title: 'Atoms/BaseDropdown',
  component: BaseDropdown,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
    },
  },
} satisfies Meta<typeof BaseDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseDropdown },
    setup() {
      return { args };
    },
    template: `
      <BaseDropdown v-bind="args">
        <template #trigger>
          Please, select…
        </template>
        <ul class="py-1">
          <li class="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer">Apple</li>
          <li class="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer">Banana</li>
          <li class="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer">Cherry</li>
        </ul>
      </BaseDropdown>
    `,
  }),
};
