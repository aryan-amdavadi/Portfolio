import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface TechnologyEvidenceProps {
  technologies: string[];
}

export const TechnologyEvidence: React.FC<TechnologyEvidenceProps> = ({ technologies }) => {
  return (
    <div className="cs-technology" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
      {technologies.map((tech) => (
        <ScrollReveal 
          key={tech} 
          baseOpacity={0} 
          baseRotation={2}
          blurStrength={2} 
          containerClassName="tech-tag-reveal"
        >
          <span style={{
            display: 'inline-block',
            padding: '8px 16px',
            fontSize: '0.85rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--text-secondary)'
          }}>
            {tech}
          </span>
        </ScrollReveal>
      ))}
    </div>
  );
};
