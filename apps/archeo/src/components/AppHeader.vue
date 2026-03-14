<template>
  <div class="sticky left-0 right-0 top-0 z-20 h-14 bg-white grid grid-cols-[1fr_150px_1fr] items-center gap-3 px-4 py-1 border-b border-b-neutral-200">
    <div class="flex items-center gap-3">
      <BaseButton
        v-if="isExplore"
        size="small"
        :variant="filterOpen ? 'primary' : 'secondary'"
        @click="filterOpen = !filterOpen"
      >
        <BaseIcon icon="filter" />
        <span class="hidden md:block">Filter</span>
      </BaseButton>

      <BaseButton
        v-if="!isExplore"
        variant="secondary"
        size="small"
        @click="$router.push({ name: 'Explore' })"
      >
        <BaseIcon icon="arrowLeft" />
        <span class="hidden md:block">Späť do Explore</span>
      </BaseButton>
    </div>
    <div class="text-center font-bold">
      Archeo Explorer
    </div>
    <div class="flex items-center justify-end gap-3">
      <div
        v-if="isDetail"
        class="hidden md:block"
      >
        <BaseButton
          variant="secondary"
          size="small"
          @click="detailPanelOpen = !detailPanelOpen"
        >
          {{ detailPanelOpen ? 'Skryť panel' : 'Otvoriť panel' }}
        </BaseButton>
      </div>
      <BaseButton
        variant="secondary"
        size="small"
        @click="$router.push({ name: 'Info' })"
      >
        <BaseIcon icon="info" />
        <span class="hidden md:block">Info</span>
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
      >
        <BaseIcon icon="user" />
        <span class="hidden md:block">User</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { BaseButton, BaseIcon } from '@metafori/components';

import { filterOpen, detailPanelOpen } from '@/store';

const route = useRoute();

const isExplore = computed(() => route.name === 'Explore');
const isDetail = computed(() => route.name?.toString().includes('Detail'));

</script>
