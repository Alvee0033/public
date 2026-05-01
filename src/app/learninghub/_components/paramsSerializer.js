/** Serialize GET params so Nest receives repeated keys for arrays (e.g. services_offered). */
export function serializeSearchParams(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => usp.append(key, String(item)));
    } else if (typeof value === "boolean") {
      usp.append(key, value ? "true" : "false");
    } else {
      usp.append(key, String(value));
    }
  });
  return usp.toString();
}
