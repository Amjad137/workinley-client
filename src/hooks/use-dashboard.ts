import {
  fetchDashboardSummary,
  fetchVelocityTrend,
  fetchHoursDistribution,
  fetchProjectWorkload,
  fetchComplianceMatrix,
  fetchTeamBlockers,
  fetchActivityFeed,
  fetchMemberStats,
} from '@/services/dashboard.service';
import { IComplianceQuery } from '@/dto/dashboard.dto';
import { useQuery } from '@tanstack/react-query';

export const DASHBOARD_KEYS = {
  summary: (wn?: number, y?: number) => ['dashboard', 'summary', wn, y] as const,
  velocity: (year?: number) => ['dashboard', 'velocity', year] as const,
  hours: (wn?: number, y?: number) => ['dashboard', 'hours', wn, y] as const,
  workload: (wn?: number, y?: number) => ['dashboard', 'workload', wn, y] as const,
  compliance: (query?: IComplianceQuery) => ['dashboard', 'compliance', query] as const,
  blockers: (wn?: number, y?: number) => ['dashboard', 'blockers', wn, y] as const,
  activity: (limit?: number) => ['dashboard', 'activity', limit] as const,
  memberStats: (userId: string) => ['dashboard', 'member', userId] as const,
};

export const useGetDashboardSummary = (weekNumber?: number, year?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.summary(weekNumber, year),
    queryFn: () => fetchDashboardSummary(weekNumber, year),
  });
  return { isLoading, data: data ?? null, error };
};

export const useGetVelocityTrend = (year?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.velocity(year),
    queryFn: () => fetchVelocityTrend(year),
  });
  return { isLoading, data: data ?? [], error };
};

export const useGetHoursDistribution = (weekNumber?: number, year?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.hours(weekNumber, year),
    queryFn: () => fetchHoursDistribution(weekNumber, year),
  });
  return { isLoading, data: data ?? null, error };
};

export const useGetProjectWorkload = (weekNumber?: number, year?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.workload(weekNumber, year),
    queryFn: () => fetchProjectWorkload(weekNumber, year),
  });
  return { isLoading, data: data ?? [], error };
};

export const useGetComplianceMatrix = (queryOrWeek?: IComplianceQuery | number, year?: number) => {
  const query: IComplianceQuery | undefined =
    typeof queryOrWeek === 'number' ? { weekNumber: queryOrWeek, year } : queryOrWeek;

  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.compliance(query),
    queryFn: () => fetchComplianceMatrix(query),
  });
  return {
    isLoading,
    data: data?.results ?? [],
    pagination: data?.pagination,
    error,
  };
};

export const useGetTeamBlockers = (weekNumber?: number, year?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.blockers(weekNumber, year),
    queryFn: () => fetchTeamBlockers(weekNumber, year),
  });
  return { isLoading, data: data ?? [], error };
};

export const useGetActivityFeed = (limit?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.activity(limit),
    queryFn: () => fetchActivityFeed(limit),
  });
  return { isLoading, data: data ?? [], error };
};

export const useGetMemberStats = (userId: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: DASHBOARD_KEYS.memberStats(userId),
    queryFn: () => fetchMemberStats(userId),
    enabled: options?.enabled ?? !!userId,
  });
  return { isLoading, data: data ?? null, error };
};
