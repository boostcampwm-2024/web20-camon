import { UserData, MutationUserData } from '@/entities/user';
import { axiosInstance } from '@/shared/api';

export const getUserInfo = async (): Promise<UserData> => {
  const response = await axiosInstance.get('/v1/members/info');
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const getUserProfileImage = async (): Promise<string> => {
  const response = await axiosInstance.get('/v1/members/profile-image');
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data.profileImage;
};

export const patchUserInfo = async (formData: MutationUserData) => {
  const response = await axiosInstance.patch('/v1/members/info', formData);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data;
};
