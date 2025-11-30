// 1. 'React'는 사용하지 않으므로 제거합니다. (JSX는 자동 변환됩니다)
// 2. 'ReactNode'는 타입이므로 'type' 키워드를 붙여서 가져옵니다.
import { createContext, useState, useEffect, type ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>('light'); 

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'hancom-classic') {
      root.style.setProperty('--bg-color', '#f0f0f0');
      root.style.setProperty('--editor-bg', '#ffffff');
      root.style.setProperty('--primary-color', '#0066cc'); 
    } else if (theme === 'dark') {
      root.style.setProperty('--bg-color', '#1a1a1a');
      root.style.setProperty('--editor-bg', '#2d2d2d');
      root.style.setProperty('--primary-color', '#bb86fc');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--editor-bg', '#ffffff');
      root.style.setProperty('--primary-color', '#3b82f6');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};