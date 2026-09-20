'use client';

import { useEffect, useRef } from 'react';
import { SceneDirector } from './engine/SceneDirector';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { experienceStore } from '@/store/ExperienceStore';

export default function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directorRef = useRef<SceneDirector | null>(null);
  const tier = useDeviceTier();
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    if (tier === 0) {
      // If Tier 0, WebGL is skipped. Mark as ready immediately so loading screen progresses.
      experienceStore.setWebglReady();
      return;
    }
    
    if (!canvasRef.current) return;

    directorRef.current = new SceneDirector(canvasRef.current, tier);
    directorRef.current.start();
    
    // Mark WebGL as initialized in the global experience store
    experienceStore.setWebglReady();

    const onPointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      directorRef.current?.updateState({ pointer: { x, y } });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      directorRef.current?.dispose();
      directorRef.current = null;
    };
  }, [tier]);

  useEffect(() => {
    if (directorRef.current) {
      directorRef.current.updateState({ isReducedMotion });
    }
  }, [isReducedMotion]);

  if (tier === 0) {
    // Fallback static CSS/SVG background for Tier 0
    return <div className="layer-canvas fallback-background" />;
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="layer-canvas" 
      aria-hidden="true" 
    />
  );
}
