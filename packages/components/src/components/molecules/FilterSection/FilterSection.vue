<template>
  <section>
    <div
      v-if="label"
      class="flex items-center gap-1 text-neutral-500 mb-2"
    >
      <BaseIcon
        :icon="icon"
        :size="16"
      />
      <h3 class="text-xs">
        {{ label }}
      </h3>
    </div>
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '../../atoms/BaseIcon';

const {
  label = null,
  icon = 'stack',
} = defineProps<{
  label?: string,
  icon?: IconName,
}>();

</script>
