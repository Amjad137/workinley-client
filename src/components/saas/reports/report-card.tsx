'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_VARIANTS,
} from '@/constants/report.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import { format } from 'date-fns';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, FileText, Layers } from 'lucide-react';
import ReportActionsDropdown from './table-action-components/report-actions-dropdown';
import ReportDetailDialog from './table-action-components/report-detail-dialog';

interface ReportCardProps {
  report: IWeeklyReport;
  onEdit?: (report: IWeeklyReport) => void;
}

export const ReportCard = ({ report, onEdit }: ReportCardProps) => {
  const [detailOpen, setDetailOpen] = useState(false);

  const tasks = report.tasks ?? [];
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const taskHours = tasks.reduce((sum, t) => sum + (t.actualHours || t.spentHours || 0), 0);
  const entryHours = (report.hoursEntries ?? []).reduce((sum, h) => sum + (h.hours || 0), 0);
  const breakdownHours = report.hoursBreakdown
    ? Object.values(report.hoursBreakdown).reduce((sum, val) => sum + (Number(val) || 0), 0)
    : 0;
  const totalHours = taskHours || entryHours || breakdownHours || 0;

  const blockersCount = report.blockers?.length ?? 0;

  const status = report.status as REPORT_STATUS;
  const statusVariant = REPORT_STATUS_VARIANTS[status] || 'outline';
  const statusLabel = REPORT_STATUS_LABELS[status] || status;

  return (
    <>
      <Card
        onClick={() => setDetailOpen(true)}
        className='flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 group cursor-pointer border border-border/80 rounded-xl bg-card'
      >
        <CardHeader className='pb-3 pt-5 px-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              <div className='h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20 bg-primary/10 text-primary shadow-xs'>
                <FileText className='h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors'>
                    Week {report.weekNumber}
                  </h3>
                  <span className='text-xs font-medium text-muted-foreground'>/ {report.year}</span>
                </div>
                <div className='flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground'>
                  <CalendarDays className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>
                    {format(new Date(report.weekStartDate), 'MMM d')} –{' '}
                    {format(new Date(report.weekEndDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 dots action menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <ReportActionsDropdown rowData={report} onEdit={onEdit} />
            </div>
          </div>

          {/* Status and Project Pills */}
          <div className='flex flex-wrap items-center gap-2 pt-3'>
            <Badge variant={statusVariant} className='text-xs font-medium px-2.5 py-0.5'>
              {statusLabel}
            </Badge>

            {report.project ? (
              <div className='flex items-center gap-1.5 text-xs font-medium text-foreground/80 bg-muted/40 px-2 py-0.5 rounded-md border border-border/60 max-w-[180px]'>
                <span
                  className='h-2 w-2 rounded-full shrink-0'
                  style={{ backgroundColor: report.project.color || 'hsl(var(--primary))' }}
                />
                <span className='truncate' title={report.project.name}>
                  {report.project.name}
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md border border-border/40'>
                <Layers className='h-3 w-3 shrink-0' />
                <span>General</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className='py-2 px-5 flex-1 space-y-3'>
          {/* Tasks Progress Bar */}
          <div className='space-y-1.5'>
            <div className='flex items-center justify-between text-xs text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                <span>Tasks completed</span>
              </span>
              <span className='font-medium text-foreground/80'>
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-1.5 overflow-hidden'>
              <div
                className='bg-primary h-1.5 rounded-full transition-all duration-300'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Metrics row: Hours Logged & Blockers */}
          <div className='flex items-center justify-between pt-1 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1.5' title='Total hours logged'>
              <Clock className='h-3.5 w-3.5 text-muted-foreground/70' />
              <span>{totalHours > 0 ? `${totalHours} hrs logged` : '0 hrs'}</span>
            </div>

            {blockersCount > 0 ? (
              <div className='flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium'>
                <AlertTriangle className='h-3.5 w-3.5' />
                <span>
                  {blockersCount} blocker{blockersCount > 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <span className='text-emerald-600 dark:text-emerald-400 text-[11px] font-medium'>
                No blockers
              </span>
            )}
          </div>

          {/* Notes preview if available */}
          {report.notes && (
            <p className='text-xs text-muted-foreground/90 line-clamp-2 italic pt-1 border-t border-border/40'>
              &quot;{report.notes}&quot;
            </p>
          )}
        </CardContent>

        <CardFooter className='pt-3 pb-4 px-5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground'>
          <Badge
            variant='outline'
            className='text-[10px] font-mono border-border bg-card px-1.5 py-0'
          >
            v{report.currentVersion}
          </Badge>

          <span>
            {report.submittedAt
              ? `Submitted ${format(new Date(report.submittedAt), 'MMM d, yyyy')}`
              : `Updated ${format(new Date(report.updatedAt || report.createdAt), 'MMM d, yyyy')}`}
          </span>
        </CardFooter>
      </Card>

      {/* Detail Dialog */}
      {detailOpen && (
        <ReportDetailDialog open={detailOpen} setOpen={setDetailOpen} report={report} />
      )}
    </>
  );
};

export default ReportCard;
