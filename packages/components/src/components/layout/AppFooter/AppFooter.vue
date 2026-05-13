<template>
  <footer class="bg-neutral-900 text-white py-6 lg:py-16 px-4 flex flex-col items-center gap-2 text-center lg:gap-4">
    <p class="text-heading-2">
      {{ title }}
    </p>
    <ul class="flex justify-center gap-2 md:gap-4 my-2">
      <li
        v-for="(partner, i) in partners"
        :key="i"
        class="max-w-[100px] md:max-w-[160px] p-2 md:p-3 bg-white rounded-lg flex items-center"
      >
        <img
          :src="partner.src"
          :alt="partner.name"
        >
      </li>
    </ul>
    <p class="max-w-[900px] text-neutral-400 text-sm">
      {{ legalText }}
    </p>
    <div class="text-neutral-500">
      <span>{{ copyright }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const {
  title = null,
  legalText = null,
  copyright = '© 2026',
  partners = [],
} = defineProps<{
  title?: string,
  legalText?: string,
  copyright?: string,
  partners?: { src: string, name: string }[],
}>();

</script>
