import { axiosInstance } from '@/shared/api';
import { AttendanceData, AttendanceResponse } from '../model/types';

export const fetchAttendance = async (): Promise<AttendanceData[]> => {
  const { data } = await axiosInstance.get<AttendanceResponse>('/v1/members/attendance');
  if (!data.success) {
    throw new Error(data.message || '출석부 조회에 실패했습니다.');
  }
  return data.data.attendances;
};
