<template>
  <div class="flex flex-col min-h-screen pt-12 md:pt-0">
    <LidiceArtHeader />
    <router-view class="flex-1" />
    <LidiceArtFooter />
  </div>
</template>

<script setup lang="ts">
import LidiceArtHeader from '@/components/LidiceArtHeader.vue';
import LidiceArtFooter from '@/components/LidiceArtFooter.vue';
</script>
