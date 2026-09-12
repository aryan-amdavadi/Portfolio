import React from 'react';
import { Navigation } from './Navigation';
import { CustomCursor } from '../cursor/CustomCursor';
import { ScrollOrchestrator } from './ScrollOrchestrator';

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
      <ScrollOrchestrator />
      <Navigation />

      <div id="main-content">
        {children}
      </div>
    </>
  );
};
