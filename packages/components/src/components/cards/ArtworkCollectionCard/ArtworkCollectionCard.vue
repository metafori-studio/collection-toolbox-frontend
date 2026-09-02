<template>
  <div
    class="border border-neutral-300 rounded-lg overflow-hidden flex flex-col md:flex-row"
  >
    <img
      :src="collection.image"
      :alt="collection.name"
      class="object-cover md:w-[300px]"
    >
    <div class="p-3 md:p-6 space-y-2">
      <h3 class="text-heading-3">
        {{ collection.name }}
      </h3>
      <ul class="flex gap-4 text-label text-text-tertiary">
        <li class="flex gap-1 items-center">
          <BaseIcon icon="calendar" />
          {{ collection.date }}
        </li>
        <li class="flex gap-1 items-center">
          <BaseIcon icon="image" />
          {{ collection.artwork_count }} {{ pluralize(collection.artwork_count, ['dielo', 'diela', 'diel']) }}
        </li>
      </ul>
      <p>{{ collection.about }}</p>
      <BaseButton
        variant="secondary"
      >
        Zobraziť kolekciu
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type ArtworkCollection } from '../../../types/artwork';
import { pluralize } from '@metafori/shared';

import {
  BaseButton,
  BaseIcon,
} from '@metafori/components';

const {
  collection,
} = defineProps<{
  collection: ArtworkCollection
}>();
</script>
