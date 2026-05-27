import type { Meta, StoryObj } from '@storybook/vue3-vite';

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';

const TYPOGRAPHY_GROUPS = [
  {
    label: 'Display',
    classes: [
      { name: 'Display 1', className: 'text-display-1' },
      { name: 'Display 2', className: 'text-display-2' },
      { name: 'Display 3', className: 'text-display-3' },
    ],
  },
  {
    label: 'Heading',
    classes: [
      { name: 'Heading 1', className: 'text-heading-1' },
      { name: 'Heading 2', className: 'text-heading-2' },
      { name: 'Heading 3', className: 'text-heading-3' },
      { name: 'Heading 4', className: 'text-heading-4' },
    ],
  },
  {
    label: 'Body',
    classes: [
      { name: 'Body XL', className: 'text-xl' },
      { name: 'Body Large', className: 'text-lg' },
      { name: 'Body Base', className: 'text-base' },
      { name: 'Body Small', className: 'text-sm' },
    ],
  },
  {
    label: 'Semantic',
    classes: [
      { name: 'Label', className: 'text-label' },
      { name: 'Label Small', className: 'text-label-sm' },
      { name: 'List Large', className: 'text-list-lg' },
      { name: 'List Small', className: 'text-list-sm' },
      { name: 'Caption', className: 'text-caption' },
      { name: 'Eyebrow', className: 'text-eyebrow' },
      { name: 'Overline', className: 'text-overline' },
      { name: 'Code', className: 'text-code' },
      { name: 'Data', className: 'text-data' },
      { name: 'Data Label', className: 'text-data-label' },
      { name: 'Title Card', className: 'text-title-card' },
      { name: 'Button Large', className: 'text-button-lg' },
      { name: 'Button Medium', className: 'text-button-md' },
      { name: 'Button Small', className: 'text-button-sm' },
    ],
  },
];

const meta = {
  title: 'Design System/Typography',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {
  render: () => ({
    setup() {
      return { groups: TYPOGRAPHY_GROUPS, sample: SAMPLE_TEXT };
    },
    template: `
      <div class="flex flex-col gap-12">
        <div v-for="group in groups" :key="group.label">
          <h2 class="text-overline uppercase text-neutral-400 mb-4">
            {{ group.label }}
          </h2>
          <div class="flex flex-col">
            <div v-for="item in group.classes" :key="item.className" class="flex flex-col sm:flex-row border-t-1 border-neutral-200 py-4 gap-2">
              <div class="sm:w-[240px] shrink-0 text-neutral-500">
                <p class="mb-1">{{ item.name }}</p>
                <p class="text-01 font-mono border text-neutral-400 border-neutral-300 w-fit px-2 py-0.5 rounded">.{{ item.className }}</p>
              </div>
              <div>
                <span :class="item.className">{{ sample }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
