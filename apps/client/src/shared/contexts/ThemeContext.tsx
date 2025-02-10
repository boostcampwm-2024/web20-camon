import { createContext } from 'react';

const currentTheme = localStorage.getItem('theme') ?? null;

type Theme = 'light' | 'dark' | null;

type ThemeContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: currentTheme as Theme,
  setTheme: () => null,
});
