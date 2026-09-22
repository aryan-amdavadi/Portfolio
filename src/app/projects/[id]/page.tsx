import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { projects } from '@/data/projects';
import { InteractiveDiagram } from '@/components/projects/InteractiveDiagram';
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
    <main className="case-study-container" style={{ padding: 'var(--space-8) 0', maxWidth: '800px', margin: '0 auto' }}>
      <CaseStudyHero project={project} />

      <CaseStudySection number="01" title="THE PROBLEM">
        <p>{caseStudy.problem}</p>
      </CaseStudySection>

      <CaseStudySection number="02" title="THE IDEA">
        <p>{caseStudy.idea}</p>
      </CaseStudySection>

      <CaseStudySection number="03" title="THE SYSTEM">
        <p style={{ marginBottom: 'var(--space-6)' }}>{caseStudy.system}</p>
        {caseStudy.architecture && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <InteractiveDiagram 
              nodes={caseStudy.architecture.nodes} 
              edges={caseStudy.architecture.edges} 
            />
          </div>
        )}
      </CaseStudySection>

      <CaseStudySection number="04" title="ENGINEERING CHALLENGE">
        <p>{caseStudy.challenge}</p>
      </CaseStudySection>

      <CaseStudySection number="05" title="THE SOLUTION">
        <p>{caseStudy.solution}</p>
        {project.id === 'splitsphere' && <AlgorithmVisualizer />}
      </CaseStudySection>

      <CaseStudySection number="06" title="ENGINEERING DETAILS">
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {caseStudy.details.map((detail, index) => (
            <div key={index} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>{detail.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{detail.content}</p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection number="07" title="RESULT">
        <p>{caseStudy.result}</p>
      </CaseStudySection>

      <CaseStudySection number="08" title="TECHNOLOGY">
        <TechnologyEvidence technologies={project.technology} />
      </CaseStudySection>

      <CaseStudySection number="09" title="SOURCE / LIVE">
        <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
      </CaseStudySection>

      <CaseStudyNavigation prevProject={prevProject} nextProject={nextProject} />
    </main>
  );
}
