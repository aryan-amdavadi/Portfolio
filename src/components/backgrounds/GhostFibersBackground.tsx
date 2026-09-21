'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GhostFibers = dynamic(() => import('./GhostFibers'), { ssr: false });

export const GhostFibersBackground = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };
    
    // Initial check
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      setTimeout(() => setTheme('light'), 0);
    }

    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themechange', handleThemeChange as EventListener);
  }, []);

  const isLight = theme === 'light';

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
      <GhostFibers 
        speed={0.2}
        lineColor={isLight ? "#606C38" : "#A8B1FF"}
        glowColor={isLight ? "#283618" : "#3437A0"}
        layers={isLight ? 2 : 3}
        brightness={isLight ? 1.0 : 2.0}
        vignette={isLight ? 0.4 : 0.8}
        lineSharpness={isLight ? 8 : 12}
        grain={isLight ? 0.01 : 0.02}
        lightMode={isLight}
      />
    </div>
  );
};
