<template>
  <p>
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
}>()
</script>
