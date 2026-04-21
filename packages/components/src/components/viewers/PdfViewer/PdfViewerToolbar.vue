<template>
  <div class="relative bg-white border-b border-neutral-200 px-4 py-2 flex items-center justify-end">
    <!-- Zoom Controls -->
    <div class="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
      <BaseButton
        variant="secondary"
        size="small"
        @click="zoom?.zoomOut()"
      >
        <BaseIcon icon="zoomOut" />
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
        @click="zoom?.zoomIn()"
      >
        <BaseIcon icon="zoomIn" />
      </BaseButton>
    </div>

    <!-- Page Navigation -->
    <div class="flex items-center gap-2">
      <BaseButton
        variant="secondary"
        size="small"
        :disabled="!scrollState.totalPages || scrollState.currentPage <= 1"
        @click="scroll?.scrollToPreviousPage()"
      >
        <BaseIcon icon="caretLeft" />
      </BaseButton>

      <span class="text-sm text-neutral-500 min-w-16 text-center">
        {{ scrollState.currentPage }} / {{ scrollState.totalPages }}
      </span>

      <BaseButton
        variant="secondary"
        size="small"
        :disabled="!scrollState.totalPages || scrollState.currentPage >= scrollState.totalPages"
        @click="scroll?.scrollToNextPage()"
      >
        <BaseIcon icon="caretRight" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from '@embedpdf/plugin-scroll/vue';
import { useZoom } from '@embedpdf/plugin-zoom/vue';

import BaseButton from '../../atoms/BaseButton';
import BaseIcon from '../../atoms/BaseIcon';

const props = defineProps<{
  documentId: string;
}>();

const { provides: scroll, state: scrollState } = useScroll(() => props.documentId);
const { provides: zoom } = useZoom(() => props.documentId);
</script>
