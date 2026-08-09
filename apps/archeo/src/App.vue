<template>
  <div class="flex flex-col min-h-screen">
    <ArcheoHeader />
    <router-view class="flex-1" />
  </div>
  <ModalIntro />
</template>

<script setup lang="ts">
import ArcheoHeader from '@/components/ArcheoHeader.vue';
import ModalIntro from '@/components/ModalIntro.vue';

</script>
