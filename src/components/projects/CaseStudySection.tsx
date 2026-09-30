import React from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

interface CaseStudySectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({ number, title, children }) => {
  return (
    <section className="flex flex-col gap-6">
      <ScrollReveal baseRotation={2} blurStrength={5} baseOpacity={0}>
        <h2 className="font-technical text-sm tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-4">
          <span className="text-primary">{number}</span>
          <span className="w-8 h-px bg-border" />
          <span>{title}</span>
        </h2>
      </ScrollReveal>
      <div className="flex flex-col gap-6 w-full">
        {children}
      </div>
    </section>
  );
};
