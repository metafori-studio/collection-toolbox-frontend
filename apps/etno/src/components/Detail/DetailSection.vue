<template>
  <section>
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-[13px] font-bold text-neutral-700 uppercase">
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
