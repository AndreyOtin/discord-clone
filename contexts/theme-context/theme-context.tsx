'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const THEMES = ['dark', 'light'] as const;

const isIncluded = <T extends readonly string[]>(str: string, values: T): str is T[number] =>
  values.includes(str);

interface ThemeContext {
  theme: (typeof THEMES)[number];
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

const Context = createContext<ThemeContext | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeContext['theme']>(() => {
    const theme = localStorage.getItem('theme');
    if (typeof theme === 'string' && isIncluded(theme, THEMES)) {
      return theme;
    }

    localStorage.setItem('theme', 'dark');
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const values = useMemo(
    () => ({
      theme,
      setTheme
    }),
    [theme]
  );

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export const useThemeContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('theme context error');
  }

  return context;
};

export default ThemeProvider;
