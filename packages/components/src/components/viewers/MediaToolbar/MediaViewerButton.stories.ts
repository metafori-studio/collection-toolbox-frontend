import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MediaViewerButton from './MediaViewerButton.vue';
import BaseIcon from '../../atoms/BaseIcon';

const meta = {
  title: 'Viewers/MediaViewerButton',
  component: MediaViewerButton,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { action: 'click' },
  },
} satisfies Meta<typeof MediaViewerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Previous Page',
    disabled: false,
  },
  render: (args) => ({
    components: { MediaViewerButton, BaseIcon },
    setup() {
      return { args };
    },
    template: `
      <MediaViewerButton v-bind="args">
        <BaseIcon icon="arrowLeft" :size="20" />
      </MediaViewerButton>
    `,
  }),
};

export const DisabledState: Story = {
  args: {
    title: 'Zoom In',
    disabled: true,
  },
  render: (args) => ({
    components: { MediaViewerButton, BaseIcon },
    setup() {
      return { args };
    },
    template: `
      <MediaViewerButton v-bind="args">
        <BaseIcon icon="zoomIn" :size="20" />
      </MediaViewerButton>
    `,
  }),
};
