import { useQuery } from '@tanstack/react-query';
import { fetchAttendance } from '@/entities/attendance/api/attendanceApi';
import { AttendanceData } from './types';

export const useAttendanceList = () => {
  const {
    data: attendanceList,
    error,
    isLoading,
  } = useQuery<AttendanceData[], Error>({
    queryKey: ['attendance'],
    queryFn: fetchAttendance,
    staleTime: 1000 * 60,
  });

  return {
    attendanceList,
    error,
    isLoading,
  };
};
