'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { REPORT_STATUS } from '@/constants/report.constants';
import { ROUTES } from '@/constants/routes.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  FileText,
  ListTodo,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface UserRecentReportsProps {
  reports: IWeeklyReport[];
  isLoading: boolean;
  onViewReport: (reportId: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  [REPORT_STATUS.APPROVED]: {
    label: 'Approved',
    className:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  [REPORT_STATUS.SUBMITTED]: {
    label: 'Submitted',
    className:
      'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Clock,
  },
  [REPORT_STATUS.NEEDS_CORRECTION]: {
    label: 'Needs Revision',
    className:
      'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    icon: AlertTriangle,
  },
  [REPORT_STATUS.DRAFT]: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground border-border',
    icon: FileEdit,
  },
};

export const UserRecentReports = ({ reports, isLoading, onViewReport }: UserRecentReportsProps) => {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <div>
          <CardTitle className='text-base font-semibold'>Recent Reports</CardTitle>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Your latest weekly submission history
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          asChild
          className='text-xs font-medium text-primary hover:text-primary/80'
        >
          <Link href={ROUTES.REPORTS_ROOT} className='gap-1'>
            View All <ArrowRight className='h-3 w-3' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='flex-1'>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-16 w-full rounded-lg' />
            ))}
          </div>
        ) : // eslint-disable-next-line sonarjs/no-nested-conditional
        reports.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center rounded-lg border border-dashed border-border/80 bg-muted/20'>
            <FileText className='h-10 w-10 text-muted-foreground/40 mb-2' />
            <p className='text-sm font-medium text-foreground'>No Reports Yet</p>
            <p className='text-xs text-muted-foreground mt-0.5 max-w-xs'>
              Create your first weekly report to begin tracking your tasks and progress.
            </p>
            <Button size='sm' asChild className='mt-3'>
              <Link href={ROUTES.REPORT_NEW}>Create Report</Link>
            </Button>
          </div>
        ) : (
          <div className='space-y-2.5'>
            {reports.slice(0, 5).map((report) => {
              const statusCfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG[REPORT_STATUS.DRAFT];
              const StatusIcon = statusCfg.icon;
              const taskCount = (report.plannedTasks?.length ?? 0) + (report.tasks?.length ?? 0);

              return (
                <div
                  key={report.id}
                  className='flex items-center justify-between gap-3 p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-muted/30 transition-all group'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0'>
                      W{report.weekNumber}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-sm text-foreground truncate'>
                          Week {report.weekNumber}, {report.year}
                        </span>
                        {report.currentVersion && report.currentVersion > 1 && (
                          <Badge variant='outline' className='text-[10px] px-1 py-0'>
                            v{report.currentVersion}
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-2 mt-0.5 text-xs text-muted-foreground'>
                        <span>
                          {report.createdAt
                            ? format(new Date(report.createdAt), 'MMM d, yyyy')
                            : '-'}
                        </span>
                        <span>·</span>
                        <span className='inline-flex items-center gap-1'>
                          <ListTodo className='h-3 w-3' /> {taskCount} tasks
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-2.5 shrink-0'>
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                        statusCfg.className,
                      )}
                    >
                      <StatusIcon className='h-3 w-3' />
                      <span className='text-[11px]'>{statusCfg.label}</span>
                    </div>

                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 text-muted-foreground hover:text-primary'
                      onClick={() => onViewReport(report.id)}
                      title='Quick View'
                    >
                      <Eye className='h-3.5 w-3.5' />
                    </Button>
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

export default UserRecentReports;
