<template>
  <RouterLink
    :to="{
      name: 'Detail',
      params: { id: item.id },
    }"
    class="
      bg-white w-full text-left rounded-xl border border-neutral-200 p-3 transition-all
      flex flex-col gap-2
      hover:border-neutral-300 hover:shadow-sm
    "
    :class="[focusClasses]"
  >
    <span class="font-mono text-xs text-primary-500">
      {{ item.id }}
    </span>
    <img
      :src="item.image"
      :alt="item.title"
      class="aspect-[4/3] object-cover rounded-lg"
    >
    <div class="flex items-center justify-between gap-2 mb-2">
      <MediaTypeChip
        v-if="item.type"
        icon="stack"
        :label="item.type"
      />

      <div class="flex items-center gap-2 text-neutral-500 text-xs">
        <div class="flex items-center gap-1">
          <BaseIcon
            icon="folder"
            :size="16"
          />
          Zbierka (2)
        </div>

        <div class="flex items-center gap-1">
          <BaseIcon
            icon="document"
            :size="16"
          />
          12345
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-wrap gap-x-1 text-xs text-neutral-500">
        <span>{{ item.location_note }}</span>
        <span aria-hidden>·</span>
        <span>{{ item.year }}</span>
      </div>
      <h3 class="text-base font-semibold">
        {{ item.title }}
      </h3>
      <div
        v-if="authorsReadable"
        class="text-xs text-neutral-500"
      >
        Autorstvo:
        <span>{{ authorsReadable }}</span>
      </div>
      <div
        v-if="researchersReadable"
        class="text-xs text-neutral-500"
      >
        Výskum:
        <span>{{ researchersReadable }}</span>
      </div>
      <div
        v-if="originatorsReadable"
        class="text-xs text-neutral-500"
      >
        Pôvod:
        <span>{{ originatorsReadable }}</span>
      </div>
    </div>
  </RouterLink>
</template>


<script lang="ts" setup>
import { computed } from 'vue';

import { BaseIcon } from '@metafori/components';
import MediaTypeChip from '@/components/MediaTypeChip.vue';

import { focusClasses } from '@metafori/components';

type Person = { display_name: string; family_name?: string; given_name?: string };
type Originator = { label?: string; person?: Person };
type PersonOrOriginator = Person | Originator;

const {
  item,
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
}>();

const resolveDisplayName = (entry: PersonOrOriginator): string | undefined => {
  if ('display_name' in entry) return entry.display_name;
  if ('label' in entry) return entry.label;
  if ('person' in entry) return entry.person?.display_name;
  return undefined;
};

const toReadable = (people: PersonOrOriginator[] | undefined) => {
  if (!people) {
    return null;
  }
  return people.map(resolveDisplayName).filter(Boolean).join(' · ') || null;
};

const authorsReadable = computed(() => toReadable(item.authors));
const researchersReadable = computed(() => toReadable(item.researchers));
const originatorsReadable = computed(() => toReadable(item.originators));

</script>
