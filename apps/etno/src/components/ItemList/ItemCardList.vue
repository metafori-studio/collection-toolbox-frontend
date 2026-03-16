<template>
  <div class="grid grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-3 gap-3">
    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script lang="ts" setup>
import ItemCard from './ItemCard.vue';

const {
  items = [],
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
}>();

</script>
