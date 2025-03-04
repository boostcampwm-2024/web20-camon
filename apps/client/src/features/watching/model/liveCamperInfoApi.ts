import { axiosInstance } from '@/shared/api';
import { LiveInfo } from './types';

export const getLiveCamperInfo = async (liveId: string): Promise<LiveInfo> => {
  const response = await axiosInstance.get(`v1/broadcasts/${liveId}/info`);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
