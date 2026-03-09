<template>
  <div
    class="
      flex items-center rounded-lg gap-2 px-3 py-2
      bg-white border border-neutral-200 text-sm relative group
      hover:bg-primary-100
    "
  >
    <button
      class="absolute inset-0 cursor-pointer rounded-lg"
      :class="[focusClasses]"
      :aria-label="`Open ${label}`"
      @click="$emit('open')"
    />
    <BaseIcon
      v-if="icon"
      :icon="icon"
      :size="24"
    />
    <div class="flex items-center gap-2">
      {{ label }}
      <FilterChip
        v-if="selectedCount !== null"
        class="relative"
        :count="selectedCount"
      />
    </div>
    <BaseIcon
      class="ml-auto"
      icon="caretRight"
      :size="16"
    />
  </div>
</template>

<script setup lang="ts">
import BaseIcon, { type IconName } from '@/components/atoms/BaseIcon';
import FilterChip from '@/components/atoms/FilterChip';
import { focusClasses } from '@/misc/reusableCss';

const {
  label = 'Filter name',
  icon = null,
  selectedCount = null,
} = defineProps<{
  label?: string
  icon?: IconName,
  selectedCount?: number,
}>();

defineEmits([
  'open',
]);

</script>
