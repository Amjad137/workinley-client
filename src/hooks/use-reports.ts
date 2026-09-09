import { IReportQuery, IReportFormValues } from '@/dto/report.dto';
import {
  fetchMyReports,
  fetchReportById,
  fetchAllTeamReports,
  createReport,
  updateReport,
  submitReport,
  deleteReport,
  approveReport,
  requestChanges,
} from '@/services/report.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';

// ── Query keys ────────────────────────────────────────────────────────────────

export const REPORT_KEYS = {
  all: ['reports'] as const,
  myReports: (params?: IReportQuery) => ['reports', 'my', params] as const,
  teamReports: (params?: IReportQuery) => ['reports', 'team', params] as const,
  detail: (id: string) => ['reports', 'detail', id] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────

export const useGetMyReports = (params?: IReportQuery, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: REPORT_KEYS.myReports(params),
    queryFn: () => fetchMyReports(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    pagination: data?.pagination,
    error,
  };
};

export const useGetAllTeamReports = (params?: IReportQuery, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: REPORT_KEYS.teamReports(params),
    queryFn: () => fetchAllTeamReports(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    pagination: data?.pagination,
    error,
  };
};

export const useGetReportById = (id: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: REPORT_KEYS.detail(id),
    queryFn: () => fetchReportById(id),
    enabled: options?.enabled ?? !!id,
  });

  return { isLoading, data: data ?? null, error };
};

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReportFormValues) => createReport(data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Report draft created' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IReportFormValues> }) =>
      updateReport(id, data),
    onSuccess: (_, variables) => {
      toast({ title: 'Success', description: 'Report updated' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.detail(variables.id) });
    },
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitReport(id),
    onSuccess: (_, id) => {
      toast({ title: 'Submitted', description: 'Report submitted for review' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.detail(id) });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Report deleted' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
    },
  });
};

export const useApproveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => approveReport(id, comment),
    onSuccess: (_, variables) => {
      toast({ title: 'Approved', description: 'Report approved successfully' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.detail(variables.id) });
    },
  });
};

export const useRequestChanges = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => requestChanges(id, comment),
    onSuccess: (_, variables) => {
      toast({ title: 'Changes Requested', description: 'Report sent back for correction' });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORT_KEYS.detail(variables.id) });
    },
  });
};
