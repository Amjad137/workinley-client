/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IProjectWorkload } from '@/dto/dashboard.dto';

interface StaffProjectWorkloadProps {
  workload: IProjectWorkload[];
  isLoading?: boolean;
}

export const StaffProjectWorkload = ({ workload, isLoading }: StaffProjectWorkloadProps) => {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-base'>Project Workload</CardTitle>
        <CardDescription>Task distribution across projects this week</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : workload.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-6'>No project data yet</p>
        ) : (
          <div className='space-y-3'>
            {workload.map((item) => (
              <div key={item.project.id} className='flex items-center gap-3'>
                <span
                  className='inline-block w-3 h-3 rounded-full shrink-0 ring-1 ring-border'
                  style={{ backgroundColor: item.project.color }}
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='font-medium truncate'>{item.project.name}</span>
                    <span className='text-muted-foreground'>
                      {item.taskCount} tasks · {item.totalSpentHours}h
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffProjectWorkload;
