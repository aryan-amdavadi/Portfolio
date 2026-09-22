import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';

interface CaseStudyNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export const CaseStudyNavigation: React.FC<CaseStudyNavigationProps> = ({ prevProject, nextProject }) => {
  return (
    <nav className="case-study-nav" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginTop: '10vh', 
      paddingTop: 'var(--space-6)', 
      borderTop: '1px solid var(--border)',
      flexWrap: 'wrap',
      gap: 'var(--space-4)'
    }}>
      {prevProject ? (
        <Link href={prevProject.caseStudyRoute || `/projects/${prevProject.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          ← PREVIOUS: {prevProject.title.toUpperCase()}
        </Link>
      ) : <div style={{ width: '150px' }} />}

      <Link href="/#work" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        BACK TO WORK
      </Link>

      {nextProject ? (
        <Link href={nextProject.caseStudyRoute || `/projects/${nextProject.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          NEXT: {nextProject.title.toUpperCase()} →
        </Link>
      ) : <div style={{ width: '150px' }} />}
    </nav>
  );
};
