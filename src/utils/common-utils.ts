import { getISOWeek } from 'date-fns';

export const formatGrade = (grade: string): string => {
  // Handle empty or invalid input
  if (!grade || !grade.includes('_')) return grade;

  // Extract the number part after the underscore
  const gradeNumber = grade.split('_')[1];

  // Return formatted string
  return `Grade ${gradeNumber}`;
};

export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

export const getRestApiBaseUrl = (rawUrl: string, prefix = '/api'): string => {
  let url = (rawUrl || '').trim();
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url.endsWith(prefix) ? url : `${url}${prefix}`;
};

export function getCurrentWeekYear() {
  const now = new Date();
  return { weekNumber: getISOWeek(now), year: now.getFullYear() };
}
