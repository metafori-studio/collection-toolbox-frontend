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
    <InputCheckbox
      label="Placeholder"
      :count="2345"
    />

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
import InputCheckbox from '@/components/atoms/InputCheckbox';
import BaseButton from '@/components/atoms/BaseButton';
import InfoBox from '@/components/molecules/InfoBox';
import FilterSection from '@/components/molecules/FilterSection';
import FilterItem from '@/components/molecules/FilterItem';

const text = ref<string>('hello');
</script>
