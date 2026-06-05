<template>
  <div class="flex flex-col min-h-screen pt-12 md:pt-0">
    <LidiceMemorialHeader />
    <router-view class="flex-1" />
    <LidiceMemorialFooter />
  </div>
</template>

<script setup lang="ts">
import LidiceMemorialHeader from '@/components/LidiceMemorialHeader.vue';
import LidiceMemorialFooter from '@/components/LidiceMemorialFooter.vue';
</script>
