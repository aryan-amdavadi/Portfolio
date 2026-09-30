import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface TechnologyEvidenceProps {
  technologies: string[];
}

export const TechnologyEvidence: React.FC<TechnologyEvidenceProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <ScrollReveal 
          key={tech} 
          baseOpacity={0} 
          baseRotation={2}
          blurStrength={2} 
        >
          <span className="inline-block px-4 py-2 font-technical text-xs tracking-widest text-secondary-foreground bg-muted/50 border border-border rounded-full uppercase">
            {tech}
          </span>
        </ScrollReveal>
      ))}
    </div>
  );
};
