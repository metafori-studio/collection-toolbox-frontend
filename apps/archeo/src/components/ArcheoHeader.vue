<template>
  <AppHeader>
    <template #left>
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
    </template>

    <template #center>
      <span class="font-bold">Archeomap</span>
    </template>

    <template #right>
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
    </template>
  </AppHeader>
</template>

<script setup lang="ts">
import { AppHeader } from '@metafori/components';

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { BaseButton, BaseIcon } from '@metafori/components';

import { filterOpen, detailPanelOpen } from '@/store';

const route = useRoute();

const isExplore = computed(() => route.name === 'Explore');
const isDetail = computed(() => route.name?.toString().includes('Detail'));

</script>
