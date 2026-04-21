import type { Meta, StoryObj } from '@storybook/vue3-vite';

import PdfViewer from './PdfViewer.vue';

const samplePdf = {
  id: 1,
  name: 'Field notes 2021',
  file_name: 'field-notes-2021.pdf',
  mime_type: 'application/pdf',
  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  human_readable_size: '3.15 MB',
};

const meta = {
  title: 'Viewers/PdfViewer',
  component: PdfViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PdfViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    media: samplePdf,
  },
  render: (args) => ({
    components: { PdfViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><PdfViewer v-bind="args" /></div>',
  }),
};

export const WithTranscript: Story = {
  args: {
    media: {
      ...samplePdf,
      transcript: 'Field notes, Kolari valley, July 2021.\n\nDay 1. Arrived in the morning, met with the head of the weaving cooperative.',
    },
  },
  render: (args) => ({
    components: { PdfViewer },
    setup() { return { args }; },
    template: '<div class="h-[600px] flex"><PdfViewer v-bind="args" /></div>',
  }),
};
