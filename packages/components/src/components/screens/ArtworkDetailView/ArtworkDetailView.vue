<template>
  <div
    v-if="error"
    class="flex justify-center py-16"
  >
    <ErrorState
      :title="t('artworkDetail.error.title')"
      :text="t('artworkDetail.error.text')"
    >
      <template #action>
        <BaseButton @click="loadDetail">
          {{ t('common.retry') }}
        </BaseButton>
      </template>
    </ErrorState>
  </div>
  <div v-else-if="!isLoading && detail">
    <div
      class="flex flex-col md:flex-row"
    >
      <div class="flex-1 bg-neutral-700 min-h-[260px]" />
      <div
        class="md:w-[400px] p-6 flex flex-col gap-8"
      >
        <BreadcrumbList
          :items="[
            { label: t('artworkDetail.breadcrumbCatalogue'), to: { name: 'Explore' } },
            { label: t('artworkDetail.breadcrumbCurrent') },
          ]"
        />

        <div class="flex flex-col gap-3">
          <p class="text-heading-4">
            {{ detail.author }}
          </p>
          <h1 class="text-heading-1">
            {{ detail.title }}
          </h1>
        </div>

        <DetailSection
          :title="t('artworkDetail.aboutArtwork')"
        >
          <MetadataTable
            :items="metadataItems"
          />
        </DetailSection>

        <DetailSection
          v-if="license"
          :title="t('artworkDetail.license')"
        >
          <p>{{ license }}</p>
        </DetailSection>
      </div>
    </div>
    <div class="container py-16">
      <h2 class="text-heading-2 mb-4">
        {{ t('artworkDetail.partOfCollections', { count: detail.collections.length }, detail.collections.length) }}
      </h2>
      <ArtworkCollectionCard
        v-for="collection in detail.collections"
        :key="collection.id"
        :collection="collection"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BreadcrumbList from '../../navigation/BreadcrumbList';
import DetailSection from '../../detail/DetailSection';
import MetadataTable from '../../detail/MetadataTable';
import ArtworkCollectionCard from '../../cards/ArtworkCollectionCard';
import ErrorState from '../../molecules/ErrorState';
import BaseButton from '../../atoms/BaseButton';
import { type ArtworkDetail } from '../../../types/artwork';

const {
  id,
  getById,
  license = undefined,
} = defineProps<{
  id: string
  getById: (id: string) => Promise<ArtworkDetail>
  license?: string
}>();

const { t } = useI18n();

const isLoading = ref(false);
const error = ref(false);
const detail = ref<ArtworkDetail | null>(null);

let requestId = 0;

const loadDetail = async () => {
  const currentRequestId = ++requestId;
  isLoading.value = true;
  error.value = false;
  try {
    const result = await getById(id);
    if (currentRequestId !== requestId) {
      return;
    }
    detail.value = result;
  } catch {
    if (currentRequestId !== requestId) {
      return;
    }
    error.value = true;
  } finally {
    if (currentRequestId === requestId) {
      isLoading.value = false;
    }
  }
};

const metadataItems = computed(() => {
  if (!detail.value) {
    return [];
  }
  return [
    {
      label: t('artworkDetail.metadata.dating'),
      value: detail.value.dating,
    },
    {
      label: t('artworkDetail.metadata.dimensions'),
      value: `${detail.value.dimensions.width} x ${detail.value.dimensions.height}`,
    },
    {
      label: t('artworkDetail.metadata.material'),
      value: detail.value.material,
    },
    {
      label: t('artworkDetail.metadata.technique'),
      value: detail.value.technique,
    },
    {
      label: t('artworkDetail.metadata.acquisitionMethod'),
      value: detail.value.acquisition.method,
    },
    {
      label: t('artworkDetail.metadata.acquisitionYear'),
      value: detail.value.acquisition.year,
    },
    {
      label: t('artworkDetail.metadata.locationOrigin'),
      value: detail.value.location_origin,
    },
    {
      label: t('artworkDetail.metadata.inventoryNumber'),
      value: detail.value.inventory_number,
    },
  ];
});

watch(() => id, loadDetail, { immediate: true });
</script>
