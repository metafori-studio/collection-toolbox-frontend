<template>
  <ModalWindow
    :is-open="isOpen"
    :allow-close="false"
    title="Rešpektujte prosím podmienky používania"
  >
    <div class="flex flex-col gap-4">
      <h2 class="text-heading-2">
        Rešpektujte prosím podmienky používania
      </h2>
      <p>Tento portál sprístupňuje výskumné materiály, pri ktorých je dôležité rešpektovať autorské a majetkové práva uvedené pri dokumentoch.</p>
      <p>Aby sme chránili dáta aj autorov, dokumenty sú dostupné len na čítanie, nie je možné ich priamo sťahovať ani hromadne exportovať. Ak potrebujete prístup k plnej verzii konkrétneho dokumentu, môžete si oň jednoducho požiadať priamo v systéme cez funkciu „Žiadosť o sprístupnenie“.</p>
      <p>Kliknutím na tlačidlo <strong>„Zoznámil(a) som sa s podmienkami používania“</strong> potvrdzujete, že týmto pravidlám rozumiete a budete ich dodržiavať.</p>

      <InputCheckbox
        v-model="termsAccepted"
        label="Zoznámil(a) som sa s podmienkami používania portálu Archeomap."
      />
      <BaseButton
        :disabled="!termsAccepted"
        @click="handleSubmit"
      >
        Prejsť na portál
      </BaseButton>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ModalWindow, BaseButton, InputCheckbox } from '@metafori/components';

const STORAGE_KEY = 'ARCHEOMAP_USER_AGREEMENT';
const STORAGE_VALUE = 'TRUE';

const checkAgreement = () => localStorage.getItem(STORAGE_KEY) === STORAGE_VALUE;
const setAgreement = () => localStorage.setItem(STORAGE_KEY, STORAGE_VALUE);

const termsAccepted = ref(false);
const isOpen = ref(!checkAgreement());

const handleSubmit = () => {
  if (!termsAccepted.value) {
    alert('Prosím, potvrďte podmienky');
    return;
  }

  setAgreement();
  isOpen.value = false;
};
</script>
