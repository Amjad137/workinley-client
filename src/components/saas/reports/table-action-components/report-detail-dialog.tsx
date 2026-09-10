'use client';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_VARIANTS,
} from '@/constants/report.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import { useGetReportById } from '@/hooks/use-reports';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  MessageSquare,
  Trophy,
} from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  report?: IWeeklyReport | null;
  reportId?: string;
};

const priorityColors: Record<string, string> = {
  LOW: 'text-green-500',
  MEDIUM: 'text-yellow-500',
  HIGH: 'text-orange-500',
  CRITICAL: 'text-red-500',
};

const statusColors: Record<string, string> = {
  NOT_STARTED: 'text-muted-foreground',
  IN_PROGRESS: 'text-blue-500',
  COMPLETED: 'text-green-500',
  BLOCKED: 'text-destructive',
};

const ReportDetailDialog = ({ open, setOpen, report, reportId }: Props) => {
  const targetId = reportId || report?.id || '';

  // Fetch full report on demand with relations (tasks, blockers, achievements, hours, reviews)
  const { data: fetchedReport, isLoading } = useGetReportById(targetId, {
    enabled: open && !!targetId,
  });

  const activeReport = fetchedReport || report;

  if (!activeReport && isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-6 space-y-4'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
          <Separator />
          <div className='space-y-3 py-4'>
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!activeReport) return null;

  const weekLabel = `Week ${activeReport.weekNumber} / ${activeReport.year}`;
  const status = activeReport.status as REPORT_STATUS;
  const hb = activeReport.hoursBreakdown;
  const totalHours = hb
    ? Object.values(hb).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

  const hasTasks = activeReport.tasks && activeReport.tasks.length > 0;
  const hasPlannedTasks = activeReport.plannedTasks && activeReport.plannedTasks.length > 0;
  const hasBlockers = activeReport.blockers && activeReport.blockers.length > 0;
  const hasAchievements = activeReport.achievements && activeReport.achievements.length > 0;
  const hasReviews = activeReport.reviews && activeReport.reviews.length > 0;

  const isContentEmpty =
    !hasTasks &&
    !hasPlannedTasks &&
    !hasBlockers &&
    !hasAchievements &&
    !activeReport.notes &&
    !activeReport.nextWeekPlans;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='flex items-center gap-2'>
              <CalendarDays size={18} />
              {weekLabel}
            </DialogTitle>
            <Badge variant={REPORT_STATUS_VARIANTS[status]}>{REPORT_STATUS_LABELS[status]}</Badge>
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            {activeReport.weekStartDate
              ? `${format(new Date(activeReport.weekStartDate), 'MMMM d')} – ${format(new Date(activeReport.weekEndDate), 'MMMM d, yyyy')}`
              : '-'}
            {activeReport.project && (
              <span className='ml-3 inline-flex items-center gap-1'>
                <span
                  className='inline-block w-2 h-2 rounded-full'
                  style={{ backgroundColor: activeReport.project.color }}
                />
                {activeReport.project.name}
              </span>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className='flex-1 px-6 py-4'>
          {isLoading && !fetchedReport ? (
            <div className='space-y-4 py-2'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-16 w-full rounded-md' />
                <Skeleton className='h-16 w-full rounded-md' />
              </div>
              <Separator />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-12 w-full rounded-md' />
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Actual Completed Tasks */}
              {hasTasks && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                    <CheckCircle2 size={14} className='text-primary' /> Tasks (
                    {activeReport.tasks?.length})
                  </h4>
                  <div className='space-y-2'>
                    {activeReport.tasks?.map((task, i) => (
                      <div
                        key={task.id ?? i}
                        className='bg-muted/40 rounded-lg p-3 border border-border/50'
                      >
                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-sm font-medium text-foreground'>{task.name}</span>
                          <div className='flex items-center gap-1.5 shrink-0'>
                            <span
                              className={cn('text-xs font-semibold', priorityColors[task.priority])}
                            >
                              {task.priority}
                            </span>
                            <span className={cn('text-xs', statusColors[task.status])}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className='mt-2 grid grid-cols-4 gap-2 text-xs text-muted-foreground'>
                          <span>
                            Planned: {task.plannedPercent ?? task.plannedCompletionPercent ?? 0}%
                          </span>
                          <span>
                            Actual: {task.actualPercent ?? task.actualCompletionPercent ?? 0}%
                          </span>
                          <span>Est: {task.plannedHours ?? 0}h</span>
                          <span>Spent: {task.spentHours ?? task.actualHours ?? 0}h</span>
                        </div>
                        {task.deliverable && (
                          <div className='mt-1.5 text-xs text-blue-500 truncate'>
                            🔗 {task.deliverable}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Planned Tasks */}
              {hasPlannedTasks && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                    <ListTodo size={14} className='text-blue-500' /> Planned Tasks (
                    {activeReport.plannedTasks?.length})
                  </h4>
                  <div className='space-y-2'>
                    {activeReport.plannedTasks?.map((task, i) => (
                      <div
                        key={task.id ?? i}
                        className='bg-muted/30 rounded-lg p-3 border border-border/50 flex items-center justify-between gap-3'
                      >
                        <span className='text-sm font-medium text-foreground'>{task.name}</span>
                        <div className='flex items-center gap-3 shrink-0 text-xs text-muted-foreground'>
                          <span className={cn('font-semibold', priorityColors[task.priority])}>
                            {task.priority}
                          </span>
                          <span>{task.plannedHours}h planned</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Blockers */}
              {hasBlockers && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                    <AlertTriangle size={14} className='text-orange-500' /> Blockers (
                    {activeReport.blockers?.length})
                  </h4>
                  <div className='space-y-2'>
                    {activeReport.blockers?.map((b, i) => (
                      <div
                        key={b.id ?? i}
                        className='flex items-start gap-2 bg-orange-500/10 rounded-lg p-3 border border-orange-200/40 dark:border-orange-900/30'
                      >
                        <span className='text-sm flex-1 text-foreground'>{b.description}</span>
                        {(b.isKeyBlocker || b.isKeyIssue) && (
                          <Badge variant='destructive' className='text-xs shrink-0'>
                            Key
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements */}
              {hasAchievements && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                    <Trophy size={14} className='text-amber-500' /> Achievements (
                    {activeReport.achievements?.length})
                  </h4>
                  <div className='space-y-2'>
                    {activeReport.achievements?.map((a, i) => (
                      <div
                        key={a.id ?? i}
                        className='flex items-start gap-2 bg-amber-500/10 rounded-lg p-3 border border-amber-200/40 dark:border-amber-900/30'
                      >
                        <span className='text-sm flex-1 text-foreground'>{a.description}</span>
                        {a.isKeyAchievement && (
                          <Badge className='text-xs shrink-0 bg-amber-500 hover:bg-amber-600 text-white'>
                            Key
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hours Breakdown */}
              {hb && totalHours > 0 && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                    <Clock size={14} className='text-blue-500' /> Hours ({totalHours}h total)
                  </h4>
                  <div className='grid grid-cols-5 gap-3'>
                    {Object.entries(hb).map(([k, v]) => (
                      <div
                        key={k}
                        className='text-center bg-muted/40 rounded-lg p-2 border border-border/50'
                      >
                        <div className='text-lg font-bold text-foreground'>{String(v)}</div>
                        <div className='text-xs text-muted-foreground capitalize'>{k}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Next Week Plans */}
              {activeReport.nextWeekPlans && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-2 text-foreground'>
                    Next Week Plans
                  </h4>
                  <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-lg p-3 border border-border/50'>
                    {activeReport.nextWeekPlans}
                  </div>
                </section>
              )}

              {/* Notes */}
              {activeReport.notes && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-2 text-foreground'>
                    Notes
                  </h4>
                  <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-lg p-3 border border-border/50'>
                    {activeReport.notes}
                  </div>
                </section>
              )}

              {/* Empty Content State */}
              {isContentEmpty && (
                <div className='flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-border/80 bg-muted/20'>
                  <FileText className='h-8 w-8 text-muted-foreground/40 mb-1.5' />
                  <p className='text-sm font-medium text-foreground'>No Detailed Entries</p>
                  <p className='text-xs text-muted-foreground mt-0.5 max-w-xs'>
                    This report has no tasks, blockers, or achievements recorded yet.
                  </p>
                </div>
              )}

              {/* Reviews */}
              {hasReviews && (
                <>
                  <Separator />
                  <section>
                    <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
                      <MessageSquare size={14} className='text-primary' /> Review History
                    </h4>
                    <div className='space-y-3'>
                      {activeReport.reviews?.map((r) => (
                        <div key={r.id} className='rounded-lg border p-3 bg-card'>
                          <div className='flex items-center justify-between mb-1'>
                            <span className='text-xs font-semibold text-foreground'>
                              {r.reviewer?.name}
                            </span>
                            <Badge
                              variant={r.action === 'APPROVE' ? 'default' : 'destructive'}
                              className='text-xs'
                            >
                              {r.action === 'APPROVE' ? 'Approved' : 'Changes Requested'}
                            </Badge>
                          </div>
                          <p className='text-sm text-muted-foreground'>{r.comment}</p>
                          <p className='text-xs text-muted-foreground/70 mt-1'>
                            {format(new Date(r.createdAt), 'MMM d, HH:mm')} • v{r.versionNumber}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailDialog;
