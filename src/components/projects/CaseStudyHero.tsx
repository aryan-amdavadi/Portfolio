'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { ScrollReveal } from '@/components/text/ScrollReveal';
import { TechnologyEvidence } from '@/components/projects/TechnologyEvidence';
import { ProjectLinks } from '@/components/projects/ProjectLinks';

interface CaseStudyHeroProps {
  project: Project;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ project }) => {
  const isProduction = Boolean(project.liveUrl && project.liveUrl !== '#' && !project.liveUrl.includes('localhost'));

  return (
    <header className="cs-hero">
      {/* Breadcrumb / Back link */}
      <div className="cs-breadcrumb-nav">
        <Link href="/#work" className="cs-back-link" aria-label="Return to all projects">
          ← BACK TO ALL WORK
        </Link>
      </div>

      <ScrollReveal baseOpacity={0} blurStrength={6} baseRotation={1}>
        <div className="cs-hero-header">
          <span className="cs-category-badge">
            {project.category}
          </span>
          <h1 className="cs-title">
            {project.title}
          </h1>
          <p className="cs-tagline">
            {project.solution || project.problem}
          </p>
        </div>
      </ScrollReveal>

      {/* Prominent Art-Directed Project Artwork */}
      {project.image && (
        <div className="cs-hero-artwork-frame">
          <Image
            src={project.image}
            alt={project.alt || `${project.title} technical architecture and project visual`}
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            priority
            className="cs-hero-image"
          />
          <div className="cs-hero-artwork-overlay" />
        </div>
      )}

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
