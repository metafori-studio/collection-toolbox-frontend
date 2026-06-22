import { ref, computed } from 'vue';
import { type RangeValue } from '@metafori/components';
import { filterSections } from '@/misc/filterSections';

export const filterOpen = ref(window.innerWidth > 768);
export const filterWidgetWidthRaw = ref(0);
export const filterWidgetWidth = computed(() => filterOpen.value ? filterWidgetWidthRaw.value : 0);
export const detailPanelOpen = ref(true);
export const isLoggedIn = ref(false);

// Filter values
const allFilterItems = filterSections.flatMap((s) => s.items);
const filterDefaults = Object.fromEntries(allFilterItems.map((item) => [item.id, item.defaultValue ?? []]));
export const filterValues = ref<Record<string, string[] | RangeValue>>(structuredClone(filterDefaults));
export const resetFilterValues = () => { filterValues.value = structuredClone(filterDefaults); };
export const resetFilterItem = (id: string) => {
  const item = allFilterItems.find((i) => i.id === id);
  if (item) filterValues.value[id] = structuredClone(item.defaultValue ?? []);
};
