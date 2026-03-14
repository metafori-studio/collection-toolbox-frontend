<template>
  <ArcheoMap
    class="md:flex-1 md:sticky md:top-14"
    :map-points="[{
      id: detail.id,
      coordinate_x: detail.coordinate_x,
      coordinate_y: detail.coordinate_y,
      localization_degree: detail.localization_degree,
    }]"
    :controls="{
      legend: false,
      zoomIn: true,
      zoomOut: true,
      center: false,
      tileType: true,
      copyCoordinates: true,
      openMaps: true,
    }"
  />
</template>

<script setup lang="ts">
import ArcheoMap, { type MapPoint } from '@/components/ArcheoMap/ArcheoMap.vue';

defineProps<{
  detail: MapPoint
}>();
</script>
