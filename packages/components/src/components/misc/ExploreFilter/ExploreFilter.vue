<template>
  <div
    class="mb-16"
  >
    <div
      class="py-6 mb-8 border-b-2 border-border-default"
      :class="{
        'bg-primary-500': highlight === 'filter'
      }"
    >
      <div class="container">
        <ExploreSearchInput
          v-model="query"
          class="mb-10"
          :class="{
            'text-primary-500': highlight === 'search',
          }"
        />
        <div>
          <h2 class="mb-2 text-label text-text-tertiary">
            {{ t('exploreFilter.filterResults') }}
          </h2>
          <div class="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-4">
            <InputMultiselect
              v-for="filterGroup in filterGroups"
              :key="filterGroup.key"
              v-model="filterGroup.model.value"
              :options="filterGroup.options"
              :label="t(filterGroup.labelKey)"
              class="flex-1 md:min-w-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container flex justify-between">
      <div class="flex items-center gap-3">
        <h3 class="label text-text-tertiary">
          {{ t('exploreFilter.appliedFilters') }}
        </h3>

        <div class="flex flex-wrap gap-2">
          <AppliedFilterChip
            v-for="filter in appliedFilters"
            :key="`${filter.filterKey}-${filter.value}`"
            :label="filter.filterLabel"
            :value="filter.valueLabel"
            @clear="filter.clear()"
          />
        </div>
      </div>
      <div>
        <BaseButton
          variant="secondary"
          @click="clearAllFilters"
        >
          {{ t('exploreFilter.clearAll') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  InputMultiselect,
  BaseButton,
  AppliedFilterChip,
} from '@metafori/components';
import ExploreSearchInput from './ExploreSearchInput.vue';

const {
  highlight = undefined,
} = defineProps<{
  highlight?: 'filter' | 'search' | undefined
}>();

const { t } = useI18n();

const query = ref('');

// TODO: replace with filter options provided by the API.
const filterGroups = [
  {
    key: 'author',
    labelKey: 'exploreFilter.groups.author',
    model: ref<string[]>([]),
    options: [
      { value: 'PICASSO', label: 'Pablo Picasso' },
      { value: 'MATISSE', label: 'Henri Matisse' },
      { value: 'CHAGALL', label: 'Marc Chagall' },
      { value: 'KOLLWITZ', label: 'Käthe Kollwitz' },
      { value: 'FILLA', label: 'Emil Filla' },
    ],
  },
  {
    key: 'artType',
    labelKey: 'exploreFilter.groups.artType',
    model: ref<string[]>([]),
    options: [
      { value: 'PAINTING', label: 'Maľba' },
      { value: 'DRAWING', label: 'Kresba' },
      { value: 'GRAPHICS', label: 'Grafika' },
      { value: 'SCULPTURE', label: 'Socha' },
      { value: 'PHOTOGRAPHY', label: 'Fotografia' },
    ],
  },
  {
    key: 'technique',
    labelKey: 'exploreFilter.groups.technique',
    model: ref<string[]>([]),
    options: [
      { value: 'OIL', label: 'Olej' },
      { value: 'LITHOGRAPH', label: 'Litografia' },
      { value: 'ETCHING', label: 'Lept' },
      { value: 'WOODCUT', label: 'Drevorez' },
      { value: 'WATERCOLOR', label: 'Akvarel' },
    ],
  },
  {
    key: 'material',
    labelKey: 'exploreFilter.groups.material',
    model: ref<string[]>([]),
    options: [
      { value: 'CANVAS', label: 'Plátno' },
      { value: 'PAPER', label: 'Papier' },
      { value: 'WOOD', label: 'Drevo' },
      { value: 'BRONZE', label: 'Bronz' },
    ],
  },
  {
    key: 'year',
    labelKey: 'exploreFilter.groups.year',
    model: ref<string[]>([]),
    options: [
      { value: '1930S', label: '1930 – 1939' },
      { value: '1940S', label: '1940 – 1949' },
      { value: '1950S', label: '1950 – 1959' },
      { value: '1960S', label: '1960 – 1969' },
    ],
  },
];

const appliedFilters = computed(() => filterGroups.flatMap((group) => group.options
  .filter((option) => group.model.value.includes(option.value))
  .map((option) => ({
    filterKey: group.key,
    value: option.value,
    filterLabel: t(group.labelKey),
    valueLabel: option.label,
    clear: () => {
      group.model.value = group.model.value.filter((v) => v !== option.value);
    },
  }))));

function clearAllFilters() {
  filterGroups.forEach((group) => {
    group.model.value = [];
  });
}

</script>
