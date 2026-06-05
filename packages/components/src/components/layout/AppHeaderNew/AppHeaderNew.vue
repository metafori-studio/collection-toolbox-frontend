<template>
  <header class="fixed top-0 w-full md:relative z-10 bg-header-bg text-header-color border-b border-b-header-border">
    <div
      class="
        container
        flex items-center justify-between gap-16
        h-12 md:h-18
      "
    >
      <div>
        <slot name="logo" />
      </div>
      <BaseButton
        variant="secondary"
        class="md:hidden"
        @click="isOpen = !isOpen"
      >
        Menu
        <BaseIcon icon="list" />
      </BaseButton>
      <div
        class="md:flex md:flex-1 md:p-0 md:relative md:flex-row md:bg-transparent justify-between"
        :class="{
          'fixed -z-10 inset-0 bg-header-bg p-4 py-20 flex flex-col items-end justify-between text-right': isOpen,
          'hidden': !isOpen,
        }"
      >
        <nav>
          <ul class="max-md:text-display-3 md:text-button-lg flex flex-col gap-8 md:flex-row">
            <slot name="nav-primary" />
          </ul>
        </nav>
        <nav>
          <ul class="max-md:text-heading-1 md:text-button-lg flex flex-col gap-8 md:flex-row">
            <slot name="nav-secondary" />
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseButton from '../../atoms/BaseButton';
import BaseIcon from '../../atoms/BaseIcon';

const isOpen = ref(false);
</script>
