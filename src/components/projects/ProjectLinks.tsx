import React from 'react';

interface ProjectLinksProps {
  githubUrl?: string;
  liveUrl?: string;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ githubUrl, liveUrl }) => {
  const hasLive = liveUrl && liveUrl !== '#';
  const hasGithub = githubUrl && githubUrl !== '#';

  if (!hasLive && !hasGithub) {
    return (
      <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
        Source code and live system are proprietary or currently offline.
      </p>
    );
  }

  return (
    <div className="cs-links" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      {hasLive && (
        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'var(--text)', 
            color: 'var(--bg)', 
            textDecoration: 'none', 
            fontWeight: 500,
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          View Live System ↗
        </a>
      )}
      {hasGithub && (
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'transparent', 
            border: '1px solid var(--border)',
            color: 'var(--text)', 
            textDecoration: 'none', 
            fontWeight: 500,
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          View Source Code ↗
        </a>
      )}
    </div>
  );
};
