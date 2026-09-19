import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { InteractiveDiagram } from '@/components/projects/InteractiveDiagram';
import { ScrollReveal } from '@/components/text/ScrollReveal';

export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

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
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          01 — THE PROBLEM
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section01_problem}
        </ScrollReveal>
      </section>

      {/* 02 — THE QUESTION */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          02 — THE QUESTION
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section02_question}
        </ScrollReveal>
      </section>

      {/* 03 — THE SYSTEM */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          03 — THE SYSTEM
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section03_idea}
        </ScrollReveal>
      </section>

      {/* 04 — THE ARCHITECTURE */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          04 — THE ARCHITECTURE
        </ScrollReveal>
        <InteractiveDiagram 
          nodes={caseStudy.section04_architecture.nodes} 
          edges={caseStudy.section04_architecture.edges} 
        />
      </section>

      {/* 05 — THE ENGINEERING CHALLENGE */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          05 — THE ENGINEERING CHALLENGE
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section05_challenge}
        </ScrollReveal>
      </section>

      {/* 06 — THE SOLUTION */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          06 — THE SOLUTION
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section06_solution}
        </ScrollReveal>
      </section>

      {/* 07 — THE RESULT */}
      <section className="cs-section">
        <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
          07 — THE RESULT
        </ScrollReveal>
        <ScrollReveal baseRotation={2} blurStrength={2} baseOpacity={0.5} textClassName="cs-content" containerClassName="cs-content-reveal">
          {caseStudy.section07_result}
        </ScrollReveal>
      </section>

      {/* 08 & 09 — LIVE SYSTEM & SOURCE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }} className="cs-section">
        <section>
          <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
            08 — LIVE SYSTEM
          </ScrollReveal>
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
          <ScrollReveal baseRotation={5} blurStrength={8} baseOpacity={0} textClassName="cs-label" containerClassName="cs-label-reveal">
            09 — SOURCE
          </ScrollReveal>
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
