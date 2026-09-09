'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { REPORT_STATUS, TASK_STATUS } from '@/constants/report.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  FileText,
  ListTodo,
  RotateCcw,
} from 'lucide-react';

interface MemberReportsCardsProps {
  reports: IWeeklyReport[];
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
      'bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
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

const MemberReportsCards = ({ reports, onViewReport }: MemberReportsCardsProps) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold tracking-tight'>Recent Weekly Reports</h2>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Activity log of the latest submissions ({reports?.length ?? 0}{' '}
            {reports?.length === 1 ? 'report' : 'reports'})
          </p>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-card/50'>
          <FileText className='h-10 w-10 text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-foreground text-base'>No Reports Found</h3>
          <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
            No reports found for this team member yet.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
          {reports.map((report) => {
            const statusKey = report.status as REPORT_STATUS;
            const statusCfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG[REPORT_STATUS.DRAFT];
            const StatusIcon = statusCfg.icon;

            const completedTasks =
              report.tasks?.filter(
                (t) => t.status === TASK_STATUS.COMPLETED || (t.status as string) === 'DONE',
              ).length ?? 0;
            const totalTasksCount = report.tasks?.length ?? 0;
            const completionRate =
              totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;

            const totalHours =
              report.tasks?.reduce((sum, t) => sum + (t.actualHours ?? t.spentHours ?? 0), 0) ?? 0;

            return (
              <Card
                key={report.id}
                className='flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 border border-border group'
              >
                <CardHeader className='pb-3 pt-5 px-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <CalendarDays className='h-4 w-4 text-primary shrink-0' />
                        <h3 className='font-semibold text-foreground text-sm tracking-tight'>
                          Week {report.weekNumber}, {report.year}
                        </h3>
                      </div>
                      {report.weekStartDate && report.weekEndDate && (
                        <p className='text-xs text-muted-foreground mt-1 pl-6'>
                          {format(new Date(report.weekStartDate), 'MMM d')} –{' '}
                          {format(new Date(report.weekEndDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>

                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0',
                        statusCfg.className,
                      )}
                    >
                      <StatusIcon className='h-3.5 w-3.5' />
                      <span>{statusCfg.label}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='py-3 px-5 space-y-3.5 flex-1'>
                  {/* Project Tag */}
                  <div className='flex items-center gap-2 text-xs'>
                    <span className='text-muted-foreground text-[11px] font-medium'>Project:</span>
                    {report.project ? (
                      <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-medium'>
                        <span
                          className='h-2 w-2 rounded-full shrink-0'
                          style={{
                            backgroundColor: report.project.color || '#3b82f6',
                          }}
                        />
                        <span className='truncate max-w-[180px]'>{report.project.name}</span>
                        {report.project.code && (
                          <span className='text-muted-foreground text-[10px]'>
                            ({report.project.code})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className='text-muted-foreground italic text-xs'>
                        General (Unassigned)
                      </span>
                    )}
                  </div>

                  {/* Tasks Progress Bar */}
                  <div className='space-y-1.5'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-muted-foreground text-[11px] font-medium'>
                        Tasks Progress
                      </span>
                      <span className='font-medium text-foreground text-xs'>
                        {completedTasks}/{totalTasksCount} done ({completionRate}%)
                      </span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-1.5 overflow-hidden'>
                      <div
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          completionRate === 100 ? 'bg-green-500' : 'bg-primary',
                        )}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Pills */}
                  <div className='grid grid-cols-3 gap-2 text-xs'>
                    <div className='flex items-center gap-1.5 p-2 rounded-md bg-muted/40 text-muted-foreground'>
                      <Clock className='h-3.5 w-3.5 text-blue-500 shrink-0' />
                      <span className='font-semibold text-foreground text-xs'>{totalHours}h</span>
                      <span className='text-[10px] text-muted-foreground'>spent</span>
                    </div>

                    <div className='flex items-center gap-1.5 p-2 rounded-md bg-muted/40 text-muted-foreground'>
                      <ListTodo className='h-3.5 w-3.5 text-primary shrink-0' />
                      <span className='font-semibold text-foreground text-xs'>
                        {totalTasksCount}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>tasks</span>
                    </div>

                    <div className='flex items-center gap-1.5 p-2 rounded-md bg-muted/40 text-muted-foreground'>
                      <RotateCcw className='h-3.5 w-3.5 text-orange-400 shrink-0' />
                      <span className='font-semibold text-foreground text-xs'>
                        v{report.currentVersion}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>ver</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className='pt-3 pb-3.5 px-5 border-t border-border/50 bg-muted/10 flex items-center justify-between gap-2'>
                  <span className='text-[11px] text-muted-foreground truncate'>
                    {report.submittedAt
                      ? `Submitted ${format(new Date(report.submittedAt), 'MMM d, yyyy')}`
                      : 'Draft – not submitted'}
                  </span>

                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 px-3 text-xs gap-1.5 font-medium group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors'
                    onClick={() => onViewReport(report.id)}
                  >
                    <Eye className='h-3.5 w-3.5' />
                    <span>View Details</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberReportsCards;
