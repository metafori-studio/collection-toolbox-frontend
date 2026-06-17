<template>
  <div class="flex items-center gap-1">
    <div
      class="rounded-full"
      :class="{
        // Levels
        'bg-status-success-500': level === 1,
        'bg-status-warning-500': level === 2,
        'bg-status-error-500': level === 3,

        // Sizes
        'size-2': label,
        'size-2.5': !label,
      }"
      :title="$t('activityLevel.localizationTitle', { level })"
    />
    <span
      class="text-xs text-neutral-500 font-mono"
      :class="{
        'sr-only': !label
      }"
    >
      {{ $t(`activityLevel.${String(level)}`) }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  level: 1 | 2 | 3
  label: boolean
}>();
</script>
