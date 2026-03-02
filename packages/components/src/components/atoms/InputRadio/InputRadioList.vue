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

const model = defineModel<string>();

const {
  name,
  options,
} = defineProps<{
  name: string
  options: {
    label: string
    value: string | null
    id?: string
    count?: number
  }[]
}>();
</script>
