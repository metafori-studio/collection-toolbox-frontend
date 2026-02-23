<template>
  <p class="p-2 border rounded w-fit">
    <span
      v-for="i in count"
      :key="i"
    >
      {{ char }}
    </span>
  </p>
</template>

<script setup lang="ts">
defineProps<{
  char: string
  count: number
}>();
</script>
