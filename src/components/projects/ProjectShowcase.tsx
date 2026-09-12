'use client';

import React from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { EngineState } from '@/canvas/engine/EngineState';
import { Button } from '../ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';

export const ProjectShowcase: React.FC = () => {
  const exploreCursor = useCursorHandlers('explore');
  const externalCursor = useCursorHandlers('external');

  const handleMouseEnter = (index: number) => {
    // eslint-disable-next-line react-hooks/immutability
    EngineState.activeArtifactIndex = index;
    // eslint-disable-next-line react-hooks/immutability
    EngineState.artifactsOpacity = 1;
  };

  const handleMouseLeave = () => {
    // eslint-disable-next-line react-hooks/immutability
    EngineState.activeArtifactIndex = -1;
    // eslint-disable-next-line react-hooks/immutability
    EngineState.artifactsOpacity = 0;
  };

  return (
    <div className="project-showcase" onMouseLeave={handleMouseLeave}>
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="project-card"
          onMouseEnter={() => {
            handleMouseEnter(project.artifactIndex);
            exploreCursor.onMouseEnter();
          }}
          onMouseLeave={() => {
            // showcase wrapper already handles mouseleave, but we can call cursor cleanup
            exploreCursor.onMouseLeave();
          }}
        >
          <div className="project-meta">
            <h3 className="project-title">{project.title}</h3>
            <span className="project-role">{project.role}</span>
            <div className="project-tech">
              {project.technology.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
          
          <div className="project-details">
            <p className="project-desc">
              <strong>Problem:</strong> {project.problem}
            </p>
            <p className="project-desc mt-4">
              <strong>Solution:</strong> {project.solution}
            </p>

            <div className="project-links">
              {project.caseStudyRoute && (
                <Link href={project.caseStudyRoute} {...exploreCursor}>
                  <Button variant="primary">CASE STUDY</Button>
                </Link>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" {...externalCursor}>
                  <Button variant="outline">LIVE</Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" {...externalCursor}>
                  <Button variant="outline">GITHUB</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
