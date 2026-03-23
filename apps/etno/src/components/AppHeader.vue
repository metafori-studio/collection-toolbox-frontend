<template>
  <div class="sticky left-0 right-0 top-0 z-20 h-14 bg-white grid grid-cols-[1fr_150px_1fr] items-center gap-3 px-4 py-1 border-b border-b-neutral-200">
    <div class="flex items-center gap-3">
      <RouterLink to="/">
        Explore
      </RouterLink>
    </div>
    <div class="text-center font-bold">
      Etno Explorer
    </div>
    <div class="flex items-center justify-end gap-3">
      <BaseButton
        variant="secondary"
        size="small"
        aria-label="Info"
        @click="$router.push({ name: 'Info' })"
      >
        <BaseIcon icon="info" />
        <span class="hidden md:block">Info</span>
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
        aria-label="User"
      >
        <BaseIcon icon="user" />
        <span class="hidden md:block">User</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseButton, BaseIcon } from '@metafori/components';

</script>
