'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MaskedHeadingProps {
  lines: string[];
  className?: string;
  delay?: number;
  duration?: number;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({ 
  lines, 
  className = '', 
  delay = 0,
  duration = 1.2
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.masked-line');
      
      // Set initial state manually to prevent FOUC (Flash of Unstyled Content)
      gsap.set(targets, { y: '120%' });

      gsap.to(targets, { 
        y: '0%', 
        duration: duration, 
        ease: 'power4.out',
        stagger: 0.15,
        delay: delay
      });
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <div ref={containerRef} className={className} style={{ margin: 0, padding: 0 }}>
      {lines.map((line, idx) => (
        <span key={idx} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.1em' }}>
          <span className="masked-line" style={{ display: 'block' }}>{line}</span>
        </span>
      ))}
    </div>
  );
};
