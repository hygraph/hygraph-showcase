/**
 * Dark Mode Toggle - Theme switcher button
 * Cycles through: Light → Dark → System
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="group relative h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all-smooth focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={`Theme: ${theme === 'system' ? `System (${systemTheme})` : theme}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Sun icon (light mode) */}
        <svg
          className={`h-5 w-5 text-gray-700 dark:text-gray-400 transition-all duration-300 ${
            currentTheme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon icon (dark mode) */}
        <svg
          className={`absolute h-5 w-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
            currentTheme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* System indicator dot */}
      {theme === 'system' && (
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand shadow-glow" />
      )}
    </button>
  );
}
