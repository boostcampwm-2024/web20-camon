import { useQuery } from '@tanstack/react-query';
import { getRecordList } from '../api/recordApi';

export const useRecordList = (attendanceId: string | undefined) => useQuery({
    queryKey: ['record-list', attendanceId],
    queryFn: () => getRecordList(attendanceId),
    staleTime: 1000 * 60 * 60,
    enabled: !!attendanceId,
  });
