/** In-memory cache for hub profile payloads — warmed by hover prefetch on directory cards */
const cache = new Map();

export function getCachedHub(hubId) {
  if (hubId == null) return undefined;
  const key = String(hubId);
  return cache.get(key);
}

export function setCachedHub(hubId, data) {
  if (hubId == null || data == null) return;
  cache.set(String(hubId), data);
}

/** Fire-and-forget; skips if already cached */
export function prefetchHubProfile(hubId) {
  if (hubId == null) return;
  const key = String(hubId);
  if (cache.has(key)) return;

  import("@/lib/axios").then(({ default: axios }) => {
    if (cache.has(key)) return;
    axios
      .get(`/learning-hub/${hubId}`)
      .then((res) => {
        const data = res?.data?.data ?? res?.data;
        if (data) cache.set(key, data);
      })
      .catch(() => {});
  });
}
