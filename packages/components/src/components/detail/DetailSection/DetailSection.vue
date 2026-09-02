<template>
  <section>
    <div class="flex items-center justify-between gap-2 mb-3">
      <h3 class="text-title-card">
        {{ title }}
      </h3>
      <slot name="actions" />
    </div>
    <slot />
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>();
</script>
