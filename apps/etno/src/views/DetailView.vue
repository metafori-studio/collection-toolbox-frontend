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

    <div
      v-if="isLoaded && detailPanelOpen"
      class="bg-white md:max-w-[392px]"
    >
      <div class="sticky z-10 top-14 bg-white px-4 py-2 flex items-center gap-2 border-b border-neutral-200 min-h-[49px]">
        <span class="">
          {{ $t('detail.panel.title') }}
        </span>
        <span class="font-mono text-xs font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
          {{ detail.id }}
        </span>
      </div>

      <div class="p-4 flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <span class="text-label text-neutral-500">{{ $t('detail.viewer.label') }}</span>
          <div class="flex flex-wrap items-center gap-2">
            <InputSelect
              v-model="viewerActive"
              :options="availableViewers.map((v) => ({
                value: v.key,
                label: v.key,
              }))"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <h1 class="text-heading-3">
            {{ detail.title }}
          </h1>
        </div>

        <DetailSection
          :title="$t('detail.section.basicInfo')"
        >
          <DetailTable
            :items="basicInfo"
          />
        </DetailSection>

        <DetailSection
          v-if="detail.abstract"
          :title="$t('detail.section.abstract')"
        >
          <p class="text-sm text-neutral-500">
            {{ detail.abstract }}
          </p>
        </DetailSection>

        <DetailSection
          :title="$t('detail.section.keywords')"
        >
          <ul class="flex gap-1.5 flex-wrap">
            <li
              v-for="keyword in detail.keywords"
              :key="keyword.id"
              class="rounded-md px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700"
              v-text="keyword.name"
            />
          </ul>
        </DetailSection>

        <h2 class="text-heading-4">
          {{ $t('detail.section.data') }}
        </h2>

        <DetailSection
          :title="tableDesc.title"
        >
          <DetailTable
            :items="tableDesc.items"
          />
          <div class="flex flex-col gap-2">
            <div
              v-if="detail.general_note"
              class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
            >
              <h3 class="text-label-small font-bold text-neutral-500">
                {{ $t('detail.notes.general') }}
              </h3>
              <p class="text-sm font-medium">
                {{ detail.general_note }}
              </p>
            </div>
            <div
              v-if="detail.content_note"
              class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
            >
              <h3 class="text-label-small font-bold text-neutral-500">
                {{ $t('detail.notes.content') }}
              </h3>
              <p class="text-sm font-medium">
                {{ detail.content_note }}
              </p>
            </div>
            <div
              v-if="detail.technical_note"
              class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
            >
              <h3 class="text-label-small font-bold text-neutral-500">
                {{ $t('detail.notes.technical') }}
              </h3>
              <p class="text-sm font-medium">
                {{ detail.technical_note }}
              </p>
            </div>
          </div>
        </DetailSection>

        <DetailSection
          :title="tableAuthors.title"
        >
          <DetailTable
            :items="tableAuthors.items"
          />
        </DetailSection>

        <DetailSection
          :title="tableGeographic.title"
        >
          <DetailTable
            :items="tableGeographic.items"
          />
        </DetailSection>

        <DetailSection
          :title="$t('detail.section.map')"
        >
          [ TODO: Map ]
        </DetailSection>

        <DetailSection
          :title="tableFormal.title"
        >
          <DetailTable
            :items="tableFormal.items"
          />
        </DetailSection>

        <DetailSection
          :title="tableAdministrative.title"
        >
          <DetailTable
            :items="tableAdministrative.items"
          />
        </DetailSection>
      </div>
    </div>

    <div
      v-if="!isLoaded"
      class="bg-neutral-100 flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  BaseButton,
  BaseIcon,
  InputSelect,
  ImageViewer,
  MapViewer,
  VideoViewer,
  AudioViewer,
  PdfViewer,
  TranscriptViewer,
  type ViewerMediaKind,
} from '@metafori/components';
import DetailSection from '@/components/Detail/DetailSection.vue';
import DetailTable from '@/components/Detail/DetailTable.vue';

import { detailPanelOpen } from '@/store';
import { getDetail } from '@/api';
import { toNameReadable } from '@/misc/toNameReadable';
import { toYearRange } from '@/misc/toYearRange';

const {
  id,
} = defineProps<{
  id: string
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const detail = ref<any>({});

onMounted(async () => {
  detail.value = await getDetail(id);
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

// Tables
const { t } = useI18n();
const translateEnum = (namespace: string, key: string) => {
  if (!key) {
    return null;
  }
  return t(`enums.${namespace}.${key}`);
};

const basicInfo = computed(() => [
  {
    label: t('detail.table.authorship'),
    value: toNameReadable(detail.value.authors),
  },
  {
    label: t('detail.table.documentType'),
    value: translateEnum('ItemType', detail.value.type),
  },
  {
    label: t('detail.table.researchCollection'),
    value: detail.value.research_collections?.map((o: { title: string }) => o.title).join(', '),
  },
]);

const tableDesc = computed(() => ({
  title: t('detail.section.descriptiveData'),
  items: [
    {
      label: t('detail.table.language'),
      value: translateEnum('Language', detail.value.lang),
    },
  ],
}));

const tableAuthors = computed(() => ({
  title: t('detail.section.authorsAndOriginators'),
  items: [
    {
      label: t('detail.table.authorship'),
      value: toNameReadable(detail.value.authors),
    },
    {
      label: t('detail.table.research'),
      value: toNameReadable(detail.value.researchers),
    },
    {
      label: t('detail.table.origin'),
      value: toNameReadable(detail.value.originators),
    },
  ],
}));

const tableGeographic = computed(() => {
  // This is temporary solution, add more robust traverse in the future
  const locality = detail.value.locality;
  const district = locality?.district || locality?.parent;
  const region = district?.region;
  const country = region?.country;
  return {
    title: t('detail.section.geographic'),
    items: [
      { label: t('detail.table.municipality'), value: locality?.name },
      { label: t('detail.table.district'), value: district?.name },
      { label: t('detail.table.region'), value: region?.name },
      { label: t('detail.table.country'), value: country?.name },
    ],
  };
});

const tableFormal = computed(() => ({
  title: t('detail.section.researchOriginContext'),
  items: [
    {
      label: t('detail.table.institution'),
      value: detail.value.institution?.name,
    },
    {
      label: t('detail.table.collectionMethod'),
      value: translateEnum('CollectionMethod', detail.value.collection_method),
    },
    {
      label: t('detail.table.accrualMethod'),
      value: translateEnum('AccrualMethod', detail.value.accural_method),
    },
    {
      label: t('detail.table.documentType'),
      value: translateEnum('ItemType', detail.value.type),
    },
    {
      label: t('detail.table.timeOfRealization'),
      value: toYearRange(detail.value.time_period_start, detail.value.time_period_end),
    },
    {
      label: t('detail.table.submissionDate'),
      value: toYearRange(detail.value.submission_date_start, detail.value.submission_date_end),
    },
  ],
}));

const tableAdministrative = computed(() => ({
  title: t('detail.section.rightsAndAccess'),
  items: [
    {
      label: t('detail.table.accessRights'),
      value: translateEnum('AccessRights', detail.value.access_rights),
    },
    {
      label: t('detail.table.license'),
      value: translateEnum('License', detail.value.licence),
    },
  ],
}));

</script>
