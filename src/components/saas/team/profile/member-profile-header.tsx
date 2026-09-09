'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { IUser } from '@/types/user.type';
import { getUserInitials } from '@/utils/user-utils';
import { format } from 'date-fns';
import { Calendar, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

interface MemberProfileHeaderProps {
  user: IUser;
}

const MemberProfileHeader = ({ user }: MemberProfileHeaderProps) => {
  const initials = getUserInitials(user);

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16 border-2 border-primary/20 shadow-xs'>
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? 'User'}
                className='object-cover'
              />
              <AvatarFallback className='text-lg font-semibold'>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-bold tracking-tight'>
                  {user?.name || user?.email || 'Team Member'}
                </h1>
                {user?.role && (
                  <Badge variant='outline' className='text-xs font-semibold'>
                    <Shield size={12} className='mr-1 text-primary' />
                    {user.role}
                  </Badge>
                )}
              </div>
              <div className='flex flex-wrap items-center gap-4 mt-1.5 text-sm text-muted-foreground'>
                {user?.email && (
                  <span className='flex items-center gap-1.5'>
                    <Mail size={14} /> {user.email}
                  </span>
                )}
                {user?.createdAt && (
                  <span className='flex items-center gap-1.5'>
                    <Calendar size={14} /> Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button variant='outline' size='sm' asChild>
            <Link href={ROUTES.REVIEWS_ROOT}>Review Reports</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberProfileHeader;
