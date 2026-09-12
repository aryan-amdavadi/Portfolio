export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  description: string;
}

export interface DiagramEdge {
  source: string;
  target: string;
  animated: boolean;
}

export interface CaseStudyData {
  section01_problem: string;
  section02_question: string;
  section03_idea: string;
  section04_architecture: {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
  section05_challenge: string;
  section06_solution: string;
  section07_result: string;
}

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
  caseStudy?: CaseStudyData;
}

const generatePlaceholderCaseStudy = (name: string): CaseStudyData => ({
  section01_problem: `The existing ecosystem for ${name} relies on outdated patterns that fail under scale, leading to unacceptable latency and fragmented user experiences.`,
  section02_question: `How might we re-architect the fundamental data flow to achieve real-time synchronization without compromising on deterministic state?`,
  section03_idea: `By shifting the computational burden to the edge and utilizing a specialized highly-concurrent state machine, we can bypass traditional bottlenecks.`,
  section04_architecture: {
    nodes: [
      { id: 'client', label: 'Client (Next.js)', x: 10, y: 50, description: 'Optimistic UI leveraging local caching.' },
      { id: 'edge', label: 'Edge Gateway', x: 50, y: 20, description: 'Handles auth and routing near the user.' },
      { id: 'worker', label: 'Compute Worker', x: 50, y: 80, description: 'Executes heavy transformations.' },
      { id: 'db', label: 'Primary DB', x: 90, y: 50, description: 'ACID compliant storage layer.' },
    ],
    edges: [
      { source: 'client', target: 'edge', animated: true },
      { source: 'edge', target: 'worker', animated: false },
      { source: 'worker', target: 'db', animated: true },
      { source: 'client', target: 'worker', animated: false },
    ]
  },
  section05_challenge: `Implementing deterministic conflict resolution across distributed nodes introduced massive complexity. Standard CRDT approaches were too memory-intensive for the target hardware profile.`,
  section06_solution: `We engineered a custom binary-packed operational transform protocol that reduced payload sizes by 80%, allowing instantaneous sync even on degraded cellular networks.`,
  section07_result: `The system now processes thousands of concurrent mutations with p99 latency under 50ms, drastically improving the core user experience and reducing infrastructure costs.`
});

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
    caseStudyRoute: '/projects/splitsphere',
    artifactIndex: 0,
    caseStudy: generatePlaceholderCaseStudy('SplitSphere')
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
    caseStudyRoute: '/projects/rapaport',
    artifactIndex: 1,
    caseStudy: generatePlaceholderCaseStudy('Rapaport Calculator')
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
    caseStudyRoute: '/projects/secretspeak',
    artifactIndex: 2,
    caseStudy: generatePlaceholderCaseStudy('SecretSpeak')
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
    caseStudyRoute: '/projects/tabster',
    artifactIndex: 3,
    caseStudy: generatePlaceholderCaseStudy('Tabster')
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
    caseStudyRoute: '/projects/pulsesync',
    artifactIndex: 4,
    caseStudy: generatePlaceholderCaseStudy('PulseSync')
  }
];
