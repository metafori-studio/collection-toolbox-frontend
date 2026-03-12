<template>
  <div class="@container flex-1">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-heading-4">
        {{ items.length }} aktivít
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
    <ActivityCardList
      :items="sortedItems"
      class="@3xl:hidden"
    />
    <ActivityTable
      :items="sortedItems"
      class="hidden @3xl:block"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import {
  BaseButton,
  InputSelect,
} from '@metafori/components';
import ActivityTable from './ActivityTable.vue';
import ActivityCardList from './ActivityCardList.vue';
import BaseIcon from '../../../../../packages/components/src/components/atoms/BaseIcon/BaseIcon.vue';

const {
  items = [],
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
}>();

const orderAsc = ref(true);
const orderBy = ref('id');
const orderByOptions = [
  { label: 'Číslo aktivity', value: 'id' },
  { label: 'Obec', value: 'municipality' },
  { label: 'Katastrálne územie', value: 'cadastral_area' },
  { label: 'Okres', value: 'district' },
  { label: 'Poloha', value: 'position' },
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

</script>
