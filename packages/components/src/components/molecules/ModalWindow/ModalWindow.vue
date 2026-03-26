<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/50" />
      <div class="relative bg-white rounded-lg shadow-lg p-6 md:min-w-[400px]">
        <button
          class="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
          :class="[focusClasses]"
          @click="emit('close')"
        >
          <BaseIcon icon="x" />
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BaseIcon from '../../atoms/BaseIcon';
import { focusClasses } from '../../../misc/reusableCss';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits([
  'close',
]);
</script>
