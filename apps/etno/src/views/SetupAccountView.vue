<template>
  <div class="bg-neutral-100 py-20">
    <div class="rounded-lg bg-white border border-neutral-200 max-w-[448px] mx-auto p-6">
      <div class="mb-4">
        <h1 class="text-heading-3">
          {{ $t('auth.setupAccount.title') }}
        </h1>
        <p class="text-sm text-neutral-500">
          {{ $t('auth.setupAccount.subtitle') }}
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
            :model-value="email"
            type="text"
            disabled
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-foreground mb-2"
          >
            {{ $t('auth.common.newPassword') }}
          </label>
          <InputText
            id="password"
            v-model="password"
            type="password"
          />
        </div>

        <div>
          <label
            for="passwordRepeat"
            class="block text-sm font-medium text-foreground mb-2"
          >
            {{ $t('auth.common.newPasswordRepeat') }}
          </label>
          <InputText
            id="passwordRepeat"
            v-model="passwordRepeat"
            type="password"
          />
        </div>

        <p
          v-if="error"
          class="bg-red-100 py-2 px-3 rounded-lg text-sm text-red-500"
        >
          {{ error }}
        </p>

        <BaseButton type="submit">
          {{ $t('auth.setupAccount.submit') }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { BaseButton, InputText } from '@metafori/components';

import type { AxiosError } from 'axios';
import { getCsrfCookie, setPassword } from '@/api';

const {
  email,
  token,
} = defineProps<{
  email: string
  token: string
}>();

const { t } = useI18n();
const password = ref('');
const passwordRepeat = ref('');

const error = ref('');
const router = useRouter();

onMounted(() => {
  getCsrfCookie();
});

const submit = async () => {
  error.value = '';
  if (password.value !== passwordRepeat.value) {
    error.value = t('auth.common.passwordMismatch');
    return;
  }
  try {
    const response = await setPassword({ token, email, password: password.value });
    if (response.status === 200) {
      router.push({ name: 'Login' });
    }
  } catch (e: unknown) {
    error.value = (e as AxiosError<{ message: string }>)?.response?.data?.message || t('auth.unknownError');
  }
};

</script>
