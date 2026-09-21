'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { Button } from '@/components/ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { ProjectShowcase } from '@/components/projects/ProjectShowcase';
import { MaskedHeading } from '@/components/text/MaskedHeading';
import { SpecularButton } from '@/components/ui/SpecularButton';
import { experienceStore } from '@/store/ExperienceStore';

// Dynamically import heavy WebGL engine to avoid blocking initial render
const WebGLCanvas = dynamic(() => import('@/canvas/WebGLCanvas'), { ssr: false });

export default function Home() {
  const exploreCursor = useCursorHandlers('explore');
  const linkCursor = useCursorHandlers('link');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Report hero layout is mounted and ready for display
    experienceStore.setHeroReady();

    let ctx: gsap.Context;
    let didStart = false;

    const startAnimations = () => {
      if (didStart) return;
      didStart = true;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      ctx = gsap.context(() => {
        // Start with elements invisible
        gsap.set('.hero-fade-up', { y: 20, opacity: 0 });
        gsap.set('.hero-cta', { y: 20, opacity: 0 });

        // Animate after MaskedHeading reveals
        gsap.to('.hero-fade-up', {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.8
        });

        gsap.to('.hero-cta', {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 1.3
        });
      }, heroRef);
    };

    const currentState = experienceStore.getState();
    let unsubscribe: (() => void) | null = null;

    if (currentState.hasInitialized || currentState.phase === 'READY') {
      startAnimations();
    } else {
      unsubscribe = experienceStore.subscribe(() => {
        const nextState = experienceStore.getState();
        if (nextState.phase === 'READY' || nextState.hasInitialized) {
          startAnimations();
          if (unsubscribe) unsubscribe();
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      <WebGLCanvas />
      
      
      
      <main className="layer-ui">
        
        {/* 1. HERO */}
        <section className="scroll-section hero-section" ref={heroRef}>
          <div className="section-content">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div className="hero-fade-up">
                <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  ARYAN AMDAVADI
                </span>
                <span className="typography-technical text-muted" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
                  FULL-STACK ENGINEER / AI ENGINEERING IN PROGRESS
                </span>
              </div>
              
              <MaskedHeading 
                lines={["I Build Systems", "For Real-World", "Problems."]} 
                className="typography-display"
                delay={0.5}
                duration={1.2}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div className="hero-cta">
                <a href="#work" {...exploreCursor}>
                  <Button variant="primary">EXPLORE WORK</Button>
                </a>
              </div>
              <div className="hero-cta">
                <a href="#connect" {...linkCursor}>
                  <Button variant="outline">LET&apos;S BUILD</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE BUILDER */}
        <section id="builder" className="scroll-section">
          <div className="section-content align-right">
            <span className="typography-technical text-muted">01 / THE BUILDER</span>
            
            <div className="mt-8">
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                FULL-STACK ENGINEERING
              </span>
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                PRODUCT THINKING
              </span>
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-8)' }}>
                AI ENGINEERING
              </span>
            </div>

            <h2 className="typography-h2 mt-4 max-w-md mx-auto" style={{ marginRight: 0 }}>
              I build software around real-world problems.
            </h2>
          </div>
        </section>

        {/* 3. PROBLEM -> SYSTEM */}
        <section id="problem-system" className="scroll-section" style={{ minHeight: '80vh' }}>
          <div className="section-content">
            <span className="typography-technical text-muted">02 / PROBLEM & SYSTEM</span>
            <h2 className="typography-display mt-4">
              Complex Problems Require<br />Intentional Systems.
            </h2>
            
            <p className="typography-body-large mt-8 max-w-xl">
              I decompose real-world constraints—expense routing, pricing grids, structural data—and architect robust, deterministic systems to solve them. 
              From high-throughput backends to fluid user interfaces, every component must serve the system&apos;s overarching purpose.
            </p>

            <div className="mt-16" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', opacity: 0.6 }}>
              <span className="typography-technical">PROBLEM</span>
              <span className="typography-technical">→</span>
              <span className="typography-technical">DECOMPOSITION</span>
              <span className="typography-technical">→</span>
              <span className="typography-technical">ENGINEERING</span>
              <span className="typography-technical">→</span>
              <span className="typography-technical">SYSTEM</span>
            </div>
          </div>
        </section>

        {/* 4. PROJECTS */}
        <section id="work" className="scroll-section projects-section">
          <div className="section-content">
            <span className="typography-technical text-muted">03 / THE WORK</span>
            <h2 className="typography-display mt-4">Project Exploration</h2>
            
            <ProjectShowcase />
          </div>
        </section>







        {/* 5. ABOUT & CONTEXT */}
        <section id="about" className="scroll-section">
          <div className="section-content">
            <span className="typography-technical text-muted">04 / PERSONAL CONTEXT</span>
            <h2 className="typography-display mt-4">Profile & Trajectory</h2>
            
            <div className="about-grid mt-12">
              <div className="about-section-block">
                <span className="about-label">ABOUT</span>
                <p className="about-content">
                  I am a <strong>Full-stack engineer moving toward AI engineering</strong>. My focus is on building performant, deterministic systems that solve actual problems rather than chasing trends.
                </p>
              </div>

              <div className="about-section-block">
                <span className="about-label">CURRENT PURSUIT</span>
                <div className="about-content">
                  <div className="current-work-path" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span>FULL-STACK ENGINEERING</span>
                    <span style={{ color: 'var(--accent-base)' }}>→ AI ENGINEERING</span>
                  </div>
                  <p className="mt-4">
                    Actively expanding my capabilities at the intersection of robust system architecture and generative models.
                  </p>
                </div>
              </div>

              <div className="about-section-block">
                <span className="about-label">EDUCATION & INTERESTS</span>
                <div className="about-content">
                  <p><strong>B.Tech Information Technology</strong></p>
                  <p className="text-muted">Charusat University</p>
                  <div className="mt-4" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {['Product', 'Business', 'Architecture', 'AI'].map(i => (
                      <span key={i} className="tech-tag" style={{ margin: 0 }}>{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CODE */}
        <section id="code" className="scroll-section" style={{ minHeight: '100vh' }}>
          <div className="section-content align-center">
            <span className="typography-technical text-muted">05 / THE CODE</span>
            <h2 className="typography-display mt-4">Open Source</h2>
            <p className="typography-body mt-6 max-w-md mx-auto">
              Selected public repositories and experimental implementations demonstrating active engineering work.
            </p>

            <div className="github-grid" style={{ textAlign: 'left' }}>
              <a href="https://github.com/aryan-amdavadi/SplitSphere" target="_blank" rel="noopener noreferrer" className="github-repo-card" {...exploreCursor}>
                <div>
                  <h3>SplitSphere</h3>
                  <p>A dynamic network application modeling complex financial relationships and transaction structures.</p>
                </div>
                <div className="github-repo-meta">
                  <span><span className="lang-dot"></span>TypeScript</span>
                  <span>System Architecture</span>
                </div>
              </a>

              <a href="https://github.com/aryan-amdavadi/Rapaport-Calculator" target="_blank" rel="noopener noreferrer" className="github-repo-card" {...exploreCursor}>
                <div>
                  <h3>Rapaport-Calculator</h3>
                  <p>A structured pricing engine providing real-time data grid evaluations for crystalline assets.</p>
                </div>
                <div className="github-repo-meta">
                  <span><span className="lang-dot" style={{ background: '#f1e05a' }}></span>JavaScript</span>
                  <span>Data Grid</span>
                </div>
              </a>

              <a href="https://github.com/aryan-amdavadi/SecretSpeak" target="_blank" rel="noopener noreferrer" className="github-repo-card" {...exploreCursor}>
                <div>
                  <h3>SecretSpeak</h3>
                  <p>A procedural language framework for obfuscated communication over WebSockets.</p>
                </div>
                <div className="github-repo-meta">
                  <span><span className="lang-dot" style={{ background: '#3572A5' }}></span>Python</span>
                  <span>Algorithms</span>
                </div>
              </a>

              <a href="https://github.com/aryan-amdavadi" target="_blank" rel="noopener noreferrer" className="github-repo-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' }} {...exploreCursor}>
                <span className="typography-technical" style={{ color: 'var(--accent-base)' }}>EXPLORE THE CODE ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 7. CONNECT */}
        <section id="connect" className="scroll-section connect-section" style={{ minHeight: '100vh' }}>
          <div className="section-content align-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span className="typography-technical text-muted">06 / CONCLUSION</span>
            <h2 className="typography-display mt-8" style={{ fontSize: 'clamp(4rem, 8vw, 8rem)', lineHeight: 0.9 }}>
              HAVE A PROBLEM?<br />
              <span style={{ color: 'var(--accent-base)' }}>LET&apos;S BUILD IT.</span>
            </h2>
            
            <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
              <SpecularButton href="mailto:aryan.amdavadi@gmail.com" style={{ padding: 'var(--space-4) var(--space-12)', fontSize: 'var(--text-lg)' }}>
                LET&apos;S BUILD
              </SpecularButton>
              
              <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-4)' }}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="typography-technical text-muted hover:text-white" style={{ transition: 'color 0.3s ease' }} {...useCursorHandlers('external')}>
                  LINKEDIN
                </a>
                <a href="https://github.com/aryan-amdavadi" target="_blank" rel="noopener noreferrer" className="typography-technical text-muted hover:text-white" style={{ transition: 'color 0.3s ease' }} {...useCursorHandlers('external')}>
                  GITHUB
                </a>
                <a href="mailto:contact@example.com" className="typography-technical text-muted hover:text-white" style={{ transition: 'color 0.3s ease' }} {...exploreCursor}>
                  EMAIL
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
