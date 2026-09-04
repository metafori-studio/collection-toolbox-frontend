import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ThumbnailStripThumb from './ThumbnailStripThumb.vue';

const meta = {
  title: 'Viewers/ThumbnailStripThumb',
  component: ThumbnailStripThumb,
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number' },
    label: { control: 'text' },
    active: { control: 'boolean' },
    onClick: { action: 'click' },
  },
  args: {
    page: 1,
    label: 'Item 1',
    active: false,
  },
} satisfies Meta<typeof ThumbnailStripThumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { ThumbnailStripThumb },
    setup() {
      return { args };
    },
    template: `
      <ThumbnailStripThumb v-bind="args">
        <img src="https://picsum.photos/id/10/200/200" class="w-full h-full object-cover pointer-events-none select-none" alt="" />
      </ThumbnailStripThumb>
    `,
  }),
};
export const Active: Story = {
  render: (args) => ({
    components: { ThumbnailStripThumb },
    setup() {
      return { args };
    },
    template: `
      <ThumbnailStripThumb v-bind="args" :active="true">
        <img src="https://picsum.photos/id/10/200/200" class="w-full h-full object-cover pointer-events-none select-none" alt="" />
      </ThumbnailStripThumb>
    `,
  }),
};

export const CustomSlotText: Story = {
  render: (args) => ({
    components: { ThumbnailStripThumb },
    setup() {
      return { args };
    },
    template: `
      <ThumbnailStripThumb v-bind="args" :page="2" label="Item 2">
        <div class="text-neutral-400 text-xs font-medium select-none">
          Page 2
        </div>
      </ThumbnailStripThumb>
    `,
  }),
};
