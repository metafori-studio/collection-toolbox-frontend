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
    />
    <div class="p-4 flex flex-col lg:flex-row">
      <div
        v-if="filterWidgetWidth"
        class="mr-4 transition-all duration-300"
        :style="{
          minWidth: `${filterWidgetWidth}px`,
        }"
      />
      <ActivityList
        :items="items"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ArcheoMap, { type MapPoint } from '@/components/ArcheoMap/ArcheoMap.vue';
import ActivityList from '@/components/ActivityList/ActivityList.vue';
import FilterWidget from '@/components/Filter/FilterWidget.vue';

import { getMapPoints, getList } from '@/api';
import { filterOpen, filterWidgetWidth } from '@/store';

const mapPoints = ref<MapPoint[]>([]);
const items = ref<Record<string, unknown>[]>([]);

onMounted(async() => {
  mapPoints.value = await getMapPoints();
  items.value = await getList();
});

</script>
