/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IHoursDistribution } from '@/dto/dashboard.dto';

interface StaffHoursDistributionProps {
  hours: IHoursDistribution | null;
  isLoading?: boolean;
}

export const StaffHoursDistribution = ({ hours, isLoading }: StaffHoursDistributionProps) => {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-base'>Hours Distribution</CardTitle>
        <CardDescription>Team-wide (submitted reports)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className='h-8 w-full' />
            ))}
          </div>
        ) : hours ? (
          <div className='space-y-3'>
            {Object.entries(hours).map(([category, value]) => {
              const total = Object.values(hours).reduce((s, v) => s + (v as number), 0);
              const pct = total > 0 ? Math.round(((value as number) / total) * 100) : 0;
              return (
                <div key={category}>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='capitalize'>{category}</span>
                    <span className='font-medium'>
                      {value as number}h ({pct}%)
                    </span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-1.5'>
                    <div
                      className='bg-primary h-1.5 rounded-full transition-all'
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-6'>No hours data yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffHoursDistribution;
