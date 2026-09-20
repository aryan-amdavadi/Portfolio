'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DepthText } from '@/components/text/DepthText';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    title: 'UNDERSTAND',
    description: 'Identify the actual problem.'
  },
  {
    title: 'DECOMPOSE',
    description: 'Break complexity into manageable systems.'
  },
  {
    title: 'DESIGN',
    description: 'Define architecture and boundaries.'
  },
  {
    title: 'ENGINEER',
    description: 'Build the solution.'
  },
  {
    title: 'TEST',
    description: 'Challenge assumptions and implementation.'
  },
  {
    title: 'ITERATE',
    description: 'Improve based on evidence.'
  }
];

export const ThinkingProcess: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.thinking-step');

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', marginTop: 'var(--space-12)' }}>
      {PROCESS_STEPS.map((step, index) => (
        <div key={index} className="thinking-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <DepthText
            text={step.title}
            fontSize="clamp(3rem, 8vw, 6rem)"
            faceColor="var(--text-primary)"
            depthColor="var(--accent-base)"
            layers={15}
            depth={2}
            tilt={10}
            orbitSpeed={0.2}
          />
          <p className="typography-body mt-4 max-w-md" style={{ color: 'var(--text-secondary)' }}>
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
};
