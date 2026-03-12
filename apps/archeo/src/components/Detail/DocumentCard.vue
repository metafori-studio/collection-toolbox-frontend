<template>
  <button class="bg-white rounded-xl border border-neutral-200 flex items-center justify-between p-3 w-full cursor-pointer hover:border-neutral-300 hover:shadow-sm transition-all group">
    <div class="flex items-center gap-3">
      <div
        class="rounded-lg size-10 flex items-center justify-center"
        :class="{
          'bg-primary-50 text-primary-500': available,
          'bg-neutral-100 text-neutral-500': !available,
        }"
      >
        <BaseIcon icon="document" />
      </div>
      <div
        class="flex flex-col gap-0.5 items-start"
      >
        <p class="text-sm font-semibold text-neutral-900">
          {{ name }}
        </p>
        <p
          class="text-xs font-normal text-neutral-400"
        >
          <span v-if="available">
            {{ size }} · {{ pages }}
          </span>
          <span v-else>
            Na vyžiadanie
          </span>
        </p>
      </div>
    </div>
    <span
      class="text-xs font-semibold group-hover:underline"
      :class="{
        'text-primary-600': available,
        'text-neutral-600': !available,
      }"
    >
      <span v-if="available">
        Otvoriť PDF
      </span>
      <span v-else>
        Vyžiadať
      </span>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { BaseIcon } from '@metafori/components';

const {
  name,
  available = false,
  size = '',
  pages = undefined,
} = defineProps<{
  name: string
  available?: boolean
  size?: string
  pages?: number
}>();

</script>
