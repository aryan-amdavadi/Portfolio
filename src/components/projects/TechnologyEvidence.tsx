'use client';

import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface TechnologyEvidenceProps {
  technologies: string[];
}

export const TechnologyEvidence: React.FC<TechnologyEvidenceProps> = ({ technologies }) => {
  return (
    <div className="cs-tech-tags-group">
      {technologies.map((tech) => (
        <ScrollReveal
          key={tech}
          baseOpacity={0}
          baseRotation={1}
          blurStrength={2}
        >
          <span className="cs-tech-tag">
            {tech}
          </span>
        </ScrollReveal>
      ))}
    </div>
  );
};
