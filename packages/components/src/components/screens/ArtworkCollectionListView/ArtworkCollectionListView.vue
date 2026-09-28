<template>
  <div>
    <div class="bg-header-bg">
      <div class="container py-16">
        <h1 class="text-display-3">
          {{ t('collectionList.title') }}
        </h1>
        <p class="text-xl">
          {{ t('collectionList.subtitle') }}
        </p>
      </div>
      <div class="container flex flex-col gap-10 py-16">
        <ArtworkCollectionCard
          v-for="collection in collections.highlighted"
          :key="collection.id"
          :collection="collection"
          layout="horizontal"
          show-button
          @open="$router.push({
            name: 'CollectionDetail',
            params: { id: collection.id },
          })"
        />
      </div>
    </div>
    <div>
      <div class="container py-16">
        <div class="flex justify-between mb-10">
          <h2 class="text-heading-2">
            {{ t('collectionList.otherCollections') }}
          </h2>
          <div class="flex items-center gap-4">
            <label
              class="text-label text-text-tertiary"
              for="collections-orderby"
            >
              {{ t('collectionList.orderBy') }}
            </label>
            <InputSelect
              id="collections-orderby"
              v-model="orderBy"
              class="md:w-[180px]"
              :options="orderByOptions"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
          <ArtworkCollectionCard
            v-for="collection in collections.rest"
            :key="collection.id"
            :collection="collection"
            layout="vertical"
            show-button
            @open="$router.push({
              name: 'CollectionDetail',
              params: { id: collection.id },
            })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ArtworkCollectionCard from '../../cards/ArtworkCollectionCard';
import InputSelect from '../../atoms/InputSelect';

import { type ArtworkCollectionListResponse } from '../../../types/artwork';

const {
  getCollections,
} = defineProps<{
  getCollections: (orderBy: string) => Promise<ArtworkCollectionListResponse>
}>();

const { t } = useI18n();

const orderBy = ref('-date');

const orderByOptions = computed(() => [
  { label: t('collectionList.orderByOptions.newest'), value: '-date' },
  { label: t('collectionList.orderByOptions.oldest'), value: 'date' },
  { label: t('collectionList.orderByOptions.name'), value: 'name' },
  { label: t('collectionList.orderByOptions.artworkCount'), value: '-artwork_count' },
]);

const collections = ref<ArtworkCollectionListResponse>({ highlighted: [], rest: [] });

const loadCollections = async () => {
  collections.value = await getCollections(orderBy.value);
};

watch(orderBy, loadCollections);
loadCollections();
</script>
