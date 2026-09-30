'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { Button } from '../ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { CardFanCarousel } from './CardFanCarousel';

export const ProjectShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const exploreCursor = useCursorHandlers('explore');
  const externalCursor = useCursorHandlers('external');

  const displayProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      image: `/images/projects/${project.id.toLowerCase()}.jpg`,
      alt: `${project.title} conceptual visualization`
    }));
  }, []);

  const activeProject = displayProjects[activeIndex];

  return (
    <div className="w-full relative flex flex-col lg:flex-row items-center justify-between min-h-[80vh] gap-12 lg:gap-20 py-20 px-6 max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Visual Entry Point - Carousel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
        <CardFanCarousel 
          projects={displayProjects} 
          activeIndex={activeIndex} 
          onIndexChange={setActiveIndex} 
        />
      </div>

      {/* Project Information Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 order-2 lg:order-1 max-w-xl">
        <div className="flex flex-col gap-2">
          <span className="font-technical text-sm tracking-widest text-muted-foreground uppercase">
            {activeProject.category}
          </span>
          <h3 className="font-display text-4xl lg:text-5xl uppercase leading-none text-foreground">
            {activeProject.title}
          </h3>
        </div>

        <p className="font-body text-lg text-secondary-foreground leading-relaxed">
          {activeProject.problem}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {activeProject.technology?.map((tech: string) => (
            <span 
              key={tech} 
              className="font-technical text-xs px-3 py-1 border border-border rounded-full text-secondary-foreground bg-background/50"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-6 mt-2 border-t border-border">
          {activeProject.caseStudyRoute && (
            <Link href={activeProject.caseStudyRoute} {...exploreCursor}>
              <Button variant="primary">EXPLORE SYSTEM</Button>
            </Link>
          )}
          {activeProject.liveUrl && activeProject.liveUrl !== '#' && (
            <a 
              href={activeProject.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`Live demo for ${activeProject.title}`} 
              {...externalCursor}
            >
              <Button variant="outline">LIVE</Button>
            </a>
          )}
          {activeProject.githubUrl && activeProject.githubUrl !== '#' && (
            <a 
              href={activeProject.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`GitHub repository for ${activeProject.title}`} 
              {...externalCursor}
            >
              <Button variant="outline">SOURCE</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
