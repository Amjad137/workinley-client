/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ITeamBlocker } from '@/dto/dashboard.dto';
import { AlertTriangle } from 'lucide-react';

interface StaffTeamBlockersProps {
  blockers: ITeamBlocker[];
  isLoading: boolean;
}

export const StaffTeamBlockers = ({ blockers, isLoading }: StaffTeamBlockersProps) => {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-base flex items-center gap-2'>
          <AlertTriangle size={16} className='text-orange-400' /> Active Blockers
        </CardTitle>
        <CardDescription>Blockers flagged this week</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            {[1, 2].map((i) => (
              <Skeleton key={i} className='h-12 w-full' />
            ))}
          </div>
        ) : blockers.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-6'>
            🎉 No active blockers this week!
          </p>
        ) : (
          <div className='space-y-3'>
            {blockers.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className='flex items-start gap-3 p-2.5 bg-orange-500/10 rounded-md border border-orange-200/50 dark:border-orange-800/30'
              >
                <AlertTriangle size={13} className='text-orange-400 flex-shrink-0 mt-0.5' />
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-foreground'>{b.description}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {b.report?.user?.name ?? b.userName}
                  </p>
                </div>
                {(b.isKeyBlocker || b.isKeyIssue) && (
                  <Badge variant='destructive' className='text-xs flex-shrink-0'>
                    Key
                  </Badge>
                )}
              </div>
            ))}
            {blockers.length > 5 && (
              <p className='text-xs text-muted-foreground text-center'>
                +{blockers.length - 5} more
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffTeamBlockers;
