'use client';

import WebGLCanvas from '@/canvas/WebGLCanvas';
import { Button } from '@/components/ui/Button';
import { useCursorHandlers } from '@/hooks/useCursorState';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export default function Home() {
  const exploreCursor = useCursorHandlers('explore');
  const scrollProgress = useScrollProgress();

  // Simple opacity fade based on scroll progress so the hero gracefully fades out
  // The hero occupies the first 100vh. Scroll progress goes from 0 to 1 over the whole page.
  // For a basic demo, we'll just fade out the text as we scroll down.
  const heroOpacity = Math.max(0, 1 - scrollProgress * 5); // Fades out quickly

  return (
    <>
      <WebGLCanvas />
      
      <main className="layer-ui">
        
        {/* HERO SECTION */}
        <section 
          style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: '0 var(--container-padding)',
            opacity: heroOpacity,
            transition: 'opacity 0.1s linear', // smooth interpolation handled by state
            position: 'relative'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            
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
              <a href="#connect" {...useCursorHandlers('link')}>
                <Button variant="outline">LET&apos;S BUILD</Button>
              </a>
            </div>

          </div>
        </section>

        {/* NARRATIVE SCROLL SPACE (Next Section Placeholder) */}
        <section id="work" className="container" style={{ minHeight: '150vh', paddingTop: '10vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              01 / THE WORK
            </span>
            <h2 className="typography-h2" style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
              Engineering as a Discipline
            </h2>
            <p className="typography-body-large" style={{ textAlign: 'center' }}>
              (Scroll progressively transforms the environment. Case studies will appear here in Phase 6.)
            </p>
          </div>
        </section>

        {/* Additional padding to allow scrolling */}
        <section id="connect" className="container" style={{ minHeight: '100vh' }}>
          {/* Connect Section Placeholder */}
        </section>

      </main>
    </>
  );
}
