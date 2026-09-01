<template>
  <MediaToolbar variant="pill">
    <MediaViewerButton
      :title="t('viewer.previous')"
      :disabled="current <= 1"
      @click="emit('previous')"
    >
      <BaseIcon
        icon="caretLeft"
        :size="20"
      />
    </MediaViewerButton>

    <span class="px-2 text-center text-xs font-semibold text-white/90 select-none">
      {{ current }}/{{ total }}
    </span>

    <MediaViewerButton
      :title="t('viewer.next')"
      :disabled="current >= total"
      @click="emit('next')"
    >
      <BaseIcon
        icon="caretRight"
        :size="20"
      />
    </MediaViewerButton>

    <MediaToolbarSeparator />

    <MediaViewerButton
      :title="t('viewer.zoomOut')"
      :disabled="!canZoomOut"
      @click="emit('zoom-out')"
    >
      <BaseIcon
        icon="zoomOut"
        :size="20"
      />
    </MediaViewerButton>

    <span class="inline-flex w-12 justify-center text-center text-xs font-semibold text-white/90 tabular-nums select-none">
      <template v-if="zoomPercentage !== null">
        {{ zoomPercentage }}%
      </template>
    </span>

    <MediaViewerButton
      :title="t('viewer.zoomIn')"
      :disabled="!canZoomIn"
      @click="emit('zoom-in')"
    >
      <BaseIcon
        icon="zoomIn"
        :size="20"
      />
    </MediaViewerButton>

    <MediaViewerButton
      :title="t('viewer.resetZoom')"
      :disabled="!canResetZoom"
      @click="emit('reset-zoom')"
    >
      <BaseIcon
        icon="zoomReset"
        :size="20"
      />
    </MediaViewerButton>
  </MediaToolbar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseIcon from '../../atoms/BaseIcon';
import MediaToolbar from './MediaToolbar.vue';
import MediaViewerButton from './MediaViewerButton.vue';
import MediaToolbarSeparator from './MediaToolbarSeparator.vue';

defineProps<{
  current: number;
  total: number;
  zoomPercentage: number | null;
  canZoomOut: boolean;
  canZoomIn: boolean;
  canResetZoom: boolean;
}>();

const emit = defineEmits<{
  (e: 'previous'): void;
  (e: 'next'): void;
  (e: 'zoom-in'): void;
  (e: 'zoom-out'): void;
  (e: 'reset-zoom'): void;
}>();

const { t } = useI18n();
</script>
