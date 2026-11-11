<template>
  <div>
    <ArcheoMap
      :map-points="mapPoints"
      :controls="{
        legend: true,
        zoomIn: true,
        zoomOut: true,
        center: true,
        tileType: true,
      }"
      :allow-popover="true"
    />
    <FilterWidget
      v-if="filterOpen"
      :aggregations="aggregations"
    />
    <div class="p-4 flex flex-col lg:flex-row">
      <div
        class="mr-4 transition-all duration-300"
        :style="{
          minWidth: `${filterWidgetWidth}px`,
        }"
      />
      <ActivityList
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
import ArcheoMap, { type MapPoint } from '@/components/ArcheoMap/ArcheoMap.vue';
import ActivityList from '@/components/ActivityList/ActivityList.vue';
import FilterWidget from '@/components/Filter/FilterWidget.vue';

import { getMapPoints, getList, getAggregations, type ListMeta } from '@/api';
import { filterOpen, filterWidgetWidth, filterValues } from '@/store';
import { type AggregationOption } from '@/misc/filterTypes';

const isLoadingItems = ref(true);

const mapPoints = ref<MapPoint[]>([]);
const items = ref<Record<string, unknown>[]>([]);
const itemsMeta = ref<ListMeta>({});

const aggregations = ref<Record<string, AggregationOption[]>>({});

const orderBy = ref('municipality');
const orderAsc = ref(true);
const page = ref(1);

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
    itemsMeta.value = response.meta;
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

watch([orderBy, orderAsc], () => {
  // Resetting the page triggers the page watcher, which reloads items
  if (page.value !== 1) {
    page.value = 1;
    return;
  }
  loadItems();
});

watch(page, () => {
  loadItems();
});

watch(filterValues, () => {
  loadAggregations();
  // Resetting the page triggers the page watcher, which reloads items
  if (page.value !== 1) {
    page.value = 1;
    return;
  }
  loadItems();
}, {
  deep: true,
});

</script>
