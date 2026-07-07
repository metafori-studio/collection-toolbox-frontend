<template>
  <div class="container py-6">
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
          class="w-[180px]"
          :options="orderbyOptions"
        />
      </label>
    </div>
    <div class="">
      <div class="flex flex-col gap-4 md:grid md:grid-cols-4 mb-16">
        <ArtworkCard
          v-for="item in items"
          :key="item.id"
          :image="item.image"
          :title="item.title"
          :author="item.author"
          :year="item.year"
          :to="{ name: 'ArtworkDetail', params: { id: item.id } }"
        />
      </div>
      <div class="flex flex-col items-center gap-8">
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
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import {
  InputSelect,
  ArtworkCard,
  BaseButton,
} from '@metafori/components';

import { pluralize } from '@metafori/shared';
import { getList, type Artwork } from '@/api';

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
const artworkCountReadable = computed(() => `${total.value} ${pluralize(total.value, ['dielo', 'diela', 'diel'])}`);

const loadItems = async () => {
  page.value = 1;
  const result = await getList(orderBy.value, 1);
  items.value = result.data;
  total.value = result.meta.total;
};

const loadMore = async () => {
  page.value += 1;
  const result = await getList(orderBy.value, page.value);
  items.value = [...items.value, ...result.data];
};

watch(orderBy, loadItems);
loadItems();
</script>
