import { IUser } from '@/types/user.type';
import { IPaginationQuery } from './common.dto';
import { IWeeklyReport } from './report.dto';

export interface IDashboardSummary {
  weekNumber: number;
  year: number;
  totalUsers: number;
  totalReports: number;
  submitted: number;
  approved: number;
  needsCorrection: number;
  draft: number;
  notStarted: number;
  complianceRate: number;
  activeBlockers: number;
}

export interface IComplianceMember {
  user: IUser;
  status: string;
  currentVersion: number;
  submittedAt?: string | null;
}

export interface ITaskVelocity {
  weekNumber: number;
  year: number;
  avgPlannedPercent: number;
  avgActualPercent: number;
  totalTasks: number;
}

export interface IHoursDistribution {
  development: number;
  testing: number;
  meetings: number;
  documentation: number;
  other: number;
}

export interface IProjectWorkload {
  project: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  taskCount: number;
  totalPlannedHours: number;
  totalSpentHours: number;
}

export interface ITeamBlocker {
  id: string;
  description: string;
  impact?: string;
  resolved?: boolean;
  reportId?: string;
  userName?: string;
  isKeyBlocker?: boolean;
  isKeyIssue?: boolean;
  createdAt?: string;
  report?: {
    id: string;
    weekNumber: number;
    year: number;
    user?: {
      id: string;
      name: string;
      email?: string;
      image?: string | null;
    };
  };
}

export interface IActivityFeedItem {
  id: string;
  action: string;
  comment: string;
  createdAt: string | Date;
  reviewer: {
    id: string;
    name: string;
    image?: string | null;
  };
  report: {
    id: string;
    weekNumber: number;
    year: number;
    user: {
      id: string;
      name: string;
    };
  };
}

export interface IMemberStats {
  user: IUser;
  userId: string;
  totalReports: number;
  statusCounts: Record<string, number>;
  totalTasks: number;
  avgRevisions: number;
  recentReports: IWeeklyReport[];
}

export interface IDashboardQuery {
  weekNumber?: number;
  year?: number;
}

export interface IComplianceQuery extends IPaginationQuery {
  weekNumber?: number;
  year?: number;
}

export interface IVelocityQuery {
  year?: number;
  weeksBack?: number;
}

export interface IActivityFeedQuery {
  limit?: number;
}
