import WebGLCanvas from '@/canvas/WebGLCanvas';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      <WebGLCanvas />
      
      <main className="layer-ui container" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
        
        {/* DISPLAY TYPOGRAPHY */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
            Phase 02 / Visual Identity System
          </span>
          <h1 className="typography-display">Cinematic.<br/>Minimal.</h1>
        </section>

        {/* TYPOGRAPHY HIERARCHY */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-8)' }}>Typography Hierarchy</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <span className="typography-technical">Heading 1 (Editorial)</span>
              <h1 className="typography-h1">I solve real-world problems</h1>
            </div>
            <div>
              <span className="typography-technical">Heading 2 (Structural)</span>
              <h2 className="typography-h2">The Systems Architecture</h2>
            </div>
            <div>
              <span className="typography-technical">Heading 3 (Component)</span>
              <h3 className="typography-h3">Problem Decomposition</h3>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* BODY & TECHNICAL TYPOGRAPHY */}
        <section className="grid" style={{ marginBottom: 'var(--space-16)' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 className="typography-h3" style={{ marginBottom: 'var(--space-4)' }}>Body Text</h3>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p className="typography-body-large" style={{ marginBottom: 'var(--space-4)' }}>
              The portfolio must demonstrate engineering ability through the interface itself. 
              The experience must feel premium, intelligent, and business-minded.
            </p>
            <p className="typography-body">
              This is the standard body typography. Used for detailed descriptions, paragraphs, 
              and deeper technical explanations. We avoid generic gradients and excessive glassmorphism.
            </p>
          </div>
        </section>

        <div className="divider" />

        {/* INTERACTION SYSTEM: BUTTONS & LINKS */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-8)' }}>Interaction System</h2>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <Button variant="primary">Primary Action</Button>
            <Button variant="outline">Secondary Action</Button>
            <Button variant="outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Disabled State</Button>
          </div>
          
          <div>
            <span className="typography-body" style={{ marginRight: 'var(--space-4)' }}>External reference:</span>
            <a href="#" className="link-technical">VIEW GITHUB SOURCE</a>
          </div>
        </section>

        <div className="divider" />

        {/* SURFACE SYSTEM */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-8)' }}>Surface System</h2>
          
          <div className="grid">
            {/* Mock Surface Card 1 */}
            <div className="surface" style={{ gridColumn: 'span 2' }}>
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>System 01</span>
              <h3 className="typography-h3" style={{ marginBottom: 'var(--space-4)' }}>SplitSphere</h3>
              <p className="typography-body" style={{ marginBottom: 'var(--space-6)' }}>
                A conceptual breakdown of the architecture, engineering challenges, and final execution.
              </p>
              <a href="#" className="link-technical">EXPLORE SYSTEM</a>
            </div>

            {/* Mock Surface Card 2 */}
            <div className="surface" style={{ gridColumn: 'span 2' }}>
              <span className="typography-technical" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>System 02</span>
              <h3 className="typography-h3" style={{ marginBottom: 'var(--space-4)' }}>SecretSpeak</h3>
              <p className="typography-body" style={{ marginBottom: 'var(--space-6)' }}>
                High-performance real-time synchronization layer with zero-knowledge encryption guarantees.
              </p>
              <a href="#" className="link-technical">EXPLORE SYSTEM</a>
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}
