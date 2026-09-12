'use client';

import { useEffect, useRef } from 'react';
import { SceneDirector } from './engine/SceneDirector';
import { useDeviceTier } from '@/hooks/useDeviceTier';

export default function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directorRef = useRef<SceneDirector | null>(null);
  const tier = useDeviceTier();

  useEffect(() => {
    // Graceful degradation: Do not initialize WebGL on Tier 0
    if (tier === 0 || !canvasRef.current) return;

    directorRef.current = new SceneDirector(canvasRef.current);
    directorRef.current.start();

    return () => {
      directorRef.current?.dispose();
      directorRef.current = null;
    };
  }, [tier]);

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
