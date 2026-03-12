<template>
  <div class="relative">
    <select
      :id="id"
      v-model="model"
      class="w-full appearance-none rounded-lg bg-neutral-0 border border-neutral-300 px-3 py-2 pr-8 text-label"
      :class="[focusClasses, {
        // Disabled
        [disabledClasses]: disabled,
        'hover:border-primary-500': !disabled,

        // Error
        'border-status-error': hasError,

        // Placeholder (no value selected)
        'text-neutral-400': !model,
      }]"
      :disabled="disabled"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <BaseIcon
      icon="caretDown"
      :size="16"
      class="absolute right-2.5 top-3 pointer-events-none text-neutral-500"
    />
  </div>
</template>

<script setup lang="ts">
import { focusClasses, disabledClasses } from '../../../misc/reusableCss';
import BaseIcon from '../BaseIcon';

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
};

const {
  options,
  id = undefined,
  disabled = false,
  hasError = false,
} = defineProps<{
  options: SelectOption[]
  id?: string
  disabled?: boolean
  hasError?: boolean
}>();

const model = defineModel<string>();
</script>
