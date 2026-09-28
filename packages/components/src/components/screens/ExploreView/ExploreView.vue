<template>
  <div class="">
    <ExploreFilter
      :highlight="highlight"
    />

    <div class="container pb-8">
      <div class="flex items-center justify-between mb-8 min-h-[75px]">
        <h2 class="text-heading-2">
          {{ artworkCountReadable }}
        </h2>
        <label
          class="flex items-center gap-4"
          for="orderby"
        >
          {{ t('explore.orderBy') }}
          <InputSelect
            id="orderby"
            v-model="orderBy"
            class="md:w-[180px]"
            :options="orderbyOptions"
          />
        </label>
      </div>
      <div
        v-if="error"
        class="flex justify-center py-16"
      >
        <ErrorState
          :title="t('explore.error.title')"
          :text="t('explore.error.text')"
        >
          <template #action>
            <BaseButton @click="loadItems">
              {{ t('common.retry') }}
            </BaseButton>
          </template>
        </ErrorState>
      </div>
      <div v-else>
        <MasonryWall
          :items="items"
          :column-width="300"
          :gap="16"
        >
          <template #default="{ item }">
            <ArtworkCard
              :image="item.image"
              :image-width="item.imageWidth"
              :image-height="item.imageHeight"
              :title="item.title"
              :author="item.author"
              :year="item.year"
              :to="{ name: 'ArtworkDetail', params: { id: item.id } }"
            />
          </template>
        </MasonryWall>
        <div class="flex flex-col items-center gap-8 mt-8">
          <div class="text-center text-label">
            {{ t('explore.shownCount', { shown: items.length, total }) }}
          </div>
          <BaseButton
            v-if="items.length < total"
            variant="secondary"
            :disabled="isLoadingMore"
            @click="loadMore"
          >
            {{ t('explore.loadMore') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { MasonryWall } from '@yeger/vue-masonry-wall';
import ExploreFilter from '../../misc/ExploreFilter';

import {
  InputSelect,
  ArtworkCard,
  BaseButton,
  ErrorState,
} from '@metafori/components';

import { type Artwork, type ArtworkListResponse } from '../../../types/artwork';

const {
  getList,
  highlight = undefined,
} = defineProps<{
  getList: (orderBy: string, page: number) => Promise<ArtworkListResponse>
  highlight?: 'filter' | 'search' | undefined
}>();

const { t } = useI18n();

// Items
const orderBy = ref('age');

const orderbyOptions = computed(() => [
  { label: t('explore.orderByOptions.newest'), value: 'age' },
  { label: t('explore.orderByOptions.oldest'), value: '-age' },
  { label: t('explore.orderByOptions.id'), value: 'id' },
]);

const items = ref<Artwork[]>([]);
const total = ref(0);
const page = ref(1);
const error = ref(false);
const artworkCountReadable = computed(() => t('artwork.count', { count: total.value }, total.value));

const isLoadingItems = ref(false);
const isLoadingMore = ref(false);

let requestId = 0;

const loadItems = async () => {
  const currentRequestId = ++requestId;
  page.value = 1;
  error.value = false;
  isLoadingItems.value = true;
  // A new first page supersedes any in-flight load more request
  isLoadingMore.value = false;
  try {
    const result = await getList(orderBy.value, 1);
    if (currentRequestId !== requestId) {
      return;
    }
    items.value = result.data;
    total.value = result.meta.total;
  } catch {
    if (currentRequestId !== requestId) {
      return;
    }
    error.value = true;
  } finally {
    if (currentRequestId === requestId) {
      isLoadingItems.value = false;
    }
  }
};

const loadMore = async () => {
  if (isLoadingItems.value || isLoadingMore.value) {
    return;
  }
  const currentRequestId = ++requestId;
  const nextPage = page.value + 1;
  isLoadingMore.value = true;
  try {
    const result = await getList(orderBy.value, nextPage);
    if (currentRequestId !== requestId) {
      return;
    }
    page.value = nextPage;
    items.value = [...items.value, ...result.data];
  } catch {
    if (currentRequestId !== requestId) {
      return;
    }
    error.value = true;
  } finally {
    if (currentRequestId === requestId) {
      isLoadingMore.value = false;
    }
  }
};

watch(orderBy, loadItems);
loadItems();
</script>
