<template>
  <table
    class="w-full border-collapse table-fixed"
  >
    <tbody>
      <tr
        v-for="(row, i) in nonEmptyItems"
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
          <span v-if="typeof row.value === 'string'">
            {{ row.value }}
          </span>
          <span v-if="typeof row.value === 'number'">
            {{ row.value }}
          </span>
          <span v-if="typeof row.value === 'boolean'">
            {{ row.value ? $t('detail.boolean.true') : $t('detail.boolean.false') }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const {
  items,
} = defineProps<{
  items: {
    label: string;
    value: string | number | boolean | null | undefined;
  }[]
}>();

const nonEmptyItems = computed(() => items.filter((row) => row.value !== '' && row.value != null));
</script>
