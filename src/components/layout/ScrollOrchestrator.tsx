'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EngineState } from '@/canvas/engine/EngineState';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ScrollOrchestrator = () => {
  const isReducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // If reduced motion is preferred, we don't orchestrate complex timeline shifts 
    // to avoid nausea, but we still allow minimal position updates or just keep it static.
    if (isReducedMotion) {
      return;
    }

    // Reset Engine State before creating timeline
    EngineState.sculptureX = 0;
    EngineState.sculptureY = 0;
    EngineState.sculptureZ = 0;
    EngineState.sculptureRotY = 0;
    EngineState.sculptureRotX = 0;
    EngineState.cameraZ = 8;
    EngineState.fogDensity = 0.05;
    EngineState.orbitalNodesOpacity = 0;
    EngineState.orbitalNodesScale = 0; // Starts collapsed
    EngineState.fragmentsOpacity = 0;
    EngineState.fragmentsScale = 0; // Starts collapsed
    EngineState.artifactsOpacity = 0;
    EngineState.activeArtifactIndex = -1;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // DESKTOP TIMELINE: Subtle, continuous spatial response
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth native feel
          onUpdate: (self) => {
            EngineState.scrollProgress = self.progress;
          }
        }
      });

      const tl = timelineRef.current;
      
      tl.to(EngineState, {
        sculptureRotY: Math.PI * 2, // One full slow rotation over the entire page
        sculptureZ: -2,             // Slight push back to give content room
        cameraZ: 7,                 // Subtle zoom in
        ease: "none"
      });
    });

    mm.add("(max-width: 768px)", () => {
      // MOBILE TIMELINE: Subtle, continuous spatial response, scaled for mobile
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            EngineState.scrollProgress = self.progress;
          }
        }
      });

      const tl = timelineRef.current;
      
      tl.to(EngineState, {
        sculptureRotY: Math.PI * 2,
        sculptureZ: -4, 
        cameraZ: 12, // Needs more distance on mobile
        ease: "none"
      });
    });

    return () => {
      mm.revert(); 
    };
  }, [isReducedMotion]);

  return null; // Logic only component
};
