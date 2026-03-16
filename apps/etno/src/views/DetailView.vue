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
          title="Abstrakt"
        >
          <p class="text-neutral-500">
            {{ detail.abstract }}
          </p>
        </DetailSection>


        <DetailSection
          title="Kľúčové slová"
        >
          <ul class="flex gap-1 flex-wrap">
            <li
              v-for="keyword in detail.keywords"
              :key="keyword"
              v-text="keyword"
            />
          </ul>
        </DetailSection>

        <h2 class="text-heading-4">
          Údaje
        </h2>
        <DetailSection
          v-for="(table, i) in tables"
          :key="i"
          :title="table.title"
        >
          <DetailTable
            :items="table.items"
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
type Author = { family_name: string; given_name: string };

const authorsReadable = computed(() => {
  const flat = (detail.value.authors as Author[]).map((a) => `${a.family_name}, ${a.given_name}`);
  return flat.join('; ');
});

const basicInfo = computed(() => [
  { label: 'Autorstvo', value: authorsReadable.value },
  { label: 'Typ dokumentu', value: detail.value.type },
  { label: 'Výskumná zbierka', value: '' },
]);

const tables = computed(() => [
  {
    title: 'Tematické a autorské údaje',
    items: [
      { label: 'Autor', value: detail.value.author },
    ],
  },
  {
    title: 'Geografické údaje',
    items: [
      { label: 'Obec', value: 'Čičmany' },
      { label: 'Okres', value: 'Žilina' },
      { label: 'Kraj', value: 'Žilinský' },
      { label: 'Štát', value: 'Slovensko' },
    ],
  },
  {
    title: 'Formálne údaje',
    items: [
      { label: 'Typ dokumentu', value: 'diapozitív' },
      { label: 'Čas realizácie', value: 1970 },
      { label: 'Dátum odovzdania', value: 1971 },
      { label: 'Spôsob zberu', value: 'terénny výskum' },
      { label: 'Spôsob nadobudnutia', value: 'zamestnanecké dielo' },
      { label: 'Jazyk', value: 'sk' },
    ],
  },
  {
    title: 'Administratívne údaje',
    items: [
      { label: 'Výskumná zbierka', value: 'Zbierka diapozitívov' },
      { label: 'Inštitúcia', value: 'Ústav etnológie a sociálnej antropológie SAV, v. v. i.' },
      { label: 'Prístup', value: 'otvorený prístup' },
      { label: 'Licencia', value: 'CC BY-NC-SA' },
    ],
  },
]);

</script>
