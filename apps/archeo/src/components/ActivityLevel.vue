<template>
  <div class="flex items-center gap-1">
    <div
      class="rounded-full"
      :class="{
        // Levels
        'bg-status-success': level === 1,
        'bg-status-warning': level === 2,
        'bg-status-error': level === 3,

        // Sizes
        'size-2': label,
        'size-2.5': !label,
      }"
      :title="`Stupeň lokalizácie - ${level}`"
    />
    <span
      v-if="label"
      class="text-xs text-neutral-500 font-mono"
    >
      {{ levelNames[level] }}
    </span>
  </div>
</template>

<script setup lang="ts">
const levelNames = {
  1: 'presná',
  2: 'orientačná',
  3: 'neurčená',
};

defineProps<{
  level: 1 | 2 | 3
  label: boolean
}>();
</script>
