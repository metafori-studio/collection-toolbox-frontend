<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 mt-4"
    :aria-label="$t('pagination.label')"
  >
    <BaseButton
      variant="secondary"
      :disabled="modelValue === 1"
      :aria-label="$t('pagination.previousPage')"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      <BaseIcon icon="arrowLeft" />
    </BaseButton>
    <span class="rounded bg-neutral-100 px-4 h-10 flex items-center rounded-lg text-body-2 border border-neutral-300">
      {{ modelValue }} / {{ totalPages }}
    </span>
    <BaseButton
      variant="secondary"
      :disabled="modelValue === totalPages"
      :aria-label="$t('pagination.nextPage')"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      <BaseIcon icon="arrowRight" />
    </BaseButton>
  </nav>
</template>

<script lang="ts" setup>
import {
  BaseButton,
  BaseIcon,
} from '@metafori/components';

defineProps<{
  modelValue: number;
  totalPages: number;
}>();

defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>
