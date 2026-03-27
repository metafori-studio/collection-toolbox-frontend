<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <router-view class="flex-1" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

</script>
