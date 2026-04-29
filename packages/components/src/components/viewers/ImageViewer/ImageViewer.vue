<template>
  <div class="flex-1 flex relative min-w-0">
    <!-- <BaseButton
      v-if="hasTranscript"
      variant="secondary"
      size="small"
      class="absolute top-2 right-4 z-10"
      @click="showTranscript = !showTranscript"
    >
      Toggle transcript
    </BaseButton> -->

    <BaseViewer class="flex flex-col relative overflow-hidden min-w-0">
      <div class="flex-1 relative bg-neutral-100 flex overflow-hidden min-w-0">
        <div class="flex-1 overflow-auto relative flex min-w-0" ref="containerRef">
          <div
            class="m-auto flex items-center justify-center pointer-events-none flex-shrink-0 transition-all duration-200"
            :style="wrapperStyle"
          >
            <img
              v-if="currentImage"
              :src="currentImage.url"
              class="w-full h-full object-contain pointer-events-auto"
              @load="onImageLoad"
            >
          </div>
        </div>

        <!-- Zoom controls -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          <BaseButton
            variant="secondary"
            size="small"
            class="!p-2 shadow-sm"
            @click="zoomIn"
          >
            <BaseIcon icon="zoomIn" />
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="small"
            class="!p-2 shadow-sm"
            @click="zoomOut"
          >
            <BaseIcon icon="zoomOut" />
          </BaseButton>
        </div>
      </div>

      <!-- Thumbnail strip -->
      <div
        v-if="images.length > 1"
        class="h-24 border-t border-neutral-200 bg-white flex items-center gap-2 px-4 overflow-x-auto shrink-0 w-full min-w-0"
      >
        <button
          v-for="(image, index) in images"
          :key="image.url"
          class="h-16 min-w-16 w-16 border-2 rounded overflow-hidden flex-shrink-0 transition-colors cursor-pointer"
          :class="currentIndex === index ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'"
          @click="currentIndex = index"
        >
          <img
            :src="image.conversions?.thumbnail"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </BaseViewer>

    <TranscriptViewer
      v-if="showTranscript && hasTranscript"
      class="w-80 max-w-[33%] shrink-0 border-l border-neutral-200"
      :transcript="currentImage?.transcript"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, onUnmounted, watch } from 'vue';

import BaseButton from '../../atoms/BaseButton';
import BaseIcon from '../../atoms/BaseIcon';
import BaseViewer from '../BaseViewer';
import TranscriptViewer from '../TranscriptViewer';

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
}>();

const showTranscript = ref(false);

const images = computed(() => props.detail?.media?.images || []);
const currentIndex = ref(0);

const currentImage = computed(() => images.value[currentIndex.value]);

const hasTranscript = computed(() => !!currentImage.value?.transcript);

const zoom = ref(1);

const containerRef = shallowRef<HTMLElement | null>(null);
const containerSize = ref({ width: 0, height: 0 });
const imageNaturalSize = ref({ width: 0, height: 0 });

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    if (entries[0]) {
      containerSize.value = {
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      };
    }
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const onImageLoad = (e: Event) => {
  const target = e.target as HTMLImageElement;
  imageNaturalSize.value = {
    width: target.naturalWidth,
    height: target.naturalHeight,
  };
};

watch(currentIndex, () => {
  // Reset natural size when image changes so we don't use old aspect ratio
  imageNaturalSize.value = { width: 0, height: 0 };
  zoom.value = 1; // Also reset zoom
});

const wrapperStyle = computed(() => {
  const cWidth = containerSize.value.width;
  const cHeight = containerSize.value.height;
  const iWidth = imageNaturalSize.value.width;
  const iHeight = imageNaturalSize.value.height;

  if (!cWidth || !cHeight || !iWidth || !iHeight) {
    // Fallback if not loaded yet
    return {
      width: `${zoom.value * 100}%`,
      height: `${zoom.value * 100}%`,
    };
  }

  const containerRatio = cWidth / cHeight;
  const imageRatio = iWidth / iHeight;

  let baseWidth, baseHeight;
  if (imageRatio > containerRatio) {
    baseWidth = cWidth;
    baseHeight = cWidth / imageRatio;
  } else {
    baseHeight = cHeight;
    baseWidth = cHeight * imageRatio;
  }

  return {
    width: `${baseWidth * zoom.value}px`,
    height: `${baseHeight * zoom.value}px`,
  };
});

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.5, 5);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.5, 0.5);
};
</script>
