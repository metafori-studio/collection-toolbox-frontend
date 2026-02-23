<template>
  <div
    class="
      flex items-center rounded-md gap-2 px-3 py-2
      bg-white border border-neutral-200
      hover:bg-primary-100
    "
  >
    <BaseIcon
      icon="stack"
      :size="24"
    />
    <div class="flex items-center gap-2">
      {{ label }}
      <FilterChip
        v-if="selectedCount !== null"
        :count="selectedCount"
      />
    </div>
    <button
      class="ml-auto cursor-pointer"
      @click="$emit('open')"
    >
      <BaseIcon
        icon="caretRight"
        :size="16"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/atoms/BaseIcon';
import FilterChip from '@/components/atoms/FilterChip';

const {
  label = 'Filter name',
  selectedCount = null,
} = defineProps<{
  label?: string
  selectedCount?: number,
}>();

defineEmits([
  'open',
]);

</script>
