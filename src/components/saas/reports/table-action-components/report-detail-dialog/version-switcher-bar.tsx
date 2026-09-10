'use client';

import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VersionSwitcherBarProps {
  allVersionNumbers: number[];
  currentVersion: number;
  effectiveVersion: number;
  isViewingSnapshot: boolean;
  onSelectVersion: (version: number) => void;
  onResetToLatest: () => void;
}

export const VersionSwitcherBar = ({
  allVersionNumbers,
  currentVersion,
  effectiveVersion,
  isViewingSnapshot,
  onSelectVersion,
  onResetToLatest,
}: VersionSwitcherBarProps) => {
  return (
    <div className='flex items-center justify-between bg-muted/40 px-6 py-2.5 border-b text-xs flex-shrink-0'>
      <div className='flex items-center gap-2'>
        <History size={14} className='text-muted-foreground' />
        <span className='font-medium text-foreground'>Version:</span>
        <div className='flex items-center gap-1 bg-background p-0.5 rounded-md border shadow-xs'>
          {allVersionNumbers.map((vNum) => {
            const isLatest = vNum === currentVersion;
            const isSelected = effectiveVersion === vNum;
            return (
              <button
                key={vNum}
                type='button'
                onClick={() => onSelectVersion(vNum)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
              >
                v{vNum}
                <span className='text-[10px] opacity-80'>
                  {isLatest ? '(Latest)' : '(Snapshot)'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {isViewingSnapshot && (
        <Button
          variant='ghost'
          size='sm'
          className='h-7 text-xs text-primary hover:text-primary'
          onClick={onResetToLatest}
        >
          Reset to Latest
        </Button>
      )}
    </div>
  );
};
