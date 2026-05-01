"use client";

const DASHBOARD_ROUTES = {
  student: "/lms/student-dashboard",
  tutor: "/lms/tutor-dashboard",
  guardian: "/lms/guardian-dashboard",
  hub: "/lms/hub-dashboard",
  admin: "/lms/admin-dashboard",
};

function normalizeRoleValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "object") {
    return String(value?.name || value?.role?.name || "").toLowerCase();
  }
  return String(value).toLowerCase();
}

export function collectRoleText(user = {}) {
  const roleCandidates = [
    user?.role,
    user?.primaryRole?.name,
    user?.primary_role?.name,
    ...(Array.isArray(user?.roles) ? user.roles : []),
    ...(Array.isArray(user?.app_user_roles) ? user.app_user_roles : []),
  ]
    .map(normalizeRoleValue)
    .filter(Boolean);

  return roleCandidates.join(" ");
}

export function getDashboardRoute(user = {}, options = {}) {
  const {
    fallback = DASHBOARD_ROUTES.student,
    adminRoute = DASHBOARD_ROUTES.admin,
  } = options;

  const roleText = collectRoleText(user);

  if (!roleText) return fallback;
  if (roleText.includes("admin") || roleText.includes("super")) return adminRoute;
  if (roleText.includes("partner") || roleText.includes("hub")) return DASHBOARD_ROUTES.hub;
  if (roleText.includes("guardian")) return DASHBOARD_ROUTES.guardian;
  if (roleText.includes("tutor")) return DASHBOARD_ROUTES.tutor;
  if (roleText.includes("student")) return DASHBOARD_ROUTES.student;
  return fallback;
}

export function getPostCheckoutRoute(user = {}) {
  const dashboardRoute = getDashboardRoute(user);
  if (dashboardRoute === DASHBOARD_ROUTES.student) {
    return "/lms/student-dashboard/my-courses";
  }
  return dashboardRoute;
}

export function getDashboardCoursesRoute(user = {}) {
  const dashboardRoute = getDashboardRoute(user);
  if (dashboardRoute === DASHBOARD_ROUTES.tutor) return `${dashboardRoute}/course`;
  if (dashboardRoute === DASHBOARD_ROUTES.student) return `${dashboardRoute}/my-courses`;
  return dashboardRoute;
}

export function getDashboardSettingsRoute(user = {}) {
  const dashboardRoute = getDashboardRoute(user);
  if (dashboardRoute === DASHBOARD_ROUTES.student) return `${dashboardRoute}/settings`;
  return dashboardRoute;
}

export { DASHBOARD_ROUTES };
