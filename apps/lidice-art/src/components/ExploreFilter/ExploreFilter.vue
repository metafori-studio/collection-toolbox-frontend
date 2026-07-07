<template>
  <div class="mb-16">
    <div class="bg-primary-500 py-6 mb-8">
      <div class="container">
        <ExploreSearchInput
          v-model="query"
          class="mb-10"
        />
        <div>
          <h2 class="mb-2 text-label text-text-tertiary">
            Filtrovať výlsedky
          </h2>
          <div class="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-4">
            <InputMultiselect
              v-for="filterGroup in filterGroups"
              :key="filterGroup.key"
              v-model="filterGroup.model.value"
              :options="filterGroup.options"
              :label="filterGroup.label"
              class="flex-1 md:min-w-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container flex justify-between">
      <div class="flex items-center gap-3">
        <h3 class="label text-text-tertiary">
          Aplikované filtre
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
          Odstrániť všetky filtre
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import {
  InputMultiselect,
  BaseButton,
  AppliedFilterChip,
} from '@metafori/components';
import ExploreSearchInput from './ExploreSearchInput.vue';

const query = ref('');

const filterGroups = [
  {
    key: 'author',
    label: 'Autor',
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
    label: 'Výtvarný druh',
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
    label: 'Technika',
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
    label: 'Materiál',
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
    label: 'Roky',
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
    filterLabel: group.label,
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
