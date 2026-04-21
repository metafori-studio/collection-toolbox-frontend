import type { Meta, StoryObj } from '@storybook/vue3-vite';

import VideoViewer from './VideoViewer.vue';

const sampleVideo = {
  id: 1,
  name: 'Ceremony recording',
  file_name: 'ceremony-recording.mp4',
  mime_type: 'video/mp4',
  url: 'https://files.vidstack.io/sprite-fight/720p.mp4',
  human_readable_size: '512.4 MB',
  conversions: {
    poster: 'https://files.vidstack.io/sprite-fight/poster.webp',
  },
};

const meta = {
  title: 'Viewers/VideoViewer',
  component: VideoViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VideoViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    media: sampleVideo,
  },
  render: (args) => ({
    components: { VideoViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><VideoViewer v-bind="args" /></div>',
  }),
};

export const WithTranscript: Story = {
  args: {
    media: {
      ...sampleVideo,
      transcript: '[00:00] The recording opens on a wide shot of the courtyard.\n[00:12] A group of elders enters from the east side.\n[00:45] The head weaver welcomes the participants.',
    },
  },
  render: (args) => ({
    components: { VideoViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><VideoViewer v-bind="args" /></div>',
  }),
};
