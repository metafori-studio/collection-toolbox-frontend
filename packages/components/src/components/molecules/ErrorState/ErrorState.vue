<template>
  <div class="max-w-[280px] flex flex-col gap-8 text-center">
    <div class="flex flex-col gap-3 items-center">
      <BaseIcon
        :icon="icon"
        :size="80"
      />
      <h3 class="text-heading-3">
        {{ title }}
      </h3>
      <p class="text-neutral-500">
        {{ text }}
      </p>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '../../atoms/BaseIcon';

const {
  title = 'Error',
  text = 'Unknown error occurred.',
  icon = 'bug',
} = defineProps<{
  title?: string
  text?: string
  icon?: IconName,
}>();

</script>
