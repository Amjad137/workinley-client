/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { IReportReview, IReportVersion } from '@/dto/report.dto';

interface ReviewHistorySectionProps {
  reviews?: IReportReview[];
  allVersions: IReportVersion[];
  currentVersion: number;
  effectiveVersion: number;
  isViewingSnapshot: boolean;
  onSelectVersion: (version: number) => void;
}

export const ReviewHistorySection = ({
  reviews = [],
  allVersions,
  currentVersion,
  effectiveVersion,
  isViewingSnapshot,
  onSelectVersion,
}: ReviewHistorySectionProps) => {
  if (!reviews.length) return null;

  return (
    <section>
      <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
        <MessageSquare size={14} className='text-primary' /> Review History
      </h4>
      <div className='space-y-3'>
        {reviews.map((r) => {
          const matchingSnapshot = allVersions.find((v) => v.versionNumber === r.versionNumber);
          const isCurrentlyViewingThis = effectiveVersion === r.versionNumber;

          return (
            <div key={r.id} className='rounded-lg border p-3 bg-card'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-xs font-semibold text-foreground'>{r.reviewer?.name}</span>
                <Badge
                  variant={r.action === 'APPROVE' ? 'default' : 'destructive'}
                  className='text-xs'
                >
                  {r.action === 'APPROVE' ? 'Approved' : 'Changes Requested'}
                </Badge>
              </div>
              <p className='text-sm text-muted-foreground'>{r.comment}</p>
              <div className='flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-xs text-muted-foreground'>
                <span>
                  {format(new Date(r.createdAt), 'MMM d, HH:mm')} • Version {r.versionNumber}
                </span>

                {matchingSnapshot ? (
                  isCurrentlyViewingThis ? (
                    <Badge
                      variant='outline'
                      className='text-[10px] bg-primary/10 text-primary border-primary/30'
                    >
                      Currently viewing
                    </Badge>
                  ) : (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-6 text-[11px] gap-1 px-2'
                      onClick={() => onSelectVersion(r.versionNumber)}
                    >
                      <Eye size={11} /> View v{r.versionNumber} Snapshot
                    </Button>
                  )
                ) : r.versionNumber === currentVersion && !isViewingSnapshot ? (
                  <span className='text-[10px] text-muted-foreground'>Current version</span>
                ) : r.versionNumber === currentVersion && isViewingSnapshot ? (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-6 text-[11px] gap-1 px-2'
                    onClick={() => onSelectVersion(currentVersion)}
                  >
                    <Eye size={11} /> View Latest (v{currentVersion})
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
