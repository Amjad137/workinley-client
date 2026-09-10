'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SIDEBAR_MENU_CATEGORIES, MANAGER_SIDEBAR_MENU_ITEMS } from '@/constants/sidebar.constants';
import { VERSION } from '@/version';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavGroup from '../sidebar-nav-group';
import { SidebarUserMenu } from '../sidebar-user-menu';

export function ManagerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='h-20 border-b border-border'>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <div className='flex gap-1 h-full items-start'>
                <Image
                  src={'/assets/images/workinley-icon.svg'}
                  alt='Workinley'
                  width={36}
                  height={36}
                  className='h-12 w-12 rounded-lg'
                />
                <Link href='#' className='flex flex-col gap-0'>
                  <span className='text-[22px] font-semibold text-primary'>Workinley</span>
                  <span className='text-[10px]'>version {VERSION}</span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavGroup
          items={MANAGER_SIDEBAR_MENU_ITEMS.HOME}
          title={SIDEBAR_MENU_CATEGORIES.HOME}
        />
        <SidebarNavGroup
          items={MANAGER_SIDEBAR_MENU_ITEMS.REPORTS}
          title={SIDEBAR_MENU_CATEGORIES.REPORTS}
        />
        <SidebarNavGroup
          items={MANAGER_SIDEBAR_MENU_ITEMS.TEAM}
          title={SIDEBAR_MENU_CATEGORIES.TEAM}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
