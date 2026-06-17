<template>
  <ModalWindow
    :is-open="true"
    :title="$t('attachmentRequest.title')"
  >
    <div class="flex flex-col items-center gap-4">
      <h2 class="text-heading-3">
        {{ $t('attachmentRequest.title') }}
      </h2>
      <p class="text-sm text-neutral-500">
        {{ $t('attachmentRequest.description') }}
      </p>
      <div class="flex flex-col gap-1 text-sm bg-neutral-100 text-neutral-500 rounded-lg p-4 w-full">
        <p class="text-base font-semibold text-neutral-900">
          Archeologický ústav SAV, v. v. i.
        </p>
        <p>
          Akademická 2, 949 21 Nitra
        </p>
        <p>
          sekretariat@savba.sk
        </p>
        <p>
          +421 37 6943 473
        </p>
      </div>
      <BaseButton
        block
        @click="sendEmail()"
      >
        {{ $t('attachmentRequest.sendEmail') }}
      </BaseButton>
      <BaseButton
        variant="secondary"
        block
      >
        {{ $t('attachmentRequest.close') }}
      </BaseButton>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import {
  ModalWindow,
  BaseButton,
} from '@metafori/components';

const sendEmail = () => { window.open('mailto:sekretariat@savba.sk'); };

</script>
