<template>
  <button
    class="
      inline-flex gap-1 items-center w-fit text-xs
      bg-primary-100 text-primary-600 rounded-full px-2 py-1 cursor-pointer
      hover:bg-primary-500 hover:text-primary-100
    "
    :class="[focusClasses, {
      'bg-primary-200': dark
    }]"
    @click="$emit('clear')"
  >
    {{ label }}
    <BaseIcon
      icon="x"
      :size="16"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { focusClasses } from '@/misc/reusableCss';

import BaseIcon from '@/components/atoms/BaseIcon';

const {
  count,
  dark = false,
} = defineProps<{
  count: number
  dark?: boolean
}>();

const label = computed(() => {
  return `${count} selected`;
});

defineEmits([
  'clear',
]);
</script>
