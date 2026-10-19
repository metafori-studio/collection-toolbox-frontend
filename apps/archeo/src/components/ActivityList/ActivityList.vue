<template>
  <div class="@container flex-1">
    <div class="flex items-center justify-between mb-4">
      <h2
        v-if="meta.total !== undefined && meta.total !== null"
        class="text-heading-4"
      >
        {{ $t('activityList.count', meta.total) }}
      </h2>
      <div class="flex items-center gap-2">
        <label for="orderBy">
          {{ $t('activityList.sortBy') }}
        </label>
        <InputSelect
          id="orderBy"
          :model-value="orderBy"
          :options="orderByOptions"
          @update:model-value="emit('update:orderBy', $event)"
        />
        <BaseButton
          variant="secondary"
          @click="emit('update:orderAsc', !orderAsc)"
        >
          <BaseIcon
            :icon="orderAsc ? 'arrowUp' : 'arrowDown'"
          />
        </BaseButton>
      </div>
    </div>
    <ActivityCardList
      :items="items"
      class="@3xl:hidden"
    />
    <ActivityTable
      :items="items"
      class="hidden @3xl:block"
    />
    <ActivityListPagination
      :model-value="meta.current_page ?? 1"
      :total-pages="meta.last_page ?? 1"
      @update:model-value="emit('update:page', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  BaseButton,
  InputSelect,
  BaseIcon,
} from '@metafori/components';
import ActivityTable from './ActivityTable.vue';
import ActivityCardList from './ActivityCardList.vue';
import ActivityListPagination from './ActivityListPagination.vue';
import type { ListMeta } from '@/api';

const { t } = useI18n();

const {
  items = [],
  meta = {},
  orderBy = 'municipality',
  orderAsc = true,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  meta?: ListMeta;
  orderBy?: string;
  orderAsc?: boolean;
}>();

const emit = defineEmits(['update:orderBy', 'update:orderAsc', 'update:page']);

const orderByOptions = computed(() => [
  { label: t('activityList.orderByOptions.municipality'), value: 'municipality' },
  { label: t('activityList.orderByOptions.id'), value: 'id' },
  { label: t('activityList.orderByOptions.cadastralArea'), value: 'cadastral_area' },
  { label: t('activityList.orderByOptions.district'), value: 'district' },
  { label: t('activityList.orderByOptions.position'), value: 'position' },
]);

</script>
