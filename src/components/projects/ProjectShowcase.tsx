'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';
import { Button } from '../ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { CardFanCarousel } from './CardFanCarousel';
import './ProjectShowcase.css';

export const ProjectShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  
  const openCursor = useCursorHandlers('open');
  const viewCursor = useCursorHandlers('view');

  const displayProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      image: `/images/projects/${project.id.toLowerCase()}.jpg`,
      alt: `${project.title} conceptual visualization`
    }));
  }, []);

  const activeProject = displayProjects[activeIndex];
  
  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    
    setIsNavigating(true);
    const route = activeProject.caseStudyRoute || `/projects/${activeProject.id}`;
    
    // Subtle active-card emphasis before routing
    setTimeout(() => {
      router.push(route);
    }, 150); // Very fast, responsive transition
  };

  return (
    <div className="project-showcase">
      
      {/* Visual Entry Point - Carousel */}
      <div className={`project-carousel-container ${isNavigating ? 'navigating' : ''}`}>
        <CardFanCarousel 
          projects={displayProjects} 
          activeIndex={activeIndex} 
          onIndexChange={setActiveIndex} 
        />
      </div>

      {/* Project Information Panel */}
      <div className="project-info-container">
        <div key={activeProject.id} className="project-info-wrapper">
          <div className="project-meta">
            <span className="project-category">
              {activeProject.category}
              <span className="project-category-separator" />
              {activeProject.role}
            </span>
            <h3 className="project-title">
              {activeProject.title}
            </h3>
          </div>

          <p className="project-desc">
            {activeProject.solution || activeProject.problem}
          </p>

          <div className="project-tech">
            {activeProject.technology?.map((tech: string) => (
              <span 
                key={tech} 
                className="tech-tag"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="project-links">
            <Button variant="primary" onClick={handleExplore} className="btn-wrapper" {...openCursor}>
              EXPLORE SYSTEM
            </Button>
            
            {activeProject.liveUrl && activeProject.liveUrl !== '#' && (
              <a 
                href={activeProject.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Live demo for ${activeProject.title}`} 
                {...viewCursor}
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
                {...viewCursor}
              >
                <Button variant="outline">SOURCE</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
