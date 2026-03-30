<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/50" />
      <div
        class="relative bg-white rounded-lg shadow-lg p-6 w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto md:min-w-[400px] md:max-w-[600px] md:w-auto"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <button
          v-if="allowClose"
          class="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
          :class="[focusClasses]"
          aria-label="Close window"
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

const {
  isOpen,
  allowClose = true,
  title = '',
} = defineProps<{
  isOpen: boolean;
  allowClose?: boolean;
  title?: string;
}>();

const emit = defineEmits([
  'close',
]);
</script>
