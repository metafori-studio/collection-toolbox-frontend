<template>
  <nav aria-label="breadcrumb">
    <ul class="flex gap-2">
      <template
        v-for="(item, i) in items"
        :key="item.label"
      >
        <li
          class="text-label"
        >
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="underline"
          >
            {{ item.label }}
          </RouterLink>
          <span
            v-else
            :aria-current="i === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </li>
        <li
          v-if="i < items.length - 1"
          class="text-text-tertiary"
        >
          <BaseIcon
            icon="arrowRight"
          />
        </li>
      </template>
    </ul>
  </nav>
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
