'use client';

import WebGLCanvas from '@/canvas/WebGLCanvas';
import { Button } from '@/components/ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { ProjectShowcase } from '@/components/projects/ProjectShowcase';
import { InteractiveToolset } from '@/components/projects/InteractiveToolset';

export default function Home() {
  const exploreCursor = useCursorHandlers('explore');
  const linkCursor = useCursorHandlers('link');

  return (
    <>
      <WebGLCanvas />
      
      <main className="layer-ui">
        
        {/* 1. HERO */}
        <section className="scroll-section hero-section">
          <div className="section-content">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
                FULL-STACK ENGINEER <br />
                AI ENGINEERING IN PROGRESS
              </span>
              
              <h1 className="typography-display" style={{ textTransform: 'uppercase' }}>
                I Build Systems<br />
                For Real-World<br />
                Problems.
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <a href="#work" {...exploreCursor}>
                <Button variant="primary">EXPLORE WORK</Button>
              </a>
              <a href="#connect" {...linkCursor}>
                <Button variant="outline">LET&apos;S BUILD</Button>
              </a>
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

        {/* 3. THE PROBLEMS */}
        <section id="problems" className="scroll-section">
          <div className="section-content align-left">
            <span className="typography-technical text-muted">02 / THE PROBLEMS</span>
            <h2 className="typography-display mt-4">
              Problems I&apos;ve<br />Chosen To Solve
            </h2>
            
            <ul className="typography-body-large mt-8" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="typography-technical text-muted">01</span>
                Expense complexity
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="typography-technical text-muted">02</span>
                Pricing & data complexity
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="typography-technical text-muted">03</span>
                Commerce systems
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="typography-technical text-muted">04</span>
                Procedural language
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="typography-technical text-muted">05</span>
                Health monitoring
              </li>
            </ul>

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

        {/* 4. THE SYSTEMS */}
        <section id="systems" className="scroll-section">
          <div className="section-content align-right">
            <span className="typography-technical text-muted">03 / THE SYSTEMS</span>
            <h2 className="typography-h2 mt-4">Architecting Solutions</h2>
            <p className="typography-body-large mt-6 max-w-md">
              From high-throughput backends to fluid user interfaces, every component must serve the system&apos;s overarching purpose.
            </p>
          </div>
        </section>

        {/* 5. PROJECTS */}
        <section id="work" className="scroll-section projects-section">
          <div className="section-content">
            <span className="typography-technical text-muted">04 / THE WORK</span>
            <h2 className="typography-display mt-4">Projects</h2>
            
            <ProjectShowcase />
          </div>
        </section>

        {/* 6. THINKING / THE METHOD */}
        <section id="thinking" className="scroll-section">
          <div className="section-content align-left">
            <span className="typography-technical text-muted">05 / THE METHOD</span>
            <h2 className="typography-display mt-4">Engineering Process</h2>
            
            <div className="mt-8" style={{ display: 'grid', gap: 'var(--space-8)' }}>
              <div>
                <span className="typography-technical text-muted">01 UNDERSTAND</span>
                <p className="typography-body mt-2 max-w-md">Identify the core constraints. What is the actual business problem? What are the edge cases?</p>
              </div>
              <div>
                <span className="typography-technical text-muted">02 DECOMPOSE</span>
                <p className="typography-body mt-2 max-w-md">Break monolithic challenges into independent, testable sub-systems.</p>
              </div>
              <div>
                <span className="typography-technical text-muted">03 DESIGN</span>
                <p className="typography-body mt-2 max-w-md">Architect for scale, latency, and maintainability. Choose tools based on empirical needs, not hype.</p>
              </div>
              <div>
                <span className="typography-technical text-muted">04 ENGINEER</span>
                <p className="typography-body mt-2 max-w-md">Build robust, typed, deterministic solutions. Manage state predictably.</p>
              </div>
              <div>
                <span className="typography-technical text-muted">05 TEST</span>
                <p className="typography-body mt-2 max-w-md">Verify critical paths aggressively. Rely on automated integration over manual checks.</p>
              </div>
              <div>
                <span className="typography-technical text-muted">06 ITERATE</span>
                <p className="typography-body mt-2 max-w-md">Deploy, monitor, and optimize based on real-world telemetry.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TOOLSET */}
        <section id="toolset" className="scroll-section" style={{ minHeight: '150vh' }}>
          <div className="section-content align-right">
            <span className="typography-technical text-muted">06 / THE TOOLSET</span>
            <h2 className="typography-display mt-4">Proven Technologies</h2>
            <p className="typography-body mt-6 max-w-md" style={{ marginLeft: 'auto' }}>
              I have used these technologies to build production systems. Hover over a technology to see its application.
            </p>
            
            <InteractiveToolset />
          </div>
        </section>

        {/* 8. ABOUT */}
        <section id="about" className="scroll-section">
          <div className="section-content align-right">
            <span className="typography-technical text-muted">07 / ABOUT</span>
            <h2 className="typography-h2 mt-4">My Journey</h2>
            <p className="typography-body-large mt-6 max-w-md">
              A brief history of my engineering path and where I am headed next.
            </p>
          </div>
        </section>

        {/* 9. CURRENTLY BUILDING */}
        <section id="currently-building" className="scroll-section">
          <div className="section-content align-left">
            <span className="typography-technical text-muted">08 / CURRENTLY BUILDING</span>
            <h2 className="typography-h2 mt-4">Active Pursuits</h2>
            <p className="typography-body-large mt-6 max-w-md">
              Focusing on AI integration and high-performance WebGL architectures.
            </p>
          </div>
        </section>

        {/* 10. CODE */}
        <section id="code" className="scroll-section">
          <div className="section-content align-center">
            <span className="typography-technical text-muted">09 / CODE</span>
            <h2 className="typography-h2 mt-4">Open Source</h2>
            <p className="typography-body-large mt-6 max-w-md mx-auto">
              Contributions and public repositories.
            </p>
          </div>
        </section>

        {/* 11. CONNECT */}
        <section id="connect" className="scroll-section connect-section">
          <div className="section-content align-center">
            <span className="typography-technical text-muted">10 / CONNECT</span>
            <h2 className="typography-display mt-4">Let&apos;s Build.</h2>
            <div className="mt-8" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <a href="mailto:contact@example.com" {...exploreCursor}>
                <Button variant="primary">EMAIL ME</Button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" {...useCursorHandlers('external')}>
                <Button variant="outline">LINKEDIN</Button>
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
