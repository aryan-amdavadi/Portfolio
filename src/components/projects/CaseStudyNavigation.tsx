'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';

interface CaseStudyNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export const CaseStudyNavigation: React.FC<CaseStudyNavigationProps> = ({ prevProject, nextProject }) => {
  return (
    <nav className="cs-nav-container" aria-label="Project Case Study Navigation">
      {prevProject ? (
        <Link
          href={prevProject.caseStudyRoute || `/projects/${prevProject.id}`}
          className="cs-nav-link"
          aria-label={`Previous project: ${prevProject.title}`}
        >
          <span className="cs-nav-direction">← PREVIOUS CASE STUDY</span>
          <span className="cs-nav-project-title">{prevProject.title}</span>
        </Link>
      ) : (
        <div />
      )}

      <div className="cs-nav-center-group">
        <Link
          href="/#work"
          className="cs-nav-center-link"
          aria-label="Return to showcase on homepage"
        >
          SHOWCASE
        </Link>
        <span className="cs-nav-center-sep" aria-hidden="true">•</span>
        <Link
          href="/projects"
          className="cs-nav-center-link"
          aria-label="View all projects archive directory"
        >
          ALL PROJECTS
        </Link>
      </div>

      {nextProject ? (
        <Link
          href={nextProject.caseStudyRoute || `/projects/${nextProject.id}`}
          className="cs-nav-link next"
          aria-label={`Next project: ${nextProject.title}`}
        >
          <span className="cs-nav-direction">NEXT CASE STUDY →</span>
          <span className="cs-nav-project-title">{nextProject.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
};
