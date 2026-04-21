<template>
  <BaseViewer>
    <div class="flex items-start justify-center bg-neutral-100 p-4">
      <img
        :src="media.url"
        :alt="media.name"
        class="max-w-full object-contain rounded-md shadow-sm"
      >
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import BaseViewer from '../BaseViewer';
import type { MediaItem } from '../types';

defineProps<{
  media: MediaItem;
}>();
</script>
