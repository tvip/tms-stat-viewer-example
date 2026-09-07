/**
 * Page of a TMS provider API list: /api/provider/... responses.
 */
export type PageResponse<T> = {
  data: T[];
  total: number;
  start: number;
  limit: number;
}

export type PageFetcher<T> = (start: number, limit: number) => Promise<PageResponse<T>>;

/**
 * Loads a list page by page until the server reports no more items.
 * Stops on an empty or short page as well, so a missing `total` does not loop forever.
 */
export async function fetchAllPages<T>(fetchPage: PageFetcher<T>, pageSize: number = 500): Promise<T[]> {
  const items: T[] = [];
  let start = 0;
  for (;;) {
    const page = await fetchPage(start, pageSize);
    const data = Array.isArray(page.data) ? page.data : [];
    items.push(...data);
    start += data.length;
    const total = typeof page.total == 'number' ? page.total : 0;
    if (data.length == 0 || data.length < pageSize || start >= total) {
      break;
    }
  }
  return items;
}
