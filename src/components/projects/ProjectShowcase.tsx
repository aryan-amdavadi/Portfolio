'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { Button } from '../ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import DepthCarousel, { DepthCarouselItem } from '../layout/DepthCarousel';

export const ProjectShowcase: React.FC = () => {
  const exploreCursor = useCursorHandlers('explore');
  const externalCursor = useCursorHandlers('external');

  const carouselItems = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      image: `/images/projects/${project.id.toLowerCase()}.jpg`,
      alt: `${project.title} conceptual visualization`
    }));
  }, []);

  type ProjectCarouselItem = DepthCarouselItem & {
    title: string;
    role: string;
    problem: string;
    technology: string[];
    caseStudyRoute?: string;
    liveUrl?: string;
    githubUrl?: string;
  };

  const renderOverlay = (item: DepthCarouselItem, isActive: boolean) => {
    const proj = item as ProjectCarouselItem;
    // Only render full interactive content if active, otherwise maybe just title or nothing.
    // The depth carousel will automatically handle opacity of non-active items, but we want 
    // pointer-events to be handled as well.
    return (
      <div className={`project-card ${isActive ? 'is-active' : ''}`} style={{ width: '100%', height: '100%', pointerEvents: isActive ? 'auto' : 'none' }}>
        <div className="project-meta">
          <h3 className="project-title">{proj.title}</h3>
          <span className="project-role">{proj.role}</span>
          <div className="project-tech">
            {proj.technology?.map((tech: string) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
        
        <div className="project-details" style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <p className="project-desc">
            <strong>System:</strong> {proj.problem}
          </p>

          <div className="project-links mt-4">
            {proj.caseStudyRoute && (
              <Link href={proj.caseStudyRoute} {...exploreCursor} tabIndex={isActive ? 0 : -1}>
                <Button variant="primary">EXPLORE SYSTEM</Button>
              </Link>
            )}
            {proj.liveUrl && (
              <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Live demo for ${proj.title}`} {...externalCursor} tabIndex={isActive ? 0 : -1}>
                <Button variant="outline">LIVE</Button>
              </a>
            )}
            {proj.githubUrl && (
              <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${proj.title}`} {...externalCursor} tabIndex={isActive ? 0 : -1}>
                <Button variant="outline">SOURCE</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="project-showcase" style={{ width: '100%', height: '600px', position: 'relative' }}>
      <DepthCarousel 
        items={carouselItems} 
        renderOverlay={renderOverlay} 
        cardWidth={350} 
        cardHeight={450} 
        depth={250}
        tilt={15}
        showIndicators={false}
      />
    </div>
  );
};
