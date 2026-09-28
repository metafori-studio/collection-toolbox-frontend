<template>
  <div class="flex gap-2">
    <img
      v-for="(image, i) in images"
      :key="i"
      :src="image"
      :alt="t('collectionImageGrid.imageAlt', { title, index: i + 1 })"
      class="flex-1 min-w-0 h-full object-cover rounded-lg hover:flex-2 transition-all duration-500"
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
