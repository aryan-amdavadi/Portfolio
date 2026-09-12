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
    
    // Section 1: Hero -> The Builder
    tl.to(EngineState, {
      sculptureX: -2,
      cameraZ: 10,
      sculptureRotY: Math.PI / 4,
      orbitalNodesOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 0)
    
    // Section 2: The Builder -> The Problems
    .to(EngineState, {
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
      sculptureX: 2,
      sculptureZ: -5,
      fragmentsOpacity: 0,
      orbitalNodesOpacity: 1,
      duration: 1,
      ease: "power2.inOut"
    }, 2)

    // Section 4: The Systems -> Projects
    .to(EngineState, {
      sculptureX: 0,
      sculptureY: 2,
      cameraZ: 6,
      orbitalNodesOpacity: 0,
      artifactsOpacity: 1,
      onStart: () => { EngineState.activeArtifactIndex = 0; },
      onReverseComplete: () => { EngineState.activeArtifactIndex = -1; },
      duration: 1,
      ease: "power1.inOut"
    }, 3)

    // Section 5: Projects -> Thinking
    .to(EngineState, {
      sculptureY: 0,
      sculptureZ: -15, // push way back
      fogDensity: 0.15,
      artifactsOpacity: 0,
      onStart: () => { EngineState.activeArtifactIndex = -1; },
      onReverseComplete: () => { EngineState.activeArtifactIndex = 0; },
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
      sculptureX: -3,
      cameraZ: 12,
      orbitalNodesOpacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 6)

    // Section 8: About -> Currently Building
    .to(EngineState, {
      sculptureX: 3,
      sculptureRotX: 0,
      fragmentsOpacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 7)

    // Section 9: Currently Building -> Code
    .to(EngineState, {
      sculptureX: 0,
      sculptureZ: -2,
      cameraZ: 8,
      fragmentsOpacity: 0,
      artifactsOpacity: 1,
      onStart: () => { EngineState.activeArtifactIndex = 2; },
      onReverseComplete: () => { EngineState.activeArtifactIndex = -1; },
      duration: 1,
      ease: "power2.inOut"
    }, 8)

    // Section 10: Code -> Connect
    .to(EngineState, {
      sculptureRotY: Math.PI * 4,
      fogDensity: 0.05, // return to baseline
      artifactsOpacity: 0,
      onStart: () => { EngineState.activeArtifactIndex = -1; },
      onReverseComplete: () => { EngineState.activeArtifactIndex = 2; },
      duration: 1,
      ease: "power2.inOut"
    }, 9);

    return () => {
      tl.kill();
    };
  }, [isReducedMotion]);

  return null; // Logic only component
};
