export const ROUTES = {
  MARKETING_ROOT: '/',
  SAAS_ROOT: '/portal',

  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  USERS_ROOT: '/portal/users', //Access: Admin
};

export const ADMIN_ROUTES = {
  ROOT: ROUTES.SAAS_ROOT,
  USERS_ROOT: ROUTES.USERS_ROOT,
};
