const PREFETCHABLE_ROUTES = new Set([
  "/login",
  "/courses",
  "/learninghub",
  "/institutes",
]);

function normalizePath(href = "") {
  if (typeof href !== "string" || !href.startsWith("/")) {
    return "";
  }

  const [path] = href.split("?");
  return path.replace(/\/+$/, "") || "/";
}

export function shouldPrefetchRoute(href) {
  const path = normalizePath(href);
  return PREFETCHABLE_ROUTES.has(path);
}

export function prefetchRoute(router, href) {
  if (!router || !shouldPrefetchRoute(href)) {
    return;
  }

  router.prefetch(href);
}
