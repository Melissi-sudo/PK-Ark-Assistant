import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill'
}) => {
  const { setTheme, toggleTheme, isDark } = useTheme();

  if (variant === 'segmented') {
    return (
      <div 
        className={`inline-flex items-center bg-gray-100 dark:bg-[#1c1c1e] p-1 rounded-full border border-gray-200 dark:border-[#2c2c2e] select-none gap-0.5 ${className}`}
        role="radiogroup"
        aria-label="Color theme switcher"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          role="radio"
          aria-checked={!isDark}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors z-10 ${
            !isDark
              ? 'text-[#111827] font-semibold'
              : 'text-[#4b5563] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white font-medium'
          }`}
          title="Switch to Light Theme (Gallery White)"
        >
          {!isDark && (
            <motion.span
              layoutId="themeTogglePill"
              className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/80 -z-10"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          role="radio"
          aria-checked={isDark}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors z-10 ${
            isDark
              ? 'text-white font-semibold'
              : 'text-[#4b5563] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-white font-medium'
          }`}
          title="Switch to Dark Theme (Apple Dark)"
        >
          {isDark && (
            <motion.span
              layoutId="themeTogglePill"
              className="absolute inset-0 bg-[#2c2c2e] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-[#3a3a3c] -z-10"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1c1e] dark:hover:bg-[#2c2c2e] border border-gray-200 dark:border-[#2c2c2e] text-[#111827] dark:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-[#374151] hover:text-[#111827]" />
      )}
    </motion.button>
  );
};
