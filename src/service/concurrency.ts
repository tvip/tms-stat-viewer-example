/**
 * Runs fn over items keeping at most `limit` calls in flight.
 * Results keep the order of items. After the first rejection no new items are started
 * and the returned promise rejects with that error.
 */
export async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  let failed = false;

  const worker = async (): Promise<void> => {
    while (next < items.length && !failed) {
      const index = next++;
      try {
        results[index] = await fn(items[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({length: workerCount}, () => worker()));
  return results;
}
