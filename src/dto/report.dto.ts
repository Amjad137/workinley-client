import {
  REPORT_STATUS,
  TASK_PRIORITY,
  TASK_STATUS,
  REVIEW_ACTION,
  SORT_REPORT_BY,
} from '@/constants/report.constants';
import { SORT_BY } from '@/constants/common.constants';
import { IPaginationQuery } from './common.dto';

export enum HoursCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  MEETINGS = 'MEETINGS',
  DOCUMENTATION = 'DOCUMENTATION',
  OTHER = 'OTHER',
}

export interface IReportTask {
  id: string;
  reportId: string;
  projectId?: string;
  name: string;
  priority: TASK_PRIORITY;
  status: TASK_STATUS;
  plannedCompletionPercent?: number;
  actualCompletionPercent?: number;
  plannedHours?: number;
  actualHours?: number;
  deliverable?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;

  // Backward-compatibility aliases
  plannedPercent?: number;
  actualPercent?: number;
  spentHours?: number;
}

export interface IReportPlannedTask {
  id: string;
  reportId: string;
  projectId?: string;
  name: string;
  priority: TASK_PRIORITY;
  plannedHours: number;
  orderIndex: number;
  createdAt: string;
}

export interface IReportBlocker {
  id: string;
  reportId: string;
  description: string;
  isKeyIssue?: boolean;
  isKeyBlocker?: boolean; // alias
  orderIndex: number;
  createdAt: string;
}

export interface IReportAchievement {
  id: string;
  reportId: string;
  description: string;
  isKeyAchievement: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface IReportHours {
  id: string;
  reportId: string;
  category: HoursCategory;
  hours: number;
}

export interface IReportReview {
  id: string;
  reportId: string;
  reviewerId: string;
  reviewer: { id: string; name: string; email: string; image?: string };
  versionNumber: number;
  action: REVIEW_ACTION;
  comment: string;
  createdAt: string;
}

export interface IReportVersion {
  id: string;
  reportId: string;
  versionNumber: number;
  snapshotData: {
    tasks?: IReportTask[];
    plannedTasks?: IReportPlannedTask[];
    blockers?: IReportBlocker[];
    achievements?: IReportAchievement[];
    hoursEntries?: IReportHours[];
    notes?: string;
    links?: string[];
    nextWeekPlans?: string;
  };
  submitterNote?: string;
  submittedAt: string;
}

export interface IHoursBreakdown {
  development: number;
  testing: number;
  meetings: number;
  documentation: number;
  other: number;
}

export interface IWeeklyReport {
  id: string;
  userId: string;
  projectId?: string;
  weekStartDate: string;
  weekEndDate: string;
  weekNumber: number;
  year: number;
  status: REPORT_STATUS;
  currentVersion: number;
  notes?: string;
  links?: string[];
  nextWeekPlans?: string;
  hoursBreakdown?: IHoursBreakdown;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: { id: string; name: string; email: string; image?: string };
  project?: { id: string; name: string; code: string; color: string };
  tasks?: IReportTask[];
  plannedTasks?: IReportPlannedTask[];
  blockers?: IReportBlocker[];
  achievements?: IReportAchievement[];
  hoursEntries?: IReportHours[];
  reviews?: IReportReview[];
  versions?: IReportVersion[];
}

export interface IReportQuery extends Omit<IPaginationQuery, 'sortBy'> {
  status?: REPORT_STATUS;
  sortBy?: SORT_BY | SORT_REPORT_BY;
  year?: number;
  weekNumber?: number;
  userId?: string;
  projectId?: string;
}

// Form types (used in dialogs and sheets)
export interface IReportTaskFormValues {
  name: string;
  priority?: TASK_PRIORITY;
  plannedPercent?: number;
  actualPercent?: number;
  plannedCompletionPercent?: number;
  actualCompletionPercent?: number;
  status?: TASK_STATUS;
  plannedHours?: number;
  spentHours?: number;
  actualHours?: number;
  deliverable?: string;
  projectId?: string;
}

export interface IReportBlockerFormValues {
  description: string;
  isKeyBlocker?: boolean;
  isKeyIssue?: boolean;
}

export interface IReportAchievementFormValues {
  description: string;
  isKeyAchievement?: boolean;
}

export interface IReportFormValues {
  weekStartDate: string;
  weekEndDate: string;
  weekNumber: number;
  year: number;
  projectId?: string;
  tasks: IReportTaskFormValues[];
  blockers: IReportBlockerFormValues[];
  achievements: IReportAchievementFormValues[];
  nextWeekPlans?: string;
  hoursBreakdown?: IHoursBreakdown;
  notes?: string;
  links?: string[];
}
