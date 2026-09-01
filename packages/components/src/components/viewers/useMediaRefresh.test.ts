import { computed } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { useMediaRefresh } from './useMediaRefresh';

describe('useMediaRefresh', () => {
  it('allows another expiration after the replacement content successfully loads', async () => {
    const handler = vi.fn().mockResolvedValueOnce('second').mockResolvedValueOnce('third');
    const retry = vi.fn().mockResolvedValue(true);
    const session = useMediaRefresh(computed(() => handler));
    expect(await session.refreshAndRetry('first', retry)).toBe(true);
    expect(await session.refreshAndRetry('second', retry)).toBe(false);
    session.markLoadSuccess();
    expect(await session.refreshAndRetry('second', retry)).toBe(true);
    expect(handler.mock.calls).toEqual([['first'], ['second']]);
  });

  it('bounds refresh attempts until reset', async () => {
    const handler = vi.fn().mockResolvedValue(' refreshed ');
    const retry = vi.fn().mockResolvedValue(true);
    const session = useMediaRefresh(computed(() => handler));

    expect(await session.refreshAndRetry('expired', retry)).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
    expect(retry).toHaveBeenCalledExactlyOnceWith('refreshed');

    // Second attempt blocked by maxAttempts (1)
    expect(await session.refreshAndRetry('expired', retry)).toBe(false);
    expect(handler).toHaveBeenCalledOnce();

    // Reset allows retry again
    session.resetRefreshAttempts();
    expect(await session.refreshAndRetry('expired', retry)).toBe(true);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it.each(['', '   ', 'expired', undefined])('does not retry unusable URL %s', async (url) => {
    const handler = vi.fn().mockResolvedValue(url);
    const retry = vi.fn();
    const session = useMediaRefresh(computed(() => handler));
    expect(await session.refreshAndRetry('expired', retry)).toBe(false);
    expect(retry).not.toHaveBeenCalled();
  });
});
