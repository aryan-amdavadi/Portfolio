'use client';

import { useEffect, useRef } from 'react';
import { SceneDirector } from './engine/SceneDirector';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directorRef = useRef<SceneDirector | null>(null);
  const tier = useDeviceTier();
  const scrollProgress = useScrollProgress();
  const isReducedMotion = useReducedMotion();

  // Initialize and dispose SceneDirector based on hardware tier
  useEffect(() => {
    if (tier === 0 || !canvasRef.current) return;

    directorRef.current = new SceneDirector(canvasRef.current);
    directorRef.current.start();

    const onPointerMove = (e: PointerEvent) => {
      // Normalize pointer coordinates (-1 to +1)
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

  // Sync scroll progress and reduced motion state via the bridge (no react re-renders inside canvas)
  useEffect(() => {
    if (directorRef.current) {
      directorRef.current.updateState({ scrollProgress, isReducedMotion });
    }
  }, [scrollProgress, isReducedMotion]);

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
