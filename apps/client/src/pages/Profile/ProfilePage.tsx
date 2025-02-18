import { useEffect, useState } from 'react';
import { Attendance, UserInfo } from './ui';
import { EditUserInfo } from '@/features/editProfile';
import { ErrorCharacter, LoadingCharacter } from '@/shared/ui';
import { useUserData } from '@/entities/user';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { userData, isLoading, error } = useUserData();

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
