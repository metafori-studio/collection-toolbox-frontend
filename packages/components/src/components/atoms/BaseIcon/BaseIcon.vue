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
  PhCaretLeft,
  PhCaretDown,
  PhSquare,
  PhCheckSquare,
  PhMagnifyingGlass,
  PhCircle,
  PhRadioButton,
  PhArrowUp,
  PhArrowDown,
  PhArrowLeft,
  PhArrowRight,
  PhMinus,
  PhPlus,
  PhGpsFix,
  PhUser,
  PhFaders,
  PhMapPin,
  PhCity,
  PhFileText,
  PhSidebar,
  PhTag,
  PhFolder,
  PhSignIn,
  PhUserPlus,
} from '@phosphor-icons/vue';

export const icons = {
  placeholder: PhCrosshair,
  x: PhX,
  info: PhInfo,
  stack: PhStack,
  caretRight: PhCaretRight,
  caretLeft: PhCaretLeft,
  caretDown: PhCaretDown,
  square: PhSquare,
  checkSquare: PhCheckSquare,
  circle: PhCircle,
  radioButton: PhRadioButton,
  magnifyingGlass: PhMagnifyingGlass,
  arrowUp: PhArrowUp,
  arrowDown: PhArrowDown,
  arrowLeft: PhArrowLeft,
  arrowRight: PhArrowRight,
  minus: PhMinus,
  plus: PhPlus,
  gpsFix: PhGpsFix,
  user: PhUser,
  filter: PhFaders,
  mapPin: PhMapPin,
  city: PhCity,
  document: PhFileText,
  sidebar: PhSidebar,
  tag: PhTag,
  folder: PhFolder,
  signIn: PhSignIn,
  userPlus: PhUserPlus,
};

export type IconName = keyof typeof icons;
</script>

<script setup lang="ts">
const {
  icon = 'placeholder',
  size = 24,
  weight = 'regular',
} = defineProps<{
  icon?: IconName
  size?: 16 | 20 | 24 | 32
  weight?: 'regular' | 'fill'
}>();

</script>
