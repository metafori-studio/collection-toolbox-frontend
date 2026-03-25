<template>
  <div
    ref="containerRef"
    class="relative"
  >
    <BaseButton
      :id="id"
      variant="secondary"
      :size="size"
      @click="toggle"
    >
      <slot name="trigger">
        Select
      </slot>
    </BaseButton>
    <div
      v-if="isOpen"
      class="absolute z-10 rounded-lg border border-neutral-300 bg-neutral-0 shadow-lg w-50"
      :class="{
        'mt-1 right-0': direction === 'bottom-left',
        'mt-1 left-0': direction === 'bottom-right',
        'mb-1 right-0 bottom-full': direction === 'top-left',
        'mb-1 left-0 bottom-full': direction === 'top-right',
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseButton from '../BaseButton';

type Direction = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const {
  id = undefined,
  direction = 'bottom-left',
  size = 'regular',
} = defineProps<{
  id?: string
  direction?: Direction
  size?: string
}>();


const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function handleOutsideClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
});

defineExpose({ close, isOpen });
</script>
