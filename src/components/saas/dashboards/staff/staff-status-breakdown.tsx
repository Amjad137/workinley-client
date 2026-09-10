'use client';

import { IDashboardSummary } from '@/dto/dashboard.dto';
import { cn } from '@/lib/utils';

interface StaffStatusBreakdownProps {
  summary: IDashboardSummary | null;
  isLoading: boolean;
}

const BREAKDOWN_ITEMS = [
  {
    key: 'approved',
    label: 'Approved',
    color: 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800',
  },
  {
    key: 'submitted',
    label: 'Pending',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
  },
  {
    key: 'needsCorrection',
    label: 'Needs Revision',
    color: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800',
  },
  {
    key: 'draft',
    label: 'Draft',
    color: 'bg-secondary text-muted-foreground border-border',
  },
  {
    key: 'notStarted',
    label: 'Not Started',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
  },
] as const;

export const StaffStatusBreakdown = ({ summary, isLoading }: StaffStatusBreakdownProps) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
      {BREAKDOWN_ITEMS.map(({ key, label, color }) => (
        <div key={key} className={cn('rounded-lg border px-3 py-3 text-center', color)}>
          <div className='text-2xl font-bold'>{isLoading ? '-' : (summary?.[key] ?? 0)}</div>
          <div className='text-xs mt-0.5'>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default StaffStatusBreakdown;
