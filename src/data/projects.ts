export interface Project {
  id: string;
  title: string;
  problem: string;
  solution: string;
  technology: string[];
  role: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyRoute?: string;
  artifactIndex: number;
}

export const projects: Project[] = [
  {
    id: 'splitsphere',
    title: 'SplitSphere',
    problem: 'Managing shared expenses lacks real-time, transparent relationship networking.',
    solution: 'A dynamic network application modeling complex financial relationships.',
    technology: ['Next.js', 'PostgreSQL', 'TypeScript'],
    role: 'Full-Stack Engineer',
    githubUrl: '#',
    liveUrl: '#',
    artifactIndex: 0,
  },
  {
    id: 'rapaport',
    title: 'Rapaport Calculator',
    problem: 'Pricing models for crystalline assets are opaque and difficult to parse dynamically.',
    solution: 'A structured pricing engine providing real-time data grid evaluations.',
    technology: ['React', 'Node.js', 'Data Grid'],
    role: 'Lead Developer',
    githubUrl: '#',
    liveUrl: '#',
    artifactIndex: 1,
  },
  {
    id: 'secretspeak',
    title: 'SecretSpeak',
    problem: 'Procedural patterns in secure messaging are rigid and predictable.',
    solution: 'A procedural language framework for obfuscated communication.',
    technology: ['Python', 'Algorithms', 'WebSockets'],
    role: 'Backend Architect',
    githubUrl: '#',
    liveUrl: '#',
    artifactIndex: 2,
  },
  {
    id: 'tabster',
    title: 'Tabster',
    problem: 'Commerce transaction structures lack modular system flexibility.',
    solution: 'A modular commerce tracking and transaction structural system.',
    technology: ['TypeScript', 'GraphQL', 'Stripe'],
    role: 'Software Engineer',
    githubUrl: '#',
    liveUrl: '#',
    artifactIndex: 3,
  },
  {
    id: 'pulsesync',
    title: 'PulseSync',
    problem: 'Health monitoring signals are noisy and difficult to visualize continuously.',
    solution: 'A waveform-based signal visualization and synchronization engine.',
    technology: ['WebGL', 'WebRTC', 'React'],
    role: 'Frontend Engineer',
    githubUrl: '#',
    liveUrl: '#',
    artifactIndex: 4,
  }
];
