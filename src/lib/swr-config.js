export const stableSWRConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60_000,
  keepPreviousData: true,
  errorRetryCount: 1,
};

export const liveSWRConfig = {
  ...stableSWRConfig,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  dedupingInterval: 15_000,
};

export const swrConfig = stableSWRConfig;
