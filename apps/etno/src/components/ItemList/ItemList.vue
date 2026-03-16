<template>
  <div class="@container flex-1">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-heading-4">
        {{ items.length }} objektov
      </h2>
      <div class="flex items-center gap-2">
        <label for="orderBy">
          Zoradiť podľa
        </label>
        <InputSelect
          id="orderBy"
          v-model="orderBy"
          :options="orderByOptions"
        />
        <BaseButton
          variant="secondary"
          @click="orderAsc = !orderAsc"
        >
          <BaseIcon
            :icon="orderAsc ? 'arrowUp' : 'arrowDown'"
          />
        </BaseButton>
      </div>
    </div>
    <ItemCardList
      :items="pagedItems"
    />
    <ItemListPagination
      v-model="currentPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

import {
  BaseButton,
  InputSelect,
  BaseIcon,
} from '@metafori/components';
import ItemCardList from './ItemCardList.vue';
import ItemListPagination from './ItemListPagination.vue';

const PAGE_SIZE = 20;

const {
  items = [],
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
}>();

const orderAsc = ref(true);
const orderBy = ref('id');
const currentPage = ref(1);
const orderByOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Názov', value: 'name' },
  { label: 'Čas aktivity', value: 'year' },
];

const sortedItems = computed(() => {
  const direction = orderAsc.value ? 1 : -1;

  return [...items].sort((a, b) => {
    const valA = a[orderBy.value];
    const valB = b[orderBy.value];

    if (valA < valB) return -direction;
    if (valA > valB) return direction;
    return 0;
  });
});

const totalPages = computed(() => Math.ceil(sortedItems.value.length / PAGE_SIZE));

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return sortedItems.value.slice(start, start + PAGE_SIZE);
});

watch([orderBy, orderAsc], () => {
  currentPage.value = 1;
});

</script>
