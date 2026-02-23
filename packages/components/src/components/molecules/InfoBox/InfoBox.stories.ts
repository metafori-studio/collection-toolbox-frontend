import type { Meta, StoryObj } from '@storybook/vue3-vite';

import InfoBox from './InfoBox.vue';
import BaseButton from '@/components/atoms/BaseButton';

const meta = {
  title: 'Molecules/InfoBox',
  component: InfoBox,
  tags: ['autodocs'],
} satisfies Meta<typeof InfoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { InfoBox },
    template: '<InfoBox>This is an informational message</InfoBox>',
  }),
};

export const WithButton: Story = {
  render: () => ({
    components: { InfoBox, BaseButton },
    template: `
      <InfoBox>
        Some items require your attention
        <template #actions>
          <BaseButton size="small">Dismiss</BaseButton>
        </template>
      </InfoBox>
    `,
  }),
};
