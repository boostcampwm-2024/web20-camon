import { useQuery } from '@tanstack/react-query';
import { getLiveCamperInfo } from './liveCamperInfoApi';

export const useLiveInfo = (liveId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['liveInfo', liveId],
    queryFn: () => getLiveCamperInfo(liveId),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
  });

  return { data, isLoading, isError };
};
