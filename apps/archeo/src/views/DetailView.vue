<template>
  <div
    class="flex flex-col md:flex-row md:items-start min-h-screen"
  >
    <router-view
      v-if="isLoaded"
      :detail="detail"
      :galleries="detail.galleries"
    />
    <div
      v-if="isLoaded && detailPanelOpen"
      class="p-6 flex flex-col gap-8 md:max-w-[420px] md:border-l border-neutral-200"
    >
      <div class="flex justify-between">
        <span class="font-mono text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded">
          {{ $t('detail.activityNumber', { id: detail.id }) }}
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
          {{ $t('detail.district', { district: detail.district }) }}
        </p>
        <p class="text-sm text-neutral-500">
          {{ detail.position }}
        </p>
      </div>

      <DetailSection
        v-if="detail.attachments?.length"
        :title="$t('detail.sections.documents')"
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
        v-if="detail.youtube_id"
        :title="$t('detail.sections.video')"
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

      <DetailSection
        v-if="detail.dating_ns?.length"
        :title="$t('detail.sections.datingType')"
      >
        <div class="flex flex-wrap gap-2">
          <ActivityChip
            v-for="(item, i) in detail.dating_ns"
            :key="i"
          >
            {{ item }}
          </ActivityChip>
        </div>
      </DetailSection>

      <h2 class="text-heading-4">
        {{ $t('detail.sections.data') }}
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

      <DetailSection
        v-if="detail.galleries?.length"
        :title="$t('detail.sections.images')"
      >
        <template #actions>
          <BaseButton
            size="small"
            variant="secondary"
            @click="$router.push({ name: 'DetailGallery' })"
          >
            {{ $t('detail.openGallery') }}
            <BaseIcon icon="arrowRight" />
          </BaseButton>
        </template>
        <div class="grid grid-cols-2 gap-2">
          <GalleryCard
            v-for="(gallery, i) in detail.galleries"
            :key="i"
            :to="{ name: 'DetailGallery' }"
            :title="gallery.title"
            :image-count="gallery.images.length"
            :preview="gallery.images[0]?.thumbnail || ''"
          />
        </div>
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
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n();

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
    title: t('detail.sections.identification'),
    items: [
      {
        label: t('detail.table.activityNumber'),
        value: t('detail.activityNumber', { id: detail.value.id }),
      },
      { label: t('detail.table.cvs'), value: detail.value.cvs_number },
      { label: t('detail.table.registrationYear'), value: detail.value.registration_year },
      { label: t('detail.table.activityYear'), value: detail.value.activity_year_start },
      { label: t('detail.table.activityType'), value: detail.value.activity_type },
    ],
  },
  {
    title: t('detail.sections.geographic'),
    items: [
      { label: t('detail.table.cadastralArea'), value: detail.value.cadastral_area },
      { label: t('detail.table.municipality'), value: detail.value.municipality },
      { label: t('detail.table.position'), value: detail.value.position },
      { label: t('detail.table.district'), value: detail.value.district },
    ],
  },
  {
    title: t('detail.sections.personnel'),
    items: [
      { label: t('detail.table.researchLeader'), value: detail.value.research_leader },
      { label: t('detail.table.authorNs'), value: detail.value.author_ns },
      { label: t('detail.table.institution'), value: detail.value.institution },
    ],
  },
  {
    title: t('detail.sections.localization'),
    items: [
      { label: t('detail.table.localizationDegree'), value: detail.value.localization_degree },
      { label: t('detail.table.hasGisLink'), value: detail.value.has_gis_link },
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
