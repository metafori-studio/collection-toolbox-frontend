<template>
  <AppFooterNew
    :title="$t('appName')"
    :description="$t('footer.about')"
    :copyright="$t('footer.copyright')"
    :logos="logos"
  >
    <div
      v-for="i in 3"
      :key="i"
      class="flex-1"
    >
      <h3 class="text-heading-4 h-[32px] mb-4">
        Placeholder
      </h3>
      <ul class="flex flex-col gap-3">
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>
    </div>
  </AppFooterNew>
</template>

<script setup lang="ts">
import { AppFooterNew } from '@metafori/components';

import LogoLidiceArt from '@/assets/logo-lidice-art.svg';
import LogoLidiceMemorial from '@/assets/logo-lidice-memorial.svg';
import LogoLezaky from '@/assets/logo-lezaky.svg';

const logos = [
  {
    title: 'Lidice Memorial',
    src: LogoLidiceMemorial,
  },
  {
    title: 'Ležáky',
    src: LogoLezaky,
  },
  {
    title: 'Lidice Art',
    src: LogoLidiceArt,
  },
];

</script>
