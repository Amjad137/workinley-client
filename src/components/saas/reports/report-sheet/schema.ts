import * as yup from 'yup';
import { format, startOfWeek, endOfWeek, getISOWeek, getISOWeekYear } from 'date-fns';
import { TASK_PRIORITY, TASK_STATUS } from '@/constants/report.constants';
import { IWeeklyReport } from '@/dto/report.dto';

export const taskSchema = yup.object({
  name: yup.string().required('Task name is required').max(300),
  priority: yup.mixed<TASK_PRIORITY>().oneOf(Object.values(TASK_PRIORITY)).optional(),
  plannedPercent: yup.number().min(0).max(100).optional(),
  actualPercent: yup.number().min(0).max(100).optional(),
  plannedCompletionPercent: yup.number().min(0).max(100).optional(),
  actualCompletionPercent: yup.number().min(0).max(100).optional(),
  status: yup.mixed<TASK_STATUS>().oneOf(Object.values(TASK_STATUS)).optional(),
  plannedHours: yup.number().min(0).optional(),
  spentHours: yup.number().min(0).optional(),
  actualHours: yup.number().min(0).optional(),
  deliverable: yup.string().optional().max(500),
  projectId: yup.string().optional(),
});

export const blockerSchema = yup.object({
  description: yup.string().required('Description is required').max(500),
  isKeyBlocker: yup.boolean().optional(),
  isKeyIssue: yup.boolean().optional(),
});

export const achievementSchema = yup.object({
  description: yup.string().required('Description is required').max(500),
  isKeyAchievement: yup.boolean().optional(),
});

export const hoursBreakdownSchema = yup.object({
  development: yup.number().min(0).default(0),
  testing: yup.number().min(0).default(0),
  meetings: yup.number().min(0).default(0),
  documentation: yup.number().min(0).default(0),
  other: yup.number().min(0).default(0),
});

export const reportSchema = yup.object({
  weekStartDate: yup.string().required(),
  weekEndDate: yup.string().required(),
  weekNumber: yup.number().required(),
  year: yup.number().required(),
  projectId: yup.string().optional(),
  tasks: yup.array(taskSchema).defined().default([]),
  blockers: yup.array(blockerSchema).defined().default([]),
  achievements: yup.array(achievementSchema).defined().default([]),
  nextWeekPlans: yup.string().optional().max(3000),
  hoursBreakdown: hoursBreakdownSchema.optional(),
  notes: yup.string().optional().max(3000),
});

export type FormValues = yup.InferType<typeof reportSchema>;

export function getWeekInfoFromDate(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    weekStartDate: format(start, 'yyyy-MM-dd'),
    weekEndDate: format(end, 'yyyy-MM-dd'),
    weekNumber: getISOWeek(start),
    year: getISOWeekYear(start),
  };
}

export function getCurrentWeekDefaults() {
  return getWeekInfoFromDate(new Date());
}

export function buildInitialFormValues(report?: IWeeklyReport | null): FormValues {
  const weekDefaults = getCurrentWeekDefaults();

  if (!report) {
    return {
      weekStartDate: weekDefaults.weekStartDate,
      weekEndDate: weekDefaults.weekEndDate,
      weekNumber: weekDefaults.weekNumber,
      year: weekDefaults.year,
      projectId: '',
      tasks: [],
      blockers: [],
      achievements: [],
      nextWeekPlans: '',
      hoursBreakdown: {
        development: 0,
        testing: 0,
        meetings: 0,
        documentation: 0,
        other: 0,
      },
      notes: '',
    };
  }

  const hoursBreakdown = {
    development: report.hoursBreakdown?.development ?? 0,
    testing: report.hoursBreakdown?.testing ?? 0,
    meetings: report.hoursBreakdown?.meetings ?? 0,
    documentation: report.hoursBreakdown?.documentation ?? 0,
    other: report.hoursBreakdown?.other ?? 0,
  };

  if (report.hoursEntries && report.hoursEntries.length > 0) {
    for (const entry of report.hoursEntries) {
      const cat = entry.category?.toLowerCase() as keyof typeof hoursBreakdown;
      if (cat in hoursBreakdown && !hoursBreakdown[cat]) {
        hoursBreakdown[cat] = entry.hours;
      }
    }
  }

  return {
    weekStartDate: report.weekStartDate
      ? format(new Date(report.weekStartDate), 'yyyy-MM-dd')
      : weekDefaults.weekStartDate,
    weekEndDate: report.weekEndDate
      ? format(new Date(report.weekEndDate), 'yyyy-MM-dd')
      : weekDefaults.weekEndDate,
    weekNumber: report.weekNumber ?? weekDefaults.weekNumber,
    year: report.year ?? weekDefaults.year,
    projectId: report.projectId ?? report.project?.id ?? '',
    tasks: (report.tasks ?? []).map((t) => ({
      name: t.name ?? '',
      priority: t.priority ?? TASK_PRIORITY.MEDIUM,
      plannedPercent: t.plannedPercent ?? t.plannedCompletionPercent ?? 0,
      actualPercent: t.actualPercent ?? t.actualCompletionPercent ?? 0,
      plannedCompletionPercent: t.plannedCompletionPercent ?? t.plannedPercent ?? 0,
      actualCompletionPercent: t.actualCompletionPercent ?? t.actualPercent ?? 0,
      status: t.status ?? TASK_STATUS.IN_PROGRESS,
      plannedHours: t.plannedHours ?? 0,
      spentHours: t.spentHours ?? t.actualHours ?? 0,
      actualHours: t.actualHours ?? t.spentHours ?? 0,
      deliverable: t.deliverable ?? '',
      projectId: t.projectId ?? report.projectId ?? report.project?.id ?? '',
    })),
    blockers: (report.blockers ?? []).map((b) => ({
      description: b.description ?? '',
      isKeyBlocker: b.isKeyBlocker ?? b.isKeyIssue ?? false,
      isKeyIssue: b.isKeyIssue ?? b.isKeyBlocker ?? false,
    })),
    achievements: (report.achievements ?? []).map((a) => ({
      description: a.description ?? '',
      isKeyAchievement: a.isKeyAchievement ?? false,
    })),
    nextWeekPlans: report.nextWeekPlans ?? '',
    hoursBreakdown,
    notes: report.notes ?? '',
  };
}
