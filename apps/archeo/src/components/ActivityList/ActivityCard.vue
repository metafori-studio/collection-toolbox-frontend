<template>
  <RouterLink
    :to="{
      name: 'DetailMap',
      params: { id: item.id },
    }"
    class="
      bg-white w-full text-left rounded-xl border border-neutral-200 p-3 transition-all
      hover:border-neutral-300 hover:shadow-sm
    "
    :class="[focusClasses]"
  >
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-mono text-primary-500">
        {{ item.id }}
      </span>
      <ActivityLevel
        :level="1"
        :label="true"
      />
    </div>
    <div class="flex flex-col gap-px">
      <span class="text-base font-semibold text-neutral-900">
        {{ title }}
      </span>
      <span
        v-if="item.district !== item.municipality"
        class="text-sm text-neutral-500"
      >
        {{ item.district }}
      </span>
      <span class="text-xs text-neutral-400">
        {{ item.position }}
      </span>
    </div>
    <div
      v-if="item.dating_ns?.length"
      class="flex gap-1 flex-wrap pt-2 border-t border-t-neutral-200 mt-2"
    >
      <ActivityChip
        v-for="(chip, i) in item.dating_ns"
        :key="i"
      >
        {{ chip }}
      </ActivityChip>
    </div>
  </RouterLink>
</template>


<script lang="ts" setup>
import { computed } from 'vue';

import ActivityChip from '@/components/ActivityChip.vue';
import ActivityLevel from '@/components/ActivityLevel.vue';

import { focusClasses } from '@metafori/components';

const {
  item,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
}>();

const title = computed(() => {
  if (item.municipality === item.cadastral_area) {
    return item.municipality;
  }
  return `${item.municipality} • ${item.cadastral_area}`;
});

</script>
