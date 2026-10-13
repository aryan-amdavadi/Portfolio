'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { ThemeToggle } from './ThemeToggle';
import { FlowingMenu } from './FlowingMenu';

const MENU_ITEMS = [
  { link: '/#work', text: 'WORK' },
  { link: '/projects', text: 'ARCHIVE' },
  { link: '/#problem-system', text: 'SYSTEMS' },
  { link: '/#thinking', text: 'PROCESS' },
  { link: '/#builder', text: 'BUILDER' },
  { link: '/#connect', text: 'CONNECT' },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      <header className="nav-header">
        <Link href="/" className="nav-brand" {...useCursorHandlers('link')}>
          ARYAN
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <ThemeToggle />
          <button 
            className="nav-trigger" 
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="main-nav"
            aria-label="Toggle navigation menu"
            {...useCursorHandlers('link')}
          >
            {isOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      <div 
        id="main-nav"
        className="nav-overlay" 
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden={!isOpen}
        style={{ 
          pointerEvents: isOpen ? 'auto' : 'none', 
          opacity: isOpen ? 1 : 0, 
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 
          position: 'fixed', 
          inset: 0, 
          zIndex: 90, 
          backgroundColor: 'var(--bg-base)'
        }}
      >
        <FlowingMenu 
          items={MENU_ITEMS} 
          onItemClick={() => setIsOpen(false)}
          isOpen={isOpen}
          bgColor="transparent"
          textColor="var(--text-primary)"
          marqueeBgColor="var(--text-primary)"
          marqueeTextColor="var(--bg-base)"
        />
      </div>
    </>
  );
};
