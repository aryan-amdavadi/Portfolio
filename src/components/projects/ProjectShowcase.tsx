'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectSystemVisual } from './ProjectSystemVisual';
import './ProjectShowcase.css';

export const ProjectShowcase: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isReducedMotion = useReducedMotion();

  const exploreCursor = useCursorHandlers('explore');
  const externalCursor = useCursorHandlers('external');
  const linkCursor = useCursorHandlers('link');

  const activeProject = projects[selectedIndex];
  const totalProjects = projects.length;

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  // Keyboard navigation through project index
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex: number | null = null;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (index + 1) % totalProjects;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (index - 1 + totalProjects) % totalProjects;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = totalProjects - 1;
    }

    if (targetIndex !== null) {
      setSelectedIndex(targetIndex);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div
      className="atlas-showcase"
      aria-label="Engineering Atlas: Project Index and System Schematics"
      style={{
        '--active-project-accent': activeProject.accentColor || 'var(--accent-base)',
        '--active-project-accent-light': activeProject.accentColorLight || 'var(--accent-hover)'
      } as React.CSSProperties}
    >
      {/* 1. ATLAS HEADER / TOP REGISTER */}
      <header className="atlas-header-row">
        <div className="atlas-header-badge-group">
          <span className="atlas-pill">ATLAS REGISTER // 03. THE WORK</span>
          <span className="atlas-badge-divider">/</span>
          <span className="atlas-status-indicator">SYSTEM STATUS: VERIFIED</span>
        </div>

        <div className="atlas-header-counter-group" aria-label={`Project ${selectedIndex + 1} of ${totalProjects}`}>
          <span className="atlas-counter-current">0{selectedIndex + 1}</span>
          <span className="atlas-counter-sep">OF</span>
          <span className="atlas-counter-total">0{totalProjects}</span>

          {/* Restrained Progress Indicator */}
          <div className="atlas-progress-track" aria-hidden="true">
            {projects.map((proj, idx) => (
              <span
                key={proj.id}
                className={`atlas-progress-notch ${idx === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 2. ASYMMETRICAL ATLAS GRID: SLIM INDEX (LEFT) + EXPANSIVE STAGE (RIGHT) */}
      <div className="atlas-grid-container">
        {/* Left Column: Numbered Project Register Index */}
        <aside
          className="atlas-sidebar-index"
          role="tablist"
          aria-label="Project Index Navigation"
        >
          <div className="atlas-index-title">CATALOG INDEX</div>
          {projects.map((proj, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={proj.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                role="tab"
                id={`atlas-tab-${proj.id}`}
                aria-controls={`atlas-panel-${proj.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setSelectedIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`atlas-index-item ${isActive ? 'active' : ''}`}
                {...linkCursor}
              >
                <div className="index-item-num">0{idx + 1}</div>
                <div className="index-item-body">
                  <div className="index-item-title">{proj.title}</div>
                  <div className="index-item-category">{proj.category}</div>
                </div>
                <div className="index-item-status" aria-hidden="true">
                  <span className="index-pip" />
                </div>
              </button>
            );
          })}

          {/* Quick Prev / Next Navigator on sidebar */}
          <div className="atlas-sidebar-controls">
            <button
              type="button"
              onClick={handlePrev}
              className="atlas-ctrl-btn"
              aria-label="Previous project in catalog"
              {...linkCursor}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>PREV</span>
            </button>
            <span className="atlas-ctrl-sep" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={handleNext}
              className="atlas-ctrl-btn"
              aria-label="Next project in catalog"
              {...linkCursor}
            >
              <span>NEXT</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Right Column: Active Project Main Stage */}
        <main
          className="atlas-main-stage"
          role="tabpanel"
          id={`atlas-panel-${activeProject.id}`}
          aria-labelledby={`atlas-tab-${activeProject.id}`}
        >
          {/* Top Stage Registration Info */}
          <div className="stage-top-register">
            <div className="stage-category-stamp">
              <span className="category-code">CLASS:</span>
              <span className="category-val">{activeProject.category}</span>
              <span className="stamp-bullet">{'//'}</span>
              <span className="role-code">ROLE:</span>
              <span className="role-val">{activeProject.role}</span>
            </div>
            <div className="stage-ref-tag">
              REF // 0{selectedIndex + 1}-ENG
            </div>
          </div>

          {/* Enormous Typographic Identity */}
          <div className="stage-identity-block">
            <h3 className={`stage-project-name ${isReducedMotion ? 'no-motion' : ''}`}>
              {activeProject.title}
            </h3>
            <div className="stage-hairline-rule" />
          </div>

          {/* Bespoke Image-Free System Visualizer */}
          <div className="stage-visual-wrapper">
            <ProjectSystemVisual key={activeProject.id} project={activeProject} />
          </div>

          {/* Engineering Dossier: Technical Findings, Solutions & Core Stack */}
          <div className="stage-dossier-grid">
            <div className="dossier-column problem-column">
              <div className="dossier-heading">PROBLEM CONSTRAINT //</div>
              <p className="dossier-text">{activeProject.problem}</p>
            </div>

            <div className="dossier-column solution-column">
              <div className="dossier-heading">ENGINEERING APPROACH //</div>
              <p className="dossier-text">{activeProject.solution}</p>
            </div>
          </div>

          {/* Core Technologies Specification */}
          <div className="stage-tech-specification">
            <span className="tech-spec-label">SPECIFICATION // STACK:</span>
            <div className="tech-chips-list">
              {activeProject.technology?.map((tech) => (
                <span key={tech} className="tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="stage-actions-bar">
            <Link
              href={activeProject.caseStudyRoute || `/projects/${activeProject.id}`}
              className="btn btn-primary stage-cta-primary"
              {...exploreCursor}
            >
              <span>INSPECT CASE STUDY</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </Link>

            {activeProject.githubUrl && activeProject.githubUrl !== '#' && (
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline stage-cta-secondary"
                aria-label={`Source repository for ${activeProject.title}`}
                {...externalCursor}
              >
                <span>SOURCE REPOSITORY</span>
                <span className="cta-arrow" aria-hidden="true">↗</span>
              </a>
            )}

            {activeProject.liveUrl && activeProject.liveUrl !== '#' && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline stage-cta-secondary"
                aria-label={`Live deployment for ${activeProject.title}`}
                {...externalCursor}
              >
                <span>LIVE SYSTEM</span>
                <span className="cta-arrow" aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
