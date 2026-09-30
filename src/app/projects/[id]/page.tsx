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
    <main className="w-full min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto flex flex-col gap-24">
      <CaseStudyHero project={project} />

      <CaseStudySection number="01" title="THE PROBLEM">
        <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed max-w-3xl">
          {caseStudy.problem}
        </p>
      </CaseStudySection>

      <CaseStudySection number="02" title="THE IDEA">
        <p className="text-xl md:text-2xl text-secondary-foreground font-body leading-relaxed max-w-3xl">
          {caseStudy.idea}
        </p>
      </CaseStudySection>

      <CaseStudySection number="03" title="THE SYSTEM">
        <p className="text-lg md:text-xl text-secondary-foreground font-body leading-relaxed max-w-3xl mb-12">
          {caseStudy.system}
        </p>
        {caseStudy.architecture && (
          <div className="w-full">
            <InteractiveDiagram 
              nodes={caseStudy.architecture.nodes} 
              edges={caseStudy.architecture.edges} 
            />
          </div>
        )}
      </CaseStudySection>

      <CaseStudySection number="04" title="ENGINEERING CHALLENGE">
        <div className="p-8 md:p-12 border border-border bg-card rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <p className="text-lg md:text-xl text-card-foreground font-body leading-relaxed">
            {caseStudy.challenge}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection number="05" title="THE SOLUTION">
        <p className="text-lg md:text-xl text-secondary-foreground font-body leading-relaxed max-w-3xl mb-12">
          {caseStudy.solution}
        </p>
        {project.id === 'splitsphere' && (
          <div className="w-full border border-border rounded-2xl overflow-hidden">
            <AlgorithmVisualizer />
          </div>
        )}
      </CaseStudySection>

      <CaseStudySection number="06" title="ENGINEERING DETAILS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
          {caseStudy.details.map((detail, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h3 className="font-technical text-sm tracking-widest text-primary uppercase">
                {detail.title}
              </h3>
              <p className="text-secondary-foreground font-body leading-relaxed">
                {detail.content}
              </p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection number="07" title="RESULT">
        <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed max-w-3xl">
          {caseStudy.result}
        </p>
      </CaseStudySection>

      <CaseStudySection number="08" title="TECHNOLOGY">
        <TechnologyEvidence technologies={project.technology} />
      </CaseStudySection>

      <CaseStudySection number="09" title="SOURCE / LIVE">
        <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
      </CaseStudySection>

      <div className="mt-12 pt-12 border-t border-border">
        <CaseStudyNavigation prevProject={prevProject} nextProject={nextProject} />
      </div>
    </main>
  );
}
