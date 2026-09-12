'use client';

import React, { useRef } from 'react';
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
      // DESKTOP TIMELINE
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      const tl = timelineRef.current;
      
      tl.to(EngineState, {
        sculptureX: -6, cameraZ: 10, sculptureRotY: Math.PI / 4, orbitalNodesOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 0)
      .to(EngineState, {
        sculptureX: -8, sculptureRotX: Math.PI / 2, sculptureRotY: Math.PI, fogDensity: 0.1, orbitalNodesOpacity: 0, fragmentsOpacity: 1, fragmentsScale: 1.5, duration: 1, ease: "power1.inOut"
      }, 1)
      .to(EngineState, {
        sculptureX: 4, sculptureZ: -5, fragmentsScale: 0.1, fragmentsOpacity: 0, orbitalNodesScale: 1, orbitalNodesOpacity: 1, duration: 1, ease: "power2.inOut"
      }, 2)
      .to(EngineState, {
        sculptureX: 6, sculptureY: 2, cameraZ: 6, orbitalNodesOpacity: 0, duration: 1, ease: "power1.inOut"
      }, 3)
      .to(EngineState, {
        sculptureY: 0, sculptureZ: -15, fogDensity: 0.15, duration: 1, ease: "power3.inOut"
      }, 4)
      .to(EngineState, {
        sculptureZ: 0, sculptureRotY: Math.PI * 2, orbitalNodesOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 5)
      .to(EngineState, {
        sculptureX: -6, cameraZ: 12, orbitalNodesOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 6)
      .to(EngineState, {
        sculptureX: 4, sculptureRotX: 0, fragmentsOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 7)
      .to(EngineState, {
        sculptureX: 6, sculptureZ: -2, cameraZ: 8, fragmentsOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 8)
      .to(EngineState, {
        sculptureX: 0, sculptureZ: 0, sculptureRotY: Math.PI * 4, fogDensity: 0.05, fragmentsOpacity: 0, orbitalNodesOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 9);
    });

    mm.add("(max-width: 768px)", () => {
      // MOBILE TIMELINE (Reduced lateral translation, deeper Z-axis)
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      const tl = timelineRef.current;
      
      tl.to(EngineState, {
        sculptureX: -2, cameraZ: 14, sculptureRotY: Math.PI / 4, orbitalNodesOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 0)
      .to(EngineState, {
        sculptureX: -2, sculptureRotX: Math.PI / 2, sculptureRotY: Math.PI, fogDensity: 0.1, orbitalNodesOpacity: 0, fragmentsOpacity: 1, fragmentsScale: 1.5, duration: 1, ease: "power1.inOut"
      }, 1)
      .to(EngineState, {
        sculptureX: 2, sculptureZ: -8, fragmentsScale: 0.1, fragmentsOpacity: 0, orbitalNodesScale: 1, orbitalNodesOpacity: 1, duration: 1, ease: "power2.inOut"
      }, 2)
      .to(EngineState, {
        sculptureX: 2, sculptureY: 2, cameraZ: 10, orbitalNodesOpacity: 0, duration: 1, ease: "power1.inOut"
      }, 3)
      .to(EngineState, {
        sculptureY: 0, sculptureZ: -20, fogDensity: 0.15, duration: 1, ease: "power3.inOut"
      }, 4)
      .to(EngineState, {
        sculptureZ: -4, sculptureRotY: Math.PI * 2, orbitalNodesOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 5)
      .to(EngineState, {
        sculptureX: -2, cameraZ: 16, orbitalNodesOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 6)
      .to(EngineState, {
        sculptureX: 2, sculptureRotX: 0, fragmentsOpacity: 1, duration: 1, ease: "power1.inOut"
      }, 7)
      .to(EngineState, {
        sculptureX: 2, sculptureZ: -5, cameraZ: 12, fragmentsOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 8)
      .to(EngineState, {
        sculptureX: 0, sculptureZ: 0, sculptureRotY: Math.PI * 4, fogDensity: 0.05, fragmentsOpacity: 0, orbitalNodesOpacity: 0, duration: 1, ease: "power2.inOut"
      }, 9);
    });

    return () => {
      mm.revert(); // Revert all matchMedia setups
    };
  }, [isReducedMotion]);

  return null; // Logic only component
};
