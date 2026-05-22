import { ref, computed, watch } from 'vue';
import { normalizeString, debounce } from '@metafori/shared';
import { getSearch } from '@/api';

type SearchResult = { id: string } & Record<string, unknown>;

export const useSearch = () => {
  const DEBOUNCE_TIMEOUT = 300;

  const query = ref('');
  const queryNormalized = computed(() => normalizeString(query.value));
  const results = ref<SearchResult[]>([]);
  const isLoading = ref(false);
  const hasQuery = computed(() => queryNormalized.value.length);

  let activeRequestId = 0;

  const reset = () => {
    activeRequestId++;
    isLoading.value = false;
    results.value = [];
  };

  const search = debounce(async (value: string) => {
    const thisRequestId = activeRequestId;
    try {
      const data = await getSearch(value);
      // Only set if this is last request
      if (thisRequestId === activeRequestId) {
        results.value = data;
      }
    } catch {
      // ignore
    } finally {
      if (thisRequestId === activeRequestId) {
        isLoading.value = false;
      }
    }
  }, DEBOUNCE_TIMEOUT);

  watch(queryNormalized, (value) => {
    if (!value.length) {
      reset();
      return;
    }
    activeRequestId++;
    isLoading.value = true;
    search(value);
  });

  return {
    query,
    hasQuery,
    results,
    isLoading,
  };
};
