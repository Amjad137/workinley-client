'use client';

import PageLoader from '@/components/saas/shared/page-loader';
import { ROUTES } from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const { userRole, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (userRole === USER_ROLE.ADMIN || userRole === USER_ROLE.MANAGER) {
      router.replace(ROUTES.STAFF_DASHBOARD);
    } else {
      router.replace(ROUTES.USER_DASHBOARD);
    }
  }, [userRole, isInitialized, router]);

  return <PageLoader />;
};

export default Home;
