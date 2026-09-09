export const ROUTES = {
  MARKETING_ROOT: '/',
  SAAS_ROOT: '/portal',

  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Admin routes
  USERS_ROOT: '/portal/users',
  INVITATIONS_ROOT: '/portal/invitations',

  // Shared (member + manager)
  REPORTS_ROOT: '/portal/reports',
  REPORT_DETAIL: (id: string) => `/portal/reports/${id}`,

  // Manager / Admin only
  REVIEWS_ROOT: '/portal/reviews',
  DASHBOARD_ROOT: '/portal/dashboard',
  PROJECTS_ROOT: '/portal/projects',
  TEAM_ROOT: '/portal/team',
  TEAM_MEMBER: (userId: string) => `/portal/team/${userId}`,
};

export const ADMIN_ROUTES = {
  ROOT: ROUTES.SAAS_ROOT,
  USERS_ROOT: ROUTES.USERS_ROOT,
  INVITATIONS_ROOT: ROUTES.INVITATIONS_ROOT,
  DASHBOARD: ROUTES.DASHBOARD_ROOT,
  PROJECTS: ROUTES.PROJECTS_ROOT,
  REVIEWS: ROUTES.REVIEWS_ROOT,
  TEAM: ROUTES.TEAM_ROOT,
  REPORTS: ROUTES.REPORTS_ROOT,
};

export const MANAGER_ROUTES = {
  ROOT: ROUTES.DASHBOARD_ROOT,
  DASHBOARD: ROUTES.DASHBOARD_ROOT,
  PROJECTS: ROUTES.PROJECTS_ROOT,
  REVIEWS: ROUTES.REVIEWS_ROOT,
  TEAM: ROUTES.TEAM_ROOT,
  REPORTS: ROUTES.REPORTS_ROOT,
};

export const MEMBER_ROUTES = {
  ROOT: ROUTES.REPORTS_ROOT,
  REPORTS: ROUTES.REPORTS_ROOT,
};
