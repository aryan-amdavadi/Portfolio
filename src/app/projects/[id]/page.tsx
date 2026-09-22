import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { InteractiveDiagram } from '@/components/projects/InteractiveDiagram';
import { ScrollReveal } from '@/components/text/ScrollReveal';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} - Aryan Amdavadi`,
    description: project.caseStudy?.problem || project.problem
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectIndex = projects.findIndex((p) => p.id === id);
  
  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  if (!project.caseStudy) {
    notFound();
  }

  const { caseStudy } = project;
  
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

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

      {/* 01 — OVERVIEW */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          01 — OVERVIEW
        </ScrollReveal>
        <div className="cs-content" style={{ marginTop: 'var(--space-4)' }}>
          <p style={{ marginBottom: 'var(--space-2)' }}><strong>Project:</strong> {project.title}</p>
          <p style={{ marginBottom: 'var(--space-2)' }}><strong>Description:</strong> {project.problem}</p>
          <p style={{ marginBottom: 'var(--space-2)' }}><strong>Role:</strong> {project.role}</p>
          <p style={{ marginBottom: 'var(--space-2)' }}><strong>Stack:</strong> {project.technology.join(' / ')}</p>
          <p style={{ marginBottom: 'var(--space-2)' }}><strong>Status:</strong> {project.liveUrl && project.liveUrl !== '#' ? 'Production' : 'Completed / Prototype'}</p>
          {project.liveUrl && project.liveUrl !== '#' && (
            <p style={{ marginBottom: 'var(--space-2)' }}><strong>Live:</strong> <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)' }}>View Production ↗</a></p>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <p style={{ marginBottom: 'var(--space-2)' }}><strong>Source:</strong> <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)' }}>View Repo ↗</a></p>
          )}
        </div>
      </section>

      {/* 02 — THE PROBLEM */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          02 — THE PROBLEM
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.problem}
        </ScrollReveal>
      </section>

      {/* 03 — THE QUESTION */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          03 — THE QUESTION
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.question}
        </ScrollReveal>
      </section>

      {/* 04 — THE SYSTEM */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          04 — THE SYSTEM
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.system}
        </ScrollReveal>
        {caseStudy.architecture && (
          <InteractiveDiagram 
            nodes={caseStudy.architecture.nodes} 
            edges={caseStudy.architecture.edges} 
          />
        )}
      </section>

      {/* 05 — ENGINEERING CHALLENGE */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          05 — ENGINEERING CHALLENGE
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.challenge}
        </ScrollReveal>
      </section>

      {/* 06 — THE SOLUTION */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          06 — THE SOLUTION
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.solution}
        </ScrollReveal>
      </section>

      {/* 07 — ENGINEERING DECISIONS */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          07 — ENGINEERING DECISIONS
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.decisions}
        </ScrollReveal>
      </section>

      {/* 08 — RESULT */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          08 — RESULT
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.result}
        </ScrollReveal>
      </section>

      {/* 09 — LIVE / SOURCE */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          09 — LIVE / SOURCE
        </ScrollReveal>
        <div className="cs-content">
          {project.liveUrl && project.liveUrl !== '#' && (
            <p style={{ marginBottom: 'var(--space-2)' }}>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                View Live System ↗
              </a>
            </p>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-base)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                View Source Code ↗
              </a>
            </p>
          )}
          {(!project.liveUrl || project.liveUrl === '#') && (!project.githubUrl || project.githubUrl === '#') && (
            <p>Source code and live system are proprietary or currently offline.</p>
          )}
        </div>
      </section>

      {/* NAVIGATION */}
      <nav className="case-study-nav" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '10vh', 
        paddingTop: 'var(--space-6)', 
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        {prevProject ? (
          <Link href={prevProject.caseStudyRoute || `/projects/${prevProject.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            ← PREVIOUS: {prevProject.title.toUpperCase()}
          </Link>
        ) : <div style={{ width: '150px' }} />}

        <Link href="/#work" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          BACK TO WORK
        </Link>

        {nextProject ? (
          <Link href={nextProject.caseStudyRoute || `/projects/${nextProject.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            NEXT: {nextProject.title.toUpperCase()} →
          </Link>
        ) : <div style={{ width: '150px' }} />}
      </nav>
    </main>
  );
}
