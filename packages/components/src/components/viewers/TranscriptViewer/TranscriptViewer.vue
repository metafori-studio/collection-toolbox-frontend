<template>
  <BaseViewer class="bg-white relative">
    <div class="sticky top-0 bg-white border-b border-neutral-200 px-6 py-3 z-10 flex items-center">
      <span class="font-bold text-neutral-800">{{ $t('viewer.transcript.title') }}</span>
    </div>
    <div class="p-6 whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed">
      {{ content }}
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseViewer from '../BaseViewer';

const props = defineProps<{
  transcript?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
}>();

const content = computed(() => {
  return props.transcript || props.detail?.media?.transcript || 'No transcript available.';
});
</script>
