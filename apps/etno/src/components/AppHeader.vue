<template>
  <div class="sticky left-0 right-0 top-0 z-30 h-14 bg-white grid grid-cols-[1fr_150px_1fr] lg:grid-cols-[1fr_600px_1fr] items-center gap-3 px-4 py-1 border-b border-b-neutral-200">
    <div class="flex items-center gap-3">
      <RouterLink to="/">
        Explore
      </RouterLink>
    </div>
    <div class="text-center font-bold">
      <EtnoSearch />
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
      <BaseDropdown
        size="small"
        direction="bottom-left"
      >
        <template #trigger>
          <BaseIcon icon="user" />
          <span class="hidden md:block">User</span>
        </template>

        <div class="p-2 flex flex-col gap-2">
          <BaseButton
            variant="secondary"
            size="small"
            @click="$router.push({ name: 'Login' })"
          >
            <BaseIcon icon="signIn" />
            Prihlásiť sa
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="small"
            @click="$router.push({ name: 'Signup' })"
          >
            <BaseIcon icon="userPlus" />
            Registrácia
          </BaseButton>
        </div>
      </BaseDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BaseButton,
  BaseIcon,
  BaseDropdown,
} from '@metafori/components';
import EtnoSearch from './EtnoSearch.vue';

</script>
