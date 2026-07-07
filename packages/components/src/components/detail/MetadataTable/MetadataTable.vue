<template>
  <table
    class="w-full border-collapse table-fixed"
  >
    <tbody>
      <tr
        v-for="(item, i) in items"
        :key="i"
      >
        <th
          class="text-text-tertiary pr-2"
          :class="cellClasses"
          scope="row"
        >
          {{ item.label }}
        </th>
        <td
          class="text-text-primary"
          :class="cellClasses"
        >
          {{ item.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
export type MetadataRecord = {
  label: string
  value: string | number
};

const cellClasses = 'py-2 text-left text-label border-b border-b-neutral-200';

defineProps<{
  items: MetadataRecord[]
}>();
</script>
