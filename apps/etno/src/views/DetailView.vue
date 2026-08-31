<template>
  <div
    class="flex flex-col md:flex-row min-h-[calc(100dvh-3.5rem)]"
  >
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

    <div
      v-if="isLoaded"
      class="z-0 flex flex-none md:flex-1 sticky top-14 h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-0 min-w-0 overflow-hidden w-full md:w-auto"
    >
      <component
        :is="activeViewerComponent"
        :detail="detail"
        :on-refresh-url="refreshMediaUrl"
      />
    </div>

    <DetailSidebar
      v-if="isLoaded && detailPanelOpen"
      class="relative z-10 w-full shrink-0 md:w-[392px]"
      :detail="detail"
      :viewer-active="viewerActive"
      :available-viewers="availableViewers"
      @update:viewer-active="viewerActive = $event as ViewerKey"
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
let detailRefreshPromise: Promise<Detail> | null = null;
const refreshedUrlSources = new Map<string, string>();

async function refreshMediaUrl(expiredUrl?: string): Promise<string | void> {
  if (!expiredUrl) return;
  const sourceUrl = refreshedUrlSources.get(expiredUrl) ?? expiredUrl;

  const mediaEntry = Object.entries(detail.value.media ?? {}).find(([, items]) => (
    items?.some((item) => item.url === sourceUrl)
  ));
  if (!mediaEntry) return;

  const [mediaKind, items] = mediaEntry;
  const expiredMedia = items?.find((item) => item.url === sourceUrl);
  if (!expiredMedia) return;

  detailRefreshPromise ??= getDetail(id).finally(() => {
    detailRefreshPromise = null;
  });
  const refreshedDetail = await detailRefreshPromise;
  const refreshedMedia = refreshedDetail.media?.[mediaKind as ViewerMediaKind]?.find((item) => (
    item.id === expiredMedia.id
  ));

  if (!refreshedMedia?.url) return;
  refreshedUrlSources.set(refreshedMedia.url, sourceUrl);
  return refreshedMedia.url;
}

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
    available: Object.values(detail.value.media ?? {}).some((items) => (
      items.some((item) => !!item.transcript)
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

const activeViewer = computed(() => (
  availableViewers.value.find((viewer) => viewer.key === viewerActive.value)
));

const activeViewerComponent = computed(() => (
  activeViewer.value?.component
));

</script>
