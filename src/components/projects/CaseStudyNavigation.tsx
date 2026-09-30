import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';

interface CaseStudyNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export const CaseStudyNavigation: React.FC<CaseStudyNavigationProps> = ({ prevProject, nextProject }) => {
  return (
    <nav className="w-full flex flex-wrap items-center justify-between gap-6 py-8">
      {prevProject ? (
        <Link 
          href={prevProject.caseStudyRoute || `/projects/${prevProject.id}`} 
          className="font-technical text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors flex-1"
        >
          ← PREV
        </Link>
      ) : <div className="flex-1" />}

      <Link 
        href="/#work" 
        className="font-technical text-sm tracking-widest text-foreground hover:text-primary transition-colors whitespace-nowrap"
      >
        BACK TO WORK
      </Link>

      {nextProject ? (
        <Link 
          href={nextProject.caseStudyRoute || `/projects/${nextProject.id}`} 
          className="font-technical text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors flex-1 text-right"
        >
          NEXT →
        </Link>
      ) : <div className="flex-1" />}
    </nav>
  );
};
