<template>
  <div
    class="flex flex-col md:flex-row"
  >
    <div class="p-4 flex-1 border-r border-neutral-200">
      <ItemList
        :items="items"
        :meta="itemsMeta"
        :order-by="orderBy"
        :order-asc="orderAsc"
        @update:order-by="orderBy = $event"
        @update:order-asc="orderAsc = $event"
        @update:page="page = $event"
      />
    </div>

    <DetailSidebar
      v-if="isLoaded"
      :detail="detail"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
} from 'vue';
import {
  getDocument,
  getList,
  type Detail,
  type ListItem,
  type ListMeta,
} from '@/api';
import DetailSidebar from '@/components/Detail/DetailSidebar.vue';
import ItemList from '@/components/ItemList/ItemList.vue';
import { useListControls } from '@/composables/useListControls';

const {
  id,
} = defineProps<{
  id: string
}>();

const detail = ref<Detail>({} as Detail);
const items = ref<ListItem[]>([]);
const itemsMeta = ref<ListMeta>({});

// View state - list controls
const {
  orderBy,
  orderAsc,
  page,
  reloadTriggers,
} = useListControls();

const isLoaded = computed(() => !!detail.value.id);

// Loaders
const loadDetail = async () => {
  detail.value = await getDocument(id);
};

const loadItems = async () => {
  const response = await getList({ document_id: [id] }, orderBy.value, orderAsc.value, page.value);
  items.value = response.data;
  itemsMeta.value = response.meta;
};

onMounted(() => {
  loadDetail();
  loadItems();
});

watch(() => id, async () => {
  await loadDetail();
  await loadItems();
});

watch(reloadTriggers, async () => {
  loadItems();
});

</script>
