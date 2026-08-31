<template>
  <MediaViewerFrame
    pinchable
    :panning="isPanning"
    :layout="isFit ? 'fit' : 'pannable'"
    @previous="previousPage"
    @next="nextPage"
    @first="selectPage(1)"
    @last="selectPage(pageCount)"
    @viewport-wheel="onViewportWheel"
    @viewport-pointer-down="onViewportPointerDown"
    @viewport-pointer-move="onViewportPointerMove"
    @viewport-pointer-up="onViewportPointerUp"
  >
    <template #thumbnails>
      <PdfThumbnailStrip
        v-if="pageCount > 1"
        class="order-last lg:order-first"
        :document="documentProxy"
        :current-page="currentPage"
        @select-page="selectPage"
        @render-error="handleCanvasError"
      />
    </template>

    <template #source>
      <div
        v-if="sourceOptions.length > 1"
        class="absolute left-3 top-3 z-10 w-64"
      >
        <InputSelect
          :model-value="selectedSourceUrl"
          :options="sourceOptions"
          @update:model-value="selectedSourceUrl = $event || ''"
        />
      </div>
    </template>

    <div
      v-if="loadState.status === 'loading' || (loadState.status === 'ready' && !pageDimension)"
      class="flex h-full items-center justify-center text-sm font-medium text-neutral-500"
    >
      {{ t('viewer.loading') }}
    </div>

    <div
      v-else-if="loadState.status === 'error'"
      class="flex h-full items-center justify-center"
    >
      <div class="max-w-lg text-center text-sm font-medium text-neutral-600">
        {{ loadState.message }}
      </div>
    </div>

    <div
      v-else-if="documentProxy"
      data-pdf-stage
      class="relative flex min-w-full shrink-0 items-center justify-center"
      :class="isFit ? 'h-full w-full [container-type:size]' : 'min-h-[calc(100cqh-var(--media-toolbar-height)+1rem)] mb-[calc(var(--media-toolbar-height)-1rem)]'"
      :style="pageStageStyle"
    >
      <PdfCanvas
        ref="pdfCanvas"
        :key="selectedSourceUrl"
        class="block bg-white shadow-sm"
        :document="documentProxy"
        :page-number="currentPage"
        :scale="scale"
        :fit="isFit"
        :label="t('viewer.pdf.page', { page: currentPage })"
        @render-error="handleCanvasError"
      />
    </div>

    <template #toolbar>
      <ViewerToolbar
        v-if="documentProxy"
        :current="currentPage"
        :total="pageCount"
        :zoom-percentage="displayedZoomPercentage"
        :can-zoom-out="canZoomOut"
        :can-zoom-in="canZoomIn"
        :can-reset-zoom="canResetZoom"
        @previous="previousPage"
        @next="nextPage"
        @zoom-in="zoomAtViewportCenter(zoomIn)"
        @zoom-out="zoomOut"
        @reset-zoom="resetZoom"
      />
    </template>
  </MediaViewerFrame>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getDocument, GlobalWorkerOptions, type PDFDocumentLoadingTask, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import InputSelect, { type SelectOption } from '../../atoms/InputSelect';
import { useZoom } from './useZoom';
import { useViewerViewportInteraction } from '../useViewerViewportInteraction';
import ViewerToolbar from '../MediaToolbar/ViewerToolbar.vue';
import PdfCanvas from './PdfCanvas.vue';
import PdfThumbnailStrip from './PdfThumbnailStrip.vue';
import MediaViewerFrame from '../MediaViewerFrame.vue';
import { createPdfTransport } from './createPdfTransport';
import type { ViewerDetail } from '../media';
import { isCancellationOrDestroyedError } from './pdfErrors';

export interface PdfSource {
  label: string;
  url: string;
}

export interface PdfViewerProps {
  url?: string;
  sources?: PdfSource[];
  modelValue?: number;
  detail?: ViewerDetail | null;
  onRefreshUrl?: (expiredUrl?: string) => Promise<string | void>;
}

const props = withDefaults(defineProps<PdfViewerProps>(), {
  url: '',
  sources: () => [],
  modelValue: 1,
  detail: null,
  onRefreshUrl: undefined,
});
const { t } = useI18n();

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const rangeChunkSize = 5 * 1024 * 1024;

const selectedSourceUrl = ref('');
const loadState = shallowRef<
  { status: 'idle' | 'loading' | 'ready' } | { status: 'error'; message: string }
>({ status: 'idle' });
const currentPage = ref(props.modelValue);
const pageDimension = ref<{ width: number; height: number } | null>(null);
const pdfCanvas = ref<InstanceType<typeof PdfCanvas> | null>(null);
const renderedPdfElement = computed<HTMLCanvasElement | null>(() => pdfCanvas.value?.canvas ?? null);
const maxScale = 2;
let loadingTask: PDFDocumentLoadingTask | null = null;
let transportController: AbortController | null = null;
const documentProxy = shallowRef<PDFDocumentProxy | null>(null);
// Retain the page count during replacement to keep the thumbnail rail stable.
const pageCount = ref(0);
let loadVersion = 0;

const emit = defineEmits<{
  (event: 'update:modelValue', pageNumber: number): void;
  (event: 'selectPage', pageNumber: number): void;
}>();

const {
  customScale,
  isFit,
  scale,
  displayedZoomPercentage,
  canZoomIn,
  canZoomOut,
  canResetZoom,
  zoomIn,
  zoomByFactor,
  zoomByWheel,
  zoomOut,
  resetZoom,
} = useZoom({
  maxScale,
  renderedElement: renderedPdfElement,
  contentDimension: pageDimension,
});

const {
  isPanning,
  onViewportWheel,
  onViewportPointerDown,
  onViewportPointerMove,
  onViewportPointerUp,
  zoomAtViewportCenter,
} = useViewerViewportInteraction({
  canPan: computed(() => !isFit.value),
  renderedElement: renderedPdfElement,
  zoomByFactor,
  zoomByWheel,
});

const pageStageStyle = computed(() => isFit.value || !pageDimension.value ? {} : ({
  width: `${pageDimension.value.width * scale.value}px`,
  height: `${pageDimension.value.height * scale.value}px`,
}));
const sourceOptions = computed<SelectOption[]>(() => {
  if (props.sources?.length) return props.sources.map(({ label, url }) => ({ label, value: url }));
  const documents = props.detail?.media?.documents || [];
  if (documents.length) {
    return documents.map((document, index) => ({
      label: document.name || `Document ${index + 1}`,
      value: document.url,
    }));
  }
  return props.url ? [{ label: 'Document 1', value: props.url }] : [];
});

async function disposeDocument() {
  transportController?.abort();
  transportController = null;
  const currentDoc = documentProxy.value;
  documentProxy.value = null;
  const currentTask = loadingTask;
  loadingTask = null;

  try {
    await currentDoc?.destroy();
  } catch {
    // Ignore destruction errors
  }
  try {
    await currentTask?.destroy();
  } catch {
    // Ignore destruction errors
  }
}

function handleCanvasError(error: unknown) {
  if (!isCancellationOrDestroyedError(error)) {
    loadState.value = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unable to render the PDF page.',
    };
  }
}

async function loadDocument(url: string, resetPage = false) {
  const version = ++loadVersion;
  loadState.value = { status: url ? 'loading' : 'idle' };
  pageDimension.value = null;
  currentPage.value = resetPage ? 1 : Math.max(1, props.modelValue);
  customScale.value = null;
  await disposeDocument();
  if (version !== loadVersion) return;
  if (!url) {
    pageCount.value = 0;
    return;
  }

  const controller = new AbortController();
  transportController = controller;
  try {
    const source = await createPdfTransport({
      url,
      chunkSize: rangeChunkSize,
      signal: controller.signal,
      refreshUrl: props.onRefreshUrl,
      onError: async (error) => {
        if (version !== loadVersion) return;
        loadVersion += 1;
        controller.abort();
        handleCanvasError(error);
        // Stop pending PDF.js reads: its custom transport has no reject method.
        documentProxy.value = null;
        const task = loadingTask;
        loadingTask = null;
        try { await task?.destroy(); } catch { /* Ignore disposal errors. */ }
      },
    });
    if (version !== loadVersion || controller.signal.aborted) return;
    loadingTask = getDocument({ ...source, rangeChunkSize, disableRange: false, disableStream: true, disableAutoFetch: true });
    const loadedDoc = await loadingTask.promise;
    if (version !== loadVersion) {
      try {
        await loadedDoc.destroy();
      } catch {
        // Ignore destruction errors
      }
      return;
    }
    documentProxy.value = loadedDoc;
    pageCount.value = loadedDoc.numPages;
    currentPage.value = Math.min(loadedDoc.numPages, currentPage.value);
    const dimensionsLoaded = await updatePageDimension();
    if (dimensionsLoaded && version === loadVersion) loadState.value = { status: 'ready' };
  } catch (error) {
    if (version === loadVersion && !controller.signal.aborted && !isCancellationOrDestroyedError(error)) {
      console.error('[PdfViewer] PDF.js failed to load the document:', error);
      loadState.value = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unable to load the PDF document.',
      };
      pageCount.value = 0;
    }
  }
}

function selectPage(pageNumber: number) {
  if (pageNumber !== currentPage.value && pageNumber >= 1 && pageNumber <= pageCount.value) {
    currentPage.value = pageNumber;
    emit('update:modelValue', pageNumber);
    emit('selectPage', pageNumber);
  }
}

function previousPage() {
  selectPage(currentPage.value - 1);
}

function nextPage() {
  selectPage(currentPage.value + 1);
}

async function updatePageDimension() {
  const document = documentProxy.value;
  const pageNumber = currentPage.value;
  if (!document) return;
  try {
    const page = await document.getPage(pageNumber);
    if (documentProxy.value !== document || currentPage.value !== pageNumber) return;
    const viewport = page.getViewport({ scale: 1 });
    pageDimension.value = { width: viewport.width, height: viewport.height };
    if (loadState.value.status === 'error') loadState.value = { status: 'ready' };
    return true;
  } catch (error) {
    if (isCancellationOrDestroyedError(error)) return;
    if (documentProxy.value !== document || currentPage.value !== pageNumber) return;
    console.error('[PdfViewer] Failed to update page dimension:', error);
    loadState.value = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unable to load the PDF page.',
    };
  }
}

watch(sourceOptions, (options) => {
  if (!options.some((option) => option.value === selectedSourceUrl.value)) {
    selectedSourceUrl.value = String(options[0]?.value ?? '');
  }
}, { immediate: true });

watch(
  selectedSourceUrl,
  (url, previousUrl) => { void loadDocument(url, previousUrl !== undefined); },
  { immediate: true, flush: 'sync' },
);

watch(currentPage, () => {
  void updatePageDimension();
});

watch(() => props.modelValue, (pageNumber) => {
  if (pageNumber && pageNumber !== currentPage.value) selectPage(pageNumber);
});

onBeforeUnmount(() => {
  loadVersion += 1;
  void disposeDocument();
});
</script>
