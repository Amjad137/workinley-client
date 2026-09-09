import {
  IProjectQuery,
  ICreateProjectFormValues,
  IUpdateProjectFormValues,
} from '@/dto/project.dto';
import {
  fetchAllProjects,
  fetchActiveProjects,
  fetchProjectById,
  createProject,
  updateProject,
  archiveProject,
  deleteProject,
} from '@/services/project.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
  list: (params?: IProjectQuery) => ['projects', 'list', params] as const,
  active: ['projects', 'active'] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
};

export const useGetAllProjects = (params?: IProjectQuery, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: PROJECT_KEYS.list(params),
    queryFn: () => fetchAllProjects(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    pagination: data?.pagination,
    error,
  };
};

export const useGetActiveProjects = (options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: PROJECT_KEYS.active,
    queryFn: () => fetchActiveProjects(),
    enabled: options?.enabled ?? true,
  });

  return { isLoading, data: data ?? [], error };
};

export const useGetProjectById = (id: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => fetchProjectById(id),
    enabled: options?.enabled ?? !!id,
  });

  return { isLoading, data: data ?? null, error };
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateProjectFormValues) => createProject(data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Project created' });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProjectFormValues }) =>
      updateProject(id, data),
    onSuccess: (_, variables) => {
      toast({ title: 'Success', description: 'Project updated' });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(variables.id) });
    },
  });
};

export const useArchiveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveProject(id),
    onSuccess: () => {
      toast({ title: 'Archived', description: 'Project archived' });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Project deleted' });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};
