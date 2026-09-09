'use client';

import { SiteHeader } from '@/components/saas/shared/header';
import { AdminSidebar } from '@/components/saas/sidebar/admin/admin-sidebar';
import { ManagerSidebar } from '@/components/saas/sidebar/manager/manager-sidebar';
import { UserSidebar } from '@/components/saas/sidebar/user/user-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { USER_ROLE } from '@/constants/user.constants';
import ReactQueryProvider from '@/providers/react-query.provider';
import { useAuthStore } from '@/stores/auth.store';
import { ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const { userRole } = useAuthStore(
    useShallow((state) => ({
      userRole: state.userRole,
    })),
  );

  const renderSidebar = (role: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.ADMIN:
        return <AdminSidebar />;
      case USER_ROLE.MANAGER:
        return <ManagerSidebar />;
      case USER_ROLE.USER:
        return <UserSidebar />;
      default:
        return null;
    }
  };

  return (
    <ReactQueryProvider>
      <SidebarProvider>
        {userRole && renderSidebar(userRole)}
        <SidebarInset>
          <SiteHeader />
          <div className='min-h-screen bg-secondary text-foreground antialiased'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  );
};

export default AppLayout;
