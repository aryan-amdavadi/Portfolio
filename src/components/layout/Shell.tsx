import React from 'react';
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

      <div id="main-content">
        {children}
      </div>
    </>
  );
};
