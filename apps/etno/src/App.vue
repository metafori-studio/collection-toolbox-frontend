<template>
  <div>
    <AppHeader />
    <router-view />

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

const isDev = import.meta.env.DEV;
</script>
