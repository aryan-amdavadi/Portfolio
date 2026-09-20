'use client';

import React, { useState, useMemo } from 'react';
import { projects } from '@/data/projects';

export const InteractiveToolset: React.FC = () => {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  // Extract all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(p => p.technology.forEach(t => techSet.add(t)));
    return Array.from(techSet).sort();
  }, []);

  return (
    <div className="interactive-toolset">
      <div className="toolset-layout">
        
        {/* Technologies Grid */}
        <div className="tech-grid">
          <span className="typography-technical text-muted mb-4" style={{ display: 'block' }}>TECHNOLOGIES</span>
          <div className="tech-tags">
            {allTechnologies.map(tech => {
              const isActive = activeTech === tech;
              return (
                <button
                  key={tech}
                  className={`tech-tag-btn ${isActive ? 'active' : ''} ${activeTech && !isActive ? 'dimmed' : ''}`}
                  data-cursor="explore"
                  onMouseEnter={() => {
                    setActiveTech(tech);
                  }}
                  onMouseLeave={() => {
                    setActiveTech(null);
                  }}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Associated Projects Grid */}
        <div className="tech-projects">
          <span className="typography-technical text-muted mb-4" style={{ display: 'block' }}>SYSTEMS BUILT</span>
          <div className="project-list">
            {projects.map(project => {
              // Highlight if this project uses the active tech
              const isHighlighted = activeTech ? project.technology.includes(activeTech) : false;
              // Dim if there is an active tech, but this project doesn't use it
              const isDimmed = activeTech ? !isHighlighted : false;

              return (
                <div 
                  key={project.id} 
                  className={`tech-project-item ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
                >
                  <h4 className="typography-h4">{project.title}</h4>
                  <p className="typography-body mt-2 text-muted">{project.solution}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
