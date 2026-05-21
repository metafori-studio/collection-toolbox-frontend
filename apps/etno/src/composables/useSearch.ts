import { ref, computed, watch } from 'vue';
import { normalizeString, debounce } from '@metafori/shared';
import { getSearch } from '@/api';

export const useSearch = () => {
  const DEBOUNCE_TIMEOUT = 300;

  const query = ref('');
  const queryNormalized = computed(() => normalizeString(query.value));
  const results = ref<Record<string, unknown>[]>([]);
  const isLoading = ref(false);

  const reset = () => {
    isLoading.value = false;
    results.value = [];
  };

  const search = debounce(async (value: string) => {
    results.value = await getSearch(value);
    isLoading.value = false;
  }, DEBOUNCE_TIMEOUT);

  watch(queryNormalized, (value) => {
    if (!value.length) {
      reset();
      return;
    }
    isLoading.value = true;
    search(value);
  });

  return { query, results, isLoading };
};
