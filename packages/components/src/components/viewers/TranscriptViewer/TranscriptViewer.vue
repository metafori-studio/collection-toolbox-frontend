<template>
  <aside
    class="w-full md:max-w-[360px] flex flex-col border-l border-neutral-200 bg-white"
    aria-label="Transcript"
  >
    <header class="sticky top-0 z-10 px-4 py-2 border-b border-neutral-200 bg-white text-label text-neutral-500">
      Transcript
    </header>
    <div class="flex-1 overflow-y-auto px-4 py-3 whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed">
      {{ transcript }}
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  transcript: string;
}>();
</script>
