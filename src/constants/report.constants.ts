export enum REPORT_STATUS {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  NEEDS_CORRECTION = 'NEEDS_CORRECTION',
  APPROVED = 'APPROVED',
}

export enum TASK_PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TASK_STATUS {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

export enum REVIEW_ACTION {
  APPROVE = 'APPROVE',
  REQUEST_CHANGES = 'REQUEST_CHANGES',
}

export enum REPORT_QUERY_PARAMS {
  STATUS = 'status',
  YEAR = 'year',
  WEEK_NUMBER = 'weekNumber',
  USER_ID = 'userId',
  PROJECT_ID = 'projectId',
}

export enum SORT_REPORT_BY {
  WEEK_START_DATE = 'weekStartDate',
}

export const REPORT_STATUS_LABELS: Record<REPORT_STATUS, string> = {
  [REPORT_STATUS.DRAFT]: 'Draft',
  [REPORT_STATUS.SUBMITTED]: 'Submitted',
  [REPORT_STATUS.NEEDS_CORRECTION]: 'Needs Correction',
  [REPORT_STATUS.APPROVED]: 'Approved',
};

export const REPORT_STATUS_VARIANTS: Record<
  REPORT_STATUS,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [REPORT_STATUS.DRAFT]: 'secondary',
  [REPORT_STATUS.SUBMITTED]: 'default',
  [REPORT_STATUS.NEEDS_CORRECTION]: 'destructive',
  [REPORT_STATUS.APPROVED]: 'outline',
};

export const TASK_PRIORITY_LABELS: Record<TASK_PRIORITY, string> = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.CRITICAL]: 'Critical',
};

export const TASK_STATUS_LABELS: Record<TASK_STATUS, string> = {
  [TASK_STATUS.NOT_STARTED]: 'Not Started',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.BLOCKED]: 'Blocked',
};
