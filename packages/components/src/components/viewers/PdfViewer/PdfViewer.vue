<template>
  <BaseViewer>
    <div
      v-if="isLoading || !engine"
      class="flex justify-center items-center h-full"
    >
      {{ $t('viewer.pdf.loading') }}
    </div>
    <EmbedPDF
      v-else
      v-slot="{ activeDocumentId }"
      :engine="engine"
      :plugins="plugins"
    >
      <DocumentContent
        v-if="activeDocumentId"
        v-slot="{ isLoaded }"
        :document-id="activeDocumentId"
      >
        <div class="flex flex-col h-full w-full">
          <template v-if="isLoaded">
            <PdfViewerToolbar
              :document-id="activeDocumentId"
            />
            <Viewport
              :document-id="activeDocumentId"
              class="bg-neutral-100 flex-1"
            >
              <Scroller :document-id="activeDocumentId">
                <template #default="{ page }">
                  <div
                    :style="{ width: page.width + 'px', height: page.height + 'px' }"
                    class="border border-neutral-200 bg-white"
                  >
                    <RenderLayer
                      :document-id="activeDocumentId"
                      :page-index="page.pageIndex"
                    />
                  </div>
                </template>
              </Scroller>
            </Viewport>
          </template>
        </div>
      </DocumentContent>
    </EmbedPDF>
  </BaseViewer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePdfiumEngine } from '@embedpdf/engines/vue';
import { EmbedPDF } from '@embedpdf/core/vue';
import { createPluginRegistration } from '@embedpdf/core';
import { ViewportPluginPackage, Viewport } from '@embedpdf/plugin-viewport/vue';
import { ScrollPluginPackage, Scroller } from '@embedpdf/plugin-scroll/vue';
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/vue';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/vue';
import { ZoomPluginPackage } from '@embedpdf/plugin-zoom/vue';

import BaseViewer from '../BaseViewer';
import PdfViewerToolbar from './PdfViewerToolbar.vue';

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
}>();

const { engine, isLoading } = usePdfiumEngine();

const plugins = computed(() => {
  const url = props.detail?.media?.documents?.[0]?.url;

  if (!url) {
    return [];
  }

  return [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(ZoomPluginPackage),
  ];
});
</script>
