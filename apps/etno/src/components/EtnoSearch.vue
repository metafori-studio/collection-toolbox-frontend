<template>
  <div class="relative md:w-[600px]">
    <InputText
      v-model="query"
      icon="magnifyingGlass"
      placeholder="Prehľadaj Etno Explorer"
    />
    <div
      v-if="showResults"
      class="absolute z-30 left-0 right-0 top-14 max-h-[calc(100vh-80px)] text-left bg-white border border-neutral-200 rounded-lg flex flex-col overflow-hidden"
    >
      <div class="px-4 py-3">
        {{ resultsLabel }}
      </div>
      <div class="flex-1 overflow-auto">
        <ItemPreview
          v-for="(item, i) in itemsDisplayed"
          :key="i"
          :item="item"
          :is-last="i === itemsDisplayed.length - 1"
          @click="query = ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { InputText } from '@metafori/components';
import ItemPreview from '@/components/ItemPreview.vue';
import { getList } from '@/api';
import { pluralize } from '@/misc/pluralize';

const itemsAll = ref<Record<string, unknown>[]>([]);


const query = ref('');

const normalize = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
};

const itemsDisplayed = computed(() => {
  if (!query.value) {
    return [];
  }
  const normalizedQuery = normalize(query.value);
  return itemsAll.value.filter((item) => {
    if (typeof item.title !== 'string') {
      return false;
    }
    const normalizedTitle = normalize(item.title as string);
    return normalizedTitle.includes(normalizedQuery);
  });
});

const resultsLabel = computed(() => {
  const len = itemsDisplayed.value.length;
  const pluralized = pluralize(len, ['výsledok', 'výsledky', 'výsledkov']);
  return `${len} ${pluralized} vyhľadávania`;
});

const showResults = computed(() => query.value.length > 0);

onMounted(async() => {
  itemsAll.value = await getList();
});

</script>
