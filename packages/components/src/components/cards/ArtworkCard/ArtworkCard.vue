<template>
  <RouterLink
    class="flex flex-col gap-1"
    :to="to"
  >
    <img
      :src="image"
      :style="{
        aspectRatio,
      }"
      class="w-full object-cover"
      :alt="title"
    >
    <div>
      <h2 class="text-title-card mb-1">
        {{ title }}
      </h2>
      <p class="text-label-sm text-text-secondary">
        {{ author }}
      </p>
      <p class="text-label-sm text-text-primary">
        {{ year }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const {
  image,
  imageWidth = undefined,
  imageHeight = undefined,
  title,
  author,
  year,
  to,
} = defineProps<{
  image: string,
  imageWidth?: number,
  imageHeight?: number,
  title: string
  author: string,
  year: string,
  to: RouteLocationRaw,
}>();

const aspectRatio = computed(() => imageWidth && imageHeight
  ? `${imageWidth} / ${imageHeight}`
  : '4 / 3',
);

</script>
