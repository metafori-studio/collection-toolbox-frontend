<template>
  <div>
    <AppHeader />
    <router-view />
    <ModalIntro />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import ModalIntro from '@/components/ModalIntro.vue';

</script>
