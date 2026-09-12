import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { InteractiveDiagram } from '@/components/projects/InteractiveDiagram';

export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project || !project.caseStudy) {
    notFound();
  }

  const { caseStudy } = project;

  return (
    <main className="case-study-container">
      <header className="case-study-header">
        <Link href="/#work" className="back-link">
          ← BACK TO PROJECTS
        </Link>
        <h1 className="case-study-title">{project.title}</h1>
        <div className="case-study-meta">
          <span>ROLE: {project.role}</span>
          <span>
            TECH: {project.technology.join(' / ')}
          </span>
        </div>
      </header>

      {/* 01 — THE PROBLEM */}
      <section className="cs-section">
        <span className="cs-label">01 — THE PROBLEM</span>
        <p className="cs-content">{caseStudy.section01_problem}</p>
      </section>

      {/* 02 — THE QUESTION */}
      <section className="cs-section">
        <span className="cs-label">02 — THE QUESTION</span>
        <p className="cs-content">{caseStudy.section02_question}</p>
      </section>

      {/* 03 — THE IDEA */}
      <section className="cs-section">
        <span className="cs-label">03 — THE IDEA</span>
        <p className="cs-content">{caseStudy.section03_idea}</p>
      </section>

      {/* 04 — THE ARCHITECTURE */}
      <section className="cs-section">
        <span className="cs-label">04 — THE ARCHITECTURE</span>
        <InteractiveDiagram 
          nodes={caseStudy.section04_architecture.nodes} 
          edges={caseStudy.section04_architecture.edges} 
        />
      </section>

      {/* 05 — THE ENGINEERING CHALLENGE */}
      <section className="cs-section">
        <span className="cs-label">05 — THE ENGINEERING CHALLENGE</span>
        <p className="cs-content">{caseStudy.section05_challenge}</p>
      </section>

      {/* 06 — THE SOLUTION */}
      <section className="cs-section">
        <span className="cs-label">06 — THE SOLUTION</span>
        <p className="cs-content">{caseStudy.section06_solution}</p>
      </section>

      {/* 07 — THE RESULT */}
      <section className="cs-section">
        <span className="cs-label">07 — THE RESULT</span>
        <p className="cs-content">{caseStudy.section07_result}</p>
      </section>

      {/* 08 & 09 — LIVE SYSTEM & SOURCE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }} className="cs-section">
        <section>
          <span className="cs-label">08 — LIVE SYSTEM</span>
          <p className="cs-content">
            {project.liveUrl && project.liveUrl !== '#' ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)' }}>
                View Production Deploy ↗
              </a>
            ) : (
              'Currently offline or private internal system.'
            )}
          </p>
        </section>

        <section>
          <span className="cs-label">09 — SOURCE</span>
          <p className="cs-content">
            {project.githubUrl && project.githubUrl !== '#' ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)' }}>
                View Source Code ↗
              </a>
            ) : (
              'Source code is proprietary.'
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
