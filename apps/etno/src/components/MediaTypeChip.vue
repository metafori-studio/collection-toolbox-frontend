<template>
  <span class="text-xs inline-flex items-center gap-1 rounded-full border px-2 py-0.5 border-primary-200 bg-primary-50 text-primary-700">
    <BaseIcon
      :icon="icon"
      :size="16"
    />
    <span>
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
import {
  BaseIcon,
  type IconName,
} from '@metafori/components';

const {
  label,
  icon = 'stack',
} = defineProps<{
  label: string
  icon?: IconName
}>();
</script>
