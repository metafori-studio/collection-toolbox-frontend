<template>
  <ul class="flex flex-wrap items-center gap-y-1 gap-x-4 text-label text-text-tertiary">
    <li
      v-if="collection.category"
      class="flex gap-1 items-center"
    >
      {{ collection.category }}
    </li>
    <li
      v-if="collection.date"
      class="flex gap-1 items-center"
    >
      <BaseIcon icon="calendar" />
      {{ collection.date }}
    </li>
    <li
      class="flex gap-1 items-center"
    >
      <BaseIcon icon="image" />
      {{ t('artwork.count', { count: collection.artwork_count }, collection.artwork_count) }}
    </li>
    <li
      v-if="collection.author"
      class="flex gap-1 items-center"
    >
      <BaseIcon icon="user" />
      {{ collection.author }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import BaseIcon from '../../atoms/BaseIcon';
import { type ArtworkCollection } from '../../../types/artwork';

const {
  collection,
} = defineProps<{
  collection: ArtworkCollection
}>();

const { t } = useI18n();
</script>
