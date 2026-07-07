<template>
  <ul class="flex gap-2">
    <template
      v-for="(item, i) in items"
      :key="item.label"
    >
      <li class="text-label">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="underline"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else>
          {{ item.label }}
        </span>
      </li>
      <li
        v-if="i < items.length - 1"
        class="text-gray-400"
      >
        <BaseIcon
          icon="arrowRight"
        />
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import BaseIcon from '../../atoms/BaseIcon';

export type BreadcrumbItem = {
  label: string
  to?: RouteLocationRaw
};

const {
  items,
} = defineProps<{
  items: BreadcrumbItem[]
}>();
</script>
