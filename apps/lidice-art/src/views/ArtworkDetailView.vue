<template>
  <div>
    <div class="flex flex-col md:flex-row">
      <div class="flex-1 bg-neutral-700 min-h-[260px]" />
      <div
        v-if="!isLoading && detail"
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
      <h2 class="text-heading-2">
        Súčasť…
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import {
  BreadcrumbList,
  DetailSection,
  MetadataTable,
} from '@metafori/components';
import { getById, type ArtworkDetail } from '@/api';

const {
  id,
} = defineProps<{
  id: string
}>();

const isLoading = ref(false);
const detail = ref<ArtworkDetail | null>(null);

const loadDetail = async () => {
  isLoading.value = true;
  detail.value = await getById(id);
  isLoading.value = false;
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
      value: detail.value.aquisition.method,
    },
    {
      label: 'Rok akvizície',
      value: detail.value.aquisition.year,
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
