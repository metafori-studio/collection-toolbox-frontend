<template>
  <AppHeaderNew>
    <template #logo>
      <img
        :src="LogoLidiceMemorial"
        :alt="$t('appName')"
        class="h-[24px] md:h-[40px]"
      >
    </template>

    <template #nav-primary>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
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
