<template>
  <section
    class="mb-3"
  >
    <div
      v-if="label"
      class="flex items-center gap-1 text-neutral-500 mb-3"
    >
      <BaseIcon
        :icon="icon"
        :size="16"
      />
      <h3>{{ label }}</h3>
    </div>
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '@/components/atoms/BaseIcon';

const {
  label = null,
  icon = 'stack',
} = defineProps<{
  label?: string,
  icon?: IconName,
}>();

</script>
