import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getLivePreviewList, searchLivePreviewList } from '../api';
import { Field } from '@/shared/types';
import { Cursor } from './types';

export const useLivePreviewList = (field: Field) =>
  useInfiniteQuery({
    queryKey: ['live-preview-list', field],
    queryFn: ({ pageParam }) => getLivePreviewList(field, pageParam),
    initialPageParam: null as Cursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    refetchOnWindowFocus: true,
  });

export const useSearchLivePreviewList = (keyword: string) =>
  useQuery({
    queryKey: ['live-preview-search', keyword],
    queryFn: () => searchLivePreviewList(keyword),
    enabled: !!keyword && keyword.trim().length > 0,
    refetchOnWindowFocus: false,
  });
