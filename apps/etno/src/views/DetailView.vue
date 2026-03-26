<template>
  <div
    class="flex flex-col md:flex-row min-h-screen"
  >
    <BaseButton
      class="fixed z-20 left-4 top-16"
      size="small"
      @click="$router.push({ name: 'Explore' })"
    >
      <BaseIcon icon="caretLeft" />
      Späť na explore
    </BaseButton>

    <BaseButton
      class="fixed z-20 right-4 top-16"
      variant="secondary"
      size="small"
      @click="detailPanelOpen = !detailPanelOpen"
    >
      <span v-if="detailPanelOpen">
        Skryť
      </span>
      <span v-else>
        Zobraziť panel
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
      class="md:max-w-[392px]"
    >
      <div class="sticky z-10 top-14 bg-white px-4 py-2 flex items-center gap-2 border-b border-neutral-200 min-h-[49px]">
        <span class="">
          Detail
        </span>
        <span class="font-mono text-xs font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
          {{ detail.id }}
        </span>
      </div>

      <div class="p-4 flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <span class="text-label text-neutral-500">Viewer</span>
          <div class="flex flex-wrap items-center gap-2">
            <InputSelect
              v-model="viewerActive"
              :options="viewers.map((v) => ({
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
          title="Základné údaje"
        >
          <DetailTable
            :items="basicInfo"
          />
        </DetailSection>

        <DetailSection
          v-if="detail.abstract"
          title="Abstrakt"
        >
          <p class="text-sm text-neutral-500">
            {{ detail.abstract }}
          </p>
        </DetailSection>

        <DetailSection
          title="Kľúčové slová"
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
          Údaje
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
                Všeobecná poznámka
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
                Obsahová poznámka
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
                Technická poznámka
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
          title="Mapa"
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
      class="bg-neutral-100 flex-1 h-[calc(100vh-56px)]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import {
  BaseButton,
  BaseIcon,
  InputSelect,
} from '@metafori/components';
import DetailSection from '@/components/Detail/DetailSection.vue';
import DetailTable from '@/components/Detail/DetailTable.vue';

// Modules
import ImageViewer from '@/components/DetailViewers/ImageViewer.vue';
import MapViewer from '@/components/DetailViewers/MapViewer.vue';
import VideoViewer from '@/components/DetailViewers/VideoViewer.vue';
import AudioViewer from '@/components/DetailViewers/AudioViewer.vue';
import PdfViewer from '@/components/DetailViewers/PdfViewer.vue';
import TranscriptViewer from '@/components/DetailViewers/TranscriptViewer.vue';

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
});

const isLoaded = computed(() => !!detail.value.id);

const viewers = [
  {
    key: 'image',
    component: ImageViewer,
  },
  {
    key: 'map',
    component: MapViewer,
  },
  {
    key: 'pdf',
    component: PdfViewer,
  },
  {
    key: 'audio',
    component: AudioViewer,
  },
  {
    key: 'video',
    component: VideoViewer,
  },
  {
    key: 'transcript',
    component: TranscriptViewer,
  },
];

const viewerActive = ref<string>('image');

const activeViewerComponent = computed(() => {
  const match = viewers.find((viewer) => viewer.key === viewerActive.value);
  if (!match) {
    return null;
  }
  return match.component;
});

// Tables
const basicInfo = computed(() => [
  { label: 'Autorstvo', value: toNameReadable(detail.value.authors) },
  { label: 'Typ dokumentu', value: detail.value.type },
  {
    label: 'Výskumná zbierka',
    value: detail.value.research_collections?.map((o: { title: string }) => o.title).join(', '),
  },
]);

const tableDesc = computed(() => ({
  title: 'Popisné údaje',
  items: [
    { label: 'Jazyk', value: detail.value.lang },
  ],
}));

const tableAuthors = computed(() => ({
  title: 'Autori a pôvodcovia',
  items: [
    { label: 'Autorstvo', value: toNameReadable(detail.value.authors) },
    { label: 'Výskum', value: toNameReadable(detail.value.researchers) },
    { label: 'Pôvod', value: toNameReadable(detail.value.originators) },
  ],
}));

const tableGeographic = computed(() => {
  // This is temporary solution, add more robust traverse in the future
  const locality = detail.value.locality;
  const district = locality?.district || locality?.parent;
  const region = district?.region;
  const country = region?.country;
  return {
    title: 'Geografické údaje',
    items: [
      { label: 'Obec', value: locality?.name },
      { label: 'Okres', value: district?.name },
      { label: 'Kraj', value: region?.name },
      { label: 'Štát', value: country?.name },
    ],
  };
});

const tableFormal = computed(() => ({
  title: 'Pôvod a kontext výskumu',
  items: [
    { label: 'Inštitúcia', value: detail.value.institution?.name },
    { label: 'Spôsob zberu', value: detail.value.collection_method },
    { label: 'Spôsob nadobudnutia', value: detail.value.accural_method },

    { label: 'Typ dokumentu', value: detail.value.type },
    {
      label: 'Čas realizácie',
      value: toYearRange(detail.value.time_period_start, detail.value.time_period_end),
    },
    {
      label: 'Dátum odovzdania',
      value: toYearRange(detail.value.submission_date_start, detail.value.submission_date_end),
    },
  ],
}));

const tableAdministrative = computed(() => ({
  title: 'Práva a prístup',
  items: [
    { label: 'Prístupové práva', value: detail.value.access_rights },
    { label: 'Licencia', value: detail.value.licence },
  ],
}));

</script>
