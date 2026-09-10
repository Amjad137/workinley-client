'use client';

import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { IReportBlocker } from '@/dto/report.dto';

interface BlockersDetailSectionProps {
  blockers?: IReportBlocker[];
}

export const BlockersDetailSection = ({ blockers = [] }: BlockersDetailSectionProps) => {
  if (!blockers.length) return null;

  return (
    <section>
      <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
        <AlertTriangle size={14} className='text-orange-500' /> Blockers ({blockers.length})
      </h4>
      <div className='space-y-2'>
        {blockers.map((b, i) => (
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
  );
};
