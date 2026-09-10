'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { REPORT_STATUS } from '@/constants/report.constants';
import { ROUTES } from '@/constants/routes.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit3,
  FilePlus,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

interface UserCurrentWeekBannerProps {
  currentWeekReport?: IWeeklyReport | null;
  weekNumber: number;
  year: number;
}

export const UserCurrentWeekBanner = ({
  currentWeekReport,
  weekNumber,
  year,
}: UserCurrentWeekBannerProps) => {
  const status = currentWeekReport?.status;

  if (!status) {
    return (
      <Card className='border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shadow-xs overflow-hidden relative'>
        <CardContent className='p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='h-11 w-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5'>
              <AlertCircle className='h-6 w-6' />
            </div>
            <div>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 mb-1'>
                Action Required
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Week {weekNumber} Report Not Submitted
              </h3>
              <p className='text-xs md:text-sm text-muted-foreground mt-0.5 max-w-xl'>
                Your weekly submission for Week {weekNumber}, {year} is due. Keep your team and
                managers updated on your achievements, planned tasks, and blockers.
              </p>
            </div>
          </div>

          <Button asChild size='sm' className='gap-2 shrink-0 self-start md:self-auto'>
            <Link href={ROUTES.REPORT_NEW}>
              <FilePlus className='h-4 w-4' />
              Submit Week {weekNumber} Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === REPORT_STATUS.DRAFT) {
    return (
      <Card className='border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent shadow-xs overflow-hidden'>
        <CardContent className='p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='h-11 w-11 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5'>
              <Edit3 className='h-6 w-6' />
            </div>
            <div>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 mb-1'>
                Draft in Progress
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Week {weekNumber} Report is in Draft
              </h3>
              <p className='text-xs md:text-sm text-muted-foreground mt-0.5 max-w-xl'>
                You have an unsubmitted draft for Week {weekNumber}. Finish adding your tasks and
                submit it for manager review.
              </p>
            </div>
          </div>

          <Button asChild size='sm' className='gap-2 shrink-0 self-start md:self-auto'>
            <Link href={ROUTES.REPORT_DETAIL(currentWeekReport.id)}>
              <ArrowRight className='h-4 w-4' />
              Continue Editing
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === REPORT_STATUS.SUBMITTED) {
    return (
      <Card className='border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-xs overflow-hidden'>
        <CardContent className='p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5'>
              <Clock className='h-6 w-6' />
            </div>
            <div>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary mb-1'>
                Under Review
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Week {weekNumber} Report Submitted
              </h3>
              <p className='text-xs md:text-sm text-muted-foreground mt-0.5 max-w-xl'>
                Your report has been submitted and is currently being reviewed by your manager. You
                will be notified once reviewed.
              </p>
            </div>
          </div>

          <Button
            variant='outline'
            asChild
            size='sm'
            className='gap-2 shrink-0 self-start md:self-auto'
          >
            <Link href={ROUTES.REPORT_DETAIL(currentWeekReport.id)}>
              View Submission
              <ArrowRight className='h-3.5 w-3.5' />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === REPORT_STATUS.NEEDS_CORRECTION) {
    return (
      <Card className='border-orange-200/70 dark:border-orange-900/50 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent shadow-xs overflow-hidden'>
        <CardContent className='p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='h-11 w-11 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5'>
              <RotateCcw className='h-6 w-6' />
            </div>
            <div>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-700 dark:text-orange-400 mb-1'>
                Corrections Requested
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Week {weekNumber} Report Needs Revision
              </h3>
              <p className='text-xs md:text-sm text-muted-foreground mt-0.5 max-w-xl'>
                Your reviewer has left feedback requesting updates on your submission. Please revise
                and resubmit.
              </p>
            </div>
          </div>

          <Button
            asChild
            size='sm'
            className='gap-2 shrink-0 self-start md:self-auto bg-orange-600 hover:bg-orange-700 text-white'
          >
            <Link href={ROUTES.REPORT_DETAIL(currentWeekReport.id)}>
              <RotateCcw className='h-4 w-4' />
              Revise & Resubmit
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // APPROVED
  return (
    <Card className='border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-xs overflow-hidden'>
      <CardContent className='p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <div className='h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5'>
            <CheckCircle2 className='h-6 w-6' />
          </div>
          <div>
            <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 mb-1'>
              Approved
            </div>
            <h3 className='text-base font-semibold text-foreground'>
              Week {weekNumber} Report Approved!
            </h3>
            <p className='text-xs md:text-sm text-muted-foreground mt-0.5 max-w-xl'>
              Excellent work! Your weekly report has been reviewed and approved by your supervisor.
            </p>
          </div>
        </div>

        <Button
          variant='outline'
          asChild
          size='sm'
          className='gap-2 shrink-0 self-start md:self-auto'
        >
          <Link href={ROUTES.REPORT_DETAIL(currentWeekReport.id)}>
            View Details
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCurrentWeekBanner;
