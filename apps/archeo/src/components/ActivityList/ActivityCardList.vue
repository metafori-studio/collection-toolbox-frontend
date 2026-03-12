<template>
  <div class="flex flex-col gap-3">
    <ActivityCard
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script lang="ts" setup>
import ActivityCard from './ActivityCard.vue';

const {
  items = [],
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
}>();

</script>
