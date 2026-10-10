'use client';

import React from 'react';

interface ProjectLinksProps {
  githubUrl?: string;
  liveUrl?: string;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ githubUrl, liveUrl }) => {
  const hasLive = Boolean(liveUrl && liveUrl !== '#' && !liveUrl.includes('localhost'));
  const hasGithub = Boolean(githubUrl && githubUrl !== '#');

  if (!hasLive && !hasGithub) {
    return (
      <p className="cs-proprietary-notice">
        Source code is proprietary or hardware/internal prototype.
      </p>
    );
  }

  return (
    <div className="cs-links-group">
      {hasLive && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Live Deployment"
          className="btn btn-primary"
        >
          View Live System ↗
        </a>
      )}
      {hasGithub && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Source Code on GitHub"
          className="btn btn-outline"
        >
          View Source Code ↗
        </a>
      )}
    </div>
  );
};
