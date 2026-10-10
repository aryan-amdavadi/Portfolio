'use client';

import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface CaseStudySectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({ number, title, children, id }) => {
  return (
    <section className="cs-section" id={id}>
      <ScrollReveal baseRotation={1} blurStrength={4} baseOpacity={0}>
        <div className="cs-section-header">
          <span className="cs-section-index">{number}</span>
          <span className="cs-section-divider" aria-hidden="true" />
          <h2 className="cs-section-title">{title}</h2>
        </div>
      </ScrollReveal>
      <div>
        {children}
      </div>
    </section>
  );
};
