import { useQuery } from '@tanstack/react-query';
import { getUserInfo, getUserProfileImage } from '@/entities/user';
import { userKeys } from './queryFactory';

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
