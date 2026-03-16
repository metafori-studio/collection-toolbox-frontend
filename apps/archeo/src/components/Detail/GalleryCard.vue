<template>
  <RouterLink
    class="bg-white rounded-lg border border-neutral-200 overflow-hidden text-left cursor-pointer hover:border-neutral-300 hover:shadow-sm transition-all"
    :to="to"
  >
    <img
      :src="preview"
      :alt="title"
      class="w-full h-20 object-cover"
    >
    <div class="px-2 py-2">
      <h4 class="text-sm font-semibold text-neutral-900 block">
        {{ title }}
      </h4>
      <p class="text-xs text-neutral-400">
        {{ imageCount }} obrázkov
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  title: string
  imageCount: number
  preview: string
  to: RouteLocationRaw
}>();
</script>
