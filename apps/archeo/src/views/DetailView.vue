<template>
  <div
    class="flex items-start min-h-screen"
  >
    <router-view
      v-if="isLoaded"
      :detail="detail"
      :galleries="detail.galleries"
    />
    <div
      v-if="isLoaded && detailPanelOpen"
      class="p-6 flex flex-col gap-8 max-w-[420px] border-l border-neutral-200"
    >
      <div class="flex justify-between">
        <span class="font-mono text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded">
          č.a. {{ detail.id }}
        </span>
        <ActivityLevel
          :level="localizationDegree"
          :label="true"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h1 class="text-heading-3">
          {{ title }}
        </h1>
        <p>
          okres {{ detail.district }}
        </p>
        <p class="text-sm text-neutral-500">
          {{ detail.position }}
        </p>
      </div>

      <DetailSection
        v-if="detail.attachments?.length"
        title="Dokumenty"
      >
        <div class="flex flex-col gap-2">
          <DocumentCard
            v-for="(attachment, i) in detail.attachments"
            :key="i"
            :name="attachment.name"
            :available="attachment.available"
            :size="attachment.size"
            :pages="attachment.pages"
            @click="openAttachment(attachment)"
          />
        </div>
      </DetailSection>

      <DetailSection
        v-if="detail.galleries?.length"
        title="Obrázky"
      >
        <template #actions>
          <BaseButton
            size="small"
            variant="secondary"
            @click="$router.push({ name: 'DetailGallery' })"
          >
            Otvoriť galériu
            <BaseIcon icon="arrowRight" />
          </BaseButton>
        </template>
        <div class="grid grid-cols-2 gap-2">
          <GalleryCard
            v-for="(gallery, i) in detail.galleries"
            :key="i"
            :title="gallery.title"
            :image-count="gallery.images.length"
            :preview="gallery.images[0]?.thumbnail || ''"
            @click="$router.push({ name: 'DetailGallery' })"
          />
        </div>
      </DetailSection>

      <DetailSection
        v-if="detail.youtube_id"
        title="Video"
      >
        <div class="relative w-full aspect-video">
          <iframe
            class="absolute inset-0 w-full h-full rounded-lg"
            :src="`https://www.youtube.com/embed/${detail.youtube_id}`"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
      </DetailSection>

      <DetailSection title="Datovanie a druh náleziska">
        <div class="flex gap-2">
          <ActivityChip
            v-for="(item, i) in detail.dating_ns"
            :key="i"
          >
            {{ item }}
          </ActivityChip>
        </div>
      </DetailSection>


      <h2>Údaje</h2>
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

    <div
      v-if="!isLoaded"
      class="bg-neutral-100 flex-1 h-[calc(100vh-56px)]"
    />

    <div
      v-if="!isLoaded"
      class="w-[420px]"
    />

    <ModalAttachmentRequest
      :is-open="requestAttachmentModalVisible"
      @close="requestAttachmentModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import {
  BaseButton,
  BaseIcon,
} from '@metafori/components';
import ActivityChip from '@/components/ActivityChip.vue';
import ActivityLevel from '@/components/ActivityLevel.vue';
import DetailSection from '@/components/Detail/DetailSection.vue';
import DetailTable from '@/components/Detail/DetailTable.vue';
import DocumentCard from '@/components/Detail/DocumentCard.vue';
import ModalAttachmentRequest from '@/components/Detail/ModalAttachmentRequest.vue';
import GalleryCard from '@/components/Detail/GalleryCard.vue';

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
const localizationDegree = computed(() => detail.value.localization_degree as 1 | 2 | 3);

// Tables
const tables = computed(() => [
  {
    title: 'Identifikačné údaje',
    items: [
      { label: 'Číslo aktivity', value: `č. a. ${detail.value.id}` },
      { label: 'ČVS', value: detail.value.cvs_number },
      { label: 'Rok zaevidovania', value: detail.value.registration_year },
      { label: 'Rok aktivity', value: detail.value.activity_year_start },
      { label: 'Druh aktivity', value: detail.value.activity_type },
      { label: 'Číslo akcie', value: detail.value.action_number },
    ],
  },
  {
    title: 'Geografické údaje',
    items: [
      { label: 'Katastrálne územie', value: detail.value.cadastral_area },
      { label: 'Obec', value: detail.value.municipality },
      { label: 'Poloha', value: detail.value.position },
      { label: 'Okres', value: detail.value.district },
    ],
  },
  {
    title: 'Personálne údaje',
    items: [
      { label: 'Vedúci výskumu', value: detail.value.research_leader },
      { label: 'Autor – NS', value: detail.value.author_ns },
      { label: 'Inštitúcia', value: detail.value.institution },
    ],
  },
  {
    title: 'Lokalizácia',
    items: [
      { label: 'Stupeň lokalizácie', value: detail.value.localization_degree },
      { label: 'Existuje GIS vrstva', value: detail.value.has_gis_link },
      { label: 'Súradnica X', value: detail.value.coordinate_x },
      { label: 'Súradnica Y', value: detail.value.coordinate_y },
    ],
  },
]);

// TODO: Refactor to separate function
const title = computed(() => {
  if (detail.value.municipality === detail.value.cadastral_area) {
    return detail.value.municipality;
  }
  return `${detail.value.municipality} • ${detail.value.cadastral_area}`;
});

// Attachments
const requestAttachmentModalVisible = ref(false);
const openAttachment = (attachment: { available: boolean; link?: string; }) => {
  if (attachment.available) {
    window.open(attachment.link);
  }
  else {
    requestAttachmentModalVisible.value = true;
  }
};

</script>
