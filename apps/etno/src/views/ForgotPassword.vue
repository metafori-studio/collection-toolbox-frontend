<template>
  <div class="bg-neutral-100 py-20">
    <div class="rounded-lg bg-white border border-neutral-200 max-w-[448px] mx-auto p-6">
      <div class="mb-4">
        <h1 class="text-heading-3">
          {{ $t('auth.forgotPassword.title') }}
        </h1>
        <p class="text-sm text-neutral-500">
          {{ $t('auth.forgotPassword.subtitle') }}
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
            {{ $t('auth.common.email') }}
          </label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
          />
        </div>

        <p
          v-if="error"
          class="bg-red-100 py-2 px-3 rounded-lg text-sm text-red-500"
        >
          {{ error }}
        </p>

        <div class="flex justify-end gap-3">
          <BaseButton
            type="button"
            variant="secondary"
            @click="$router.push({ name: 'Login' })"
          >
            {{ $t('auth.forgotPassword.toLogin') }}
          </BaseButton>

          <BaseButton type="submit">
            {{ $t('auth.forgotPassword.submit') }}
          </BaseButton>
        </div>
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
import { forgotPassword } from '@/api';

const { t } = useI18n();
const email = ref('');
const error = ref('');
const router = useRouter();

const submit = async () => {
  error.value = '';
  try {
    await forgotPassword({ email: email.value });
    router.push({ name: 'Login' });
  } catch (e: unknown) {
    error.value = (e as AxiosError<{ message: string }>)?.response?.data?.message || t('auth.unknownError');
  }
};
</script>
