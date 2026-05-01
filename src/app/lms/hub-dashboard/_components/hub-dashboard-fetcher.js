import { instance } from "@/lib/axios";

export function hubDashboardFetcher(url) {
  return instance.get(url).then((r) => r?.data?.data ?? r?.data ?? []);
}
