import type { Meta, StoryObj } from '@storybook/vue3-vite';

import AudioViewer from './AudioViewer.vue';

const sampleAudio = {
  id: 1,
  name: 'Interview with weaver',
  file_name: 'interview-weaver-01.mp3',
  mime_type: 'audio/mpeg',
  url: 'https://files.vidstack.io/sprite-fight/audio.mp3',
  human_readable_size: '48.2 MB',
};

const meta = {
  title: 'Viewers/AudioViewer',
  component: AudioViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AudioViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    media: sampleAudio,
  },
  render: (args) => ({
    components: { AudioViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><AudioViewer v-bind="args" /></div>',
  }),
};

export const WithTranscript: Story = {
  args: {
    media: {
      ...sampleAudio,
      transcript: 'Interviewer: Can you describe how you first learned to weave?\nParticipant: My grandmother taught me when I was seven years old...',
    },
  },
  render: (args) => ({
    components: { AudioViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><AudioViewer v-bind="args" /></div>',
  }),
};
