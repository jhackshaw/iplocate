export const request = async <T = any>(
  url: string,
  opts: Partial<RequestInit> = {}
): Promise<T> => {
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  const data = await resp.json();
  return data;
};
