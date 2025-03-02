import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, getUserProfileImage, patchUserInfo } from '@/entities/user';
import { userKeys } from './queryFactory';
import { useToast } from '@/shared/lib';
import { MutationUserData } from './types';

export const useUserData = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({ queryKey: userKeys.profile(), queryFn: getUserInfo, staleTime: 1000 * 60 * 10 });

  return { userData, isLoading, error };
};

export const useProfileImage = (isLoggedIn: boolean) => {
  const { data, isLoading, error } = useQuery({
    queryKey: userKeys.profileImage(),
    queryFn: getUserProfileImage,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 10,
  });

  return { profileImgUrl: data, isLoading, error };
};

export const useUserDataMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (formData: MutationUserData) => patchUserInfo(formData),
    onSuccess: async data => {
      if (data.success) {
        toast({ title: '프로필 업데이트 성공', variant: 'default' });
        await queryClient.invalidateQueries({ queryKey: userKeys.profile(), refetchType: 'active' });
        onSuccessCallback();
      } else {
        toast({
          title: '프로필 업데이트 실패',
          description: data.message || '알 수 없는 오류가 발생했습니다',
          variant: 'destructive',
        });
      }
    },
    onError: error => {
      toast({
        title: '프로필 업데이트 실패',
        description: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다',
        variant: 'destructive',
      });
    },
  });
};
