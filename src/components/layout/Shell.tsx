import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Navigation } from './Navigation';
import { CustomCursor } from '../cursor/CustomCursor';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <CustomCursor />
      <Navigation />
      
      {/* ThemeToggle visually tested in Phase 2, moving it slightly lower so it doesn't overlap header on right side, or we can just leave it since the nav-header handles pointers. */}
      <div style={{ position: 'fixed', bottom: 'var(--space-6)', right: 'var(--space-6)', zIndex: 'var(--z-nav)' }}>
        <ThemeToggle />
      </div>

      <div id="main-content">
        {children}
      </div>
    </>
  );
};
