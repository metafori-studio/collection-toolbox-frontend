<template>
  <div>
    <ArcheoHeader />
    <router-view />
    <ModalIntro />
  </div>
</template>

<script setup lang="ts">
import ArcheoHeader from '@/components/ArcheoHeader.vue';
import ModalIntro from '@/components/ModalIntro.vue';

</script>
