<template>
  <div class="@container flex-1">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2
          v-if="meta.total"
          class="text-heading-4"
        >
          {{ $t('itemList.totalObjects', { total: meta.total }) }}
        </h2>
        <p
          v-if="meta.from && meta.to"
          class="text-xs text-neutral-500"
        >
          {{ $t('itemList.showing', { from: meta.from, to: meta.to }) }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <label for="orderBy">
          {{ $t('itemList.sortBy') }}
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
    <ItemCardList
      :items="items"
    />
    <ItemListPagination
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
import ItemCardList from './ItemCardList.vue';
import ItemListPagination from './ItemListPagination.vue';

const { t } = useI18n();

const {
  items = [],
  meta = {},
  orderBy = 'id',
  orderAsc = true,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  meta?: {
    total?: number;
    from?: number;
    to?: number;
    current_page?: number;
    last_page?: number;
    [key: string]: unknown;
  },
  orderBy?: string;
  orderAsc?: boolean;
}>();

const emit = defineEmits(['update:orderBy', 'update:orderAsc', 'update:page']);

const orderByOptions = computed(() => [
  { label: t('itemList.sortOptions.id'), value: 'id' },
  { label: t('itemList.sortOptions.title'), value: 'title' },
  { label: t('itemList.sortOptions.timePeriod'), value: 'time_period_start' },
]);

</script>
