<template>
  <label
    class="
      flex justify-between border px-2 py-2 cursor-pointer text-sm
      hover:rounded-lg hover:bg-primary-100 hover:border-transparent
    "
    :class="{
      'border border-transparent border-b-neutral-200': !checked,
      'rounded-lg border border-primary-600 text-primary-600': checked,
    }"
    :for="id"
  >
    <div class="flex items-center gap-1">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        class="hidden"
      >
      <BaseIcon
        v-if="checked"
        icon="checkSquare"
        weight="fill"
      />
      <BaseIcon
        v-else
        icon="square"
      />
      {{ label }}
    </div>
    <div
      v-if="count !== null"
      class="text-primary-600"
    >
      {{ count }}
    </div>
  </label>
</template>

<script setup lang="ts">
import { useId, computed } from 'vue';
import BaseIcon from '../BaseIcon';

const model = defineModel<boolean>();

const {
  label,
  count = null,
  id = useId(),
} = defineProps<{
  label: string,
  count?: number,
  id?: string,
}>();

const checked = computed(() => model.value);
</script>
