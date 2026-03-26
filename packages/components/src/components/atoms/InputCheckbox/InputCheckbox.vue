<template>
  <label
    class="
      flex justify-between items-center border border-transparent border-b-neutral-200 px-4 py-2 cursor-pointer text-sm
      hover:bg-primary-50 hover:border-transparent
    "
    :class="{
      'border-transparent text-primary-600': checked,
    }"
    :for="id"
  >
    <div class="flex items-center gap-1 min-w-0">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        class="hidden"
      >
      <div>
        <BaseIcon
          v-if="checked"
          icon="checkSquare"
          weight="fill"
        />
        <BaseIcon
          v-else
          icon="square"
        />
      </div>
      <span class="truncate">
        {{ label }}
      </span>
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
