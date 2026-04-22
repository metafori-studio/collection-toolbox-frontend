import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ImageViewer from './ImageViewer.vue';

const sampleImage = {
  id: 1,
  name: 'Sample image',
  file_name: 'sample.jpg',
  mime_type: 'image/jpeg',
  url: 'https://fastly.picsum.photos/id/1043/1600/1067.jpg?hmac=F0jYEhXj2mH1iDv9rbPMXW3X1Xbfx6tDcL1JQsmN6Hw',
  human_readable_size: '1.24 MB',
};

const meta = {
  title: 'Viewers/ImageViewer',
  component: ImageViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ImageViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    media: sampleImage,
  },
  render: (args) => ({
    components: { ImageViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><ImageViewer v-bind="args" /></div>',
  }),
};
