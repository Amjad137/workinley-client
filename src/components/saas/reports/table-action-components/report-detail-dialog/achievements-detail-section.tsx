'use client';

import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { IReportAchievement } from '@/dto/report.dto';

interface AchievementsDetailSectionProps {
  achievements?: IReportAchievement[];
}

export const AchievementsDetailSection = ({
  achievements = [],
}: AchievementsDetailSectionProps) => {
  if (!achievements.length) return null;

  return (
    <section>
      <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
        <Trophy size={14} className='text-amber-500' /> Achievements ({achievements.length})
      </h4>
      <div className='space-y-2'>
        {achievements.map((a, i) => (
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
  );
};
