'use client';

import React, { useEffect, useState } from 'react';
import { EngineState } from '../../canvas/engine/EngineState';
import { useCursorHandlers } from '@/hooks/useCursorState';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize from document on mount (SSR safe)
  useEffect(() => {
    let initialTheme: 'dark' | 'light' = 'dark';
    
    // Check local storage first
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      initialTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      // Fall back to system preference
      initialTheme = 'light';
    }

    // eslint-disable-next-line
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    EngineState.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme-preference', nextTheme);
    EngineState.theme = nextTheme;
    setTheme(nextTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      {...useCursorHandlers('link')}
    >
      {theme === 'dark' ? '☼' : '☾'}
    </button>
  );
};
