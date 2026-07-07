<template>
  <div
    ref="containerRef"
    class="relative"
  >
    <button
      :id="id"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      class="w-full flex items-center gap-2 rounded-lg bg-neutral-0 border border-neutral-300 px-3 py-2 text-label text-left"
      :class="[focusClasses, {
        // Disabled
        [disabledClasses]: disabled,
        'hover:border-primary-500': !disabled,
      }]"
      :disabled="disabled"
      @click="toggle"
      @keydown.esc="close"
    >
      <span
        v-if="model.length"
        class="w-5 h-5 text-label-sm rounded-full bg-neutral-900 text-white flex items-center justify-center"
      >
        {{ model.length }}
      </span>
      <span class="truncate">
        {{ label }}
      </span>
      <BaseIcon
        icon="caretDown"
        :size="16"
        class="shrink-0 ml-auto"
      />
    </button>
    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full min-w-[240px] rounded-lg border border-neutral-300 bg-neutral-0 shadow-lg"
    >
      <div class="p-2 border-b border-neutral-200">
        <InputText
          v-model="query"
          type="search"
          icon="magnifyingGlass"
          :placeholder="SEARCH_PLACEHOLDER"
        />
      </div>
      <div class="max-h-60 overflow-y-auto">
        <InputCheckbox
          v-for="option in filteredOptions"
          :key="option.value"
          :model-value="model.includes(option.value)"
          :label="option.label"
          @update:model-value="toggleOption(option.value, $event ?? false)"
        />
        <div
          v-if="filteredOptions.length === 0"
          class="px-4 py-2 text-sm text-neutral-400"
        >
          {{ NO_RESULTS_LABEL }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { focusClasses, disabledClasses } from '../../../misc/reusableCss';
import BaseIcon from '../BaseIcon';
import InputText from '../InputText';
import { InputCheckbox } from '../InputCheckbox';

export type MultiselectOption = {
  value: string
  label: string
  disabled?: boolean
};

const SEARCH_PLACEHOLDER = 'Search…';
const NO_RESULTS_LABEL = 'No results found';

const {
  options,
  id = undefined,
  disabled = false,
  label = 'Select…',
} = defineProps<{
  options: MultiselectOption[]
  id?: string
  disabled?: boolean
  label?: string
}>();

const model = defineModel<string[]>({ default: () => [] });

const isOpen = ref(false);
const query = ref('');
const containerRef = ref<HTMLElement | null>(null);

// Options
const filteredOptions = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  if (!normalizedQuery) {
    return options;
  }
  return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
});

function toggleOption(value: string, checked: boolean) {
  if (checked) {
    model.value = [...model.value, value];
  } else {
    model.value = model.value.filter((v) => v !== value);
  }
}

// Dropdown toggle
function toggle() {
  if (disabled) {
    return;
  }
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    query.value = '';
  }
}

function close() {
  isOpen.value = false;
}

function handleOutsideClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
});

defineExpose({ close, isOpen });
</script>
