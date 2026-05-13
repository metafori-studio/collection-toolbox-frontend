<template>
  <AppFooter
    :title="$t('appName')"
    :legal-text="$t('footer.legalText')"
    :partners="partners"
  />
</template>

<script setup lang="ts">
import { AppFooter } from '@metafori/components';

import uesaLogo from '@/assets/footer-logos/uesa.svg';
import dariahLogo from '@/assets/footer-logos/dariah.svg';
import oglLogo from '@/assets/footer-logos/ogl.png';

const partners = [
  {
    src: uesaLogo,
    name: 'UESA SAV',
  },
  {
    src: dariahLogo,
    name: 'DARIAH',
  },
  {
    src: oglLogo,
    name: 'Off Grid Lab',
  },
];

</script>
