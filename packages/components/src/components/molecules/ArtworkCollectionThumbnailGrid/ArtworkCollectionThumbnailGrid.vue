<template>
  <div class="grid grid-cols-8 grid-rows-4 gap-2">
    <img
      v-for="(image, i) in images.slice(0, 8)"
      :key="i"
      :src="image"
      :alt="t('collectionThumbnailGrid.imageAlt', { title, index: i + 1 })"
      class="w-full h-full min-h-0 object-cover rounded-lg"
      :class="{
        'col-span-4 row-span-4': i === 0,
        'col-span-2 row-span-2': i > 0 && i < 4,
        'col-span-1 row-span-1': i > 4,
      }"
    >
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const {
  images,
  title,
} = defineProps<{
  images: string[]
  title: string
}>();

const { t } = useI18n();
</script>
