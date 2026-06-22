<template>
  <div
    ref="widgetEl"
    class="fixed z-20 left-0 top-14 md:left-4 md:top-26 flex items-start gap-4"
  >
    <FilterCard
      :class="{
        'hidden md:flex': nowOpen,
      }"
    >
      <div class="flex gap-2 items-center font-bold">
        <BaseIcon
          icon="filter"
        />
        <h2>{{ $t('filter.title') }}</h2>
        <BaseButton
          class="ml-auto"
          variant="danger-secondary"
          size="small"
          @click="resetAll"
        >
          {{ $t('filter.reset') }}
        </BaseButton>
      </div>
      <FilterSection
        v-for="(section, i) in filterSections"
        :key="i"
        :label="$t(section.title)"
        :icon="section.icon"
      >
        <FilterItem
          v-for="(item, j) in section.items"
          :key="j"
          :label="$t(item.label)"
          :selected-count="(filterValues[item.id] as string[] | undefined)?.length ?? 0"
          :active="item.id === nowOpen"
          @click="openItem(item)"
          @clear="resetItem(item)"
        />
      </FilterSection>
    </FilterCard>

    <FilterCard
      v-if="nowOpen"
    >
      <div class="flex gap-2 items-center font-bold">
        <BaseButton
          @click="closeItem()"
        >
          <BaseIcon icon="arrowLeft" />
        </BaseButton>
        <h3>
          {{ $t(nowOpenObj!.label) }}
        </h3>
        <BaseButton
          class="ml-auto"
          variant="danger-secondary"
          size="small"
          @click="resetItem(nowOpenObj!)"
        >
          {{ $t('filter.reset') }}
        </BaseButton>
      </div>
      <div
        v-if="nowOpenObj!.type === 'checkbox'"
      >
        <InputText
          v-model="query"
          icon="magnifyingGlass"
          class="mb-2"
        />
        <InputCheckboxList
          v-model="(filterValues as Record<string, string[]>)[nowOpen!]"
          :name="nowOpenObj!.id!"
          :options="getOptions(nowOpenObj!.id) ?? []"
          class="-ml-4 -mr-4"
        />
        <div
          v-if="!getOptions(nowOpenObj!.id)?.length"
          class="pt-4 pb-2 text-sm"
        >
          {{ $t('filter.noResults') }}
        </div>
      </div>
      <InputRange
        v-if="nowOpenObj!.type === 'range'"
        v-model="(filterValues as Record<string, RangeValue>)[nowOpen!]"
        :min="1920"
        :max="2025"
      />
    </FilterCard>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { useI18n } from 'vue-i18n';

import {
  BaseIcon,
  BaseButton,
  FilterSection,
  FilterItem,
  InputCheckboxList,
  InputRange,
  InputText,

  type RangeValue,
} from '@metafori/components';
import FilterCard from './FilterCard.vue';

import { filterWidgetWidthRaw, filterValues, resetFilterValues, resetFilterItem } from '@/store';
import { normalizeString } from '@metafori/shared';
import {
  type FilterItem as FilterItemDef,
  type AggregationOption,
} from '@/misc/filterTypes';
import { filterSections } from '@/misc/filterSections';

const { t } = useI18n();

const {
  aggregations = {},
} = defineProps<{
  aggregations?: Record<string, AggregationOption[]>;
}>();


const widgetEl = ref<HTMLElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    if (entries[0]) filterWidgetWidthRaw.value = entries[0].contentRect.width;
  });
  if (widgetEl.value) resizeObserver.observe(widgetEl.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// Query
const query = ref('');

const getOptions = (property: string) => {
  const allOptions = aggregations[property];
  const enumNamespace = nowOpenObj.value?.enumNamespace;

  const translated = allOptions?.map((option) => ({
    ...option,
    label: enumNamespace
      ? t(`enums.${enumNamespace}.${option.label}`, option.label)
      : option.label,
  }));

  if (!query.value) return translated;

  const normalizedQuery = normalizeString(query.value);
  return translated?.filter((option: AggregationOption) => normalizeString(option.label).includes(normalizedQuery));
};

//
const allFilterItems = filterSections.flatMap((s) => s.items);

const nowOpen = ref<string | null>(null);
const nowOpenObj = computed(() => allFilterItems.find((item) => item.id === nowOpen.value) ?? null);
const openItem = (item: FilterItemDef) => {
  nowOpen.value = item.id ?? null;
  query.value = '';
};
const closeItem = () => nowOpen.value = null;
const resetItem = (item: FilterItemDef) => resetFilterItem(item.id);
const resetAll = () => resetFilterValues();

</script>
