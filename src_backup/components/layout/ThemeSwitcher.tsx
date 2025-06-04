import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../themes/ThemeProvider';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-primary-600" />
      )}
    </button>
  );
}; 