import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '@/shared/api';

type APIOptions = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  params?: Record<string, unknown>;
  data?: unknown;
};

type APIQueryState<T> = {
  data: T | null;
  fetchData: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export const useAPI = <T>(endpoint: string, options: APIOptions = {}): APIQueryState<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await axiosInstance.request({
        url: endpoint,
        method: options.method ?? 'GET',
        params: options.params,
        data: options.data,
      });
      setData(result.data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data.'));
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options.method, options.params, options.data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, fetchData, isLoading, error };
};
