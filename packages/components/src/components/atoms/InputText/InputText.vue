<template>
  <div class="relative">
    <input
      :id="id"
      v-model="model"
      :type="type"
      class="w-full rounded-lg bg-neutral-0 border border-neutral-300 px-3 py-2 pr-7 text-label"
      :class="[focusClasses, {
        // Disabled
        [disabledClasses]: disabled,
        'hover:border-primary-500': !disabled,

        // Error
        'border-status-error': hasError,

        // Icon padding
        'pl-8': icon,
      }]"
      :disabled="disabled"
      :placeholder="placeholder"
      @change="$emit('change', model)"
    >
    <button
      v-if="isClearable"
      class="absolute p-2 right-1 top-1 cursor-pointer rounded-full hover:bg-neutral-200"
      aria-label="Clear this value"
      @click="clear()"
    >
      <BaseIcon
        icon="x"
        :size="16"
      />
    </button>
    <BaseIcon
      v-if="icon"
      :icon="icon"
      :size="24"
      class="absolute left-1.5 top-1.75"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { focusClasses, disabledClasses } from '../../../misc/reusableCss';

import BaseIcon, { type IconName } from '../BaseIcon';

const {
  id = undefined,
  icon = null,
  disabled = false,
  placeholder = '',
  hasError = false,
  type = 'text',
} = defineProps<{
  id?: string
  icon?: IconName
  disabled?: boolean
  placeholder?: string
  hasError?: boolean
  type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url'
}>();

const model = defineModel<string|number>();

const useClearing = () => {
  const isClearable = computed<boolean>(() => !!model.value);
  const clear = () => {
    model.value = '';
  };
  return { isClearable, clear };
};

const { isClearable, clear } = useClearing();

defineEmits([
  'update:model-value',
  'change',
]);

</script>
