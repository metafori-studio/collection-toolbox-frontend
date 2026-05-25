<template>
  <AppHeader
    grid-classes="grid-cols-[1fr_150px_1fr] lg:grid-cols-[1fr_600px_1fr]"
  >
    <template #left>
      <RouterLink to="/">
        {{ $t('header.explore') }}
      </RouterLink>
    </template>

    <template #center>
      <EtnoSearch />
    </template>

    <template #right>
      <BaseButton
        variant="secondary"
        size="small"
        :aria-label="$t('header.info')"
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

          <BaseButton
            v-if="$i18n.locale === 'sk'"
            variant="secondary"
            size="small"
            @click="switchLang('en')"
          >
            Switch to English
          </BaseButton>
          <BaseButton
            v-if="$i18n.locale === 'en'"
            variant="secondary"
            size="small"
            @click="switchLang('sk')"
          >
            Prepnúť na Slovenčinu
          </BaseButton>
        </div>
      </BaseDropdown>
    </template>
  </AppHeader>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

import { AppHeader } from '@metafori/components';
import {
  BaseButton,
  BaseIcon,
  BaseDropdown,
} from '@metafori/components';
import EtnoSearch from './EtnoSearch.vue';

import { isLoggedIn } from '@/store';
import { logout } from '@/api';

const router = useRouter();
const route = useRoute();

const tryLogout = async () => {
  const response = await logout();
  if (response.status === 200) {
    router.push({ name: 'Explore' });
  }
};

const switchLang = (lang: string) => {
  router.push({
    name: route.name ?? undefined,
    params: { ...route.params, lang },
    query: route.query,
  });
};
</script>
