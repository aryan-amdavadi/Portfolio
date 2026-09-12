import React from 'react';

interface ShellProps {
  children: React.ReactNode;
}

/**
 * Shell Component
 * 
 * Provides the global layout wrapper for the application.
 * Manages high-level providers, theme data attributes, and global structure.
 */
export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      {/* Navigation will go here */}
      <div id="main-content">
        {children}
      </div>
      {/* Custom Cursor will go here */}
    </>
  );
};
