'use client';

import React, { useEffect, useState } from 'react';
import { EngineState } from '../../canvas/engine/EngineState';
import { useCursorHandlers } from '@/hooks/useCursorState';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let initialTheme: 'dark' | 'light' = 'dark';
    try {
      const savedTheme = localStorage.getItem('theme-preference');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        initialTheme = savedTheme;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        initialTheme = 'light';
      }
    } catch {
      // Ignore localStorage availability issues
    }

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    EngineState.theme = initialTheme;
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: initialTheme } }));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Temporary transition class for smooth token interpolation
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('theme-preference', nextTheme);
    } catch {
      // Ignore localStorage availability issues
    }

    EngineState.theme = nextTheme;
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));

    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 350);
  };

  const isLight = mounted && theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      {...useCursorHandlers('link')}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isLight ? (
          /* Moon icon for White Mode to toggle to Dark Mode */
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          /* Sun icon for Dark Mode to toggle to White Mode */
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </span>
    </button>
  );
};
