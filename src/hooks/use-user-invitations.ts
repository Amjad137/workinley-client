import { ICreateUserInvitationDTO, IUserInvitationQuery } from '@/dto/user-invitation.dto';
import {
  createInvitation,
  deleteInvitation,
  fetchAllInvitations,
  resendInvitation,
  validateInvitation,
} from '@/services/user-invitation.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';

export const INVITATION_KEYS = {
  all: ['invitations'] as const,
  list: (params?: IUserInvitationQuery) => ['invitations', 'list', params] as const,
  validate: (code?: string) => ['invitations', 'validate', code] as const,
};

export const useGetAllUserInvitations = (
  params?: IUserInvitationQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error } = useQuery({
    queryKey: INVITATION_KEYS.list(params),
    queryFn: () => fetchAllInvitations(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    pagination: data?.pagination,
    error,
  };
};

export const useCreateUserInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateUserInvitationDTO) => createInvitation(data),
    onSuccess: (result) => {
      toast({
        title: 'Invitation Created',
        description: `Invitation created for ${result.email}`,
      });
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.all });
    },
  });
};

export const useResendUserInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendInvitation(id),
    onSuccess: (result) => {
      toast({
        title: 'Invitation Renewed',
        description: `Invitation renewed for ${result.email}`,
      });
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.all });
    },
  });
};

export const useDeleteUserInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvitation(id),
    onSuccess: () => {
      toast({
        title: 'Invitation Revoked',
        description: 'The invitation has been revoked.',
      });
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.all });
    },
  });
};

export const useValidateInvitation = (code?: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: INVITATION_KEYS.validate(code),
    queryFn: () => (code ? validateInvitation(code) : Promise.reject(new Error('No code'))),
    enabled: options?.enabled !== undefined ? options.enabled : !!code,
    retry: false,
  });

  return {
    isLoading,
    data: data ?? null,
    isValid: !!data?.valid,
    error,
  };
};
