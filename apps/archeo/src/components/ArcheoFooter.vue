<template>
  <AppFooter
    :title="$t('appName')"
    :legal-text="$t('footer.legalText')"
    :partners="partners"
  />
</template>

<script setup lang="ts">
import { AppFooter } from '@metafori/components';

import dariahLogo from '@/assets/footer-logos/dariah.svg';
import archeoLogo from '@/assets/footer-logos/ausav.png';
import oglLogo from '@/assets/footer-logos/ogl.png';

const partners = [
  {
    src: dariahLogo,
    name: 'DARIAH',
  },
  {
    src: archeoLogo,
    name: 'Archeologický ústav SAV',
  },
  {
    src: oglLogo,
    name: 'Off Grid Lab',
  },
];

</script>
