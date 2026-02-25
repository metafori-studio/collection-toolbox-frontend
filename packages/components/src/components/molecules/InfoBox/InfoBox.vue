<template>
  <div class="bg-primary-50 px-2 py-1 rounded-lg flex justify-between gap-2 text-sm">
    <div class="flex items-center gap-1">
      <BaseIcon
        icon="info"
      />
      <slot />
    </div>
    <div class="flex items-center gap-1">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/atoms/BaseIcon';
</script>
