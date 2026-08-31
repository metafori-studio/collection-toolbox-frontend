<template>
  <canvas
    ref="canvas"
    :aria-label="label"
    :class="{ 'w-[min(var(--pdf-page-width),100cqw,calc(100cqh*var(--pdf-page-aspect)))] h-auto max-w-none max-h-none': fit }"
    :style="displayStyle"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { isCancellationOrDestroyedError } from './pdfErrors';

const props = defineProps<{
  document?: PDFDocumentProxy | null;
  pageNumber: number;
  scale?: number;
  fitSize?: number;
  fit?: boolean;
  label?: string;
}>();

const emit = defineEmits<{
  (e: 'renderError', error: unknown): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const pageSize = ref({ width: 0, height: 0 });
const displayScale = computed(() => props.fitSize && pageSize.value.width && pageSize.value.height
  ? Math.min(props.fitSize / pageSize.value.width, props.fitSize / pageSize.value.height)
  : props.scale ?? 1);
const displayStyle = computed(() => props.fit ? {
  '--pdf-page-width': `${pageSize.value.width}px`,
  '--pdf-page-aspect': pageSize.value.height ? pageSize.value.width / pageSize.value.height : undefined,
} : {
  width: `${Math.floor(pageSize.value.width * displayScale.value)}px`,
  height: `${Math.floor(pageSize.value.height * displayScale.value)}px`,
});
let renderTask: RenderTask | null = null;
let renderVersion = 0;
let cancelled = false;
let scaleRenderTimer: ReturnType<typeof setTimeout> | null = null;

defineExpose({ canvas });

async function renderPage() {
  const version = ++renderVersion;
  if (renderTask) {
    try {
      renderTask.cancel();
    } catch {
      // Ignore cancellation errors
    }
    renderTask = null;
  }
  if (cancelled || !canvas.value || !props.document) return;

  const currentDoc = props.document;

  try {
    const page = await currentDoc.getPage(props.pageNumber);
    if (cancelled || version !== renderVersion || !canvas.value || props.document !== currentDoc) return;

    const unscaled = page.getViewport({ scale: 1 });
    pageSize.value = { width: unscaled.width, height: unscaled.height };
    const viewport = page.getViewport({ scale: displayScale.value });
    const pixelRatio = window.devicePixelRatio;
    // Render offscreen so refreshing the transport never clears the visible page.
    const target = document.createElement('canvas');
    target.width = Math.floor(viewport.width * pixelRatio);
    target.height = Math.floor(viewport.height * pixelRatio);
    const context = target.getContext('2d');
    if (!context) throw new Error('The browser could not create a PDF canvas.');

    const currentTask = page.render({
      canvasContext: context,
      viewport,
      transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
    });
    renderTask = currentTask;
    await currentTask.promise;
    if (cancelled || version !== renderVersion || !canvas.value || props.document !== currentDoc) return;
    canvas.value.width = target.width;
    canvas.value.height = target.height;
    canvas.value.getContext('2d')?.drawImage(target, 0, 0);
  } catch (error: unknown) {
    if (cancelled || version !== renderVersion || props.document !== currentDoc || isCancellationOrDestroyedError(error)) {
      return;
    }
    console.error('[PdfCanvas] Failed to render page:', error);
    emit('renderError', error);
  } finally {
    if (version === renderVersion) {
      renderTask = null;
    }
  }
}

onMounted(() => { void renderPage(); });
watch(() => [props.document, props.pageNumber, props.fitSize], () => { void renderPage(); });
watch(() => props.scale, () => {
  // CSS updates the displayed size immediately. Wait until continuous wheel or
  // pinch input settles before doing the expensive high-resolution PDF render.
  if (scaleRenderTimer) clearTimeout(scaleRenderTimer);
  scaleRenderTimer = setTimeout(() => {
    scaleRenderTimer = null;
    void renderPage();
  }, 120);
});
onBeforeUnmount(() => {
  cancelled = true;
  renderVersion += 1;
  if (scaleRenderTimer) clearTimeout(scaleRenderTimer);
  scaleRenderTimer = null;
  if (renderTask) {
    try {
      renderTask.cancel();
    } catch {
      // Ignore cancellation errors
    }
    renderTask = null;
  }
});
</script>
