<template>
  <InputRadio
    v-for="(option, i) in options"
    :id="option?.id"
    :key="i"
    v-model="model"
    :name="name"
    :label="option.label"
    :value="option.value"
    :count="option.count"
  />
</template>

<script setup lang="ts">
import InputRadio from './InputRadio.vue';

export type InputRadioOption = {
  label: string
  value: string | null
  id?: string
  count?: number
}

const model = defineModel<string>();

const {
  name,
  options,
} = defineProps<{
  name: string
  options: InputRadioOption[]
}>();
</script>
