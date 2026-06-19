<template>
  <BaseViewer>
    <ArcheoMap
      class="md:flex-1 md:sticky md:top-14"
      :map-points="[{
        id: detail.id,
        latitude: detail.gcs_coordinates.latitude,
        longitude: detail.gcs_coordinates.longitude,
        localization_degree: detail.gcs_coordinates.localization_degree,
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
  </BaseViewer>
</template>

<script setup lang="ts">
import { BaseViewer } from '@metafori/components';

import ArcheoMap from '@/components/ArcheoMap/ArcheoMap.vue';

defineProps<{
  detail: {
    id: string
    gcs_coordinates: {
      latitude: number
      longitude: number
      localization_degree: number
    }
  }
}>();
</script>
