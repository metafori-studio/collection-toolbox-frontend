<template>
  <div class="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden border-r border-neutral-200">
    <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <slot name="thumbnails" />

      <div class="relative grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-bg-brand isolate">
        <slot name="source" />

        <div
          ref="toolbarRow"
          class="col-start-1 row-start-2 z-10 flex justify-center p-4 pointer-events-none [&>*]:static [&>*]:pointer-events-auto [&>*]:transform-none"
        >
          <slot name="toolbar" />
        </div>

        <div
          data-media-viewport
          tabindex="0"
          class="col-start-1 row-start-1 min-h-0 w-full outline-none"
          :class="[
            layout === 'fit' ? 'row-end-2 h-[calc(100%+1rem)]' : 'absolute inset-0 row-end-[-1] [container-type:size]',
            layout === 'native' ? 'overflow-hidden' : 'overflow-auto p-4',
            pinchable ? 'touch-none' : 'touch-pan-x touch-pan-y',
            panning ? 'cursor-grabbing select-none' : { 'cursor-grab': layout !== 'fit' },
          ]"
          :style="{ '--media-toolbar-height': `${toolbarHeight}px` }"
          @keydown="onViewerKeydown"
          @wheel="emit('viewport-wheel', $event)"
          @pointerdown="emit('viewport-pointer-down', $event)"
          @pointermove="emit('viewport-pointer-move', $event)"
          @pointerup="emit('viewport-pointer-up', $event)"
          @pointercancel="emit('viewport-pointer-up', $event)"
        >
          <slot />
        </div>

        <slot name="overlays" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

withDefaults(defineProps<{
  layout?: 'fit' | 'pannable' | 'native';
  panning?: boolean;
  pinchable?: boolean;
}>(), { layout: 'fit', panning: false, pinchable: false });

const toolbarRow = ref<HTMLElement | null>(null);
const toolbarHeight = ref(0);
let toolbarObserver: ResizeObserver | null = null;

const emit = defineEmits<{
  (event: 'previous' | 'next' | 'first' | 'last'): void;
  (event: 'toolbar-resize', value: number): void;
  (event: 'viewport-wheel', value: WheelEvent): void;
  (event: 'viewport-pointer-down', value: PointerEvent): void;
  (event: 'viewport-pointer-move', value: PointerEvent): void;
  (event: 'viewport-pointer-up', value: PointerEvent): void;
}>();

function onViewerKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const navigation: Record<string, 'previous' | 'next' | 'first' | 'last'> = {
    ArrowLeft: 'previous', PageUp: 'previous',
    ArrowRight: 'next', PageDown: 'next',
    Home: 'first', End: 'last',
  };
  const action = navigation[event.key];
  if (action) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).focus({ preventScroll: true });
    emit(action);
  }
}

onMounted(() => {
  if (!toolbarRow.value) return;
  toolbarObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    toolbarHeight.value = entry.borderBoxSize[0]!.blockSize;
    emit('toolbar-resize', toolbarHeight.value);
  });
  toolbarObserver.observe(toolbarRow.value);
});

onBeforeUnmount(() => toolbarObserver?.disconnect());
</script>
