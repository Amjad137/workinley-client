import Axios from '@/config/api.config';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { IUpdatePasswordRequestDTO } from '@/dto/auth.dto';
import { ICommonResponseDTO } from '@/dto/common.dto';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const updatePassword = async ({
  userId,
  currentPassword,
  newPassword,
}: IUpdatePasswordRequestDTO) => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<{ message: string }>>(
      `/v1/user/${userId}/password`,
      {
        currentPassword,
        newPassword,
      },
    );
    toast({
      title: 'Success!',
      description: response.data.data.message || 'Password updated successfully.',
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    throw error;
  }
};
