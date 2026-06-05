<template>
  <footer class="pt-12 pb-10 bg-footer-bg text-footer-text">
    <div class="container flex flex-col gap-8">
      <div class="flex flex-col gap-10 md:flex-row">
        <div class="md:w-1/4">
          <h2 class="text-heading-3 mb-4">
            {{ title }}
          </h2>
          <p>
            {{ description }}
          </p>
        </div>
        <div class="flex-1 flex flex-col gap-10 md:flex-row">
          <slot />
        </div>
      </div>
      <hr>
      <div class="flex flex-col md:flex-row items-center gap-8 justify-between">
        <div class="w-full flex justify-between gap-2 md:gap-10 md:w-auto">
          <img
            v-for="(logo, i) in logos"
            :key="i"
            :src="logo.src"
            :alt="logo.title"
            class="max-h-[36px] md:max-h-[40px]"
          >
        </div>
        <div class="text-sm">
          {{ copyright }}
        </div>
        <div class="flex items-center gap-2 text-sm">
          Built by
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="101"
            height="36"
            fill="none"
          >
            <path
              stroke="currentColor"
              stroke-width="1.5"
              d="M18 .8h64.1a17.3 17.3 0 0 1 0 34.5H18A17.3 17.3 0 0 1 18 .8Z"
            />
            <path
              fill="currentColor"
              d="M85.4 12.7q-1.5-.1-1.6-1.6.1-1.6 1.6-1.6 1.6.1 1.7 1.6-.1 1.6-1.7 1.6m-2.6 14.8.2-.5q1.1 0 1.2-1.4V18q0-1.4-1.2-1.6l-.2-.5q2.8 0 3.4-1.3h.5v11q0 1.5 1.2 1.4l.2.5zM80.4 14.6q2.2.1 2.2 2.3c0 1.1-.8 2.2-2 2.2q-.8 0-1.2-.4 1-.3 1.1-1.7 0-1-.7-1c-1.1 0-2.4 2.2-2.4 4.4v5.2q.1 1.4 1.7 1.4l.2.5h-5.8l.2-.5q1.1 0 1.2-1.4V18q0-1.4-1.2-1.6l-.2-.5q2.8 0 3.4-1.3h.5v2.9q1-2.7 3-2.9M68.3 27.8c-3 0-4.9-2.7-4.9-6.6 0-4 2-6.6 4.9-6.6s4.9 2.7 4.9 6.6c0 4-2 6.6-5 6.6m.2-.8q2 0 2-4.5-.1-7-2.5-7.1-1.9.1-1.9 4.4c0 4.5 1 7.2 2.4 7.2"
            />
            <path
              fill="currentColor"
              d="m57.5 27.5.2-.5q1.1 0 1.2-1.4v-10h-1.3l-.1-.5c1 0 1.4-.5 1.4-2.7 0-2.8 1.4-4.1 3.3-4.1 1.5 0 3.2 1 3.2 2.6 0 1-.8 2-1.8 2q-1 0-1.4-.6 1.1-.2 1.2-1.6c0-.7-.5-1.7-1.5-1.7q-1.3 0-1.4 1.8c0 1.6 1 2.1 1 4h2.3v.9h-1.3q-1 0-1 1v8.9q0 1.4 1.6 1.4l.2.5zM57.3 27l.2.5h-3.8l-.1-2.4v-.3q-1.3 3-3.4 3-2.6 0-2.8-3c0-2 1.5-3 3-4.1s3-2.3 3-4.1q0-1.1-1.2-1.2-1.7.1-1.8 1.8 0 1 1 1.4a2 2 0 0 1-1.5.9q-1.6 0-1.7-1.6c0-1.8 2-3.3 4-3.3 2.2 0 4 1 4 4v7q0 1.4 1.1 1.4m-6-.8c1 0 2.3-1.8 2.3-4.5v-3.5q-.7 1.6-1.8 2.8-1.7 1.4-1.8 3.5 0 1.7 1.2 1.7"
            />
            <path
              fill="currentColor"
              d="M44 27.8q-2.5 0-2.5-3v-9.1h-1.1l-.2-.6c1.6 0 3-2.1 3.2-5h.6v4.8h2.5v.8h-1.3q-1.2 0-1.2 1.2v7.3q0 2 1 2c.8 0 2.3-.2 2.5-2.1h.5c0 2-2 3.7-4 3.7M39.5 22.9h.5q-.6 4.7-4.2 4.9c-2.4 0-4.4-2.5-4.4-6.4s1.8-6.8 5-6.8c2.2 0 3.6 1.7 3.6 4.3q0 .6-.7.8L35 21.4q-1 .4-.7 1.6.5 3.3 2.6 3.2 2-.1 2.6-3.3m-3.2-7.5q-2.3 0-2.2 5.2v.4c3-1.4 3.4-1.8 3.4-3.3q0-2.1-1.2-2.3"
            />
            <path
              fill="currentColor"
              d="m31.6 27 .2.5h-6.6l.2-.5q1.8.1 1.6-2l-1.4-13.3-3.2 12.4.5 2-1.8 1.5-.5.1-4.3-16-.9 9.8c-.2 2.4-.1 5.4 1.6 5.5l.2.5H12l.2-.5q1.6.1 2-2l1.1-12.5q.3-2.3-1.6-2.3l-.2-.5h5L22 22.5l3.3-12.8h5l-.1.5q-1.9-.1-1.7 2L29.8 25c.2 1.6.8 2 1.8 2.1"
            />
          </svg>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Logo {
  src: string
  title: string
}

const {
  title,
  description = '',
  copyright = '',
  logos = [],
} = defineProps<{
  title: string,
  description?: string,
  copyright?: string
  logos?: Logo[]
}>();
</script>
