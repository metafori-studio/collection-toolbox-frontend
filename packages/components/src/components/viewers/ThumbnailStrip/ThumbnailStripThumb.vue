<template>
  <button
    v-scroll-into-view="active"
    type="button"
    class="relative h-16 w-16 shrink-0 cursor-pointer focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
    :aria-label="label"
    :aria-current="active ? 'true' : undefined"
    @click="emit('click', $event)"
  >
    <div
      class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm border-2 bg-white"
      :class="[
        active
          ? 'border-primary-500'
          : 'border-transparent',
      ]"
    >
      <slot />

      <div
        class="absolute bottom-0 right-0 z-10 flex h-4 min-w-4 select-none items-center justify-center bg-black/60 px-1 text-xs font-semibold leading-none text-white"
      >
        {{ page }}
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Directive } from 'vue';

withDefaults(
  defineProps<{
    page: number | string;
    label: string;
    active?: boolean;
  }>(),
  {
    active: false,
  },
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const vScrollIntoView: Directive<HTMLElement, boolean> = {
  mounted(el, binding) {
    if (binding.value) {
      el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  },
  updated(el, binding) {
    if (binding.value && !binding.oldValue) {
      el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  },
};
</script>
