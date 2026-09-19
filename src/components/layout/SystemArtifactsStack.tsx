'use client';

import React, { useMemo } from 'react';
import Stack from './Stack';
import { projects } from '@/data/projects';
import Image from 'next/image';
import { useCursorHandlers } from '@/hooks/useCursorState';

export const SystemArtifactsStack = () => {
  const inspectCursor = useCursorHandlers('inspect');

  const cards = useMemo(() => {
    // Only use a subset or all projects that have visual representations
    return projects.map((project) => (
      <div 
        key={project.id} 
        className="stack-artifact-card"
        {...inspectCursor}
      >
        <Image
          src={`/images/projects/${project.id.toLowerCase()}.jpg`}
          alt={`${project.title} conceptual artifact`}
          fill
          style={{ objectFit: 'cover' }}
          className="stack-artifact-img"
        />
        <div className="stack-artifact-overlay">
          <h4 className="stack-artifact-title">{project.title}</h4>
          <span className="stack-artifact-role">{project.role}</span>
          <div className="stack-artifact-tech">
            {project.technology.slice(0, 3).map(tech => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [inspectCursor]);

  return (
    <div className="system-artifacts-container">
      <div className="system-artifacts-header">
        <h3 className="section-title" style={{ marginTop: '0' }}>SYSTEM ARTIFACTS</h3>
        <p className="section-description">Conceptual representations of core architectural structures.</p>
      </div>
      <div className="system-artifacts-stack">
        <Stack 
          cards={cards} 
          randomRotation={true}
          sensitivity={150}
          sendToBackOnClick={true}
        />
      </div>
    </div>
  );
};
