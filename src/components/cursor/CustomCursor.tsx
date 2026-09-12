'use client';

import React, { useEffect, useRef } from 'react';
import { useCursorState } from '@/hooks/useCursorState';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const cursorState = useCursorState();
  const prefersReducedMotion = useReducedMotion();
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  // Physics state
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    document.body.classList.add('has-custom-cursor');
    
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const updateCursor = () => {
      // Lerp factors: dot is fast, ring is slower for inertia
      // If reduced motion, snap immediately
      const dotLerp = prefersReducedMotion ? 1 : 0.8;
      const ringLerp = prefersReducedMotion ? 1 : 0.2;

      dotPos.current.x += (mouse.current.x - dotPos.current.x) * dotLerp;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * dotLerp;

      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ringLerp;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ringLerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    requestRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [prefersReducedMotion]);

  let text = '';
  if (cursorState === 'project') text = 'VIEW';
  if (cursorState === 'explore') text = 'EXPLORE';
  if (cursorState === 'external') text = 'OPEN';

  return (
    <div className={`custom-cursor cursor-state-${cursorState}`} aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-text">{text}</span>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};
