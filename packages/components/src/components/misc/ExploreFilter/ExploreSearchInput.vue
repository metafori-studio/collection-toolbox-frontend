<template>
  <div class="relative">
    <BaseIcon
      icon="magnifyingGlass"
      :size="48"
      class="absolute left-0 top-2"
    />
    <input
      v-model="model"
      type="text"
      class="w-full text-current text-display-3 border-b-2 placeholder:text-current pl-16 py-1"
      :class="[ focusClasses ]"
      placeholder="Hľadaj v katalógu"
    >
  </div>
</template>

<script setup lang="ts">
import {
  BaseIcon,
  focusClasses,
} from '@metafori/components';

const model = defineModel<string>();

defineEmits([
  'update:model-value',
  'change',
]);

</script>
