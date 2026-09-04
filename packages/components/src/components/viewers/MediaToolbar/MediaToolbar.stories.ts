import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MediaToolbar from './MediaToolbar.vue';
import MediaViewerButton from './MediaViewerButton.vue';
import BaseIcon from '../../atoms/BaseIcon';

const meta = {
  title: 'Viewers/MediaToolbar',
  component: MediaToolbar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['pill', 'full'],
    },
  },
} satisfies Meta<typeof MediaToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pill: Story = {
  args: {
    variant: 'pill',
  },
  render: (args) => ({
    components: {
      MediaToolbar,
      MediaViewerButton,
      BaseIcon,
    },
    setup() {
      return { args };
    },
    template: `
      <MediaToolbar v-bind="args">
        <MediaViewerButton title="Zoom Out">
          <BaseIcon icon="zoomOut" :size="16" />
        </MediaViewerButton>

        <span class="text-xs font-medium px-1">100%</span>

        <MediaViewerButton title="Zoom In">
          <BaseIcon icon="zoomIn" :size="16" />
        </MediaViewerButton>
      </MediaToolbar>
    `,
  }),
};

export const Full: Story = {
  args: {
    variant: 'full',
  },
  render: (args) => ({
    components: {
      MediaToolbar,
      MediaViewerButton,
      BaseIcon,
    },
    setup() {
      return { args };
    },
    template: `
      <MediaToolbar v-bind="args">
        <MediaViewerButton title="Previous Page">
          <BaseIcon icon="arrowLeft" :size="16" />
        </MediaViewerButton>

        <span class="text-xs font-medium px-1">1/12</span>

        <MediaViewerButton title="Next Page">
          <BaseIcon icon="arrowRight" :size="16" />
        </MediaViewerButton>
      </MediaToolbar>
    `,
  }),
};
