<template>
  <div
    class="flex flex-col gap-4"
    :class="{
      'md:flex-row': layout === 'horizontal',
      'border border-neutral-300 rounded-lg p-3 md:p-4': !borderless
    }"
  >
    <ArtworkCollectionThumbnailGrid
      v-if="collection.thumbnails?.length"
      :images="collection.thumbnails"
      :title="collection.name"
      :class="{
        'h-[213px]': layout === 'vertical',
        'md:min-w-[300px] md:w-[300px]': layout === 'horizontal'
      }"
    />
    <ArtworkCollectionThumbnail
      v-else
      :src="collection.thumbnail"
      :title="collection.name"
      :class="{
        'h-[213px]': layout === 'vertical',
        'md:min-w-[300px] md:w-[300px]': layout === 'horizontal'
      }"
    />
    <div class="space-y-2">
      <h3 class="text-heading-3">
        {{ collection.name }}
      </h3>
      <ArtworkCollectionMeta :collection="collection" />
      <p>{{ collection.about }}</p>
      <BaseButton
        variant="secondary"
        @click="emit('open')"
      >
        {{ t('collectionCard.view') }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { type ArtworkCollection } from '../../../types/artwork';
import ArtworkCollectionMeta from '../../molecules/ArtworkCollectionMeta';
import ArtworkCollectionThumbnail from '../../molecules/ArtworkCollectionThumbnail';
import ArtworkCollectionThumbnailGrid from '../../molecules/ArtworkCollectionThumbnailGrid';

import {
  BaseButton,
} from '@metafori/components';

const {
  collection,
  layout = 'vertical',
  borderless = false,
} = defineProps<{
  collection: ArtworkCollection
  layout?: 'vertical' | 'horizontal'
  borderless?: boolean
}>();

const emit = defineEmits(['open']);

const { t } = useI18n();
</script>
