'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SnapshotNoticeBannerProps {
  versionNumber: number;
  submittedAt?: string;
  currentVersion: number;
  onBackToLatest: () => void;
}

export const SnapshotNoticeBanner = ({
  versionNumber,
  submittedAt,
  currentVersion,
  onBackToLatest,
}: SnapshotNoticeBannerProps) => {
  return (
    <div className='flex items-center justify-between rounded-lg border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-3 text-amber-900 dark:text-amber-200 text-xs'>
      <div className='flex items-center gap-2'>
        <AlertCircle size={15} className='text-amber-600 dark:text-amber-400 shrink-0' />
        <span>
          <strong>Viewing historical snapshot of Version {versionNumber}</strong>
          {submittedAt && (
            <span className='opacity-80 ml-1'>
              (Submitted {format(new Date(submittedAt), 'MMM d, yyyy HH:mm')})
            </span>
          )}
        </span>
      </div>
      <Button
        type='button'
        size='sm'
        variant='outline'
        className='h-7 text-xs border-amber-300 dark:border-amber-700 bg-background text-foreground hover:bg-muted'
        onClick={onBackToLatest}
      >
        Back to Latest (v{currentVersion})
      </Button>
    </div>
  );
};
