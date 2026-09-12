import { useState, useEffect } from 'react';

/**
 * 0: No WebGL / Battery Saver / Reduced Motion
 * 1: Mobile Smartphones (DPR 1.0, simple geometry)
 * 2: Mid-range / Tablet (Max DPR 1.5, balanced geometry)
 * 3: High-end Desktop (Full 3D, complex shaders, high-poly)
 */
export type DeviceTier = 0 | 1 | 2 | 3;

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(3); // Assume best, degrade gracefully

  useEffect(() => {
    const detectTier = () => {
      // 1. Check for reduced motion preference (Tier 0 immediately)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return 0;
      }

      // 2. Check memory / concurrency limits (rough proxy for mobile/low-end)
      const cores = navigator.hardwareConcurrency || 2;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const memory = (navigator as any).deviceMemory || 2; // in GB
      const isMobile = window.matchMedia('(max-width: 768px)').matches || /Mobi|Android/i.test(navigator.userAgent);

      if (cores <= 2 || memory <= 2) {
        return 1; // Low-end device
      }

      if (isMobile) {
        return 1; // Force mobile to Tier 1 for battery/thermal reasons
      }

      if (cores <= 4 || memory <= 4) {
        return 2; // Mid-range
      }

      return 3; // High-end
    };

    // eslint-disable-next-line
    setTier(detectTier());
  }, []);

  return tier;
}
