<template>
  <button
    class="inline-flex gap-2 items-center rounded-lg font-bold"
    :class="[focusClasses, {
      // Sizes
      'h-10 p-2': size === 'regular',
      'h-8 px-2 py-1 text-sm': size === 'small',

      // Variants
      'bg-primary-500 text-neutral-0 hover:bg-primary-600 active:bg-primary-700': variant === 'primary',
      'bg-neutral-0 text-primary-500 hover:bg-primary-100 active:bg-primary-200': variant === 'secondary',

      // Disabled
      [disabledClasses]: disabled,
      'cursor-pointer': !disabled,
    }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { focusClasses, disabledClasses } from '@/misc/reusableCss';

const {
  size = 'regular',
  variant = 'primary',
  disabled = false,
} = defineProps<{
  size?: 'small' | 'regular'
  variant?: 'primary' | 'secondary'
  disabled?: boolean,
}>();

defineEmits([
  'click',
]);

</script>
