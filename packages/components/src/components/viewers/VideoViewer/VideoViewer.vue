<template>
  <div class="flex-1 flex relative min-w-0">
    <BaseButton
      v-if="transcript"
      variant="secondary"
      size="small"
      class="absolute z-10 top-2 right-4"
      @click="showTranscript = !showTranscript"
    >
      {{ showTranscript ? 'Hide transcript' : 'Show transcript' }}
    </BaseButton>

    <BaseViewer class="bg-neutral-100">
      <div class="flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
        <media-player
          v-if="media"
          :title="mediaTitle"
          :src="mediaSource"
          playsinline
          class="block w-full max-w-5xl overflow-hidden rounded-lg bg-black shadow-sm"
        >
          <media-provider>
            <media-poster
              v-if="poster"
              :src="poster"
              :alt="mediaTitle"
              class="absolute inset-0 block h-full w-full object-cover"
            />
          </media-provider>
          <media-video-layout />
        </media-player>

        <div
          v-else
          class="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500"
        >
          No video media available.
        </div>
      </div>
    </BaseViewer>

    <TranscriptViewer
      v-if="transcript && showTranscript"
      :transcript="transcript"
      side-panel
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BaseButton from '../../atoms/BaseButton';
import BaseViewer from '../BaseViewer';
import TranscriptViewer from '../TranscriptViewer';
import { getFirstMedia, getMediaPoster, type ViewerDetail } from '../media';

const {
  detail,
} = defineProps<{
  detail: ViewerDetail
}>();

const media = computed(() => getFirstMedia(detail, 'videos'));
const mediaSource = computed(() => (
  media.value
    ? {
      src: media.value.url,
      type: media.value.mime_type ?? undefined,
    }
    : undefined
));
const poster = computed(() => getMediaPoster(media.value));
const mediaTitle = computed(() => media.value?.name ?? media.value?.file_name ?? detail.title ?? 'Video');
const transcript = computed(() => media.value?.transcript ?? null);
const showTranscript = ref(true);
</script>

