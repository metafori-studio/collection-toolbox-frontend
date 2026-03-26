<template>
  <RouterLink
    class="flex font-normal w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-100"
    :class="{
      'border-b border-neutral-200': !isLast,
    }"
    :to="{
      name: 'Detail',
      params: { id: item.id },
    }"
  >
    <div
      v-if="item.image"
      class="shrink-0"
    >
      <img
        :src="item.image"
        :alt="item.title"
        class="rounded-md h-24 w-24"
      >
    </div>
    <div class="flex-1 flex flex-col gap-0.5">
      <p class="text-sm font-medium">
        {{ item.title }}
      </p>
      <div>
        <MediaTypeChip
          v-if="item.type"
          icon="stack"
          :label="item.type"
        />
      </div>
      <div
        v-if="item.location_note || item.year"
        class="text-xs font-regular text-neutral-500"
      >
        {{ [item.location_note, item.year]
          .filter(Boolean).join(', ') }}
      </div>
      <div class="text-xs font-regular text-neutral-500">
        {{ authorsReadable }}
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import MediaTypeChip from '@/components/MediaTypeChip.vue';
import { toNameReadable } from '@/misc/toNameReadable';

const {
  item,
  isLast,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
  isLast: boolean
}>();

const authorsReadable = computed(() => toNameReadable(item.authors));

</script>
