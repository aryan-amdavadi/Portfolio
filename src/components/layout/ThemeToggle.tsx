'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize from document on mount (SSR safe)
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      // eslint-disable-next-line
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div style={{ position: 'fixed', top: 'var(--space-6)', right: 'var(--space-6)', zIndex: 'var(--z-nav)' }}>
      <Button variant="outline" onClick={toggleTheme}>
        {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
      </Button>
    </div>
  );
};
