<template>
  <img
    v-if="src && !hasError"
    :key="src"
    ref="imageElement"
    :src="src"
    :alt="alt"
    loading="lazy"
    decoding="async"
    class="h-full w-full object-cover pointer-events-none select-none"
    @error="handleError"
  >
  <div
    v-else
    class="h-full w-full bg-bg-brand pointer-events-none"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
}>(), { src: undefined, alt: '' });

const imageElement = ref<HTMLImageElement | null>(null);
const hasError = ref(false);

function handleError(event: Event) {
  if (event.currentTarget === imageElement.value) hasError.value = true;
}

watch(() => props.src, () => { hasError.value = false; });
</script>
