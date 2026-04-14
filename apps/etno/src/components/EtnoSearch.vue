<template>
  <div class="relative md:w-[600px]">
    <label
      for="appSearch"
      class="absolute z-10 left-9 top-2.5 text-neutral-400 text-sm font-normal"
      :class="{
        'sr-only': !showLabel,
      }"
    >
      <i18n-t
        keypath="search.label"
        tag="span"
      >
        <template #title>
          <span class="font-bold text-neutral-900">
            {{ $t('appName') }}
          </span>
        </template>
      </i18n-t>
    </label>
    <InputText
      id="appSearch"
      v-model="query"
      icon="magnifyingGlass"
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
import { useI18n } from 'vue-i18n';

import { InputText } from '@metafori/components';
import ItemPreview from '@/components/ItemPreview.vue';
import { getList } from '@/api';
import { pluralize } from '@/misc/pluralize';

const { t } = useI18n();

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
  const results = pluralize(len, [
    t('search.results.singular'),
    t('search.results.few'),
    t('search.results.many'),
  ]);
  return t('search.resultsLabel', { count: len, results });
});

const showResults = computed(() => query.value.length > 0);

// Label
const showLabel = computed(() => {
  if (query.value) {
    return false;
  }
  return true;
});

onMounted(async() => {
  itemsAll.value = (await getList()).data;
});

</script>
