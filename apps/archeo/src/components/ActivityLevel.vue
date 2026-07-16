<template>
  <div class="flex items-center gap-1">
    <div
      class="rounded-full"
      :class="{
        // Levels
        'bg-activity-level1': level === 1,
        'bg-activity-level2': level === 2,
        'bg-activity-level3': level === 3,

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
const {
  level,
  label,
} = defineProps<{
  level: 1 | 2 | 3
  label: boolean
}>();

</script>
