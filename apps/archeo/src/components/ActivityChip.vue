<template>
  <span
    class="text-xs font-medium px-2 py-0.5 rounded"
    :style="colorStyle"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const colorStyles = {
  'blue': 'background-color: rgb(204, 225, 255); color: rgb(38, 38, 38);',
  'green': 'background-color: rgb(220, 252, 231); color: rgb(1, 102, 48);',
  'red': 'background-color: rgb(255, 226, 226); color: rgb(193, 0, 7);',
  'gray': 'background-color: rgb(243, 244, 246); color: rgb(82, 82, 82);',
};

const {
  color = 'gray',
} = defineProps<{
  color?: 'blue' | 'green' | 'red' | 'gray'
}>();

const colorStyle = computed(() => colorStyles[color]);

</script>
