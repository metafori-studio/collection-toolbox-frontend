<template>
  <div
    class="bg-backdrop-overlay/55 backdrop-blur-lg p-1 flex items-center gap-1 text-neutral-0"
    :class="{
      'rounded-full w-fit inline-flex': variant === 'pill',
      'rounded-none w-full': variant === 'full',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export type MediaToolbarVariant = 'pill' | 'full';

withDefaults(
  defineProps<{
    variant?: MediaToolbarVariant;
  }>(),
  {
    variant: 'pill',
  },
);
</script>
