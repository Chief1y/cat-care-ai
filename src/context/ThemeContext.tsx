import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ColorValue } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: ColorValue;
    text: ColorValue;
    card: ColorValue;
    accent: ColorValue;
    primary: ColorValue;
    secondary: ColorValue;
    surface: ColorValue;
    border: ColorValue;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const colors =
    theme === 'light'
      ? {
          background: '#CAF0F8',
          text: '#03045E',
          card: '#ADE8F4',
          accent: '#0077B6',
          primary: '#00B4D8',
          secondary: '#48CAE4',
          surface: '#90E0EF',
          border: '#0096C7',
        }
      : {
          background: '#03045E',
          text: '#CAF0F8',
          card: '#023E8A',
          accent: '#48CAE4',
          primary: '#0077B6',
          secondary: '#0096C7',
          surface: '#0077B6',
          border: '#00B4D8',
        };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
