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
      <span v-if="filterOpen">Zavrieť filter</span>
      <span v-else>Filter</span>
    </BaseButton>
    <FilterWidget
      v-if="filterOpen"
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import {
  BaseButton,
  BaseIcon,
} from '@metafori/components';
import EtnoMap, { type MapPoint } from '@/components/EtnoMap/EtnoMap.vue';
import ItemList from '@/components/ItemList/ItemList.vue';
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
