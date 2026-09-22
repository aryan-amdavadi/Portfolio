import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface CaseStudySectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({ number, title, children }) => {
  return (
    <section className="cs-section" style={{ marginBottom: 'var(--space-12)', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
      <ScrollReveal baseRotation={2} blurStrength={5} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
        <h2 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
          {number} — {title}
        </h2>
      </ScrollReveal>
      <div className="cs-content" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text)' }}>
        {children}
      </div>
    </section>
  );
};
