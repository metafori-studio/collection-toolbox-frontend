<template>
  <div class="p-4 flex flex-col gap-6">
    <BaseButton
      class="self-start"
      @click="$router.back()"
    >
      <BaseIcon icon="arrowLeft" />
      Naspäť
    </BaseButton>
    <div
      v-for="(gallery, i) in galleries"
      :key="i"
      class="flex flex-col gap-4"
    >
      <h2 class="text-heading-4">
        {{ gallery.title }} ({{ gallery.images.length }})
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <img
          v-for="(image, j) in gallery.images"
          :key="j"
          :src="image.thumbnail"
          :alt="image.title"
          class="w-full aspect-square border border-neutral-200 object-cover rounded-lg"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseButton, BaseIcon } from '@metafori/components';

const {
  galleries,
} = defineProps<{
  galleries: {
    title: string
    images: { title: string; thumbnail: string; full: string }[]
  }[]
}>();
</script>
