<template>
  <div
    ref="target"
    class="flex h-full w-full items-center justify-center"
  >
    <PdfCanvas
      v-if="isVisible"
      class="block max-h-full max-w-full shadow-sm"
      :document="document"
      :page-number="pageNumber"
      :fit-size="60"
      :label="label"
      @render-error="emit('render-error', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import PdfCanvas from './PdfCanvas.vue';

const props = defineProps<{
  document?: PDFDocumentProxy | null;
  pageNumber: number;
  label: string;
  active?: boolean;
}>();
const emit = defineEmits<{ (event: 'render-error', error: unknown): void }>();
const target = ref<HTMLElement | null>(null);
const isVisible = ref(!!props.active);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (isVisible.value || !target.value) return;
  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      isVisible.value = true;
      observer?.disconnect();
      observer = null;
    }
  }, { rootMargin: '160px' });
  observer.observe(target.value);
});

onBeforeUnmount(() => observer?.disconnect());

watch(() => props.active, (active) => {
  if (active) {
    isVisible.value = true;
    observer?.disconnect();
    observer = null;
  }
});
</script>
