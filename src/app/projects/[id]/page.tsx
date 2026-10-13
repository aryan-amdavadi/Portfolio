import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { projects } from '@/data/projects';
import { EngineeringWorkbench } from '@/components/projects/EngineeringWorkbench';
import { CaseStudyHero } from '@/components/projects/CaseStudyHero';
import { CaseStudySection } from '@/components/projects/CaseStudySection';
import { TechnologyEvidence } from '@/components/projects/TechnologyEvidence';
import { ProjectLinks } from '@/components/projects/ProjectLinks';
import { CaseStudyNavigation } from '@/components/projects/CaseStudyNavigation';
import { AlgorithmVisualizer } from '@/components/projects/AlgorithmVisualizer';

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
    title: `${project.title} — Case Study | Aryan Amdavadi`,
    description: project.caseStudy?.problem || project.problem,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.caseStudy?.problem || project.problem,
      images: project.image ? [{ url: project.image, alt: project.alt }] : [],
    },
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
    <main
      className="case-study-page"
      data-project={project.id}
      style={{
        '--project-accent': project.accentColor || 'var(--accent-base)',
        '--project-accent-light': project.accentColorLight || 'var(--accent-hover)'
      } as React.CSSProperties}
    >
      {/* 1. Identity, Overview, and Artwork */}
      <CaseStudyHero project={project} />

      {/* 2. Problem and Constraints */}
      <CaseStudySection number="01" title="THE PROBLEM" id="problem">
        <p className="cs-prose">
          {caseStudy.problem}
        </p>
      </CaseStudySection>

      {/* 3. Engineering Approach */}
      <CaseStudySection number="02" title="THE APPROACH" id="approach">
        <p className="cs-prose">
          {caseStudy.idea}
        </p>
      </CaseStudySection>

      {/* 4. Architecture & System Flow */}
      <CaseStudySection number="03" title="ARCHITECTURE & SYSTEM FLOW" id="architecture">
        <p className="cs-prose" style={{ marginBottom: 'var(--space-6)' }}>
          {caseStudy.system}
        </p>
        <EngineeringWorkbench project={project} mode="full" />
      </CaseStudySection>

      {/* 5. Concrete Technical Challenge */}
      <CaseStudySection number="04" title="TECHNICAL CHALLENGE" id="challenge">
        <div className="cs-challenge-card">
          <div className="cs-challenge-header">
            <span className="cs-challenge-badge">ENGINEERING CONSTRAINT // COMPLEXITY FACTOR</span>
          </div>
          <p className="cs-challenge-text">
            {caseStudy.challenge}
          </p>
        </div>
      </CaseStudySection>

      {/* 6. Solution & Resolution (Pipeline Visualizer for all projects) */}
      <CaseStudySection number="05" title="SOLUTION & RESOLUTION" id="solution">
        <p className="cs-prose" style={{ marginBottom: 'var(--space-6)' }}>
          {caseStudy.solution}
        </p>
        <AlgorithmVisualizer key={project.id} projectId={project.id} />
      </CaseStudySection>

      {/* 7. Important Implementation Decisions */}
      <CaseStudySection number="06" title="IMPLEMENTATION DECISIONS" id="decisions">
        <div className="cs-details-grid">
          {caseStudy.details.map((detail, index) => (
            <div key={index} className="cs-detail-card">
              <span className="cs-detail-num">DECISION // 0{index + 1}</span>
              <h3 className="cs-detail-title">
                {detail.title}
              </h3>
              <p className="cs-detail-content">
                {detail.content}
              </p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 8. Current State & Verified Functionality */}
      <CaseStudySection number="07" title="CURRENT STATE & VERIFIED RESULTS" id="results">
        <p className="cs-prose">
          {caseStudy.result}
        </p>
      </CaseStudySection>

      {/* 9. Technology Stack */}
      <CaseStudySection number="08" title="TECHNOLOGY STACK" id="technology">
        <TechnologyEvidence technologies={project.technology} />
      </CaseStudySection>

      {/* 10. Repository & Live Access */}
      <CaseStudySection number="09" title="SOURCE CODE & ARTIFACTS" id="artifacts">
        <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
      </CaseStudySection>

      {/* 11. Contextual Previous / Next Navigation */}
      <CaseStudyNavigation prevProject={prevProject} nextProject={nextProject} />
    </main>
  );
}
