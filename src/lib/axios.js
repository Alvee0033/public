import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "/api/v1";

const LEGACY_ROUTE_MAP = [
  ["/institutes", "/learning-hub"],
  ["/file-cloudinary/upload", "/file-upload"],
  ["/stores", "/shop-stores"],
  ["/products", "/shop-products"],
  ["/orders", "/shop-orders"],
];

function rewriteLegacyUrl(url = "") {
  if (!url || typeof url !== "string" || url.startsWith("http")) {
    return url;
  }

  for (const [legacyPrefix, newPrefix] of LEGACY_ROUTE_MAP) {
    if (
      url === legacyPrefix ||
      url.startsWith(`${legacyPrefix}/`) ||
      url.startsWith(`${legacyPrefix}?`)
    ) {
      return `${newPrefix}${url.slice(legacyPrefix.length)}`;
    }
  }

  return url;
}

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(
  function (config) {
    config.url = rewriteLegacyUrl(config.url);

    let token = "";

    if (typeof window !== "undefined") {
      // Browser: try localStorage then cookies
      token = localStorage?.getItem("auth-token") || "";
      if (!token) {
        const cookies = (typeof document !== "undefined" && document.cookie) ? document.cookie.split(";") : [];
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith("token=")) {
            token = cookie.substring("token=".length);
            break;
          }
        }
      }
    } else {
      token = process.env.API_TOKEN || process.env.SERVER_API_TOKEN || "";
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignore aborted/cancelled requests to avoid noisy console logs.
    if (
      axios.isCancel?.(error) ||
      error?.code === "ERR_CANCELED" ||
      error?.name === "CanceledError"
    ) {
      return Promise.reject(error);
    }

    // Optional fetches (e.g. footer) can set skipErrorLog: true on the request config.
    if (error?.config?.skipErrorLog) {
      return Promise.reject(error);
    }

    const cfg = error?.config || {};
    const base = cfg.baseURL || "";
    const path = cfg.url || "";
    let fullUrl = "(unknown URL)";
    if (path.startsWith("http")) {
      fullUrl = path;
    } else if (base && path) {
      fullUrl = `${String(base).replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
    } else {
      fullUrl = path || base || "(unknown URL)";
    }
    const status = error?.response?.status;
    const suppressedStatuses = Array.isArray(error?.config?.suppressErrorStatuses)
      ? error.config.suppressErrorStatuses
      : [];
    const isEnrollConflict =
      status === 409 && String(path || "").includes("/learning-hub/") &&
      String(path || "").includes("/enroll-request");

    if ((status != null && suppressedStatuses.includes(status)) || isEnrollConflict) {
      return Promise.reject(error);
    }
    const resData = error?.response?.data;
    const msg = error?.message || "Unknown API error";
    const code = error?.code;

    const summary = [
      fullUrl !== "(unknown URL)" ? fullUrl : null,
      cfg.method ? String(cfg.method).toUpperCase() : null,
      status != null ? `HTTP ${status}` : null,
      code ? `code=${code}` : null,
      msg,
    ]
      .filter(Boolean)
      .join(" · ");

    const dataPreview =
      resData === undefined || resData === null
        ? null
        : typeof resData === "object"
          ? (() => {
              try {
                const s = JSON.stringify(resData);
                return s.length > 400 ? `${s.slice(0, 400)}…` : s;
              } catch {
                return String(resData);
              }
            })()
          : String(resData);

    if (summary || dataPreview) {
      if (dataPreview) {
        console.error(`API Error: ${summary || msg}`, dataPreview);
      } else {
        console.error(`API Error: ${summary || msg}`);
      }
    } else {
      console.error("API Error: request failed without response details", error);
    }

    return Promise.reject(error);
  }
);

export default axios;

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

if (axios.interceptors.request.handlers[0]) {
  instance.interceptors.request.use(
    axios.interceptors.request.handlers[0].fulfilled,
    axios.interceptors.request.handlers[0].rejected
  );
}
if (axios.interceptors.response.handlers[0]) {
  instance.interceptors.response.use(
    axios.interceptors.response.handlers[0].fulfilled,
    axios.interceptors.response.handlers[0].rejected
  );
}
