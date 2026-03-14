<template>
  <div class="border border-neutral-200">
    <table class="w-full border-collapse">
      <thead class="sticky top-14 z-10">
        <tr class="bg-neutral-50 border-b border-b-neutral-200">
          <th
            :class="[headerCellCss]"
            class="text-left"
          >
            Č.A.
          </th>
          <th
            :class="[headerCellCss]"
            class="text-center"
          >
            St.
          </th>
          <th
            :class="[headerCellCss]"
            class="text-left lg:min-w-[100px]"
          >
            Obec
          </th>
          <th
            :class="[headerCellCss]"
            class="text-left lg:min-w-[90px]"
          >
            KÚ
          </th>
          <th
            :class="[headerCellCss]"
            class="text-left lg:min-w-[90px]"
          >
            Okres
          </th>
          <th
            :class="[headerCellCss]"
            class="text-left lg:min-w-[120px]"
          >
            Poloha
          </th>
          <th
            :class="[headerCellCss]"
            class="text-left lg:min-w-[200px]"
          >
            Datovanie – Druh
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b border-neutral-50 hover:bg-neutral-50 transition-colors relative"
        >
          <td class="align-top py-3 px-3 text-mono font-mono text-primary-500">
            <RouterLink
              :to="{
                name: 'DetailMap',
                params: { id: item.id },
              }"
              :class="[focusBeforeClasses]"
              class="before:absolute before:z-10 before:inset-0"
            >
              {{ item.id }}
            </RouterLink>
          </td>
          <td
            :class="[bodyCellCss]"
            class="pt-4"
          >
            <ActivityLevel
              :level="item.localization_degree"
              :label="false"
            />
          </td>
          <td
            :class="[bodyCellCss]"
            class="font-semibold"
          >
            {{ item.municipality }}
          </td>
          <td
            :class="[bodyCellCss]"
            class="text-neutral-400"
          >
            {{ item.cadastral_area }}
          </td>
          <td
            :class="[bodyCellCss]"
            class="text-neutral-500"
          >
            {{ item.district }}
          </td>
          <td
            :class="[bodyCellCss]"
            class="text-neutral-400"
          >
            {{ item.position }}
          </td>
          <td class="py-3 px-3 align-top">
            <div class="flex gap-1 flex-wrap">
              <ActivityChip
                v-for="(chip, i) in item.dating_ns"
                :key="i"
              >
                {{ chip }}
              </ActivityChip>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import ActivityChip from '@/components/ActivityChip.vue';
import ActivityLevel from '@/components/ActivityLevel.vue';

import { focusBeforeClasses } from '@metafori/components';

const headerCellCss = 'text-label-small text-neutral-400 font-semibold uppercase px-3 py-2 whitespace-nowrap';
const bodyCellCss = 'align-top py-3 px-3 text-sm';

const {
  items = [],
} = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
}>();


</script>
