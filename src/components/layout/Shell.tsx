import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <ThemeToggle />
      <div id="main-content">
        {children}
      </div>
    </>
  );
};
