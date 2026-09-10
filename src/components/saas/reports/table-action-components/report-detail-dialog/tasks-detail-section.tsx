'use client';

import { CheckCircle2, ListTodo } from 'lucide-react';
import { IReportTask, IReportPlannedTask } from '@/dto/report.dto';
import { cn } from '@/lib/utils';
import { priorityColors, statusColors } from './types';

interface TasksDetailSectionProps {
  tasks?: IReportTask[];
  plannedTasks?: IReportPlannedTask[];
}

export const TasksDetailSection = ({ tasks = [], plannedTasks = [] }: TasksDetailSectionProps) => {
  const hasTasks = tasks.length > 0;
  const hasPlannedTasks = plannedTasks.length > 0;

  if (!hasTasks && !hasPlannedTasks) return null;

  return (
    <div className='space-y-6'>
      {hasTasks && (
        <section>
          <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
            <CheckCircle2 size={14} className='text-primary' /> Tasks ({tasks.length})
          </h4>
          <div className='space-y-2'>
            {tasks.map((task, i) => (
              <div
                key={task.id ?? i}
                className='bg-muted/40 rounded-lg p-3 border border-border/50'
              >
                <div className='flex items-start justify-between gap-2'>
                  <span className='text-sm font-medium text-foreground'>{task.name}</span>
                  <div className='flex items-center gap-1.5 shrink-0'>
                    <span className={cn('text-xs font-semibold', priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                    <span className={cn('text-xs', statusColors[task.status])}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className='mt-2 grid grid-cols-4 gap-2 text-xs text-muted-foreground'>
                  <span>Planned: {task.plannedPercent ?? task.plannedCompletionPercent ?? 0}%</span>
                  <span>Actual: {task.actualPercent ?? task.actualCompletionPercent ?? 0}%</span>
                  <span>Est: {task.plannedHours ?? 0}h</span>
                  <span>Spent: {task.spentHours ?? task.actualHours ?? 0}h</span>
                </div>
                {task.deliverable && (
                  <div className='mt-1.5 text-xs text-blue-500 truncate'>🔗 {task.deliverable}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasPlannedTasks && (
        <section>
          <h4 className='text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-foreground'>
            <ListTodo size={14} className='text-blue-500' /> Planned Tasks ({plannedTasks.length})
          </h4>
          <div className='space-y-2'>
            {plannedTasks.map((task, i) => (
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
    </div>
  );
};
