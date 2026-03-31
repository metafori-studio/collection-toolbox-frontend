<template>
  <div>
    <EtnoMap
      :map-points="mapPoints"
      :controls="{
        legend: false,
        zoomIn: true,
        zoomOut: true,
        center: true,
        tileType: false,
        terrain3d: true,
      }"
      :allow-popover="true"
    />
    <BaseButton
      class="fixed z-20 left-4 top-16"
      size="small"
      :variant="filterOpen ? 'secondary' : 'primary'"
      @click="filterOpen = !filterOpen"
    >
      <BaseIcon
        :icon="filterOpen ? 'x' : 'filter'"
      />
      <span v-if="filterOpen">{{ $t('explore.filterClose') }}</span>
      <span v-else>{{ $t('explore.filterOpen') }}</span>
    </BaseButton>
    <FilterWidget
      v-show="filterOpen"
      :aggregations="aggregations"
      @update="filterValues = $event"
    />
    <div class="p-4 flex flex-col lg:flex-row">
      <div
        class="mr-4 transition-all duration-300"
        :style="{
          minWidth: `${filterWidgetWidth}px`,
        }"
      />
      <ItemList
        :items="items"
        :meta="itemsMeta"
        :order-by="orderBy"
        :order-asc="orderAsc"
        :class="{
          'opacity-30': isLoadingItems,
        }"
        @update:order-by="orderBy = $event"
        @update:order-asc="orderAsc = $event"
        @update:page="page = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import {
  BaseButton,
  BaseIcon,
} from '@metafori/components';
import EtnoMap, { type MapPoint } from '@/components/EtnoMap/EtnoMap.vue';
import ItemList from '@/components/ItemList/ItemList.vue';
import FilterWidget from '@/components/Filter/FilterWidget.vue';

import { getMapPoints, getList, getAggregations } from '@/api';
import { filterOpen, filterWidgetWidth } from '@/store';
import { type AggregationOption } from '@/misc/filterTypes';

// State
const isLoadingItems = ref(true);

const mapPoints = ref<MapPoint[]>([]);
const items = ref<Record<string, unknown>[]>([]);
const itemsMeta = ref<Record<string, unknown>>({});

const filterValues = ref<Record<string, string[]>>({});
const aggregations = ref<Record<string, AggregationOption[]>>({});

// View state
const orderBy = ref('id');
const orderAsc = ref(true);
const page = ref(1);

// Loading
const loadMapPoints = async () => {
  try {
    mapPoints.value = await getMapPoints();
  } catch {
    mapPoints.value = [];
  }
};

const loadItems = async () => {
  isLoadingItems.value = true;
  try {
    const response = await getList(filterValues.value, orderBy.value, orderAsc.value, page.value);
    items.value = response.data;
    itemsMeta.value = response.meta as Record<string, unknown>;
  } catch {
    items.value = [];
    itemsMeta.value = {};
  } finally {
    isLoadingItems.value = false;
  }
};

const loadAggregations = async () => {
  try {
    aggregations.value = await getAggregations(filterValues.value) as Record<string, AggregationOption[]>;
  } catch {
    aggregations.value = {};
  }
};

onMounted(() => {
  loadMapPoints();
  loadItems();
  loadAggregations();
});

watch([
  orderBy,
  orderAsc,
  page,
], () => {
  loadItems();
});

watch(filterValues, () => {
  page.value = 1;
  loadAggregations();
  loadItems();
}, {
  deep: true,
});

</script>
