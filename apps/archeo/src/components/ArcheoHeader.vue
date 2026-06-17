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
        <span class="hidden md:block">{{ $t('header.filter') }}</span>
      </BaseButton>

      <BaseButton
        v-if="!isExplore"
        variant="secondary"
        size="small"
        @click="$router.push({ name: 'Explore' })"
      >
        <BaseIcon icon="arrowLeft" />
        <span class="hidden md:block">{{ $t('header.backToExplore') }}</span>
      </BaseButton>
    </template>

    <template #center>
      <span class="font-bold">{{ $t('appName') }}</span>
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
          {{ detailPanelOpen ? $t('header.hidePanel') : $t('header.openPanel') }}
        </BaseButton>
      </div>
      <BaseButton
        variant="secondary"
        size="small"
        @click="$router.push({ name: 'Info' })"
      >
        <BaseIcon icon="info" />
        <span class="hidden md:block">{{ $t('header.info') }}</span>
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
      >
        <BaseIcon icon="user" />
        <span class="hidden md:block">{{ $t('header.user') }}</span>
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
