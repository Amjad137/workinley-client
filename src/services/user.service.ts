import { ISignupFormValues } from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import Axios from '@/config/api.config';
import { ENTITY_SORT, SORT_BY } from '@/constants/common.constants';
import { ICommonResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import { IUserQuery } from '@/dto/user.dto';
import { DeepPartial } from '@/types/common.type';
import { IUser } from '@/types/user.type';
import { handleError } from '@/utils/error-handler';

const BASE = '/v1/users';

export const fetchAllUsers = async (params?: IUserQuery): Promise<IPaginatedResponseDTO<IUser>> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IUser>>>(BASE, {
      params: {
        ...params,
        sortBy: params?.sortBy ?? SORT_BY.DATE,
        limit: params?.limit ?? 24,
        page: params?.page ?? 1,
        sortOrder: params?.sortOrder ?? ENTITY_SORT.DESC,
      },
    });

    return response.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchAllUsersCount = async (): Promise<number> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<number>>(`${BASE}/count`);
    return response.data.data ?? 0;
  } catch (err) {
    return handleError(err);
  }
};

export const updateUser = async (
  userId: string,
  data: DeepPartial<ISignupFormValues>,
): Promise<IUser | null> => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<IUser>>(`${BASE}/${userId}`, data);
    return response.data.data || null;
  } catch (err) {
    return handleError(err);
  }
};

export const updateUserByAdmin = async (
  userId: string,
  userData: Omit<ISignupFormValues, 'password' | 'confirmPassword' | 'entryCode'>,
): Promise<IUser | null> => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<IUser>>(`${BASE}/${userId}`, userData);
    return response.data.data || null;
  } catch (err) {
    return handleError(err);
  }
};

export const verifyMultipleUsers = async (
  userIDs: string[],
  verification: string,
): Promise<{ message: string; verifiedProfileIDs: string[] } | null> => {
  try {
    const response = await Axios.patch<
      ICommonResponseDTO<{ message: string; verifiedProfileIDs: string[] }>
    >(`${BASE}/verify`, {
      userIDs,
      verification: verification === 'true',
    });

    return response.data.data ?? null;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteUserById = async (userId: string): Promise<null> => {
  try {
    const response = await Axios.delete<ICommonResponseDTO<null>>(`${BASE}/${userId}`);
    return response.data.data;
  } catch (err) {
    return handleError(err);
  }
};
