import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'All Projects & Systems — Aryan Amdavadi',
  description: 'A comprehensive architectural catalog of production applications, deterministic algorithms, embedded systems, and case studies.',
  openGraph: {
    title: 'All Projects & Systems — Aryan Amdavadi',
    description: 'An architectural catalog of engineered systems, algorithms, and technical prototypes.',
    type: 'website',
  },
};

export default function ProjectsIndexPage() {
  return (
    <main className="projects-archive-page">
      {/* Header & Breadcrumbs */}
      <header className="archive-header">
        <div className="cs-breadcrumb-nav">
          <Link href="/" className="cs-back-link" aria-label="Return to portfolio homepage">
            <span className="cs-back-arrow" aria-hidden="true">←</span>
            <span>BACK TO HOMEPAGE</span>
          </Link>
        </div>

        <div className="cs-category-row" style={{ marginTop: 'var(--space-2)' }}>
          <span className="cs-category-badge">
            ARCHIVE // CATALOG
          </span>
          <span className="cs-index-stamp">
            TOTAL SYSTEMS: 0{projects.length}
          </span>
        </div>

        <h1 className="cs-title">
          All Projects &amp; Systems
        </h1>

        <p className="cs-tagline">
          An architectural catalog of full-stack platforms, greedy graph algorithms, real-time embedded systems, and normalized data pricing engines.
        </p>
      </header>

      {/* Project Grid */}
      <section className="archive-grid" aria-label="Project Case Studies Catalog">
        {projects.map((project, index) => (
          <article key={project.id} className="archive-card" data-project={project.id}>
            {/* Project Artwork Frame */}
            <div className="archive-card-image-box">
              <span className="archive-card-badge">
                {`0${index + 1} // ${project.category.toUpperCase()}`}
              </span>
              <Image
                src={project.image}
                alt={project.alt || `${project.title} technical architecture visualization`}
                fill
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 50vw, 100vw"
                className="archive-card-img"
              />
            </div>

            {/* Project Body */}
            <div className="archive-card-body">
              <div className="archive-card-meta">
                <span>{project.role}</span>
                <span className="cs-status-indicator">
                  <span className="cs-status-dot" />
                  {project.liveUrl && project.liveUrl !== '#' ? 'Active' : 'Completed'}
                </span>
              </div>

              <h2 className="archive-card-title">
                {project.title}
              </h2>

              <p className="archive-card-problem">
                {project.problem}
              </p>

              {/* Technologies */}
              <div className="cs-tech-tags-group">
                {project.technology.slice(0, 4).map((tech) => (
                  <span key={tech} className="cs-tech-tag" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="archive-card-footer">
                <Link
                  href={project.caseStudyRoute || `/projects/${project.id}`}
                  className="btn btn-primary"
                  style={{ fontSize: 'var(--text-xs)' }}
                  aria-label={`Read case study for ${project.title}`}
                >
                  VIEW CASE STUDY ↗
                </Link>

                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-technical"
                    aria-label={`GitHub repository for ${project.title}`}
                  >
                    CODE ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Archive Bottom Navigation */}
      <footer className="cs-nav-container" style={{ marginTop: 'var(--space-12)' }}>
        <Link href="/#work" className="cs-nav-link" aria-label="Return to homepage showcase">
          <span className="cs-nav-direction">← RETURN TO</span>
          <span className="cs-nav-project-title">Homepage Showcase</span>
        </Link>

        <Link href="/" className="cs-nav-center-link" aria-label="Return to homepage top">
          HOME
        </Link>

        <Link href="/#connect" className="cs-nav-link next" aria-label="Contact and collaborate">
          <span className="cs-nav-direction">COLLABORATE →</span>
          <span className="cs-nav-project-title">Let&apos;s Build</span>
        </Link>
      </footer>
    </main>
  );
}
