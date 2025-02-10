import { useMemo, useState } from 'react';
import { AuthContext } from '@/shared/contexts';
import { ProviderProps } from './types';

export function AuthProvider({ children }: ProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('accessToken'));
  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn, setIsLoggedIn]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
