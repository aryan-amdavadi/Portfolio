'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EngineState, SpatialLanes } from '@/canvas/engine/EngineState';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ScrollOrchestrator = () => {
  const isReducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (isReducedMotion) {
      EngineState.sculptureX = SpatialLanes.CENTER;
      return;
    }

    // Initial State Reset
    EngineState.sculptureX = SpatialLanes.CENTER; // Start center before matchMedia overrides it
    EngineState.sculptureY = 0;
    EngineState.sculptureZ = 0;
    EngineState.sculptureRotY = 0;
    EngineState.sculptureRotX = 0;
    EngineState.cameraZ = 8;
    EngineState.fogDensity = 0.05;
    EngineState.orbitalNodesOpacity = 0;
    EngineState.orbitalNodesScale = 0;
    EngineState.fragmentsOpacity = 0;
    EngineState.fragmentsScale = 0;
    EngineState.artifactsOpacity = 0;
    EngineState.activeArtifactIndex = -1;

    const mm = gsap.matchMedia();

    // Desktop
    mm.add("(min-width: 769px)", () => {
      // Set initial position for desktop
      EngineState.sculptureX = SpatialLanes.DESKTOP_RIGHT; // Hero text is left

      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth interpolation natively provided by GSAP scrub
          onUpdate: (self) => {
            EngineState.scrollProgress = self.progress;
          }
        }
      });

      const tl = timelineRef.current;
      const totalRot = Math.PI * 2;

      // Map global scroll to spatial keyframes using labels and relative positions
      // We assume roughly equal height sections for simplicity in the global timeline, 
      // or we can just sequence them based on percentages.

      tl.to(EngineState, { sculptureRotY: totalRot, ease: 'none' }, 0); // Constant rotation

      // 1. Hero -> Builder (Text Right, Object Left)
      tl.to(EngineState, { sculptureX: SpatialLanes.DESKTOP_LEFT, sculptureZ: -2, cameraZ: 7, ease: 'power1.inOut' }, 0.1);

      // 2. Builder -> Problem/System (Text Left, Object Right)
      tl.to(EngineState, { sculptureX: SpatialLanes.DESKTOP_RIGHT, ease: 'power1.inOut' }, 0.3);

      // 3. Problem/System -> Projects (Text Left/Center, Object Right pushed back)
      tl.to(EngineState, { sculptureX: SpatialLanes.DESKTOP_RIGHT, sculptureZ: -4, ease: 'power1.inOut' }, 0.5);

      // 4. Projects -> Thinking (Text Left, Object Right brought forward)
      tl.to(EngineState, { sculptureX: SpatialLanes.DESKTOP_RIGHT, sculptureZ: -2, ease: 'power1.inOut' }, 0.7);

      // 5. Thinking -> Connect (Text Center, Object Left)
      tl.to(EngineState, { sculptureX: SpatialLanes.DESKTOP_LEFT, ease: 'power1.inOut' }, 0.9);
    });

    // Mobile
    mm.add("(max-width: 768px)", () => {
      // Set initial position for mobile
      EngineState.sculptureX = SpatialLanes.MOBILE_RIGHT;

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
      
      tl.to(EngineState, { sculptureRotY: Math.PI * 2, ease: 'none' }, 0);

      // Reduced movement for mobile, push z back more to ensure it fits
      tl.to(EngineState, { sculptureX: SpatialLanes.MOBILE_LEFT, sculptureZ: -4, cameraZ: 12, ease: 'power1.inOut' }, 0.1);
      tl.to(EngineState, { sculptureX: SpatialLanes.MOBILE_RIGHT, ease: 'power1.inOut' }, 0.3);
      tl.to(EngineState, { sculptureX: SpatialLanes.MOBILE_RIGHT, sculptureZ: -6, ease: 'power1.inOut' }, 0.5);
      tl.to(EngineState, { sculptureX: SpatialLanes.MOBILE_RIGHT, sculptureZ: -4, ease: 'power1.inOut' }, 0.7);
      tl.to(EngineState, { sculptureX: SpatialLanes.MOBILE_LEFT, ease: 'power1.inOut' }, 0.9);
    });

    return () => {
      mm.revert(); 
    };
  }, [isReducedMotion]);

  return null;
};
