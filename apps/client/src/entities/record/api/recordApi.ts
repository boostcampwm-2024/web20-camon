import { axiosInstance } from '@/shared/api';

export const getRecordList = async (attendanceId: string | undefined) => {
  if (!attendanceId) {
    throw new Error('attendanceId가 없습니다.');
  }

  const response = await axiosInstance.get(`/v1/records/${attendanceId}`);

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
