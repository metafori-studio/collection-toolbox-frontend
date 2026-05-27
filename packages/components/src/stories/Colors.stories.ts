import type { Meta, StoryObj } from '@storybook/vue3-vite';

const COLOR_GROUPS = [
  {
    label: 'Primary',
    colors: [
      { name: 'Primary 50', className: 'bg-primary-50', hex: '#E5F0FF' },
      { name: 'Primary 100', className: 'bg-primary-100', hex: '#CDE0FF' },
      { name: 'Primary 200', className: 'bg-primary-200', hex: '#A0C3FF' },
      { name: 'Primary 300', className: 'bg-primary-300', hex: '#74A4FF' },
      { name: 'Primary 400', className: 'bg-primary-400', hex: '#4784FF' },
      { name: 'Primary 500', className: 'bg-primary-500', hex: '#1A62FF' },
      { name: 'Primary 600', className: 'bg-primary-600', hex: '#034AE8' },
      { name: 'Primary 700', className: 'bg-primary-700', hex: '#043CB9' },
      { name: 'Primary 800', className: 'bg-primary-800', hex: '#052E8B' },
      { name: 'Primary 900', className: 'bg-primary-900', hex: '#05205D' },
    ],
  },
  {
    label: 'Neutral',
    colors: [
      { name: 'Neutral 0', className: 'bg-neutral-0', hex: '#FFFFFF' },
      { name: 'Neutral 50', className: 'bg-neutral-50', hex: '#FAFAFA' },
      { name: 'Neutral 100', className: 'bg-neutral-100', hex: '#F3F3F3' },
      { name: 'Neutral 200', className: 'bg-neutral-200', hex: '#E5E5E5' },
      { name: 'Neutral 300', className: 'bg-neutral-300', hex: '#D3D3D3' },
      { name: 'Neutral 400', className: 'bg-neutral-400', hex: '#A1A1A1' },
      { name: 'Neutral 500', className: 'bg-neutral-500', hex: '#6D6D6D' },
      { name: 'Neutral 600', className: 'bg-neutral-600', hex: '#515151' },
      { name: 'Neutral 700', className: 'bg-neutral-700', hex: '#333333' },
      { name: 'Neutral 800', className: 'bg-neutral-800', hex: '#1F1F1F' },
      { name: 'Neutral 900', className: 'bg-neutral-900', hex: '#0E0E0E' },
    ],
  },
  {
    label: 'Status Success',
    colors: [
      { name: 'Success 100', className: 'bg-status-success-100', hex: '#DCFCE7' },
      { name: 'Success 500', className: 'bg-status-success-500', hex: '#22C55E' },
      { name: 'Success 700', className: 'bg-status-success-700', hex: '#15803D' },
    ],
  },
  {
    label: 'Status Warning',
    colors: [
      { name: 'Warning 100', className: 'bg-status-warning-100', hex: '#FEF3C7' },
      { name: 'Warning 500', className: 'bg-status-warning-500', hex: '#F59E0B' },
      { name: 'Warning 700', className: 'bg-status-warning-700', hex: '#B45309' },
    ],
  },
  {
    label: 'Status Error',
    colors: [
      { name: 'Error 100', className: 'bg-status-error-100', hex: '#FEE2E2' },
      { name: 'Error 500', className: 'bg-status-error-500', hex: '#E5484D' },
      { name: 'Error 600', className: 'bg-status-error-600', hex: '#E5272D' },
      { name: 'Error 700', className: 'bg-status-error-700', hex: '#B91C1C' },
    ],
  },
  {
    label: 'Status Info',
    colors: [
      { name: 'Info 100', className: 'bg-status-info-100', hex: '#DBEAFE' },
      { name: 'Info 500', className: 'bg-status-info-500', hex: '#3B82F6' },
      { name: 'Info 700', className: 'bg-status-info-700', hex: '#1D4ED8' },
    ],
  },
];

const meta = {
  title: 'Design System/Colors',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllColors: Story = {
  render: () => ({
    setup() {
      return { groups: COLOR_GROUPS };
    },
    template: `
      <div class="flex flex-col gap-12">
        <div v-for="group in groups" :key="group.label">
          <h2 class="text-overline uppercase text-neutral-400 mb-4">
            {{ group.label }}
          </h2>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="color in group.colors" :key="color.className"
              class="border border-neutral-300 rounded p-2 w-36"
            >
              <div
                class="h-20 mb-2 rounded"
                :class="color.className"
              />
              <p class="font-bold">
                {{ color.name }}
              </p>
              <p class="text-01 font-mono text-neutral-500">
                .{{ color.className }}
              </p>
              <p class="text-01 font-mono text-neutral-400">
                {{ color.hex }}
                </p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
