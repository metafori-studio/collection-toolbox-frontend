<template>
  <div
    v-if="error"
    class="flex justify-center py-16"
  >
    <ErrorState
      title="Nepodarilo sa načítať dielo"
      text="Skúste to prosím znova."
    >
      <template #action>
        <BaseButton @click="loadDetail">
          Skúsiť znova
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
            { label: 'Katalóg', to: { name: 'Explore' } },
            { label: 'Detail diela' },
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
          title="Údaje o diele"
        >
          <MetadataTable
            :items="metadataItems"
          />
        </DetailSection>

        <DetailSection
          title="Licencia"
        >
          <p>Copyright © Památník Lidice/Lidice Memorial</p>
        </DetailSection>
      </div>
    </div>
    <div class="container py-16">
      <h2 class="text-heading-2 mb-4">
        Súčasť {{ detail.collections.length }} kolekcie
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
} = defineProps<{
  id: string
  getById: (id: string) => Promise<ArtworkDetail>
}>();

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
      label: 'Datace',
      value: detail.value.dating,
    },
    {
      label: 'Rozměry',
      value: `${detail.value.dimensions.width} x ${detail.value.dimensions.height}`,
    },
    {
      label: 'Materiál',
      value: detail.value.material,
    },
    {
      label: 'Technika',
      value: detail.value.technique,
    },
    {
      label: 'Spôsob akvizície',
      value: detail.value.acquisition.method,
    },
    {
      label: 'Rok akvizície',
      value: detail.value.acquisition.year,
    },
    {
      label: 'Lokácia / pôvod',
      value: detail.value.location_origin,
    },
    {
      label: 'Inventární číslo',
      value: detail.value.inventory_number,
    },
  ];
});

watch(() => id, loadDetail, { immediate: true });
</script>
