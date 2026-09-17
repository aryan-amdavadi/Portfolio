'use client';

import dynamic from 'next/dynamic';

const GhostFibers = dynamic(() => import('./GhostFibers'), { ssr: false });

export const GhostFibersBackground = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, pointerEvents: 'none', opacity: 0.15 }}>
      <GhostFibers 
        speed={0.1}
        lineColor="#3437A0"
        glowColor="#140E35"
        layers={3}
        brightness={1.5}
        vignette={1.0}
        lineSharpness={12}
        grain={0.02}
      />
    </div>
  );
};
