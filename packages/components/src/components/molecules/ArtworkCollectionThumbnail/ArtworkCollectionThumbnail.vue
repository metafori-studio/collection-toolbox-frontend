<template>
  <img
    :src="src"
    :alt="title"
    class="object-cover rounded-lg"
  >
</template>

<script lang="ts" setup>
const {
  src,
  title,
} = defineProps<{
  src: string
  title: string
}>();
</script>
