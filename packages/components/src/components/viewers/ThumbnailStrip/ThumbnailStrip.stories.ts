import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import ThumbnailStrip from './ThumbnailStrip.vue';
import ThumbnailStripThumb from './ThumbnailStripThumb.vue';

const meta = {
  title: 'Viewers/ThumbnailStrip',
  component: ThumbnailStrip,
  tags: ['autodocs'],
} satisfies Meta<typeof ThumbnailStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { ThumbnailStrip, ThumbnailStripThumb },
    setup() {
      const page = ref(1);
      const thumbnails = [
        'https://picsum.photos/id/10/200/200',
        'https://picsum.photos/id/11/200/200',
        'https://picsum.photos/id/12/200/200',
        'https://picsum.photos/id/13/200/200',
      ];
      return { page, thumbnails };
    },
    template: `
      <div class="h-[500px] border rounded-lg overflow-hidden flex">
        <ThumbnailStrip>
          <ThumbnailStripThumb
            v-for="(src, idx) in thumbnails"
            :key="idx"
            :page="idx + 1"
            :label="'Item ' + (idx + 1)"
            :active="idx + 1 === page"
            @click="page = idx + 1"
          >
            <img :src="src" class="w-full h-full object-cover pointer-events-none select-none" alt="" />
          </ThumbnailStripThumb>
        </ThumbnailStrip>
        <div class="flex-1 p-8 bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
          Page {{ page }} Content
        </div>
      </div>
    `,
  }),
};
export const CustomSlots: Story = {
  render: () => ({
    components: { ThumbnailStrip, ThumbnailStripThumb },
    setup() {
      const activeIdx = ref(1);
      return { activeIdx };
    },
    template: `
      <div class="h-[500px] border rounded-lg overflow-hidden flex">
        <ThumbnailStrip>
          <ThumbnailStripThumb
            v-for="i in 5"
            :key="i"
            :page="i"
            :label="'Item ' + i"
            :active="activeIdx === i"
            @click="activeIdx = i"
          />
        </ThumbnailStrip>
        <div class="flex-1 p-8 bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
          Selected Item: {{ activeIdx }}
        </div>
      </div>
    `,
  }),
};

export const ResponsiveMobileView: Story = {
  render: () => ({
    components: { ThumbnailStrip, ThumbnailStripThumb },
    setup() {
      const page = ref(1);
      const thumbnails = [
        'https://picsum.photos/id/10/200/200',
        'https://picsum.photos/id/11/200/200',
        'https://picsum.photos/id/12/200/200',
        'https://picsum.photos/id/13/200/200',
        'https://picsum.photos/id/14/200/200',
        'https://picsum.photos/id/15/200/200',
      ];
      return { page, thumbnails };
    },
    template: `
      <div class="w-[360px] h-[500px] border rounded-lg overflow-hidden flex flex-col">
        <ThumbnailStrip>
          <ThumbnailStripThumb
            v-for="(src, idx) in thumbnails"
            :key="idx"
            :page="idx + 1"
            :label="'Item ' + (idx + 1)"
            :active="idx + 1 === page"
            @click="page = idx + 1"
          >
            <img :src="src" class="w-full h-full object-cover pointer-events-none select-none" alt="" />
          </ThumbnailStripThumb>
        </ThumbnailStrip>
        <div class="flex-1 p-8 bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
          Page {{ page }} Content
        </div>
      </div>
    `,
  }),
};
