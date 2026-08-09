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
      <span class="font-bold">
        {{ appTitle ?? $t('appName') }}
      </span>
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

      <BaseDropdown
        size="small"
        direction="bottom-left"
      >
        <template #trigger>
          <BaseIcon icon="user" />
          <span class="hidden md:block">{{ $t('header.user') }}</span>
        </template>

        <div class="p-2 flex flex-col gap-2">
          <BaseButton
            v-if="!isLoggedIn"
            variant="secondary"
            size="small"
            @click="$router.push({ name: 'Login' })"
          >
            <BaseIcon icon="signIn" />
            {{ $t('header.login') }}
          </BaseButton>
          <BaseButton
            v-if="!isLoggedIn"
            variant="secondary"
            size="small"
            @click="$router.push({ name: 'Signup' })"
          >
            <BaseIcon icon="userPlus" />
            {{ $t('header.signup') }}
          </BaseButton>
          <BaseButton
            v-if="isLoggedIn"
            variant="secondary"
            size="small"
            @click="tryLogout()"
          >
            <BaseIcon icon="signOut" />
            {{ $t('header.logout') }}
          </BaseButton>
        </div>
      </BaseDropdown>
    </template>
  </AppHeader>
</template>

<script setup lang="ts">
import {
  AppHeader,
  BaseButton,
  BaseIcon,
  BaseDropdown,
} from '@metafori/components';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { filterOpen, detailPanelOpen, appTitle, isLoggedIn } from '@/store';
import { logout } from '@/api';

const route = useRoute();
const router = useRouter();

const isExplore = computed(() => route.name === 'Explore');
const isDetail = computed(() => route.name?.toString().includes('Detail'));

const tryLogout = async () => {
  const response = await logout();
  if (response.status === 200) {
    router.push({ name: 'Explore' });
  }
};
</script>
