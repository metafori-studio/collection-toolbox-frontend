<template>
  <ThumbnailStrip v-if="images.length > 1">
    <ThumbnailStripThumb
      v-for="(image, index) in images"
      :key="image.id ?? index"
      :page="index + 1"
      :label="thumbnailLabel(image, index)"
      :active="index === currentIndex"
      @click="emit('select-image', index)"
    >
      <slot
        name="thumbnail"
        :image="image"
        :index="index"
      >
        <ImageThumbnail
          :src="image.conversions?.thumbnail"
          :alt="image.name || image.file_name || ''"
        />
      </slot>
    </ThumbnailStripThumb>
  </ThumbnailStrip>
</template>

<script setup lang="ts">
import ThumbnailStrip from '../ThumbnailStrip/ThumbnailStrip.vue';
import ThumbnailStripThumb from '../ThumbnailStrip/ThumbnailStripThumb.vue';
import type { ViewerMediaResource } from '../media';
import ImageThumbnail from './ImageThumbnail.vue';

defineProps<{
  images: ViewerMediaResource[];
  currentIndex: number;
}>();

const emit = defineEmits<{
  (event: 'select-image', index: number): void;
}>();

function thumbnailLabel(image: ViewerMediaResource, index: number) {
  const description = image.name || image.file_name;
  return description ? `${index + 1}. ${description}` : String(index + 1);
}
</script>
