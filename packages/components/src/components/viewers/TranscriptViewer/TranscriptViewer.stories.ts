import type { Meta, StoryObj } from '@storybook/vue3-vite';

import TranscriptViewer from './TranscriptViewer.vue';

const meta = {
  title: 'Viewers/TranscriptViewer',
  component: TranscriptViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TranscriptViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transcript: 'Interviewer: Can you describe how you first learned to weave?\nParticipant: My grandmother taught me when I was seven years old. She sat me down at the small loom by the window and showed me how to pass the shuttle through the warp.\n\nInterviewer: Were there specific patterns your family used?\nParticipant: Yes, every family in the valley had its own arrangement of stripes and motifs.',
  },
  render: (args) => ({
    components: { TranscriptViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex justify-end"><TranscriptViewer v-bind="args" /></div>',
  }),
};
