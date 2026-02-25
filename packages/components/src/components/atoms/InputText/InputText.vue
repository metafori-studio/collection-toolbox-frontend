<template>
  <div class="relative">
    <input
      v-model="model"
      type="text"
      class="w-full rounded-lg bg-neutral-0 border border-neutral-300 px-3 py-2 pr-7 text-sm"
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
import { focusClasses, disabledClasses } from '@/misc/reusableCss';

import BaseIcon, { type IconName } from '@/components/atoms/BaseIcon';

const {
  icon = null,
  disabled = false,
  placeholder = '',
  hasError = false,
} = defineProps<{
  icon?: IconName
  disabled?: boolean
  placeholder?: string,
  hasError?: boolean,
}>();

const model = defineModel<string>();

const useClearing = () => {
  const isClearable = computed<boolean>(() => !!model.value);
  const clear = () => {
    model.value = '';
  };
  return { isClearable, clear };
};

const { isClearable, clear } = useClearing();

</script>
