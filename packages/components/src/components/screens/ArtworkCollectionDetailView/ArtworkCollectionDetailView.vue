<template>
  <div
    v-if="error"
    class="flex justify-center py-16"
  >
    <ErrorState
      :title="t('collectionDetail.error.title')"
      :text="t('collectionDetail.error.text')"
    >
      <template #action>
        <BaseButton @click="loadDetail">
          {{ t('common.retry') }}
        </BaseButton>
      </template>
    </ErrorState>
  </div>
  <div v-else-if="!isLoading && detail">
    <div class="bg-header-bg">
      <div class="container py-8 lg:py-16">
        <BreadcrumbList
          :items="[
            { label: t('collectionDetail.breadcrumbCollections'), to: { name: 'CollectionList' } },
            { label: detail.name },
          ]"
          class="mb-6 lg:mb-10"
        />
        <ArtworkCollectionImageGrid
          :images="detail.images"
          :title="detail.name"
          class="h-[240px] lg:h-[580px] mb-6 lg:mb-10"
        />
        <h1 class="text-display-3 mb-6">
          {{ detail.name }}
        </h1>
        <p class="text-lg mb-6">
          {{ detail.summary }}
        </p>
        <ArtworkCollectionMeta
          :collection="detail"
          class="border-t border-b py-4"
        />
      </div>
    </div>

    <div class="container py-16">
      ( backend provided content )
    </div>

    <div class="container pb-8">
      <h2 class="text-heading-2 mb-8">
        {{ artworkCountReadable }}
      </h2>
      <div
        v-if="artworksError"
        class="flex justify-center py-16"
      >
        <ErrorState
          :title="t('explore.error.title')"
          :text="t('explore.error.text')"
        >
          <template #action>
            <BaseButton @click="loadArtworks">
              {{ t('common.retry') }}
            </BaseButton>
          </template>
        </ErrorState>
      </div>
      <div v-else>
        <MasonryWall
          :items="artworks"
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
            {{ t('explore.shownCount', { shown: artworks.length, total }) }}
          </div>
          <BaseButton
            v-if="artworks.length < total"
            variant="secondary"
            @click="loadMore"
          >
            {{ t('explore.loadMore') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { MasonryWall } from '@yeger/vue-masonry-wall';
import ArtworkCard from '../../cards/ArtworkCard';
import ErrorState from '../../molecules/ErrorState';
import BaseButton from '../../atoms/BaseButton';
import BreadcrumbList from '../../navigation/BreadcrumbList';
import ArtworkCollectionImageGrid from '../../molecules/ArtworkCollectionImageGrid';
import ArtworkCollectionMeta from '../../molecules/ArtworkCollectionMeta';
import {
  type Artwork,
  type ArtworkCollectionDetail,
  type ArtworkListResponse,
} from '../../../types/artwork';

const {
  id,
  getCollectionById,
  getCollectionArtworks,
} = defineProps<{
  id: string
  getCollectionById: (id: string) => Promise<ArtworkCollectionDetail>
  getCollectionArtworks: (id: string, page: number) => Promise<ArtworkListResponse>
}>();

const { t } = useI18n();

// Detail
const isLoading = ref(false);
const error = ref(false);
const detail = ref<ArtworkCollectionDetail | null>(null);

let detailRequestId = 0;

const loadDetail = async () => {
  const currentRequestId = ++detailRequestId;
  isLoading.value = true;
  error.value = false;
  try {
    const result = await getCollectionById(id);
    if (currentRequestId !== detailRequestId) {
      return;
    }
    detail.value = result;
  } catch {
    if (currentRequestId !== detailRequestId) {
      return;
    }
    error.value = true;
  } finally {
    if (currentRequestId === detailRequestId) {
      isLoading.value = false;
    }
  }
};

// Artworks
const artworks = ref<Artwork[]>([]);
const total = ref(0);
const page = ref(1);
const artworksError = ref(false);
const artworkCountReadable = computed(() => t('collectionDetail.artworkCount', { count: total.value }, total.value));

let artworksRequestId = 0;

const loadArtworks = async () => {
  const currentRequestId = ++artworksRequestId;
  page.value = 1;
  artworksError.value = false;
  try {
    const result = await getCollectionArtworks(id, 1);
    if (currentRequestId !== artworksRequestId) {
      return;
    }
    artworks.value = result.data;
    total.value = result.meta.total;
  } catch {
    if (currentRequestId !== artworksRequestId) {
      return;
    }
    artworksError.value = true;
  }
};

const loadMore = async () => {
  const currentRequestId = ++artworksRequestId;
  page.value += 1;
  try {
    const result = await getCollectionArtworks(id, page.value);
    if (currentRequestId !== artworksRequestId) {
      return;
    }
    artworks.value = [...artworks.value, ...result.data];
  } catch {
    if (currentRequestId !== artworksRequestId) {
      return;
    }
    page.value -= 1;
    artworksError.value = true;
  }
};

watch(() => id, () => {
  loadDetail();
  loadArtworks();
}, { immediate: true });
</script>
