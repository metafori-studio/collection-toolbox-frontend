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
        <h2>Filter aktivít</h2>
        <BaseButton
          class="ml-auto"
          variant="danger-secondary"
          size="small"
          @click="resetAll"
        >
          Reset
        </BaseButton>
      </div>
      <FilterSection
        v-for="(section, i) in filterSections"
        :key="i"
        :label="section.title"
        :icon="section.icon"
      >
        <FilterItem
          v-for="(item, j) in section.items"
          :key="j"
          :label="item.label"
          :selected-count="(filterValues[item.id] as string[] | undefined)?.length ?? 0"
          :active="item.id === nowOpen"
          @click="openItem(item)"
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
          {{ nowOpenObj!.label }}
        </h3>
        <BaseButton
          class="ml-auto"
          variant="danger-secondary"
          size="small"
          @click="resetItem(nowOpenObj!)"
        >
          Reset
        </BaseButton>
      </div>
      <InputCheckboxList
        v-if="nowOpenObj!.type === 'checkbox'"
        v-model="(filterValues as Record<string, string[]>)[nowOpen!]"
        :name="nowOpenObj!.id!"
        :options="nowOpenObj!.options ?? []"
      />
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
import { ref, computed, onMounted, onUnmounted } from 'vue';

import {
  BaseIcon,
  BaseButton,
  FilterSection,
  FilterItem,
  InputCheckboxList,
  InputRange,

  type RangeValue,
} from '@metafori/components';
import FilterCard from './FilterCard.vue';
import { filterWidgetWidthRaw } from '@/store';
import { type FilterItem as FilterItemDef } from '@/misc/filterTypes';
import { filterSections } from '@/misc/filterSections';

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


const allFilterItems = filterSections.flatMap((s) => s.items);
const filterDefaults = Object.fromEntries(allFilterItems.map((item) => [item.id, item.defaultValue ?? []]));
const filterValues = ref<Record<string, string[] | RangeValue>>(structuredClone(filterDefaults));

const nowOpen = ref<string | null>(null);
const nowOpenObj = computed(() => allFilterItems.find((item) => item.id === nowOpen.value) ?? null);
const openItem = (item: FilterItemDef) => nowOpen.value = item.id ?? null;
const closeItem = () => nowOpen.value = null;
const resetItem = (item: FilterItemDef) => {
  filterValues.value[item.id] = structuredClone(item.defaultValue);
};
const resetAll = () => filterValues.value = structuredClone(filterDefaults);

</script>
