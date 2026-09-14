/** Cancellation/destruction is expected when a page or document is replaced. */
export function isCancellationOrDestroyedError(error: unknown): boolean {
  if (!error) return false;
  const { name, message } = error as { name?: string; message?: string };
  return name === 'RenderingCancelledException'
    || (typeof message === 'string' && [
      'Rendering cancelled', 'Transport destroyed',
      'Worker was destroyed', 'Cannot use a destroyed',
    ].some((text) => message.includes(text)));
}
