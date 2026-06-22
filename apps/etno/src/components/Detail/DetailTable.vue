<template>
  <table
    class="w-full border-collapse table-fixed"
  >
    <tbody>
      <tr
        v-for="(row, i) in filteredRows"
        :key="i"
      >
        <th
          class="py-2 pr-2 text-xs font-normal text-left text-neutral-400 border-b border-b-neutral-200 align-top"
          scope="row"
        >
          {{ row.label }}
        </th>
        <td
          class="py-2 text-sm font-medium text-neutral-900 border-b border-b-neutral-200"
        >
          <template
            v-for="(item, vi) in resolvedValues(row)"
            :key="vi"
          >
            <button
              v-if="item.filterId != null && item.filterValue != null && item.filterValue !== ''"
              class="text-left text-primary-500 hover:underline transition-colors cursor-pointer"
              @click="$emit('selectFilter', item.filterId!, item.filterValue!)"
            >
              {{ formatText(item.text) }}
            </button>
            <template v-else>
              {{ formatText(item.text) }}
            </template>
            <span
              v-if="vi < resolvedValues(row).length - 1"
              class="text-neutral-400"
            > · </span>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type Row = { label: string } & (
  | { value: ValueItem; values?: never }
  | { values: ValueItem[]; value?: never }
  | { value?: never; values?: never }
);

type ValueItem = {
  text: string | number | boolean | null | undefined;
  filterId?: string;
  filterValue?: string | null;
};

const { rows } = defineProps<{
  rows: Row[]
}>();

defineEmits<{
  selectFilter: [filterId: string, filterValue: string]
}>();

const hasText = (v: ValueItem): v is ValueItem & { text: string | number | boolean } =>
  v.text != null && v.text !== '';

const resolvedValues = (row: Row) => {
  if ('value' in row && row.value) {
    return [row.value].filter(hasText);
  }
  return row.values?.filter(hasText) ?? [];
};

const filteredRows = computed(() => rows.filter((row) => resolvedValues(row).length));

const formatText = (text: string | number | boolean) => {
  if (typeof text === 'string' || typeof text === 'number') {
    return text;
  }
  if (typeof text === 'boolean') {
    return text ? t('detail.boolean.true') : t('detail.boolean.false');
  }
  return '';
};
</script>
