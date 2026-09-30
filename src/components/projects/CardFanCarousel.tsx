'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Project } from '@/data/projects';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CardFanCarouselProps {
  projects: Project[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const CardFanCarousel: React.FC<CardFanCarouselProps> = ({ projects, activeIndex, onIndexChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isReducedMotion = useReducedMotion();
  const exploreCursor = useCursorHandlers('explore');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const baseRotationGap = isMobile ? 8 : 12;
      const hoverSpread = isHovered && !isReducedMotion ? (isMobile ? 12 : 18) : baseRotationGap;
      
      projects.forEach((_, i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        let diff = i - activeIndex;
        const half = Math.floor(projects.length / 2);
        
        if (diff > half) diff -= projects.length;
        if (diff < -half) diff += projects.length;

        const isActive = diff === 0;
        
        const targetRotation = diff * hoverSpread;
        const targetY = Math.abs(diff) * (isMobile ? 10 : 20);
        const targetX = diff * (isMobile ? 20 : 40);
        const targetScale = isActive ? 1 : 1 - (Math.abs(diff) * 0.05);
        const targetZIndex = 50 - Math.abs(diff);
        const targetOpacity = Math.abs(diff) > 2 ? 0 : 1;

        gsap.to(card, {
          rotation: targetRotation,
          y: targetY,
          x: targetX,
          scale: targetScale,
          opacity: targetOpacity,
          zIndex: targetZIndex,
          duration: isReducedMotion ? 0 : 0.6,
          ease: 'power3.out',
          transformOrigin: '50% 150%',
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [activeIndex, isHovered, projects, isReducedMotion]);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current, 
        { y: 300, opacity: 0, rotation: (i) => (i - activeIndex) * 30 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: 'elastic.out(1, 0.5)',
          clearProps: 'y'
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = useCallback(() => {
    onIndexChange((activeIndex + 1) % projects.length);
  }, [activeIndex, onIndexChange, projects.length]);

  const handlePrev = useCallback(() => {
    onIndexChange((activeIndex - 1 + projects.length) % projects.length);
  }, [activeIndex, onIndexChange, projects.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-full h-[60vh] max-h-[600px] perspective-1000"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...exploreCursor}
      aria-label="Project carousel. Use left and right arrow keys to navigate."
    >
      <div className="relative w-full max-w-[320px] aspect-[4/5] mx-auto z-10" aria-roledescription="carousel">
        {projects.map((proj, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={proj.id}
              ref={el => { cardsRef.current[i] = el; }}
              className="absolute inset-0 cursor-pointer will-change-transform rounded-2xl overflow-hidden border border-border shadow-2xl bg-card transition-colors"
              onClick={() => {
                if (!isActive) onIndexChange(i);
              }}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <Image 
                src={proj.image} 
                alt={proj.alt}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover pointer-events-none"
                priority={isActive || Math.abs(i - activeIndex) === 1}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1 pointer-events-none text-white">
                <span className="text-xs tracking-widest font-technical opacity-80 uppercase">{proj.category}</span>
                <h3 className="text-2xl font-display uppercase leading-none">{proj.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 z-50 flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-background/50 backdrop-blur-md border border-border hover:bg-muted transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="Previous project"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <div className="flex gap-2" role="tablist">
          {projects.map((proj, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to ${proj.title}`}
              onClick={() => onIndexChange(i)}
              className={`w-2 h-2 rounded-full transition-all focus:ring-2 focus:ring-primary focus:outline-none ${i === activeIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-background/50 backdrop-blur-md border border-border hover:bg-muted transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="Next project"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
