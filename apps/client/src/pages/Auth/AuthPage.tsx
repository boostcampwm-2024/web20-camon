import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorCharacter } from '@/shared/ui';
import { useAuth } from '@/features/auth';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const { setLogIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const isNecessaryInfo = searchParams.get('isNecessaryInfo');
    if (!accessToken) {
      setError(new Error('액세스 토큰을 받지 못했습니다.'));
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return;
    }

    setLogIn(accessToken);
    navigate(isNecessaryInfo === 'true' ? '/' : '/profile', { replace: true });
  }, [navigate, searchParams, setLogIn]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <ErrorCharacter size={400} message="로그인 처리 중 문제가 발생했습니다." />
      ) : (
        <div>
          <h2 className="text-display-bold24 text-text-strong">로그인 처리 중입니다.</h2>
          <p className="text-text-default text-display-medium16">잠시만 기다려주세요!!!!</p>
        </div>
      )}
    </div>
  );
}
