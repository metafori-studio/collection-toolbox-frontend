import { ref, type ComputedRef } from 'vue';

export type RefreshUrlHandler = (expiredUrl?: string) => Promise<string | void>;

export function useMediaRefresh(handler: ComputedRef<RefreshUrlHandler | undefined>, maxAttempts = 1) {
  const isRefreshing = ref(false);
  let attempts = 0;

  function resetRefreshAttempts() {
    attempts = 0;
    isRefreshing.value = false;
  }

  // Replenish only after content actually loads, not when a new URL is issued.
  function markLoadSuccess() {
    attempts = 0;
  }

  async function refreshAndRetry(failedUrl: string, retry: (refreshedUrl: string) => Promise<boolean>) {
    if (!handler.value || attempts >= maxAttempts || isRefreshing.value) return false;

    isRefreshing.value = true;
    attempts += 1;
    try {
      const refreshed = (await handler.value(failedUrl))?.trim();
      if (!refreshed || refreshed === failedUrl) return false;
      return await retry(refreshed);
    } catch (error) {
      console.error('[MediaViewer] onRefreshUrl failed:', error);
      return false;
    } finally {
      isRefreshing.value = false;
    }
  }

  return { isRefreshing, refreshAndRetry, resetRefreshAttempts, markLoadSuccess };
}
