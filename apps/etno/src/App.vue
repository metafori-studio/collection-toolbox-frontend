<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <router-view class="flex-1" />
    <AppFooter />

    <div
      v-if="isDev"
      class="fixed z-50 left-1 bottom-1 p-1 bg-white flex gap-1"
    >
      <button
        v-for="lang in ['sk', 'en']"
        :key="lang"
        class="px-1 border"
        @click="$i18n.locale = lang"
      >
        {{ lang }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';


const isDev = import.meta.env.DEV;
</script>
