<template>
  <BaseViewer class="bg-white relative">
    <div class="sticky top-0 bg-white border-b border-neutral-200 px-6 py-3 z-10 flex items-center">
      <span class="font-bold text-neutral-800">{{ $t('viewer.transcript.title') }}</span>
      <BaseButton
        variant="secondary"
        size="small"
        class="absolute top-2 right-4 z-10"
        @click="emit('close')"
      >
        {{ $t('viewer.transcript.close') }}
      </BaseButton>
    </div>
    <div class="p-6 whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed">
      {{ content }}
    </div>
  </BaseViewer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseViewer from '../BaseViewer';
import BaseButton from '../../atoms/BaseButton';

const emit = defineEmits(['close']);

const props = defineProps<{
  transcript?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
}>();

const content = computed(() => {
  return props.transcript || props.detail?.media?.transcript || 'No transcript available.';
});
</script>
