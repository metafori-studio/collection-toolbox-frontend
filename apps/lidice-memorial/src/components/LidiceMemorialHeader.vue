<template>
  <AppHeaderNew>
    <template #logo>
      <router-link :to="{ name: 'Explore' }">
        <img
          :src="LogoLidiceMemorial"
          :alt="$t('appName')"
          class="h-[24px] md:h-[40px]"
        >
      </router-link>
    </template>

    <template #nav-primary>
      <li>
        <router-link :to="{ name: 'Explore' }">
          {{ $t('header.catalogue') }}
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'CollectionList' }">
          {{ $t('header.collections') }}
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Info' }">
          {{ $t('header.info') }}
        </router-link>
      </li>
    </template>

    <template #nav-secondary>
      <button
        v-if="$i18n.locale === 'en'"
        @click="$i18n.locale = 'cs'"
      >
        Czech
      </button>
      <button
        v-if="$i18n.locale === 'cs'"
        @click="$i18n.locale = 'en'"
      >
        English
      </button>
    </template>
  </AppHeaderNew>
</template>

<script setup lang="ts">
import { AppHeaderNew } from '@metafori/components';

import LogoLidiceMemorial from '@/assets/logo-lidice-memorial-color.svg';

</script>
