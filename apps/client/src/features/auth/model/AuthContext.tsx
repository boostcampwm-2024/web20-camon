import { createContext } from 'react';

const initialState = {
  isLoggedIn: !!localStorage.getItem('accessToken'),
  setIsLoggedIn: () => {},
};

type AuthContextValue = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextValue>(initialState);
