<template>
  <div class="flex flex-col min-h-screen">
    <EtnoHeader />
    <router-view class="flex-1" />
    <EtnoFooter />
  </div>
</template>

<script setup lang="ts">
import EtnoHeader from '@/components/EtnoHeader.vue';
import EtnoFooter from '@/components/EtnoFooter.vue';
</script>
