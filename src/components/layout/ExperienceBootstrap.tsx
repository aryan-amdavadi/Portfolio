'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useExperienceState, experienceStore } from '@/store/ExperienceStore';
import './ExperienceBootstrap.css';

export const ExperienceBootstrap = () => {
  const { phase, hasInitialized } = useExperienceState();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Initialize mounting and fonts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Safety timeout to ensure we never trap the user
    experienceStore.startMaxTimeout(4000);

    // Track fonts
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        experienceStore.setFontsReady();
      });
    } else {
      // Fallback if fonts API unavailable
      experienceStore.setFontsReady();
    }
    
    // Lock scroll during initialization
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle phase transitions
  useEffect(() => {
    if (phase === 'READY' && !hasInitialized && !isFading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFading(true);
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
        document.body.style.overflow = '';
        return;
      }
      
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
            document.body.style.overflow = '';
          }
        });

        // Cinematic exit
        tl.to(contentRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power2.inOut',
          delay: 0.2 // Brief pause on READY
        })
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        }, '-=0.2');
        
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, [phase, hasInitialized, isFading]);

  // If we already initialized on a previous route, don't show the loader
  if (hasInitialized && !isFading) {
    return null;
  }
  
  if (!isMounted) return null; // Avoid hydration mismatch

  const getStepClass = (stepPhase: string) => {
    const phases = ['BOOT', 'ENVIRONMENT', 'INTERACTION', 'IDENTITY', 'READY'];
    const currentIndex = phases.indexOf(phase);
    const stepIndex = phases.indexOf(stepPhase);
    
    if (currentIndex === stepIndex) return 'experience-step is-active';
    if (currentIndex > stepIndex) return 'experience-step is-complete';
    return 'experience-step';
  };

  return (
    <div 
      ref={containerRef} 
      className={`experience-bootstrap ${isFading ? 'experience-bootstrap--fading' : ''}`}
      data-phase={phase}
      aria-live="polite"
      aria-atomic="true"
    >
      <div ref={contentRef} className="experience-bootstrap-content">
        <div className="experience-bootstrap__header">
          <span>ARYAN AMDAVADI</span>
          <span>SYSTEM INITIALIZATION</span>
          <div className="experience-bootstrap__divider" />
        </div>
        
        <div className="experience-bootstrap__indicator" aria-hidden="true" />
        
        <div className="experience-bootstrap__steps">
          <div className={getStepClass('ENVIRONMENT')}>ENVIRONMENT</div>
          <div className={getStepClass('INTERACTION')}>INTERACTION</div>
          <div className={getStepClass('IDENTITY')}>IDENTITY</div>
          
          <div className={`${getStepClass('READY')} experience-step--ready`}>
            {phase === 'READY' ? 'READY' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
