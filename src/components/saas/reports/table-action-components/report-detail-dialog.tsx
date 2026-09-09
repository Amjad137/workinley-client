'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IWeeklyReport } from '@/dto/report.dto';
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_VARIANTS,
} from '@/constants/report.constants';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trophy,
  MessageSquare,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  report: IWeeklyReport;
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

const ReportDetailDialog = ({ open, setOpen, report }: Props) => {
  const weekLabel = `Week ${report.weekNumber} / ${report.year}`;
  const status = report.status as REPORT_STATUS;
  const hb = report.hoursBreakdown;
  const totalHours = hb
    ? Object.values(hb).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

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
            {format(new Date(report.weekStartDate), 'MMMM d')} –{' '}
            {format(new Date(report.weekEndDate), 'MMMM d, yyyy')}
            {report.project && (
              <span className='ml-3 flex items-center gap-1 inline-flex'>
                <span
                  className='inline-block w-2 h-2 rounded-full'
                  style={{ backgroundColor: report.project.color }}
                />
                {report.project.name}
              </span>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className='flex-1 px-6 py-4'>
          <div className='space-y-6'>
            {/* Tasks */}
            {report.tasks && report.tasks.length > 0 && (
              <section>
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                  <CheckCircle2 size={13} /> Tasks ({report.tasks.length})
                </h4>
                <div className='space-y-2'>
                  {report.tasks.map((task, i) => (
                    <div key={task.id ?? i} className='bg-muted/40 rounded-md p-3'>
                      <div className='flex items-start justify-between gap-2'>
                        <span className='text-sm font-medium'>{task.name}</span>
                        <div className='flex items-center gap-1.5 flex-shrink-0'>
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
                        <span>Planned: {task.plannedPercent}%</span>
                        <span>Actual: {task.actualPercent}%</span>
                        <span>Est: {task.plannedHours}h</span>
                        <span>Spent: {task.spentHours}h</span>
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

            {/* Blockers */}
            {report.blockers && report.blockers.length > 0 && (
              <section>
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                  <AlertTriangle size={13} className='text-orange-400' /> Blockers
                </h4>
                <div className='space-y-2'>
                  {report.blockers.map((b, i) => (
                    <div
                      key={b.id ?? i}
                      className='flex items-start gap-2 bg-orange-50 dark:bg-orange-900/10 rounded-md p-3'
                    >
                      <span className='text-sm flex-1'>{b.description}</span>
                      {b.isKeyBlocker && (
                        <Badge variant='destructive' className='text-xs flex-shrink-0'>
                          Key
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {report.achievements && report.achievements.length > 0 && (
              <section>
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                  <Trophy size={13} className='text-yellow-500' /> Achievements
                </h4>
                <div className='space-y-2'>
                  {report.achievements.map((a, i) => (
                    <div
                      key={a.id ?? i}
                      className='flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-md p-3'
                    >
                      <span className='text-sm flex-1'>{a.description}</span>
                      {a.isKeyAchievement && (
                        <Badge className='text-xs flex-shrink-0 bg-yellow-500 hover:bg-yellow-600'>
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
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                  <Clock size={13} className='text-blue-400' /> Hours ({totalHours}h total)
                </h4>
                <div className='grid grid-cols-5 gap-3'>
                  {Object.entries(hb).map(([k, v]) => (
                    <div key={k} className='text-center bg-muted/40 rounded-md p-2'>
                      <div className='text-lg font-bold'>{String(v)}</div>
                      <div className='text-xs text-muted-foreground capitalize'>{k}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Next Week Plans */}
            {report.nextWeekPlans && (
              <section>
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-2'>
                  Next Week Plans
                </h4>
                <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-md p-3'>
                  {report.nextWeekPlans}
                </div>
              </section>
            )}

            {/* Notes */}
            {report.notes && (
              <section>
                <h4 className='text-xs font-semibold uppercase tracking-wide mb-2'>Notes</h4>
                <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-md p-3'>
                  {report.notes}
                </div>
              </section>
            )}

            {/* Reviews */}
            {report.reviews && report.reviews.length > 0 && (
              <>
                <Separator />
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                    <MessageSquare size={13} /> Review History
                  </h4>
                  <div className='space-y-3'>
                    {report.reviews.map((r) => (
                      <div key={r.id} className='rounded-md border p-3'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='text-xs font-semibold'>{r.reviewer?.name}</span>
                          <Badge
                            variant={r.action === 'APPROVE' ? 'default' : 'destructive'}
                            className='text-xs'
                          >
                            {r.action === 'APPROVE' ? 'Approved' : 'Changes Requested'}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>{r.comment}</p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {format(new Date(r.createdAt), 'MMM d, HH:mm')} • v{r.versionNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailDialog;
