'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constants';
import { IUser } from '@/types/user.type';
import { getUserInitials } from '@/utils/user-utils';
import { FilePlus, FileText } from 'lucide-react';
import Link from 'next/link';

interface UserDashboardHeaderProps {
  user: IUser | null;
  weekNumber: number;
  year: number;
}

export const UserDashboardHeader = ({ user, weekNumber, year }: UserDashboardHeaderProps) => {
  const initials = user ? getUserInitials(user) : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-14 w-14 border-2 border-primary/20 shadow-xs'>
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
          <AvatarFallback className='text-base font-semibold bg-primary/10 text-primary'>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Welcome back, {firstName}! 👋
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Week {weekNumber}, {year} · Track your performance, tasks, and weekly reports
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2.5 shrink-0'>
        <Button variant='outline' size='sm' asChild>
          <Link href={ROUTES.REPORTS_ROOT} className='gap-2'>
            <FileText className='h-4 w-4 text-muted-foreground' />
            My Reports
          </Link>
        </Button>
        <Button size='sm' asChild className='gap-2 shadow-xs'>
          <Link href={ROUTES.REPORT_NEW}>
            <FilePlus className='h-4 w-4' />
            New Weekly Report
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardHeader;
