<template>
  <div>
    <input
      v-model.number="model.min"
      class="range-input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
    >

    <input
      v-model.number="model.max"
      class="range-input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
    >
  </div>

  <div class="flex gap-3">
    <div class="flex-1">
      <label
        class="block text-sm mb-2"
        :for="minId"
      >
        Začiatok
      </label>
      <InputText
        :id="minId"
        :model-value="model.min"
        @change="model.min = Number($event)"
      />
    </div>
    <div class="flex-1">
      <label
        :for="maxId"
        class="block text-right text-sm mb-2"
      >
        Koniec
      </label>
      <InputText
        :id="maxId"
        :model-value="model.max"
        @change="model.max = Number($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId, watch } from 'vue';

import InputText from '../../atoms/InputText';

export type RangeValue = { min: number; max: number };

const model = defineModel<RangeValue>({
  default: () => ({
    min: 1920,
    max: 2025,
  }),
});

const {
  min,
  max,
  step = 1,
} = defineProps<{
  min: number
  max: number
  step?: number
}>();

const minId = useId();
const maxId = useId();

watch(() => model.value.min, (val) => {
  if (val < min) {
    model.value.min = min;
  }
  else if (val > model.value.max) {
    model.value.min = model.value.max;
  }
});

watch(() => model.value.max, (val) => {
  if (val > max) {
    model.value.max = max;
  }
  else if (val < model.value.min) {
    model.value.max = model.value.min;
  }
});

</script>

<style scoped>
@reference "../../../assets/main.css";

.range-input {
  @apply appearance-none w-full bg-transparent cursor-pointer;
}

/* Track — WebKit/Blink */
.range-input::-webkit-slider-runnable-track {
  @apply h-1 bg-neutral-200 rounded-sm;
}

/* Track — Firefox */
.range-input::-moz-range-track {
  @apply h-1 bg-neutral-200 rounded-sm;
}

/* Thumb — WebKit/Blink */
.range-input::-webkit-slider-thumb {
  @apply appearance-none w-6 h-6 rounded-full border-4 border-blue-500 bg-white;
  margin-top: -10px; /* center on 4px track: (4 - 24) / 2 */
}

/* Thumb — Firefox */
.range-input::-moz-range-thumb {
  @apply w-6 h-6 rounded-full border-4 border-primary-500 bg-white box-border;
}
</style>
