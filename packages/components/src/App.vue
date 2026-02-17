<template>
  <div>
    <ExampleComponent
      char="👁️"
      :count="count"
    />
    <input
      type="range"
      v-model.number="count"
      min="1"
      max="30"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ExampleComponent from '@/components/ExampleComponent.vue';

const count = ref<number>(5);
</script>
