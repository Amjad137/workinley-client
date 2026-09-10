export const ROUTES = {
  MARKETING_ROOT: '/',
  SAAS_ROOT: '/portal',

  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Staff (Admin + Manager) routes
  STAFF_ROOT: '/portal/staff',
  STAFF_DASHBOARD: '/portal/staff/dashboard',
  STAFF_PROJECTS: '/portal/staff/projects',
  STAFF_REVIEWS: '/portal/staff/reviews',
  STAFF_TEAM: '/portal/staff/team',
  STAFF_TEAM_MEMBER: (userId: string) => `/portal/staff/team/${userId}`,

  // Admin-only routes
  STAFF_USERS: '/portal/staff/users',
  STAFF_INVITATIONS: '/portal/staff/invitations',

  // Member / User routes
  USER_DASHBOARD: '/portal/dashboard',
  REPORTS_ROOT: '/portal/reports',
  REPORT_DETAIL: (id: string) => `/portal/reports/${id}`,
  REPORT_NEW: '/portal/reports/new',
  PROJECTS_ROOT: '/portal/projects',
  TEAM_ROOT: '/portal/team',
  TEAM_MEMBER: (userId: string) => `/portal/team/${userId}`,

  // Compatibility aliases
  USERS_ROOT: '/portal/staff/users',
  INVITATIONS_ROOT: '/portal/staff/invitations',
  DASHBOARD_ROOT: '/portal/dashboard',
  REVIEWS_ROOT: '/portal/staff/reviews',
};

export const ADMIN_ROUTES = {
  ROOT: ROUTES.STAFF_DASHBOARD,
  DASHBOARD: ROUTES.STAFF_DASHBOARD,
  USERS_ROOT: ROUTES.STAFF_USERS,
  INVITATIONS_ROOT: ROUTES.STAFF_INVITATIONS,
  PROJECTS: ROUTES.STAFF_PROJECTS,
  REVIEWS: ROUTES.STAFF_REVIEWS,
  TEAM: ROUTES.STAFF_TEAM,
  REPORTS: ROUTES.REPORTS_ROOT,
};

export const MANAGER_ROUTES = {
  ROOT: ROUTES.STAFF_DASHBOARD,
  DASHBOARD: ROUTES.STAFF_DASHBOARD,
  PROJECTS: ROUTES.STAFF_PROJECTS,
  REVIEWS: ROUTES.STAFF_REVIEWS,
  TEAM: ROUTES.STAFF_TEAM,
  REPORTS: ROUTES.REPORTS_ROOT,
};

export const MEMBER_ROUTES = {
  ROOT: ROUTES.USER_DASHBOARD,
  DASHBOARD: ROUTES.USER_DASHBOARD,
  REPORTS: ROUTES.REPORTS_ROOT,
  PROJECTS: ROUTES.PROJECTS_ROOT,
  TEAM: ROUTES.TEAM_ROOT,
};
