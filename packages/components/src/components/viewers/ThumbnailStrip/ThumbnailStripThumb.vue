<template>
  <button
    v-scroll-into-view="active"
    type="button"
    class="
      relative h-16 w-16 shrink-0 scroll-m-2 cursor-pointer rounded-sm overflow-hidden
      focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500

    "
    :aria-label="label"
    :aria-current="active ? 'true' : undefined"
    @click="emit('click', $event)"
  >
    <slot />

    <div
      v-if="active"
      class="absolute z-10 inset-0 rounded-sm border-2 border-primary-500"
    />

    <div
      class="
        absolute bottom-0.5 right-0.5 z-10 py-0.5 px-1 select-none bg-black/60 text-white
        font-data text-data-label leading-none
      "
    >
      {{ page }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { vScrollIntoView } from '../../../misc/scrollIntoView';

const {
  page,
  label,
  active = false,
} = defineProps<{
  page: number | string
  label: string
  active?: boolean
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>
