<template>
  <BaseViewer>
    <div class="p-4 flex flex-col gap-6">
      <BaseButton
        class="self-start"
        @click="$router.back()"
      >
        <BaseIcon icon="arrowLeft" />
        {{ $t('gallery.back') }}
      </BaseButton>
      <div
        v-for="gallery in galleries"
        :key="gallery.id"
        class="flex flex-col gap-4"
      >
        <h2 class="text-heading-4">
          {{ gallery.title }} ({{ gallery.images.length }})
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <img
            v-for="image in gallery.images"
            :key="image.id"
            :src="image.conversions.thumb"
            :alt="image.name"
            class="w-full aspect-square border border-neutral-200 object-cover rounded-lg"
          >
        </div>
      </div>
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import { BaseButton, BaseIcon, BaseViewer } from '@metafori/components';

const {
  galleries,
} = defineProps<{
  galleries: {
    id: number
    title: string
    images: {
      id: number
      name: string
      file_name: string
      human_readable_size: string
      mime_type: string
      url: string
      conversions: { thumb: string }
    }[]
  }[]
}>();
</script>
