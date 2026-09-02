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
          Zoradenie
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
          title="Nepodarilo sa načítať diela"
          text="Skúste to prosím znova."
        >
          <template #action>
            <BaseButton @click="loadItems">
              Skúsiť znova
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
            Zobrazených 1-{{ items.length }} z {{ total }} diel.
          </div>
          <BaseButton
            v-if="items.length < total"
            variant="secondary"
            @click="loadMore"
          >
            Zobraziť ďalšie
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { MasonryWall } from '@yeger/vue-masonry-wall';
import ExploreFilter from '../../misc/ExploreFilter';

import {
  InputSelect,
  ArtworkCard,
  BaseButton,
  ErrorState,
} from '@metafori/components';

import { pluralize } from '@metafori/shared';
import { type Artwork, type ArtworkListResponse } from '../../../types/artwork';

const {
  getList,
  highlight = undefined,
} = defineProps<{
  getList: (orderBy: string, page: number) => Promise<ArtworkListResponse>
  highlight?: 'filter' | 'search' | undefined
}>();

// Items
const orderBy = ref('age');

const orderbyOptions = [
  { label: 'Od najnovšieho', value: 'age' },
  { label: 'Od najstaršieho', value: '-age' },
  { label: 'Podľa ID', value: 'id' },
];

const items = ref<Artwork[]>([]);
const total = ref(0);
const page = ref(1);
const error = ref(false);
const artworkCountReadable = computed(() => `${total.value} ${pluralize(total.value, ['dielo', 'diela', 'diel'])}`);

let requestId = 0;

const loadItems = async () => {
  const currentRequestId = ++requestId;
  page.value = 1;
  error.value = false;
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
  }
};

const loadMore = async () => {
  const currentRequestId = ++requestId;
  page.value += 1;
  try {
    const result = await getList(orderBy.value, page.value);
    if (currentRequestId !== requestId) {
      return;
    }
    items.value = [...items.value, ...result.data];
  } catch {
    if (currentRequestId !== requestId) {
      return;
    }
    page.value -= 1;
    error.value = true;
  }
};

watch(orderBy, loadItems);
loadItems();
</script>
