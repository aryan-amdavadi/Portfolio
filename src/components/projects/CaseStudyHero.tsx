import React from 'react';
import { Project } from '@/data/projects';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface CaseStudyHeroProps {
  project: Project;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ project }) => {
  const isProduction = project.liveUrl && project.liveUrl !== '#';

  return (
    <header className="case-study-hero" style={{ marginBottom: 'var(--space-8)' }}>
      <ScrollReveal baseOpacity={0} blurStrength={10} baseRotation={3} containerClassName="cs-hero-reveal">
        <h1 className="cs-hero-title" style={{ fontSize: 'var(--text-6xl)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 'var(--space-4)' }}>
          {project.title}
        </h1>
        
        <p className="cs-hero-description" style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: 'var(--space-6)' }}>
          {project.problem}
        </p>

        <div className="cs-hero-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
          <div className="cs-meta-item">
            <span style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>CATEGORY</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{project.category}</span>
          </div>
          <div className="cs-meta-item">
            <span style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>ROLE</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{project.role}</span>
          </div>
          <div className="cs-meta-item">
            <span style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>STATUS</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              {isProduction ? 'Production' : 'Completed / Prototype'}
            </span>
          </div>
        </div>
      </ScrollReveal>
    </header>
  );
};
