<template>
  <div class="bg-neutral-100 py-20">
    <div class="rounded-lg bg-white border border-neutral-200 max-w-[448px] mx-auto p-6">
      <div class="mb-4">
        <h1 class="text-heading-3">
          {{ $t('auth.login.title') }}
        </h1>
        <p class="text-sm text-neutral-500">
          {{ $t('auth.login.subtitle') }}
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
            {{ $t('auth.login.email') }}
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
            {{ $t('auth.login.password') }}
          </label>
          <InputText
            id="password"
            v-model="password"
            type="password"
          />
        </div>

        <p class="text-sm text-neutral-500">
          {{ $t('auth.login.noAccount') }}
          <RouterLink :to="{ name: 'Signup' }">
            {{ $t('auth.login.requestSignup') }}
          </RouterLink>
        </p>

        <p
          v-if="error"
          class="bg-red-100 py-2 px-3 rounded-lg text-sm text-red-500"
        >
          {{ error }}
        </p>

        <BaseButton>
          {{ $t('auth.login.submit') }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { BaseButton, InputText } from '@metafori/components';

import type { AxiosError } from 'axios';
import { login } from '@/api';

const { t } = useI18n();
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const submit = async () => {
  error.value = '';
  try {
    const response = await login({
      email: email.value,
      password: password.value,
      remember: true,
    });
    if (response.status === 204) {
      router.push({ name: 'Explore' });
    }
  } catch (e: unknown) {
    error.value = (e as AxiosError<{ message: string }>)?.response?.data?.message || t('auth.unknownError');
  }
};


</script>
