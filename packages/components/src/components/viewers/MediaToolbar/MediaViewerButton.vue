<template>
  <button
    type="button"
    class="
      inline-flex items-center justify-center rounded-full h-9 w-9 bg-transparent
      enabled:hover:bg-neutral-800 enabled:active:bg-neutral-700
    "
    :class="[focusClasses, {
      [disabledClasses]: disabled,
    }]"
    :disabled="disabled"
    :title="title"
    :aria-label="title"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { focusClasses, disabledClasses } from '../../../misc/reusableCss';

const {
  title = undefined,
  disabled = false,
} = defineProps<{
  title?: string
  disabled?: boolean
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>
