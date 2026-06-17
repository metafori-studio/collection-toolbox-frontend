<template>
  <div
    class="flex flex-col md:flex-row"
  >
    <BaseButton
      class="fixed z-20 left-4 top-16"
      size="small"
      @click="$router.push({ name: 'Explore' })"
    >
      <BaseIcon icon="caretLeft" />
      {{ $t('detail.navigation.backToExplore') }}
    </BaseButton>

    <BaseButton
      class="fixed z-20 right-4 top-16"
      variant="secondary"
      size="small"
      @click="detailPanelOpen = !detailPanelOpen"
    >
      <span v-if="detailPanelOpen">
        {{ $t('detail.panel.hide') }}
      </span>
      <span v-else>
        {{ $t('detail.panel.show') }}
      </span>
      <BaseIcon
        v-if="detailPanelOpen"
        icon="caretRight"
      />
    </BaseButton>

    <component
      :is="activeViewerComponent"
      v-if="isLoaded"
      :detail="detail"
    />

    <DetailSidebar
      v-if="isLoaded && detailPanelOpen"
      :detail="detail"
      :viewer-active="viewerActive"
      :available-viewers="availableViewers"
    />

    <div
      v-if="!isLoaded"
      class="bg-neutral-100 flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import {
  BaseButton,
  BaseIcon,
  ImageViewer,
  MapViewer,
  VideoViewer,
  AudioViewer,
  PdfViewer,
  TranscriptViewer,
  type ViewerMediaKind,
} from '@metafori/components';
import DetailSidebar from '@/components/Detail/DetailSidebar.vue';

import { detailPanelOpen } from '@/store';
import { getDetail, type Detail } from '@/api';

const {
  id,
} = defineProps<{
  id: string
}>();

const router = useRouter();

const detail = ref<Detail>({} as Detail);

onMounted(async () => {
  try {
    detail.value = await getDetail(id);
  } catch {
    router.push({ name: 'Error404' });
  }
  viewerActive.value = getInitialViewer();
});

const isLoaded = computed(() => !!detail.value.id);

type ViewerKey = 'image' | 'map' | 'pdf' | 'audio' | 'video' | 'transcript';
type DetailMedia = Partial<Record<ViewerMediaKind, { transcript?: string | null }[]>>;

const viewerActive = ref<ViewerKey>('image');

const mediaTypeToViewer: Record<ViewerMediaKind, ViewerKey> = {
  audios: 'audio',
  documents: 'pdf',
  images: 'image',
  videos: 'video',
};

const availableViewers = computed(() => [
  {
    key: 'image' as const,
    component: ImageViewer,
    available: !!detail.value.media?.images?.length,
  },
  {
    key: 'map' as const,
    component: MapViewer,
    available: !!detail.value.locality,
  },
  {
    key: 'pdf' as const,
    component: PdfViewer,
    available: !!detail.value.media?.documents?.length,
  },
  {
    key: 'audio' as const,
    component: AudioViewer,
    available: !!detail.value.media?.audios?.length,
  },
  {
    key: 'video' as const,
    component: VideoViewer,
    available: !!detail.value.media?.videos?.length,
  },
  {
    key: 'transcript' as const,
    component: TranscriptViewer,
    available: Object.values((detail.value.media ?? {}) as DetailMedia).some((items) => (
      items?.some((item) => !!item.transcript)
    )),
  },
].filter((viewer) => viewer.available));

const getInitialViewer = (): ViewerKey => {
  const mediaType = detail.value.media_type as ViewerMediaKind | undefined;
  const preferredViewer = mediaType ? mediaTypeToViewer[mediaType] : undefined;

  if (preferredViewer && availableViewers.value.some((viewer) => viewer.key === preferredViewer)) {
    return preferredViewer;
  }

  return availableViewers.value[0]?.key ?? 'image';
};

const activeViewerComponent = computed(() => (
  availableViewers.value.find((viewer) => viewer.key === viewerActive.value)?.component
  ?? availableViewers.value[0]?.component
  ?? null
));

</script>
