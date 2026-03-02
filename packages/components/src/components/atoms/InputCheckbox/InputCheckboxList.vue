<template>
  <InputCheckbox
    v-for="(option, i) in options"
    :id="option?.id"
    :key="i"
    :model-value="model?.includes(option.value) ?? false"
    :name="name"
    :label="option.label"
    :count="option.count"
    @update:model-value="toggle(option.value, $event ?? false)"
  />
</template>

<script setup lang="ts">
import InputCheckbox from './InputCheckbox.vue';

const model = defineModel<string[]>({ default: () => [] });

const {
  name,
  options,
} = defineProps<{
  name: string
  options: {
    label: string
    value: string
    id?: string
    count?: number
  }[]
}>();

const toggle = (value: string, checked: boolean) => {
  if (checked) {
    model.value = [...model.value, value];
  } else {
    model.value = model.value.filter((v) => v !== value);
  }
};
</script>
