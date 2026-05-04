<template>
  <aside
    v-if="sidePanel && transcript"
    class="w-full shrink-0 border-l border-neutral-200 bg-white md:w-[360px]"
  >
    <div class="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-auto p-4">
      <h2 class="text-heading-4">
        Transcript
      </h2>
      <p class="whitespace-pre-line text-sm text-neutral-600">
        {{ transcript }}
      </p>
    </div>
  </aside>

  <BaseViewer
    v-else-if="transcript"
    class="bg-white"
  >
    <div class="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-auto p-4">
      <h2 class="text-heading-4">
        Transcript
      </h2>
      <p class="whitespace-pre-line text-sm text-neutral-600">
        {{ transcript }}
      </p>
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import BaseViewer from '../BaseViewer';

const {
  transcript,
  sidePanel = false,
} = defineProps<{
  transcript?: string | null
  sidePanel?: boolean
}>();
</script>

