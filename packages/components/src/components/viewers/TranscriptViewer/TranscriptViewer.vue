<template>
  <component
    :is="props.sidePanel ? 'aside' : BaseViewer"
    :class="[
      'bg-white',
      props.sidePanel && 'w-full shrink-0 border-l border-neutral-200 md:w-[360px]',
    ]"
  >
    <div class="flex max-h-[calc(100vh-56px)] flex-col gap-3 overflow-auto p-4">
      <h2 class="text-heading-4">
        Transcript
      </h2>
      <p class="whitespace-pre-line text-sm text-neutral-600">
        {{ props.transcript }}
      </p>
    </div>
  </component>
</template>

<script setup lang="ts">
import BaseViewer from '../BaseViewer';

const props = withDefaults(defineProps<{
  transcript: string
  sidePanel?: boolean
}>(), {
  sidePanel: false,
});
</script>

