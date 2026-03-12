import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import FilterSection from './FilterSection.vue';
import FilterItem from '../FilterItem';
import { icons } from '../../atoms/BaseIcon/BaseIcon.vue';

const meta = {
  title: 'Molecules/FilterSection',
  component: FilterSection,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'select', options: Object.keys(icons) },
  },
} satisfies Meta<typeof FilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Category',
    icon: 'stack',
  },
  render: (args) => ({
    components: { FilterSection, FilterItem },
    setup() {
      const a = ref(false);
      const b = ref(false);
      const c = ref(false);
      return { args, a, b, c };
    },
    template: `
      <FilterSection v-bind="args">
        <FilterItem label="Option A" :selected-count="12" />
        <FilterItem label="Option B" :selected-count="5" />
        <FilterItem label="Option C" :selected-count="8" />
      </FilterSection>
    `,
  }),
};
