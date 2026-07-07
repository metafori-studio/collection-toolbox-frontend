<template>
  <RouterLink
    class="flex flex-col gap-1"
    :to="to"
  >
    <img
      :src="image"
      alt=""
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
const {
  image,
  title,
  author,
  year,
  to = null,
} = defineProps<{
  image: string,
  title: string
  author: string,
  year: string,
  to?: unknown,
}>();

</script>
