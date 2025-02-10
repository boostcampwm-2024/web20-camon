import { useMemo, useState } from 'react';
import { ThemeContext } from '@/shared/contexts';
import { ProviderProps } from './types';

type Theme = 'light' | 'dark' | null;

export function ThemeProvider({ children }: ProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) ?? null);
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
