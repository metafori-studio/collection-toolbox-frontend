<template>
  <div class="bg-neutral-100">
    <div class="rounded-lg bg-white border border-neutral-200 max-w-[448px] my-20 mx-auto p-6">
      <div class="mb-4">
        <h1 class="text-heading-3">
          Prihlásenie
        </h1>
        <p class="text-sm text-neutral-500">
          Prihláste sa
        </p>
      </div>
      <form
        action=""
        method="post"
        class="flex flex-col gap-4"
        @submit.prevent="submit()"
      >
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-foreground mb-2"
          >
            E-mail
          </label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-foreground mb-2"
          >
            Heslo
          </label>
          <InputText
            id="password"
            v-model="password"
            type="password"
          />
        </div>

        <p class="text-sm text-neutral-500">
          Nemáte účet?
          <RouterLink :to="{ name: 'Signup' }">
            Požiadajte o registráciu
          </RouterLink>
        </p>

        <BaseButton>
          Prihlásiť sa
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { BaseButton, InputText } from '@metafori/components';

import { getCsrfCookie, login } from '@/api';

const email = ref('');
const password = ref('');

const submit = () => {
  login({
    email: email.value,
    password: password.value,
    // remember: true,
  });
};

onMounted(() => {
  getCsrfCookie();
});

</script>
