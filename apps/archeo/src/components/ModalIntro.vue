<template>
  <ModalWindow
    :is-open="isOpen"
    :allow-close="false"
    :title="$t('intro.title')"
  >
    <div class="flex flex-col gap-4">
      <h2 class="text-heading-2">
        {{ $t('intro.title') }}
      </h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="$t('intro.body')" />

      <InputCheckbox
        v-model="termsAccepted"
        :label="$t('intro.checkboxLabel')"
      />
      <BaseButton
        :disabled="!termsAccepted"
        @click="handleSubmit"
      >
        {{ $t('intro.submitButton') }}
      </BaseButton>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ModalWindow, BaseButton, InputCheckbox } from '@metafori/components';

const { t } = useI18n();

const STORAGE_KEY = 'ARCHEOMAP_USER_AGREEMENT';
const STORAGE_VALUE = 'TRUE';

const checkAgreement = () => localStorage.getItem(STORAGE_KEY) === STORAGE_VALUE;
const setAgreement = () => localStorage.setItem(STORAGE_KEY, STORAGE_VALUE);

const termsAccepted = ref(false);
const isOpen = ref(!checkAgreement());

const handleSubmit = () => {
  if (!termsAccepted.value) {
    alert(t('intro.alertTerms'));
    return;
  }

  setAgreement();
  isOpen.value = false;
};
</script>
