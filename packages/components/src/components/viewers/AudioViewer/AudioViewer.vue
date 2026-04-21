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
      <div class="flex items-start justify-center p-6 bg-neutral-100">
        <media-player
          class="w-full max-w-3xl"
          :title="media.name"
          :src="media.url"
        >
          <media-provider />
          <media-audio-layout />
        </media-player>
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

import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/default';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/audio.css';

import BaseButton from '../../atoms/BaseButton';
import BaseViewer from '../BaseViewer';
import TranscriptViewer from '../TranscriptViewer';
import type { MediaItem } from '../types';

const { media } = defineProps<{
  media: MediaItem;
}>();

const showTranscript = ref(!!media.transcript);
</script>
