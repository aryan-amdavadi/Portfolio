'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import { Button } from '../ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import './ProjectShowcase.css';

gsap.registerPlugin(ScrollTrigger);

export const ProjectShowcase: React.FC = () => {
  const exploreCursor = useCursorHandlers('explore');
  const externalCursor = useCursorHandlers('external');
  const containerRef = useRef<HTMLDivElement>(null);

  const displayProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      image: `/images/projects/${project.id.toLowerCase()}.jpg`,
      alt: `${project.title} conceptual visualization`
    }));
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray('.project-stage') as HTMLElement[];
      
      stages.forEach((stage: HTMLElement) => {
        const visual = stage.querySelector('.project-visual img');
        
        // Main stage transformation
        gsap.to(stage, {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stage,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
          }
        });

        // Subtitle visual parallax/rotation
        if (visual) {
          gsap.fromTo(visual, 
            { scale: 1.05, rotation: -2 },
            { 
              scale: 1,
              rotation: 2,
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="project-showcase" ref={containerRef}>
      {displayProjects.map((proj) => (
        <div key={proj.id} className="project-stage">
          <div className="project-stage-content">
            <div className="project-info">
              <span className="project-role">{proj.role}</span>
              <h3 className="project-title">{proj.title}</h3>
              
              <div className="project-tech">
                {proj.technology?.map((tech: string) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <p className="project-desc mt-4">
                <strong>System:</strong> {proj.problem}
              </p>

              <div className="project-links mt-6">
                {proj.caseStudyRoute && (
                  <Link href={proj.caseStudyRoute} {...exploreCursor}>
                    <Button variant="primary">EXPLORE SYSTEM</Button>
                  </Link>
                )}
                {proj.liveUrl && proj.liveUrl !== '#' && (
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Live demo for ${proj.title}`} {...externalCursor}>
                    <Button variant="outline">LIVE</Button>
                  </a>
                )}
                {proj.githubUrl && proj.githubUrl !== '#' && (
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${proj.title}`} {...externalCursor}>
                    <Button variant="outline">SOURCE</Button>
                  </a>
                )}
              </div>
            </div>

            <div className="project-visual">
              <Image 
                src={proj.image} 
                alt={proj.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
