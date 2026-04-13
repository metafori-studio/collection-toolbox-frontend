<template>
  <footer class="bg-neutral-900 text-white py-6 lg:py-16 px-4 flex flex-col items-center gap-2 text-center lg:gap-4">
    <p class="text-heading-2">
      {{ $t('appName') }}
    </p>
    <ul class="flex justify-center gap-2 md:gap-4 my-2">
      <li
        v-for="(partner, i) in partners"
        :key="i"
        class="max-w-[100px] md:max-w-[160px] p-2 md:p-3 bg-white rounded-lg flex items-center"
      >
        <img
          :src="partner.src"
          :alt="partner.name"
        >
      </li>
    </ul>
    <p class="max-w-[900px] text-neutral-400 text-sm">
      Tento repozitár vznikol vďaka finančnej podpore ESFRI výskumných infraštruktúr Ministerstva školstva, výskumu, vývoja a mládeže Slovenskej republiky a národného konzorcia DARIAH-SK.
    </p>
    <div class="text-neutral-500">
      <span>&copy; 2026</span>
    </div>
  </footer>
</template>

<script setup lang="ts">

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
