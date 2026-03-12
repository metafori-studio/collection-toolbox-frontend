<template>
  <button
    class="inline-flex gap-2 items-center justify-center rounded-lg font-bold border"
    :class="[focusClasses, {
      // Sizes
      'h-10 p-2': size === 'regular',
      'h-8 px-2 py-1 text-sm': size === 'small',

      // Variants
      'bg-primary-500 text-neutral-0 border-transparent hover:bg-primary-600 active:bg-primary-700': variant === 'primary',
      'bg-neutral-0 text-neutral-900 border-neutral-300 hover:border-primary-500': variant === 'secondary',

      'bg-status-error text-neutral-0 hover:bg-status-error-600 active:bg-status-700 border-transparent': variant === 'danger-primary',
      'bg-neutral-0 text-status-error hover:bg-status-error-100 active:bg-status-200 border-transparent': variant === 'danger-secondary',

      // Block
      'w-full': block,

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
import { focusClasses, disabledClasses } from '../../../misc/reusableCss';

const {
  size = 'regular',
  variant = 'primary',
  block = false,
  disabled = false,
} = defineProps<{
  size?: 'small' | 'regular'
  variant?: 'primary' | 'secondary' | 'danger-primary' | 'danger-secondary'
  block?: boolean,
  disabled?: boolean,
}>();

defineEmits([
  'click',
]);

</script>
