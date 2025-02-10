import { useEffect, useState } from 'react';
import { Attendance, UserInfo } from './ui';
import { UserData } from './model';
import { EditUserInfo } from '@/features/editProfile';
import { axiosInstance } from '@/shared/api';
import { ErrorCharacter, LoadingCharacter } from '@/shared/ui';

export function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/v1/members/info')
      .then(response => {
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(new Error(response.data.message));
        }
      })
      .catch(err => setError(err instanceof Error ? err : new Error(err)))
      .finally(() => setIsLoading(false));
  }, [isEditing]);

  useEffect(() => {
    if (!userData) return;
    if (!userData.camperId || !userData.name || !userData.field) {
      if (!isEditing) setIsEditing(true);
    }
  }, [userData, isEditing]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  if (showLoading && isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCharacter size={200} />
      </div>
    );
  }

  if (error || !userData) {
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
