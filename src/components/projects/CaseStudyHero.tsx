import React from 'react';
import { Project } from '@/data/projects';
import { ScrollReveal } from '@/components/text/ScrollReveal';
import { TechnologyEvidence } from '@/components/projects/TechnologyEvidence';
import { ProjectLinks } from '@/components/projects/ProjectLinks';

interface CaseStudyHeroProps {
  project: Project;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ project }) => {
  const isProduction = project.liveUrl && project.liveUrl !== '#';

  return (
    <header className="mb-8">
      <ScrollReveal baseOpacity={0} blurStrength={10} baseRotation={3}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-technical text-sm tracking-widest text-primary uppercase">
              {project.category}
            </span>
            <h1 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight text-foreground">
              {project.title}
            </h1>
          </div>
          
          <p className="font-body text-xl md:text-3xl text-secondary-foreground max-w-3xl leading-relaxed">
            {project.solution || project.problem}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 mt-4 border-y border-border">
            <div className="flex flex-col gap-2">
              <span className="font-technical text-xs tracking-widest text-muted-foreground uppercase">Role</span>
              <span className="font-body text-foreground">{project.role}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-technical text-xs tracking-widest text-muted-foreground uppercase">Status</span>
              <span className="font-body text-foreground">
                {isProduction ? 'Production' : 'Completed / Prototype'}
              </span>
            </div>
            <div className="flex flex-col gap-2 col-span-2 md:col-span-2">
              <span className="font-technical text-xs tracking-widest text-muted-foreground uppercase">Links</span>
              <div className="-ml-4">
                <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <span className="font-technical text-xs tracking-widest text-muted-foreground uppercase">Core Stack</span>
            <TechnologyEvidence technologies={project.technology} />
          </div>
        </div>
      </ScrollReveal>
    </header>
  );
};
