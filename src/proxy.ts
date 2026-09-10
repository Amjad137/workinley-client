import { ROUTES } from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { getSession } from '@/utils/proxy-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortalRoute = pathname.startsWith(ROUTES.SAAS_ROOT);
  const isAuthRoute = pathname.startsWith('/auth');

  if (!isPortalRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const session = await getSession(request);

  // 1. Unauthenticated users trying to access protected portal routes
  if (isPortalRoute && !session) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Authenticated users trying to access auth routes (except reset-password)
  if (isAuthRoute && session && !pathname.startsWith(ROUTES.RESET_PASSWORD)) {
    const userRole = session.user?.role as USER_ROLE;
    const isStaff = userRole === USER_ROLE.ADMIN || userRole === USER_ROLE.MANAGER;
    const destination = isStaff ? ROUTES.STAFF_DASHBOARD : ROUTES.USER_DASHBOARD;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. RBAC for authenticated portal routes
  if (isPortalRoute && session) {
    const userRole = session.user?.role as USER_ROLE;
    const isStaff = userRole === USER_ROLE.ADMIN || userRole === USER_ROLE.MANAGER;

    // Portal root (/portal or /portal/) -> redirect to role home
    if (pathname === ROUTES.SAAS_ROOT || pathname === `${ROUTES.SAAS_ROOT}/`) {
      const destination = isStaff ? ROUTES.STAFF_DASHBOARD : ROUTES.USER_DASHBOARD;
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Role-based protection for /portal/staff/* routes
    if (pathname.startsWith(ROUTES.STAFF_ROOT)) {
      // Regular members (USER) cannot access staff routes
      if (!isStaff) {
        return NextResponse.redirect(new URL(ROUTES.USER_DASHBOARD, request.url));
      }

      // Admin-only subroutes (/portal/staff/users, /portal/staff/invitations)
      const isAdminOnlyRoute =
        pathname.startsWith(ROUTES.STAFF_USERS) || pathname.startsWith(ROUTES.STAFF_INVITATIONS);

      if (isAdminOnlyRoute && userRole !== USER_ROLE.ADMIN) {
        // Manager cannot access users/invitations management
        return NextResponse.redirect(new URL(ROUTES.STAFF_DASHBOARD, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
