<template>
  <BaseButton
    variant="media"
    class="h-auto"
    rounded="full"
    :disabled="disabled"
    :title="title"
    :aria-label="title"
    @click="emit('click', $event)"
  >
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '../../atoms/BaseButton';

withDefaults(
  defineProps<{
    title?: string;
    disabled?: boolean;
  }>(),
  {
    title: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>
