'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, FileText, ListTodo } from 'lucide-react';

interface KpiCardItemProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
  loading?: boolean;
}

const KpiCardItem = ({
  title,
  value,
  sub,
  icon: Icon,
  color = 'text-foreground',
  loading,
}: KpiCardItemProps) => {
  return (
    <Card className='transition-all duration-200 hover:shadow-xs hover:border-primary/30'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {title}
        </CardTitle>
        <div
          className={cn('h-8 w-8 rounded-lg flex items-center justify-center bg-muted/60', color)}
        >
          <Icon className='h-4 w-4' />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-8 w-20' />
        ) : (
          <>
            <div className={cn('text-2xl font-bold tracking-tight', color)}>{value}</div>
            {sub && <p className='text-xs text-muted-foreground mt-1'>{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface UserKpiCardsProps {
  totalReports: number;
  approvedCount: number;
  pendingCount: number;
  totalTasks: number;
  isLoading: boolean;
}

export const UserKpiCards = ({
  totalReports,
  approvedCount,
  pendingCount,
  totalTasks,
  isLoading,
}: UserKpiCardsProps) => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      <KpiCardItem
        title='Total Reports'
        value={totalReports}
        sub='All time submissions'
        icon={FileText}
        color='text-primary'
        loading={isLoading}
      />
      <KpiCardItem
        title='Approved'
        value={approvedCount}
        sub={`${totalReports > 0 ? Math.round((approvedCount / totalReports) * 100) : 0}% approval rate`}
        icon={CheckCircle2}
        color='text-emerald-600 dark:text-emerald-400'
        loading={isLoading}
      />
      <KpiCardItem
        title='Pending Review'
        value={pendingCount}
        sub='Awaiting manager feedback'
        icon={Clock}
        color='text-blue-600 dark:text-blue-400'
        loading={isLoading}
      />
      <KpiCardItem
        title='Total Tasks'
        value={totalTasks}
        sub='Across all weekly logs'
        icon={ListTodo}
        color='text-amber-600 dark:text-amber-400'
        loading={isLoading}
      />
    </div>
  );
};

export default UserKpiCards;
