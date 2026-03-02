<template>
  <div class="p-4 flex flex-col gap-1">
    <p class="text-xl">
      Icon
    </p>
    <BaseIcon />

    <p class="text-xl">
      Inputs
    </p>
    <InputText
      v-model="text"
      placeholder="Placeholder"
    />
    <InputText
      placeholder="Placeholder"
      :disabled="true"
    />
    <InputText
      placeholder="Placeholder"
      :has-error="true"
    />
    <InputCheckboxList
      v-model="checkboxVal"
      name="check1"
      :options="[
        { value: 'one', label: 'One', count: 12 },
        { value: 'two', label: 'Two', count: 23 },
        { value: 'three', label: 'Three', count: 34 },
        { value: 'four', label: 'Four', count: 45 },
      ]"
    />

    {{ checkboxVal }}

    <InputRadioList
      v-model="radioVal"
      name="radio1"
      :options="[
        { value: 'one', label: 'One', count: 12 },
        { value: 'two', label: 'Two', count: 23 },
        { value: 'three', label: 'Three', count: 34 },
        { value: 'four', label: 'Four', count: 45 },
      ]"
    />

    {{ radioVal }}

    <p class="text-xl">
      Buttons
    </p>
    <BaseButton>
      Hello world
      <BaseIcon />
    </BaseButton>
    <BaseButton :disabled="true">
      Hello world
      <BaseIcon />
    </BaseButton>

    <BaseButton size="small">
      Hello world
      <BaseIcon :size="16" />
    </BaseButton>

    <p class="text-xl">
      Filter
    </p>
    <FilterChip
      :count="7"
    />
    <InfoBox>
      4 aktivity bez súradníc
      <template #actions>
        <BaseButton size="small">
          Zoznam
        </BaseButton>
      </template>
    </InfoBox>

    <p class="text-xl">
      Filter
    </p>
    <FilterSection
      label="Geografické údaje"
    >
      <FilterItem
        label="Obec"
        icon="magnifyingGlass"
      />
      <FilterItem
        label="Kataster"
        :selected-count="3"
      />
    </FilterSection>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseIcon from '@/components/atoms/BaseIcon';
import FilterChip from '@/components/atoms/FilterChip';
import InputText from '@/components/atoms/InputText';
import { InputCheckboxList } from '@/components/atoms/InputCheckbox';
import { InputRadioList } from '@/components/atoms/InputRadio/';
import BaseButton from '@/components/atoms/BaseButton';
import InfoBox from '@/components/molecules/InfoBox';
import FilterSection from '@/components/molecules/FilterSection';
import FilterItem from '@/components/molecules/FilterItem';

const text = ref<string>('hello');
const checkboxVal = ref<string[]>([]);
const radioVal = ref<string>('one');
</script>
