<template>
  <header
    class="sticky left-0 right-0 top-0 z-30 h-14 bg-white grid items-center gap-3 px-4 py-1 border-b border-b-neutral-200"
    :class="[gridClasses]"
  >
    <div class="flex items-center gap-3">
      <slot name="left" />
    </div>
    <div class="flex items-center justify-center gap-3">
      <slot name="center" />
    </div>
    <div class="flex items-center justify-end gap-3">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
const {
  gridClasses = 'grid-cols-[1fr_150px_1fr]',
} = defineProps<{
  gridClasses?: string
}>();
</script>
