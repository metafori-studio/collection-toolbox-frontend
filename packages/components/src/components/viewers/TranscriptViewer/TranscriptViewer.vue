<template>
  <aside
    v-if="sidePanel"
    class="w-full shrink-0 border-l border-neutral-200 bg-white md:w-[360px]"
  >
    <div class="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-auto p-4">
      <h2 class="text-heading-4">
        Transcript
      </h2>
      <p class="whitespace-pre-line text-sm text-neutral-600">
        {{ transcriptText }}
      </p>
    </div>
  </aside>

  <BaseViewer
    v-else
    class="bg-white"
  >
    <div class="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-auto p-4">
      <h2 class="text-heading-4">
        Transcript
      </h2>
      <p class="whitespace-pre-line text-sm text-neutral-600">
        {{ transcriptText }}
      </p>
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import BaseViewer from '../BaseViewer';
import { getFirstTranscript, type ViewerDetail } from '../media';

const {
  transcript = null,
  sidePanel = false,
  detail = undefined,
} = defineProps<{
  transcript?: string | null
  sidePanel?: boolean
  detail?: ViewerDetail
}>();

const transcriptText = computed(() => (
  transcript
  ?? (detail ? getFirstTranscript(detail) : null)
  ?? 'No transcript available.'
));
</script>

