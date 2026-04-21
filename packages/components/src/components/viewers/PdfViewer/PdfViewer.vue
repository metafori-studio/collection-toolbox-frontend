<template>
  <div class="flex-1 flex relative">
    <BaseButton
      v-if="media.transcript"
      variant="secondary"
      size="small"
      class="absolute top-2 right-4 z-10"
      @click="showTranscript = !showTranscript"
    >
      Toggle transcript
    </BaseButton>

    <BaseViewer>
      <div class="flex flex-col items-center justify-start gap-4 p-8 text-center bg-neutral-100 min-h-[400px]">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 text-neutral-500">
          <BaseIcon icon="document" />
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-heading-4 text-neutral-700">
            PDF preview coming soon
          </p>
          <p class="text-sm text-neutral-500">
            {{ media.file_name }}
            <span v-if="media.human_readable_size">
              &middot; {{ media.human_readable_size }}
            </span>
          </p>
        </div>
        <a
          :href="media.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-primary-600 underline underline-offset-2"
        >
          Open PDF in new tab
        </a>
      </div>
    </BaseViewer>

    <TranscriptViewer
      v-if="showTranscript && media.transcript"
      :transcript="media.transcript"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseButton from '../../atoms/BaseButton';
import BaseIcon from '../../atoms/BaseIcon';
import BaseViewer from '../BaseViewer';
import TranscriptViewer from '../TranscriptViewer';
import type { MediaItem } from '../types';

const { media } = defineProps<{
  media: MediaItem;
}>();

const showTranscript = ref(!!media.transcript);
</script>
