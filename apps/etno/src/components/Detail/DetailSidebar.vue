<template>
  <div
    class="bg-white md:max-w-[392px]"
  >
    <div class="sticky z-10 top-14 bg-white px-4 py-2 flex items-center gap-2 border-b border-neutral-200 min-h-[49px]">
      <span class="">
        {{ $t('detail.panel.title') }}
      </span>
      <span class="font-mono text-xs font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
        {{ detail.id }}
      </span>
    </div>

    <div class="p-4 flex flex-col gap-8">
      <div
        v-if="isDev && availableViewers.length"
        class="flex flex-col gap-2"
      >
        <span class="text-label text-neutral-500">{{ $t('detail.viewer.label') }}</span>

        <div

          class="flex flex-wrap items-center gap-2"
        >
          <InputSelect
            :model-value="viewerActive ?? undefined"
            :options="availableViewers.map((v) => ({
              value: v.key,
              label: v.key,
            }))"
            @update:model-value="(v) => v && $emit('update:viewerActive', v)"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <h1 class="text-heading-3">
          {{ detail.title }}
        </h1>
      </div>

      <DetailSection
        :title="$t('detail.section.basicInfo')"
      >
        <DetailTable
          :items="basicInfo"
        />
      </DetailSection>

      <DetailSection
        v-if="detail.abstract"
        :title="$t('detail.section.abstract')"
      >
        <p class="text-sm text-neutral-500">
          {{ detail.abstract }}
        </p>
      </DetailSection>

      <DetailSection
        :title="$t('detail.section.keywords')"
      >
        <ul class="flex gap-1.5 flex-wrap">
          <li
            v-for="keyword in detail.keywords"
            :key="keyword.id"
            class="rounded-md px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700"
            v-text="keyword.name"
          />
        </ul>
      </DetailSection>

      <h2 class="text-heading-4">
        {{ $t('detail.section.data') }}
      </h2>

      <DetailSection
        :title="tableDesc.title"
      >
        <DetailTable
          :items="tableDesc.items"
        />
        <div class="flex flex-col gap-2">
          <div
            v-if="detail.general_note"
            class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
          >
            <h3 class="text-label-sm font-bold text-neutral-500">
              {{ $t('detail.notes.general') }}
            </h3>
            <p class="text-sm font-medium">
              {{ detail.general_note }}
            </p>
          </div>
          <div
            v-if="detail.content_note"
            class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
          >
            <h3 class="text-label-sm font-bold text-neutral-500">
              {{ $t('detail.notes.content') }}
            </h3>
            <p class="text-sm font-medium">
              {{ detail.content_note }}
            </p>
          </div>
          <div
            v-if="detail.technical_note"
            class="flex flex-col gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2.5 text-neutral-600"
          >
            <h3 class="text-label-sm font-bold text-neutral-500">
              {{ $t('detail.notes.technical') }}
            </h3>
            <p class="text-sm font-medium">
              {{ detail.technical_note }}
            </p>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        :title="tableAuthors.title"
      >
        <DetailTable
          :items="tableAuthors.items"
        />
      </DetailSection>

      <DetailSection
        :title="tableGeographic.title"
      >
        <DetailTable
          :items="tableGeographic.items"
        />
      </DetailSection>

      <DetailSection
        :title="tableFormal.title"
      >
        <DetailTable
          :items="tableFormal.items"
        />
      </DetailSection>

      <DetailSection
        :title="tableAdministrative.title"
      >
        <DetailTable
          :items="tableAdministrative.items"
        />
      </DetailSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Detail } from '@/api';
import { useTranslateEnum } from '@/composables/useTranslateEnum';

import { InputSelect } from '@metafori/components';
import DetailSection from './DetailSection.vue';
import DetailTable from './DetailTable.vue';

import { toNameReadable } from '@/misc/toNameReadable';
import { toYearRange } from '@/misc/toYearRange';

const {
  detail,
  viewerActive = null,
  availableViewers = [],
} = defineProps<{
  detail: Detail
  viewerActive?: string | null
  availableViewers?: { key: string }[]
}>();

const isDev = import.meta.env.DEV;

defineEmits<{
  'update:viewerActive': [value: string]
}>();

const { t } = useI18n();
const { translateEnum } = useTranslateEnum();

const basicInfo = computed(() => [
  {
    label: t('detail.table.authorship'),
    value: toNameReadable(detail.authors),
  },
  {
    label: t('detail.table.documentType'),
    value: translateEnum('ItemType', detail.type),
  },
  {
    label: t('detail.table.researchCollection'),
    value: detail.research_collections?.map((o: { title: string }) => o.title).join(', '),
  },
]);

const tableDesc = computed(() => ({
  title: t('detail.section.descriptiveData'),
  items: [
    {
      label: t('detail.table.language'),
      value: translateEnum('Language', detail.language),
    },
  ],
}));

const tableAuthors = computed(() => ({
  title: t('detail.section.authorsAndOriginators'),
  items: [
    {
      label: t('detail.table.authorship'),
      value: toNameReadable(detail.authors),
    },
    {
      label: t('detail.table.research'),
      value: toNameReadable(detail.researchers),
    },
    {
      label: t('detail.table.origin'),
      value: toNameReadable(detail.originators),
    },
  ],
}));

const tableGeographic = computed(() => {
  const locality = detail.locality;
  const district = locality?.district || locality?.parent;
  const region = district?.region;
  const country = region?.country;
  return {
    title: t('detail.section.geographic'),
    items: [
      { label: t('detail.table.municipality'), value: locality?.name },
      { label: t('detail.table.district'), value: district?.name },
      { label: t('detail.table.region'), value: region?.name },
      { label: t('detail.table.country'), value: country?.name },
    ],
  };
});

const tableFormal = computed(() => ({
  title: t('detail.section.researchOriginContext'),
  items: [
    {
      label: t('detail.table.institution'),
      value: detail.institution?.name,
    },
    {
      label: t('detail.table.collectionMethod'),
      value: translateEnum('CollectionMethod', detail.collection_method),
    },
    {
      label: t('detail.table.accrualMethod'),
      value: translateEnum('AccrualMethod', detail.accrual_method),
    },
    {
      label: t('detail.table.documentType'),
      value: translateEnum('ItemType', detail.type),
    },
    {
      label: t('detail.table.timeOfRealization'),
      value: toYearRange(detail.time_period_start, detail.time_period_end),
    },
    {
      label: t('detail.table.submissionDate'),
      value: toYearRange(detail.submission_date_start, detail.submission_date_end),
    },
  ],
}));

const tableAdministrative = computed(() => ({
  title: t('detail.section.rightsAndAccess'),
  items: [
    {
      label: t('detail.table.accessRights'),
      value: translateEnum('AccessRights', detail.access_rights),
    },
    {
      label: t('detail.table.license'),
      value: translateEnum('License', detail.license),
    },
  ],
}));
</script>
