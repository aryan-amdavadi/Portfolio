'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { useCursorHandlers } from '@/hooks/useCursorState';
import './ProjectShowcase.css';

export const ProjectShowcase: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartXRef = useRef<number | null>(null);

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

  // Focus management when navigating tabs with keyboard
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % totalProjects;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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

  // Touch swipe support for mobile stage navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div className="editorial-showcase" aria-label="Engineering Projects Showcase">
      {/* 1. Header Metadata Bar */}
      <div className="editorial-header-bar">
        <div className="editorial-header-title">
          <span className="editorial-header-badge">{'INDEX // REPOSITORY CATALOG'}</span>
        </div>
        <div className="editorial-header-counter">
          <span className="current-num">0{selectedIndex + 1}</span>
          <span className="separator">/</span>
          <span className="total-num">0{totalProjects}</span>
        </div>
      </div>

      {/* 2. Main Active Project Stage (Artwork 58% + Information 42%) */}
      <div 
        className="editorial-stage" 
        role="tabpanel"
        id={`project-panel-${activeProject.id}`}
        aria-labelledby={`project-tab-${activeProject.id}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Column: Dedicated High-Resolution Artwork Stage */}
        <div className="editorial-artwork-panel">
          <div className="artwork-image-container">
            <Image
              key={activeProject.id}
              src={activeProject.image}
              alt={activeProject.alt || `${activeProject.title} architectural visualization`}
              fill
              sizes="(min-width: 1440px) 760px, (min-width: 1024px) 58vw, (min-width: 768px) 90vw, 100vw"
              className="editorial-artwork-img"
              priority
            />
            <div className="artwork-vignette" />
          </div>

          {/* Top Overlays */}
          <div className="artwork-top-bar">
            <span className="artwork-chip">
              {`FIG. 0${selectedIndex + 1} // ARCHITECTURE`}
            </span>
            <span className="artwork-chip technical">
              {activeProject.category.toUpperCase()}
            </span>
          </div>

          {/* Stage Quick Controls */}
          <div className="artwork-stage-controls">
            <button
              onClick={handlePrev}
              className="artwork-nav-btn"
              aria-label="Previous project"
              {...linkCursor}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="btn-label-desktop">PREV</span>
            </button>

            <div className="artwork-progress-indicator" aria-hidden="true">
              {projects.map((_, idx) => (
                <span
                  key={idx}
                  className={`progress-pip ${idx === selectedIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="artwork-nav-btn"
              aria-label="Next project"
              {...linkCursor}
            >
              <span className="btn-label-desktop">NEXT</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Project Information & Actions */}
        <div className="editorial-info-panel">
          <div className="info-top">
            <div className="project-classification">
              <span className="classification-cat">{activeProject.category}</span>
              <span className="classification-sep">•</span>
              <span className="classification-role">{activeProject.role}</span>
            </div>

            <h3 className="editorial-project-title">
              {activeProject.title}
            </h3>
          </div>

          <div className="editorial-statements">
            <div className="statement-block">
              <span className="statement-label">{'PROBLEM STATEMENT //'}</span>
              <p className="statement-text">
                {activeProject.problem}
              </p>
            </div>

            <div className="statement-block">
              <span className="statement-label">{'SYSTEM ARCHITECTURE //'}</span>
              <p className="statement-text">
                {activeProject.solution}
              </p>
            </div>
          </div>

          <div className="editorial-tech-section">
            <span className="tech-section-label">CORE TECHNOLOGIES</span>
            <div className="editorial-tech-grid">
              {activeProject.technology?.map((tech) => (
                <span key={tech} className="editorial-tech-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="editorial-actions-bar">
            <Link
              href={activeProject.caseStudyRoute || `/projects/${activeProject.id}`}
              className="btn btn-primary editorial-primary-cta"
              {...exploreCursor}
            >
              EXPLORE CASE STUDY ↗
            </Link>

            {activeProject.githubUrl && activeProject.githubUrl !== '#' && (
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                aria-label={`Source repository for ${activeProject.title}`}
                {...externalCursor}
              >
                SOURCE ↗
              </a>
            )}

            {activeProject.liveUrl && activeProject.liveUrl !== '#' && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                aria-label={`Live demo for ${activeProject.title}`}
                {...externalCursor}
              >
                LIVE ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Numbered Project Navigator (Editorial Table of Contents) */}
      <nav 
        className="editorial-navigator" 
        role="tablist" 
        aria-label="Project index navigation"
      >
        {projects.map((proj, idx) => {
          const isActive = idx === selectedIndex;
          return (
            <button
              key={proj.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              role="tab"
              id={`project-tab-${proj.id}`}
              aria-controls={`project-panel-${proj.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setSelectedIndex(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`editorial-nav-card ${isActive ? 'active' : ''}`}
              {...linkCursor}
            >
              <div className="nav-card-header">
                <span className="nav-card-num">0{idx + 1}</span>
                <span className="nav-card-indicator" aria-hidden="true" />
              </div>
              <div className="nav-card-title">{proj.title}</div>
              <div className="nav-card-category">{proj.category}</div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
