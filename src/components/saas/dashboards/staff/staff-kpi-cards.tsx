'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IDashboardSummary } from '@/dto/dashboard.dto';
import { cn } from '@/lib/utils';
import { AlertTriangle, FileCheck2, TrendingUp, Users } from 'lucide-react';
import React from 'react';

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
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <Icon size={18} className={color} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-8 w-20' />
        ) : (
          <>
            <div className={cn('text-3xl font-bold', color)}>{value}</div>
            {sub && <p className='text-xs text-muted-foreground mt-1'>{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface StaffKpiCardsProps {
  summary: IDashboardSummary | null;
  isLoading: boolean;
}

export const StaffKpiCards = ({ summary, isLoading }: StaffKpiCardsProps) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <KpiCardItem
        title='Total Members'
        value={summary?.totalUsers ?? 0}
        icon={Users}
        loading={isLoading}
      />
      <KpiCardItem
        title='Compliance Rate'
        value={`${summary?.complianceRate ?? 0}%`}
        sub='Members who submitted'
        icon={TrendingUp}
        color='text-primary'
        loading={isLoading}
      />
      <KpiCardItem
        title='Approved'
        value={summary?.approved ?? 0}
        sub={`${summary?.submitted ?? 0} pending review`}
        icon={FileCheck2}
        color='text-green-500'
        loading={isLoading}
      />
      <KpiCardItem
        title='Active Blockers'
        value={summary?.activeBlockers ?? 0}
        sub='Across all submitted reports'
        icon={AlertTriangle}
        color={summary?.activeBlockers ? 'text-orange-400' : 'text-muted-foreground'}
        loading={isLoading}
      />
    </div>
  );
};

export default StaffKpiCards;
