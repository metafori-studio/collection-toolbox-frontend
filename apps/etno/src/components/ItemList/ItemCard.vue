<template>
  <RouterLink
    :to="{
      name: 'Detail',
      params: { id: item.id },
    }"
    class="
      bg-white w-full text-left rounded-xl border border-neutral-200 p-3 transition-all
      flex flex-col gap-2
      hover:border-neutral-300 hover:shadow-sm
    "
    :class="[focusClasses]"
  >
    <span class="font-mono text-xs text-primary-500">
      {{ item.id }}
    </span>
    <MediaImage
      class="aspect-4/3 rounded-lg"
      :src="item.first_media?.conversions?.thumbnail"
      :alt="item.title"
      :icon="icon"
      :theme="theme"
    />
    <div class="flex items-center justify-between gap-2 mb-2">
      <MediaTypeChip
        v-if="item.type"
        :icon="icon"
        :theme="theme"
        :label="translateEnum('ItemType', item.type) || item.type"
      />

      <div class="flex items-center gap-2 text-neutral-500 text-xs">
        <div
          v-if="item.document_id"
          class="flex items-center gap-1"
        >
          <BaseIcon
            icon="document"
            :size="16"
          />
          {{ item.document_id }}
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-wrap gap-x-1 text-xs text-neutral-500">
        {{ item.locality?.name }}
        <span
          v-if="item.locality?.name && yearRange"
          aria-hidden
        >·</span>
        {{ yearRange }}
      </div>
      <h3 class="text-base font-semibold">
        {{ item.title }}
      </h3>
      <div
        v-if="authorsReadable"
        class="text-xs text-neutral-500"
      >
        {{ $t('itemCard.authorship') }}
        <span>{{ authorsReadable }}</span>
      </div>
      <div
        v-if="researchersReadable"
        class="text-xs text-neutral-500"
      >
        {{ $t('itemCard.research') }}
        <span>{{ researchersReadable }}</span>
      </div>
      <div
        v-if="originatorsReadable"
        class="text-xs text-neutral-500"
      >
        {{ $t('itemCard.origin') }}
        <span>{{ originatorsReadable }}</span>
      </div>
    </div>
  </RouterLink>
</template>


<script lang="ts" setup>
import { computed } from 'vue';
import { useTranslateEnum } from '@/composables/useTranslateEnum';

import { BaseIcon, focusClasses, MediaImage } from '@metafori/components';
import { getIconForMediaType, getThemeForMediaType } from '@/misc/mediaTypeHelpers';
import MediaTypeChip from '@/components/MediaTypeChip.vue';

import { toNameReadable } from '@/misc/toNameReadable';
import { toYearRange } from '@/misc/toYearRange';

const {
  item,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
}>();

const { translateEnum } = useTranslateEnum();

const authorsReadable = computed(() => toNameReadable(item.authors));
const researchersReadable = computed(() => toNameReadable(item.researchers));
const originatorsReadable = computed(() => toNameReadable(item.originators));
const yearRange = computed(() => toYearRange(item.time_period_start, item.time_period_end));
const icon = computed(() => getIconForMediaType(item.media_type));
const theme = computed(() => getThemeForMediaType(item.media_type));
</script>
