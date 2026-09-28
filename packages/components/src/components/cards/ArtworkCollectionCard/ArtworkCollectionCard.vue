<template>
  <div
    class="border border-neutral-300 rounded-lg overflow-hidden flex flex-col gap-4 p-3 md:p-4 "
    :class="{
      'md:flex-row': layout === 'horizontal'
    }"
  >
    <ArtworkCollectionImageGrid
      :images="collection.images"
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
        v-if="showButton"
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
import ArtworkCollectionImageGrid from '../../molecules/ArtworkCollectionImageGrid';
import ArtworkCollectionMeta from '../../molecules/ArtworkCollectionMeta';

import {
  BaseButton,
} from '@metafori/components';

const {
  collection,
  layout = 'vertical',
  showButton = false,
} = defineProps<{
  collection: ArtworkCollection
  layout?: 'vertical' | 'horizontal'
  showButton?: boolean
}>();

const emit = defineEmits(['open']);

const { t } = useI18n();
</script>
