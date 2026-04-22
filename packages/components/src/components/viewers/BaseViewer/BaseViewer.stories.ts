import type { Meta, StoryObj } from '@storybook/vue3-vite';

import BaseViewer from './BaseViewer.vue';

const meta = {
  title: 'Viewers/BaseViewer',
  component: BaseViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BaseViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { BaseViewer },
    template: `
      <div class="h-[600px] flex">
        <BaseViewer>
          <div class="flex items-center justify-center h-full">
            <p class="text-neutral-500">Viewer shell content goes here</p>
          </div>
        </BaseViewer>
      </div>
    `,
  }),
};
