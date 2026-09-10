/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IActivityFeedItem } from '@/dto/dashboard.dto';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StaffActivityFeedProps {
  activity: IActivityFeedItem[];
  isLoading: boolean;
}

export const StaffActivityFeed = ({ activity, isLoading }: StaffActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Recent Activity</CardTitle>
        <CardDescription>Latest review actions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-12 w-full' />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-6'>No recent activity</p>
        ) : (
          <div className='space-y-3'>
            {activity.slice(0, 8).map((item) => {
              const isApprove = item.action === 'APPROVE';
              return (
                <div key={item.id} className='flex items-start gap-3 py-2 border-b last:border-0'>
                  <div
                    className={cn(
                      'mt-0.5 shrink-0',
                      isApprove ? 'text-green-500' : 'text-orange-400',
                    )}
                  >
                    {isApprove ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm'>
                      <strong>{item.reviewer?.name}</strong>{' '}
                      {isApprove ? 'approved' : 'requested changes on'}{' '}
                      <strong>{item.report?.user?.name}</strong>'s W{item.report?.weekNumber} report
                    </p>
                    <p className='text-xs text-muted-foreground mt-0.5 truncate'>{item.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffActivityFeed;
