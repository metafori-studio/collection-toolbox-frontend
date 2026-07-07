<template>
  <button
    class="bg-primary-200 hover:bg-primary-500 flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer"
    :class="[focusClasses]"
    :aria-label="ariaLabel"
    @click="$emit('clear')"
  >
    <span class="text-label-sm font-normal">
      {{ label }}
    </span>
    <span class="text-label-sm">
      {{ value }}
    </span>
    <BaseIcon
      :size="16"
      icon="x"
    />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import BaseIcon from '../BaseIcon/BaseIcon.vue';
import { focusClasses } from '../../../misc/reusableCss';

const {
  label,
  value,
} = defineProps<{
  label: string
  value: string
}>();

defineEmits([
  'clear',
]);

const ariaLabel = computed(() => `Clear filter ${label} ${value}`);

</script>
