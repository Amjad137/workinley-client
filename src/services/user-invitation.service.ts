import Axios from '@/config/api.config';
import { ICommonResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import {
  ICreateUserInvitationDTO,
  IUserInvitation,
  IUserInvitationQuery,
  IValidateInvitationResponse,
} from '@/dto/user-invitation.dto';
import { handleError } from '@/utils/error-handler';

const BASE = '/v1/invitations';

export const fetchAllInvitations = async (
  params?: IUserInvitationQuery,
): Promise<IPaginatedResponseDTO<IUserInvitation>> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IUserInvitation>>>(BASE, {
      params,
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const createInvitation = async (
  data: ICreateUserInvitationDTO,
): Promise<IUserInvitation> => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IUserInvitation>>(BASE, data);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const validateInvitation = async (code: string): Promise<IValidateInvitationResponse> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IValidateInvitationResponse>>(
      `${BASE}/validate`,
      { params: { code } },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const resendInvitation = async (id: string): Promise<IUserInvitation> => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IUserInvitation>>(`${BASE}/${id}/resend`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteInvitation = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`${BASE}/${id}`);
  } catch (err) {
    return handleError(err);
  }
};
