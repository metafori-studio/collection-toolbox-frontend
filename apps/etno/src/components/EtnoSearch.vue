<template>
  <div class="relative md:w-[600px]">
    <label
      for="appSearch"
      class="absolute z-10 left-9 top-2.5 text-neutral-400 text-sm font-normal"
      :class="{
        'sr-only': !showInputLabel,
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
      v-if="showDropdown"
      class="absolute z-30 left-0 right-0 top-14 text-left bg-white border border-neutral-200 rounded-lg"
    >
      <div
        v-if="isLoading"
        class="px-4 py-3"
      >
        {{ $t('search.loading') }}
      </div>
      <div
        v-else
        class="flex flex-col max-h-[calc(100vh-80px)]"
      >
        <div class="px-4 py-3">
          {{ resultsLabel }}
        </div>
        <div class="flex-1 overflow-auto">
          <ItemPreview
            v-for="(item, i) in results"
            :key="item.id"
            :item="item"
            :is-last="i === results.length - 1"
            @click="query = ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { InputText } from '@metafori/components';
import ItemPreview from '@/components/ItemPreview.vue';

import { pluralize } from '@metafori/shared';
import { useSearch } from '@/composables/useSearch';

const { t } = useI18n();

const { query, hasQuery, results, isLoading } = useSearch();

// Results display
const showDropdown = computed(() => hasQuery.value);

const resultsLabel = computed(() => {
  const len = results.value.length;
  const label = pluralize(len, [
    t('search.results.singular'),
    t('search.results.few'),
    t('search.results.many'),
  ]);
  return t('search.resultsLabel', { count: len, results: label });
});

// Input Label
const showInputLabel = computed(() => {
  if (query.value) {
    return false;
  }
  return true;
});

</script>
