import React from 'react';
import { Button } from '@/components/ui/Button';

interface ProjectLinksProps {
  githubUrl?: string;
  liveUrl?: string;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ githubUrl, liveUrl }) => {
  const hasLive = liveUrl && liveUrl !== '#';
  const hasGithub = githubUrl && githubUrl !== '#';

  if (!hasLive && !hasGithub) {
    return (
      <p className="font-body italic text-sm text-muted-foreground">
        Source code and live system are proprietary or currently offline.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 px-4">
      {hasLive && (
        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="View Live System"
        >
          <Button variant="primary" className="gap-2">
            View Live System ↗
          </Button>
        </a>
      )}
      {hasGithub && (
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="View Source Code"
        >
          <Button variant="outline" className="gap-2">
            View Source Code ↗
          </Button>
        </a>
      )}
    </div>
  );
};
