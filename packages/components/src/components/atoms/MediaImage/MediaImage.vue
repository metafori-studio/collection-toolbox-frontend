<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt"
    class="object-cover"
  >
  <div
    v-else
    class="flex items-center justify-center"
    :class="themeClasses[props.theme]"
  >
    <BaseIcon
      :icon="icon"
      :size="96"
      weight="regular"
    />
  </div>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '../BaseIcon/BaseIcon.vue';

export type MediaImageTheme = 'green' | 'amber' | 'red' | 'purple' | 'neutral';

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string | undefined
  icon?: IconName
  theme?: MediaImageTheme
}>(), {
  src: null,
  alt: '',
  icon: 'stack',
  theme: 'neutral',
});

const themeClasses: Record<MediaImageTheme, string> = {
  green: 'bg-green-50 text-green-800',
  amber: 'bg-amber-50 text-amber-800',
  red: 'bg-red-50 text-red-800',
  purple: 'bg-purple-50 text-purple-800',
  neutral: 'bg-neutral-50 text-neutral-800',
};
</script>
