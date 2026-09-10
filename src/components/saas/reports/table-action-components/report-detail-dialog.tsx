/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { format } from 'date-fns';
import { CalendarDays, FileText } from 'lucide-react';

import {
  VersionSwitcherBar,
  SnapshotNoticeBanner,
  TasksDetailSection,
  BlockersDetailSection,
  AchievementsDetailSection,
  HoursDetailSection,
  ReviewHistorySection,
} from './report-detail-dialog/index';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  report?: IWeeklyReport | null;
  reportId?: string;
};

const ReportDetailDialog = ({ open, setOpen, report, reportId }: Props) => {
  const targetId = reportId || report?.id || '';

  const { data: fetchedReport, isLoading } = useGetReportById(targetId, {
    enabled: open && !!targetId,
  });

  const activeReport = fetchedReport || report;

  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    if (open && activeReport?.currentVersion) {
      setSelectedVersion(activeReport.currentVersion);
    }
  }, [open, activeReport?.currentVersion]);

  const allVersions = useMemo(() => {
    if (!activeReport) return [];
    return [...(activeReport.versions || [])].sort((a, b) => a.versionNumber - b.versionNumber);
  }, [activeReport]);

  const currentVersion = activeReport?.currentVersion ?? 1;

  const allVersionNumbers = useMemo(() => {
    const set = new Set<number>();
    allVersions.forEach((v) => set.add(v.versionNumber));
    if (currentVersion) set.add(currentVersion);
    return Array.from(set).sort((a, b) => a - b);
  }, [allVersions, currentVersion]);

  const hasVersions = allVersionNumbers.length > 1;
  const effectiveVersion = selectedVersion ?? currentVersion;
  const isViewingSnapshot = effectiveVersion !== currentVersion;
  const viewingSnapshotVersion = isViewingSnapshot
    ? allVersions.find((v) => v.versionNumber === effectiveVersion)
    : null;

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

  // Resolve snapshot vs current version data
  const displayTasks = isViewingSnapshot
    ? (viewingSnapshotVersion?.snapshotData?.tasks ?? [])
    : (activeReport.tasks ?? []);

  const displayPlannedTasks = isViewingSnapshot
    ? (viewingSnapshotVersion?.snapshotData?.plannedTasks ?? [])
    : (activeReport.plannedTasks ?? []);

  const displayBlockers = isViewingSnapshot
    ? (viewingSnapshotVersion?.snapshotData?.blockers ?? [])
    : (activeReport.blockers ?? []);

  const displayAchievements = isViewingSnapshot
    ? (viewingSnapshotVersion?.snapshotData?.achievements ?? [])
    : (activeReport.achievements ?? []);

  const displayNotes = isViewingSnapshot
    ? viewingSnapshotVersion?.snapshotData?.notes
    : activeReport.notes;

  const displayNextWeekPlans = isViewingSnapshot
    ? (viewingSnapshotVersion?.snapshotData?.nextWeekPlans ??
      (viewingSnapshotVersion?.snapshotData?.plannedTasks &&
      viewingSnapshotVersion.snapshotData.plannedTasks.length > 0
        ? viewingSnapshotVersion.snapshotData.plannedTasks
            .map((pt: { name?: string }) => `- ${pt.name}`)
            .join('\n')
        : undefined))
    : (activeReport.nextWeekPlans ??
      (activeReport.plannedTasks && activeReport.plannedTasks.length > 0
        ? activeReport.plannedTasks.map((pt) => `- ${pt.name}`).join('\n')
        : undefined));

  const displayHoursBreakdown = (() => {
    if (!isViewingSnapshot && activeReport.hoursBreakdown) {
      return activeReport.hoursBreakdown;
    }

    const entries = isViewingSnapshot
      ? viewingSnapshotVersion?.snapshotData?.hoursEntries
      : activeReport.hoursEntries;

    if (!entries || entries.length === 0) return null;

    const breakdown: Record<string, number> = {
      development: 0,
      testing: 0,
      meetings: 0,
      documentation: 0,
      other: 0,
    };

    for (const entry of entries) {
      const cat = entry.category?.toLowerCase();
      if (cat in breakdown) {
        breakdown[cat] += Number(entry.hours) || 0;
      }
    }

    return breakdown;
  })();

  const totalHours = displayHoursBreakdown
    ? Object.values(displayHoursBreakdown).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

  const hasTasks = displayTasks.length > 0;
  const hasPlannedTasks = displayPlannedTasks.length > 0;
  const hasBlockers = displayBlockers.length > 0;
  const hasAchievements = displayAchievements.length > 0;
  const hasReviews = activeReport.reviews && activeReport.reviews.length > 0;

  const isContentEmpty =
    !hasTasks &&
    !hasPlannedTasks &&
    !hasBlockers &&
    !hasAchievements &&
    !displayNotes &&
    !displayNextWeekPlans &&
    totalHours <= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden'>
        {/* Dialog Header */}
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

        {/* Version Switcher Bar */}
        {hasVersions && (
          <VersionSwitcherBar
            allVersionNumbers={allVersionNumbers}
            currentVersion={currentVersion}
            effectiveVersion={effectiveVersion}
            isViewingSnapshot={isViewingSnapshot}
            onSelectVersion={setSelectedVersion}
            onResetToLatest={() => setSelectedVersion(currentVersion)}
          />
        )}

        {/* Scrollable Content Body */}
        <ScrollArea className='flex-1 px-6 py-4 min-h-0 overflow-y-auto'>
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
              {/* Snapshot Notice Banner */}
              {isViewingSnapshot && viewingSnapshotVersion && (
                <SnapshotNoticeBanner
                  versionNumber={viewingSnapshotVersion.versionNumber}
                  submittedAt={viewingSnapshotVersion.submittedAt}
                  currentVersion={currentVersion}
                  onBackToLatest={() => setSelectedVersion(currentVersion)}
                />
              )}

              {/* Tasks & Planned Tasks */}
              <TasksDetailSection tasks={displayTasks} plannedTasks={displayPlannedTasks} />

              {/* Blockers */}
              <BlockersDetailSection blockers={displayBlockers} />

              {/* Achievements */}
              <AchievementsDetailSection achievements={displayAchievements} />

              {/* Hours Breakdown */}
              <HoursDetailSection hoursBreakdown={displayHoursBreakdown} totalHours={totalHours} />

              {/* Next Week Plans */}
              {displayNextWeekPlans && !hasPlannedTasks && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-2 text-foreground'>
                    Next Week Plans
                  </h4>
                  <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-lg p-3 border border-border/50'>
                    {displayNextWeekPlans}
                  </div>
                </section>
              )}

              {/* Additional Notes */}
              {displayNotes && (
                <section>
                  <h4 className='text-xs font-semibold uppercase tracking-wide mb-2 text-foreground'>
                    Notes
                  </h4>
                  <div className='text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-lg p-3 border border-border/50'>
                    {displayNotes}
                  </div>
                </section>
              )}

              {/* Empty Content State */}
              {isContentEmpty && (
                <div className='flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-border/80 bg-muted/20'>
                  <FileText className='h-8 w-8 text-muted-foreground/40 mb-1.5' />
                  <p className='text-sm font-medium text-foreground'>No Detailed Entries</p>
                  <p className='text-xs text-muted-foreground mt-0.5 max-w-xs'>
                    {isViewingSnapshot
                      ? `Version ${effectiveVersion} snapshot has no tasks, blockers, or achievements recorded.`
                      : 'This report has no tasks, blockers, or achievements recorded yet.'}
                  </p>
                </div>
              )}

              {/* Review History */}
              {hasReviews && (
                <>
                  <Separator />
                  <ReviewHistorySection
                    reviews={activeReport.reviews}
                    allVersions={allVersions}
                    currentVersion={currentVersion}
                    effectiveVersion={effectiveVersion}
                    isViewingSnapshot={isViewingSnapshot}
                    onSelectVersion={setSelectedVersion}
                  />
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
