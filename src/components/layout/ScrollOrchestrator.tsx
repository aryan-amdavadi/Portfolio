'use client';

import { useEffect, useRef } from 'react';
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
    EngineState.fragmentsOpacity = 0;
    EngineState.artifactsOpacity = 0;
    EngineState.activeArtifactIndex = -1;

    // Create master ScrollTrigger timeline that controls the proxy EngineState object
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: '#main-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing (1 second delay for smoothness)
      }
    });

    const tl = timelineRef.current;
    
    // We'll map the total scroll duration (e.g. 100%) across the sections
    // Section 1: Hero -> The Builder
    tl.to(EngineState, {
      sculptureX: -6, // Push further left off-screen to make room
      cameraZ: 10,
      sculptureRotY: Math.PI / 4,
      orbitalNodesOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 0)
    
    // Section 2: The Builder -> The Problems
    .to(EngineState, {
      sculptureX: -8, // Slide even further away
      sculptureRotX: Math.PI / 2,
      sculptureRotY: Math.PI,
      fogDensity: 0.1,
      orbitalNodesOpacity: 0,
      fragmentsOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 1)

    // Section 3: The Problems -> The Systems
    .to(EngineState, {
      sculptureX: 4, // Slide in from the right
      sculptureZ: -5,
      fragmentsOpacity: 0,
      orbitalNodesOpacity: 1,
      duration: 1,
      ease: "power2.inOut"
    }, 2)

    // Section 4: The Systems -> Projects
    .to(EngineState, {
      sculptureX: 6, // Slide out to the right
      sculptureY: 2,
      cameraZ: 6,
      orbitalNodesOpacity: 0,
      artifactsOpacity: 1,
      onStart: () => { EngineState.activeArtifactIndex = 0; }, // set active, no reset needed
      duration: 1,
      ease: "power1.inOut"
    }, 3)

    // Section 5: Projects -> Thinking
    .to(EngineState, {
      sculptureY: 0,
      sculptureZ: -15, // push way back
      fogDensity: 0.15,
      artifactsOpacity: 0,
      // Removed instant -1 reset to fix popping
      duration: 1,
      ease: "power3.inOut"
    }, 4)

    // Section 6: Thinking -> Toolset
    .to(EngineState, {
      sculptureZ: 0,
      sculptureRotY: Math.PI * 2,
      orbitalNodesOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 5)

    // Section 7: Toolset -> About
    .to(EngineState, {
      sculptureX: -6, // Slide left
      cameraZ: 12,
      orbitalNodesOpacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 6)

    // Section 8: About -> Currently Building
    .to(EngineState, {
      sculptureX: 4, // Slide right
      sculptureRotX: 0,
      fragmentsOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 7)

    // Section 9: Currently Building -> Code
    .to(EngineState, {
      sculptureX: 6, // Slide out
      sculptureZ: -2,
      cameraZ: 8,
      fragmentsOpacity: 0,
      artifactsOpacity: 1,
      onStart: () => { EngineState.activeArtifactIndex = 2; },
      duration: 1,
      ease: "power2.inOut"
    }, 8)

    // Section 10: Code -> Connect
    .to(EngineState, {
      sculptureX: 0, // Return center
      sculptureRotY: Math.PI * 4,
      fogDensity: 0.05, 
      artifactsOpacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 9);

    return () => {
      tl.kill();
    };
  }, [isReducedMotion]);

  return null; // Logic only component
};
