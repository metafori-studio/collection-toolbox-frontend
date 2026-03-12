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
        :value="value"
        :name="name"
        :checked="checked"
        type="radio"
        class="hidden"
        @change="model = ($event?.target as HTMLInputElement)?.value"
      >
      <BaseIcon
        v-if="checked"
        icon="radioButton"
        weight="fill"
      />
      <BaseIcon
        v-else
        icon="circle"
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

const model = defineModel<string>();

const {
  label,
  name,
  value,
  count = null,
  id = useId(),
} = defineProps<{
  label: string,
  name: string,
  value: string | null,
  count?: number,
  id?: string,
}>();

const checked = computed(() => model.value === value);
</script>
