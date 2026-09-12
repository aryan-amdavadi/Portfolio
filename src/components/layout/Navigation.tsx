'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { ThemeToggle } from './ThemeToggle';

const MENU_ITEMS = [
  { num: '01', label: 'WORK' },
  { num: '02', label: 'THINKING' },
  { num: '03', label: 'SYSTEM' },
  { num: '04', label: 'ABOUT' },
  { num: '05', label: 'CONNECT' },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const linkCursor = useCursorHandlers('link');
  
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
        <button 
          className="nav-trigger" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="main-nav"
          {...useCursorHandlers('link')}
        >
          {isOpen ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      <div 
        id="main-nav"
        className="nav-overlay" 
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden={!isOpen}
      >
        <nav className="nav-menu" aria-label="Main Navigation">
          {MENU_ITEMS.map((item) => (
            <Link 
              key={item.num}
              href={`#${item.label.toLowerCase()}`}
              className="nav-item"
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              {...linkCursor}
            >
              <span className="nav-number">{item.num}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-8)' }}>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};
