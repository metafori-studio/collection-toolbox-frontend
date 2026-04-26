<template>
  <div class="flex-1 flex relative">
    <BaseButton
      variant="secondary"
      size="small"
      class="absolute top-2 right-4"
      @click="showTranscript = !showTranscript"
    >
      Toggle transcript
    </BaseButton>

    <BaseViewer>
      Video viewer
    </BaseViewer>

    <TranscriptViewer
      v-if="showTranscript"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseButton from '../../atoms/BaseButton';
import BaseViewer from '../BaseViewer';
import TranscriptViewer from '../TranscriptViewer';

const showTranscript = ref(true);
</script>

