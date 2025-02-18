import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Attendance, UserInfo } from './ui';
import { UserData } from './model';
import { EditUserInfo } from '@/features/editProfile';
import { axiosInstance } from '@/shared/api';
import { ErrorCharacter, LoadingCharacter } from '@/shared/ui';

const getUserInfo = async (): Promise<UserData> => {
  const response = await axiosInstance.get('/v1/members/info');
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading, error } = useQuery({ queryKey: ['userData'], queryFn: getUserInfo });

  useEffect(() => {
    if (!userData) return;
    if (!userData.camperId || !userData.name || !userData.field) {
      if (!isEditing) setIsEditing(true);
    }
  }, [userData, isEditing]);

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCharacter size={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <ErrorCharacter size={200} message={`${'프로필 조회 실패'}`} />
      </div>
    );
  }

  if (isEditing) {
    return <EditUserInfo userData={userData} toggleEditing={toggleEditing} />;
  }

  return (
    <>
      <UserInfo userData={userData} toggleEditing={toggleEditing} error={error} isLoading={isLoading} />
      <Attendance />
    </>
  );
}
