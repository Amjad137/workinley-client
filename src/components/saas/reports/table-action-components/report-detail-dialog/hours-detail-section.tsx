'use client';

import { Clock } from 'lucide-react';
import { IHoursBreakdown } from '@/dto/report.dto';

interface HoursDetailSectionProps {
  hoursBreakdown?: IHoursBreakdown | Record<string, number> | null;
  totalHours: number;
}

export const HoursDetailSection = ({ hoursBreakdown, totalHours }: HoursDetailSectionProps) => {
  if (!hoursBreakdown || totalHours <= 0) return null;

  return (
    <section>
      <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
        <Clock size={14} className='text-blue-500' /> Hours ({totalHours}h total)
      </h4>
      <div className='grid grid-cols-5 gap-3'>
        {Object.entries(hoursBreakdown).map(([k, v]) => (
          <div key={k} className='text-center bg-muted/40 rounded-lg p-2 border border-border/50'>
            <div className='text-lg font-bold text-foreground'>{String(v)}</div>
            <div className='text-xs text-muted-foreground capitalize'>{k}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
