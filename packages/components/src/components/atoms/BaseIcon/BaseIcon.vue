<template>
  <component
    :is="icons[icon] ?? icons.placeholder"
    :size="size"
    :weight="weight"
    color="currentColor"
  />
</template>

<script lang="ts">
import {
  PhCrosshair,
  PhX,
  PhInfo,
  PhStack,
  PhCaretRight,
  PhSquare,
  PhCheckSquare,
  PhMagnifyingGlass,
} from '@phosphor-icons/vue';

export const icons = {
  placeholder: PhCrosshair,
  x: PhX,
  info: PhInfo,
  stack: PhStack,
  caretRight: PhCaretRight,
  square: PhSquare,
  checkSquare: PhCheckSquare,
  magnifyingGlass: PhMagnifyingGlass,
};

export type IconName = keyof typeof icons;
</script>

<script setup lang="ts">
const {
  icon = 'placeholder',
  size = 24,
  weight = 'light',
} = defineProps<{
  icon?: IconName
  size?: 16 | 20 | 24 | 32
  weight?: 'light' | 'fill'
}>();

</script>
