<template>
  <span
    class="text-xs inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
    :class="themeClasses[theme]"
  >
    <BaseIcon
      :icon="icon"
      :size="16"
    />
    <span>
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
import {
  BaseIcon,
  type IconName,
  type MediaImageTheme,
} from '@metafori/components';

const {
  label,
  icon = 'stack',
  theme = 'neutral',
} = defineProps<{
  label: string
  icon?: IconName
  theme?: MediaImageTheme
}>();

const themeClasses: Record<MediaImageTheme, string> = {
  green: 'border-green-200 bg-green-50 text-green-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  red: 'border-red-200 bg-red-50 text-red-800',
  purple: 'border-purple-200 bg-purple-50 text-purple-800',
  neutral: 'border-neutral-200 bg-neutral-50 text-neutral-800',
};
</script>
