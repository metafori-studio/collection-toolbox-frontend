<template>
  <div class="flex items-center justify-center">
    <ErrorState
      :title="$t('error404.title')"
      :text="$t('error404.text')"
    />
  </div>
</template>

<script setup lang="ts">
import { ErrorState } from '@metafori/components';
</script>
