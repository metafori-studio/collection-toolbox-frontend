<template>
  <ThumbnailStrip
    v-if="pageCount > 1"
  >
    <ThumbnailStripThumb
      v-for="pageNumber in pageCount"
      :key="pageNumber"
      :page="pageNumber"
      :label="t('viewer.pdf.thumbnail', { page: pageNumber })"
      :active="pageNumber === currentPage"
      @click="emit('select-page', pageNumber)"
    >
      <PdfLazyThumbnail
        :document="document"
        :page-number="pageNumber"
        :active="pageNumber === currentPage"
        :label="t('viewer.pdf.thumbnail', { page: pageNumber })"
        @render-error="emit('render-error', $event)"
      />
    </ThumbnailStripThumb>
  </ThumbnailStrip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import ThumbnailStrip from '../ThumbnailStrip/ThumbnailStrip.vue';
import ThumbnailStripThumb from '../ThumbnailStrip/ThumbnailStripThumb.vue';
import PdfLazyThumbnail from './PdfLazyThumbnail.vue';

const { t } = useI18n();

const props = defineProps<{
  document?: PDFDocumentProxy | null;
  currentPage: number;
}>();

const emit = defineEmits<{
  (event: 'select-page', pageNumber: number): void;
  (event: 'render-error', error: unknown): void;
}>();

const pageCount = computed(() => props.document?.numPages || 0);
</script>
