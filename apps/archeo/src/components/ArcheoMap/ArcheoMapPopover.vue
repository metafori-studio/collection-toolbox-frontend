<template>
  <div class="absolute right-4 top-4 bg-white rounded-lg shadow-lg p-3 flex flex-col gap-3 w-60">
    <button
      class="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
      aria-label="Zatvoriť okno"
      @click="emit('close')"
    >
      <BaseIcon
        icon="x"
        :size="16"
      />
    </button>

    <span class="text-mono font-mono text-primary-500">
      Č.A. {{ id }}
    </span>
    <ActivityLevel
      :level="localizationDegree"
      :label="true"
    />
    <BaseButton
      variant="primary"
      @click="$router.push({ name: 'DetailMap', params: { id } })"
    >
      Detail aktivity
      <BaseIcon icon="arrowRight" />
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { BaseButton, BaseIcon } from '@metafori/components';
import ActivityLevel from '@/components/ActivityLevel.vue';

defineProps<{
  id: string
  localizationDegree: 1 | 2 | 3
}>();

const emit = defineEmits<{
  close: []
}>();
</script>
