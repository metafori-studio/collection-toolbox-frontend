<template>
  <MediaViewerFrame
    class="select-none"
    layout="native"
    @toolbar-resize="handleToolbarResize"
    @previous="previousImage"
    @next="nextImage"
    @first="selectImage(0)"
    @last="selectImage(images.length - 1)"
  >
    <template #thumbnails>
      <ImageThumbnailStrip
        v-if="images.length > 1"
        class="order-last lg:order-first"
        :images="images"
        :current-index="currentIndex"
        @select-image="selectImage"
      />
    </template>

    <div
      v-if="currentImage"
      class="relative flex h-[100cqh] min-h-full min-w-full w-full shrink-0 items-center justify-center"
    >
      <div
        :key="currentIndex"
        ref="viewerElement"
        class="h-full w-full bg-bg-brand"
        role="img"
        :aria-label="currentImage.name || currentImage.file_name || ''"
      />
    </div>

    <template #overlays>
      <div
        v-if="status === 'loading'"
        class="absolute inset-0 z-10 flex items-center justify-center bg-bg-brand text-sm font-medium text-neutral-500"
      >
        {{ t('viewer.loading') }}
      </div>

      <div
        v-if="status === 'error'"
        class="absolute inset-0 z-10 flex items-center justify-center bg-bg-brand p-4"
      >
        <p class="max-w-lg text-center text-sm font-medium text-neutral-600">
          {{ t('viewer.image.errorLoad') }}
        </p>
      </div>
    </template>

    <template #toolbar>
      <ViewerToolbar
        v-if="images.length > 0"
        :current="currentIndex + 1"
        :total="images.length"
        :zoom-percentage="displayedZoomPercentage"
        :can-zoom-out="canZoomOut"
        :can-zoom-in="canZoomIn"
        :can-reset-zoom="canResetZoom"
        @previous="previousImage"
        @next="nextImage"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @reset-zoom="resetZoom"
      />
    </template>
  </MediaViewerFrame>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ImageThumbnailStrip from './ImageThumbnailStrip.vue';
import MediaViewerFrame from '../MediaViewerFrame.vue';
import ViewerToolbar from '../MediaToolbar/ViewerToolbar.vue';
import type { ViewerMediaResource, ViewerDetail } from '../media';
import { useImageCollection } from '../useImageCollection';
import { useOpenSeadragonViewer } from './useOpenSeadragonViewer';

export interface ImageViewerProps {
  images?: ViewerMediaResource[];
  modelValue?: number;
  detail?: ViewerDetail | null;
  onRefreshUrl?: (expiredUrl?: string) => Promise<string | void>;
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
  images: () => [],
  modelValue: 1,
  detail: null,
  onRefreshUrl: undefined,
});

const emit = defineEmits<{
  (event: 'update:modelValue', imageNumber: number): void;
  (event: 'selectImage', index: number): void;
}>();

const { t } = useI18n();
const viewerElement = ref<HTMLElement | null>(null);
const {
  currentImage, currentIndex, images, nextImage,
  overrideImageUrl, previousImage, selectImage,
} = useImageCollection(props, emit);

const {
  status, handleToolbarResize, canResetZoom, canZoomIn, canZoomOut,
  displayedZoomPercentage, resetZoom, zoomIn, zoomOut,
} = useOpenSeadragonViewer({
  element: viewerElement,
  image: currentImage,
  source: computed(() => images.value[currentIndex.value]),
  refreshHandler: computed(() => props.onRefreshUrl),
  onUrlRefreshed: (url) => overrideImageUrl(currentIndex.value, url),
});

defineExpose({ currentIndex, nextImage, previousImage, resetZoom, selectImage, zoomIn, zoomOut });
</script>
