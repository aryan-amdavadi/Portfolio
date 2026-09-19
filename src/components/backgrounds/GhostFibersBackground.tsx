'use client';

import dynamic from 'next/dynamic';

const GhostFibers = dynamic(() => import('./GhostFibers'), { ssr: false });

export const GhostFibersBackground = () => {
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
      <GhostFibers 
        speed={0.2}
        lineColor="#A8B1FF"
        glowColor="#3437A0"
        layers={3}
        brightness={2.0}
        vignette={0.8}
        lineSharpness={12}
        grain={0.02}
      />
    </div>
  );
};
