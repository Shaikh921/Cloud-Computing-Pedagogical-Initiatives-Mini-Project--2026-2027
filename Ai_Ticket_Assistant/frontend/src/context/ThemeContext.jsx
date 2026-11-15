import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  {
    id: 'emerald',
    name: 'Emerald',
    label: 'Emerald',
    color: '#10b981',
    dotBg: 'bg-emerald-400',
    ringColor: 'ring-emerald-500/50',
    description: 'Clean emerald accent',
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    label: 'Amethyst',
    color: '#a855f7',
    dotBg: 'bg-purple-400',
    ringColor: 'ring-purple-500/50',
    description: 'Modern purple accent',
  },
  {
    id: 'amber',
    name: 'Amber',
    label: 'Amber',
    color: '#f59e0b',
    dotBg: 'bg-amber-400',
    ringColor: 'ring-amber-500/50',
    description: 'Warm amber accent',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    label: 'Cyan',
    color: '#06b6d4',
    dotBg: 'bg-cyan-400',
    ringColor: 'ring-cyan-500/50',
    description: 'Crisp cyan accent',
  },
];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('ai_ticket_theme') || 'emerald';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('ai_ticket_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

