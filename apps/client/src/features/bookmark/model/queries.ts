// src/features/bookmark/model/useBookmarkMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/lib';
import { addBookmark, deleteBookmark } from '@/features/bookmark/api/bookmarkApi';
import { BookmarkData } from './types';

export const useBookmarkMutation = ({ onAddSuccess }: { onAddSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutateAdd } = useMutation<BookmarkData, Error, BookmarkData>({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      onAddSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: '북마크 생성 실패',
        description: error.message,
      });
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: '북마크 삭제 실패',
        description: error.message,
      });
    },
  });

  return {
    mutateAdd,
    mutateDelete,
  };
};
