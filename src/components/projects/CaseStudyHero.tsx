'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { ScrollReveal } from '@/components/text/ScrollReveal';
import { TechnologyEvidence } from '@/components/projects/TechnologyEvidence';
import { ProjectLinks } from '@/components/projects/ProjectLinks';
import { ProjectSystemVisual } from '@/components/projects/ProjectSystemVisual';

interface CaseStudyHeroProps {
  project: Project;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ project }) => {
  const isProduction = Boolean(project.liveUrl && project.liveUrl !== '#' && !project.liveUrl.includes('localhost'));

  return (
    <header className="cs-hero">
      {/* Editorial Breadcrumb Navigation */}
      <div className="cs-breadcrumb-nav">
        <Link href="/#work" className="cs-back-link" aria-label="Return to all projects">
          <span className="cs-back-arrow" aria-hidden="true">←</span>
          <span>BACK TO ALL WORK</span>
        </Link>
      </div>

      <ScrollReveal baseOpacity={0} blurStrength={6} baseRotation={1}>
        <div className="cs-hero-header">
          <div className="cs-category-row">
            <span className="cs-category-badge">
              {project.category}
            </span>
            <span className="cs-index-stamp">
              {`REC // 0${project.artifactIndex + 1}`}
            </span>
          </div>

          <h1 className="cs-title">
            {project.title}
          </h1>

          <p className="cs-tagline">
            {project.solution || project.problem}
          </p>
        </div>
      </ScrollReveal>

      {/* Engineering Atlas Architectural System Map (Image-Free) */}
      <div className="cs-hero-system-visual">
        <ProjectSystemVisual project={project} />
      </div>

      {/* Engineering Metadata Grid */}
      <div className="cs-meta-grid">
        <div className="cs-meta-item">
          <span className="cs-meta-label">ROLE</span>
          <span className="cs-meta-value">{project.role}</span>
        </div>

        <div className="cs-meta-item">
          <span className="cs-meta-label">STATUS</span>
          <span className="cs-meta-value cs-status-indicator">
            <span className="cs-status-dot" />
            {isProduction ? 'Production Active' : 'Completed / Prototype'}
          </span>
        </div>

        <div className="cs-meta-item">
          <span className="cs-meta-label">SOURCE / ACCESS</span>
          <div className="cs-meta-value">
            <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
          </div>
        </div>

        <div className="cs-meta-item">
          <span className="cs-meta-label">CORE STACK</span>
          <div className="cs-meta-value">
            <TechnologyEvidence technologies={project.technology.slice(0, 4)} />
          </div>
        </div>
      </div>
    </header>
  );
};
