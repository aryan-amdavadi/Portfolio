'use client';

import React, { useRef, useState, useEffect } from 'react';
import './SpecularButton.css';
import { useCursorHandlers } from '@/hooks/useCursorState';

interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  className?: string;
}

export const SpecularButton = ({
  children,
  as: Component = 'button',
  href,
  className = '',
  ...props
}: SpecularButtonProps) => {
  const buttonRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Apply a subtle 'explore' cursor for the primary CTA
  const cursorProps = useCursorHandlers('explore');

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  const handlePointerEnter = () => {
    // Optionally trigger entry animation or effects
  };

  const handlePointerLeave = () => {
    // Reset position towards center smoothly via CSS if we wanted, 
    // but leaving it at exit point is often a nice trailing effect.
  };

  const Tag = href ? 'a' : Component;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      ref={buttonRef}
      className={`specular-button ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
      } as React.CSSProperties}
      {...cursorProps}
      {...linkProps}
      {...props}
    >
      <span className="specular-button-content">
        {children}
      </span>
    </Tag>
  );
};
