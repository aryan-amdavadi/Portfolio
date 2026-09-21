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

export const projects: Project[] = [
  {
    id: 'splitsphere',
    title: 'SplitSphere',
    problem: 'Managing shared expenses across connected groups creates cyclic debt patterns that are computationally expensive to resolve.',
    solution: 'A directed graph reduction algorithm modeling and settling complex financial relationships.',
    technology: ['Next.js', 'PostgreSQL', 'TypeScript', 'Graph Algorithms'],
    role: 'Full-Stack Engineer',
    githubUrl: 'https://github.com/aryan-amdavadi/SplitSphere',
    caseStudyRoute: '/projects/splitsphere',
    artifactIndex: 0,
    caseStudy: {
      section01_problem: 'When individuals share expenses in highly connected groups, the resulting debt graph contains complex cycles. Resolving these using naive approaches results in N^2 transactions, degrading both UX and backend performance.',
      section02_question: 'How might we re-architect the debt resolution flow to compute the absolute minimum number of transactions in real-time?',
      section03_idea: 'By modeling the group as a directed graph and applying a max-flow min-cut network algorithm, we can eliminate cycles and optimize the settlement paths mathematically.',
      section04_architecture: {
        nodes: [
          { id: 'client', label: 'Client (Next.js)', x: 10, y: 50, description: 'Optimistic UI leveraging local caching.' },
          { id: 'api', label: 'Node API', x: 50, y: 20, description: 'Handles auth and routing.' },
          { id: 'worker', label: 'Graph Engine', x: 50, y: 80, description: 'Executes reduction algorithms.' },
          { id: 'db', label: 'PostgreSQL', x: 90, y: 50, description: 'ACID compliant storage layer.' }
        ],
        edges: [
          { source: 'client', target: 'api', animated: true },
          { source: 'api', target: 'worker', animated: false },
          { source: 'worker', target: 'db', animated: true },
          { source: 'client', target: 'worker', animated: false }
        ]
      },
      section05_challenge: 'Implementing deterministic cyclic reduction introduced significant computational overhead. Standard approaches blocked the event loop when processing graphs with more than a few hundred nodes.',
      section06_solution: 'We engineered a Web Worker based offloading system on the client, and a dedicated Rust microservice on the backend to handle the intensive max-flow calculations asynchronously.',
      section07_result: 'The system reduces transaction volume by up to 60%, processing thousands of concurrent graph mutations with p99 latency under 50ms.'
    }
  },
  {
    id: 'rapaport',
    title: 'Rapaport Calculator',
    problem: 'Pricing models for crystalline assets require complex matrix evaluations against volatile real-time data.',
    solution: 'A high-performance React data grid integrated with a streaming pricing service.',
    technology: ['React', 'Node.js', 'Web Workers', 'Data Grid'],
    role: 'Lead Developer',
    githubUrl: 'https://github.com/aryan-amdavadi/Rapaport-Calculator',
    caseStudyRoute: '/projects/rapaport',
    artifactIndex: 1,
    caseStudy: {
      section01_problem: 'The diamond and gemstone industry relies on the Rapaport pricing matrix. Evaluating vast inventories against real-time, highly volatile price shifts traditionally freezes browser main threads and leads to unacceptable lag.',
      section02_question: 'How can we build a web-based data grid capable of rendering and recalculating 100,000+ rows at 60fps?',
      section03_idea: 'By completely decoupling the pricing computation from the rendering lifecycle and utilizing a virtualized DOM, we can maintain interaction smoothness regardless of data size.',
      section04_architecture: {
        nodes: [
          { id: 'ui', label: 'Virtual Grid', x: 10, y: 50, description: 'Renders only visible rows.' },
          { id: 'worker', label: 'Web Worker', x: 50, y: 20, description: 'Performs matrix multiplication.' },
          { id: 'ws', label: 'WebSocket', x: 50, y: 80, description: 'Streams live price updates.' },
          { id: 'cache', label: 'IndexedDB', x: 90, y: 50, description: 'Local inventory cache.' }
        ],
        edges: [
          { source: 'ws', target: 'worker', animated: true },
          { source: 'worker', target: 'ui', animated: false },
          { source: 'ui', target: 'cache', animated: false },
          { source: 'worker', target: 'cache', animated: true }
        ]
      },
      section05_challenge: 'The primary challenge was handling thousands of simultaneous cell updates per second without triggering expensive React re-renders across the entire component tree.',
      section06_solution: 'Implemented a custom virtualized grid that binds directly to a SharedArrayBuffer updated by the Web Worker, bypassing React state entirely for high-frequency pricing ticks.',
      section07_result: 'The calculator sustains 60fps rendering while processing 5,000+ price updates per second, drastically improving the analytical capabilities of merchants.'
    }
  },
  {
    id: 'secretspeak',
    title: 'SecretSpeak',
    problem: 'Standard cryptographic protocols in secure messaging are easily identifiable by deep packet inspection.',
    solution: 'A procedural language framework for obfuscated communication over WebSockets.',
    technology: ['Python', 'C Extensions', 'WebSockets', 'Cryptography'],
    role: 'Backend Architect',
    githubUrl: 'https://github.com/aryan-amdavadi/SecretSpeak',
    caseStudyRoute: '/projects/secretspeak',
    artifactIndex: 2,
    caseStudy: {
      section01_problem: 'In highly restricted network environments, simply encrypting data is insufficient. Deep Packet Inspection (DPI) can identify TLS or standard WebSocket handshakes and block the traffic entirely.',
      section02_question: 'How might we disguise encrypted communication streams to look like innocuous, procedural application data?',
      section03_idea: 'By wrapping encrypted payloads within a procedurally generated, structurally valid but semantically meaningless cover language, we can bypass DPI heuristics.',
      section04_architecture: {
        nodes: [
          { id: 'client', label: 'Client App', x: 10, y: 50, description: 'Generates cover language.' },
          { id: 'socket', label: 'WSS Endpoint', x: 50, y: 20, description: 'Terminates secure connection.' },
          { id: 'decoder', label: 'C-Extension', x: 50, y: 80, description: 'Strips procedural cover.' },
          { id: 'router', label: 'Message Router', x: 90, y: 50, description: 'Delivers stripped payload.' }
        ],
        edges: [
          { source: 'client', target: 'socket', animated: true },
          { source: 'socket', target: 'decoder', animated: false },
          { source: 'decoder', target: 'router', animated: true }
        ]
      },
      section05_challenge: 'Applying complex procedural transformations and statistical shaping to every packet introduced unacceptable latency, destroying the real-time feel of the messaging app.',
      section06_solution: 'Engineered a highly optimized C-extension for the core Python backend to handle the obfuscation loop, reducing computational overhead by 75%.',
      section07_result: 'The system successfully masks communication patterns from standard DPI tools while maintaining end-to-end delivery latencies under 150ms.'
    }
  },
  {
    id: 'tabster',
    title: 'Tabster',
    problem: 'Commerce tracking systems often lack the flexibility to handle modular, multi-party transactions effectively.',
    solution: 'A distributed commerce tracking and transaction structural system.',
    technology: ['TypeScript', 'GraphQL', 'Stripe Connect', 'Redis'],
    role: 'Software Engineer',
    githubUrl: '#',
    caseStudyRoute: '/projects/tabster',
    artifactIndex: 3,
    caseStudy: {
      section01_problem: 'Modern marketplaces require complex, multi-party payment splits. Monolithic transaction structures fail to provide the modularity needed for dynamic routing and automated reconciliation.',
      section02_question: 'How can we build a payment orchestration layer that handles complex splits while maintaining strict ACID compliance?',
      section03_idea: 'By implementing a distributed saga pattern using event streams, we can orchestrate complex payment flows across microservices without relying on slow two-phase commits.',
      section04_architecture: {
        nodes: [
          { id: 'gql', label: 'GraphQL API', x: 10, y: 50, description: 'Client gateway.' },
          { id: 'orchestrator', label: 'Saga Orchestrator', x: 50, y: 20, description: 'Manages transaction state.' },
          { id: 'redis', label: 'Redis Streams', x: 50, y: 80, description: 'Event bus.' },
          { id: 'stripe', label: 'Stripe Connect', x: 90, y: 50, description: 'Payment processor.' }
        ],
        edges: [
          { source: 'gql', target: 'orchestrator', animated: true },
          { source: 'orchestrator', target: 'redis', animated: false },
          { source: 'redis', target: 'stripe', animated: true },
          { source: 'stripe', target: 'orchestrator', animated: true }
        ]
      },
      section05_challenge: 'Ensuring absolute consistency in financial transactions across distributed services is notoriously difficult, especially when external providers (Stripe) rate-limit or timeout.',
      section06_solution: 'Designed an idempotent event-sourcing architecture. Every state transition is appended to an immutable log, allowing the orchestrator to automatically retry or rollback partial failures.',
      section07_result: 'Tabster handles complex multi-party splits with 99.99% transactional reliability, completely eliminating manual reconciliation efforts.'
    }
  },
  {
    id: 'pulsesync',
    title: 'PulseSync',
    problem: 'Health monitoring signals generate massive amounts of noisy data that is difficult to visualize in real-time.',
    solution: 'A WebGL-based visualization engine powered by WebRTC for low-latency telemetry streaming.',
    technology: ['WebGL', 'WebRTC', 'React', 'GLSL'],
    role: 'Frontend Engineer',
    githubUrl: '#',
    caseStudyRoute: '/projects/pulsesync',
    artifactIndex: 4,
    caseStudy: {
      section01_problem: 'Continuous biological telemetry devices stream high-frequency data. Rendering this data in the browser using SVG or Canvas 2D quickly bottlenecks the CPU, causing UI freezes.',
      section02_question: 'How might we visualize thousands of incoming data points per second with zero perceived lag?',
      section03_idea: 'By establishing a direct WebRTC data channel and offloading the signal rendering entirely to the GPU via custom shaders, we bypass the browser DOM and CPU limitations.',
      section04_architecture: {
        nodes: [
          { id: 'device', label: 'Hardware Sensor', x: 10, y: 50, description: 'Emits raw telemetry.' },
          { id: 'webrtc', label: 'WebRTC Channel', x: 50, y: 20, description: 'UDP-based low latency.' },
          { id: 'buffer', label: 'Ring Buffer', x: 50, y: 80, description: 'Memory-safe storage.' },
          { id: 'webgl', label: 'WebGL Canvas', x: 90, y: 50, description: 'GPU rendering.' }
        ],
        edges: [
          { source: 'device', target: 'webrtc', animated: true },
          { source: 'webrtc', target: 'buffer', animated: false },
          { source: 'buffer', target: 'webgl', animated: true }
        ]
      },
      section05_challenge: 'Managing memory allocation for continuous data streams in JavaScript often triggers garbage collection pauses, which manifests as visual stuttering in the waveform.',
      section06_solution: 'Implemented a strict zero-allocation ring buffer using TypedArrays. Data is written directly into pre-allocated memory spaces that are bound to WebGL vertex buffers.',
      section07_result: 'The visualization engine maintains a rock-solid 120fps while rendering 4 concurrent high-frequency signals, providing medical-grade visual fidelity.'
    }
  },
  {
    id: 'enginexus',
    title: 'EngiNexus',
    problem: 'University data systems are fragmented, making it difficult to construct a unified intelligence graph.',
    solution: 'A connected data system using a graph database to surface academic relationships.',
    technology: ['Next.js', 'Neo4j', 'GraphQL', 'TailwindCSS'],
    role: 'Full-Stack Engineer',
    githubUrl: '#',
    caseStudyRoute: '/projects/enginexus',
    artifactIndex: 5,
    caseStudy: {
      section01_problem: 'University resources—students, courses, research papers, and faculty—are stored in siloed relational databases. Querying complex relationships (e.g., "Find all undergrads assisting in ML research led by Prof. X") is prohibitively slow.',
      section02_question: 'How can we unify fragmented academic data into a single, highly performant intelligence graph?',
      section03_idea: 'By migrating the core metadata to a specialized graph database (Neo4j) and exposing it via a tailored GraphQL API, we can traverse deep relationships in milliseconds.',
      section04_architecture: {
        nodes: [
          { id: 'next', label: 'Next.js App', x: 10, y: 50, description: 'SSR presentation layer.' },
          { id: 'gql', label: 'GraphQL Server', x: 50, y: 20, description: 'Resolves complex queries.' },
          { id: 'neo4j', label: 'Neo4j Cluster', x: 50, y: 80, description: 'Graph database.' },
          { id: 'sync', label: 'ETL Pipeline', x: 90, y: 50, description: 'Ingests legacy data.' }
        ],
        edges: [
          { source: 'next', target: 'gql', animated: true },
          { source: 'gql', target: 'neo4j', animated: false },
          { source: 'sync', target: 'neo4j', animated: true }
        ]
      },
      section05_challenge: 'Traversing highly connected hub nodes (like mandatory 101 courses with thousands of edges) caused query execution times to spike unpredictably.',
      section06_solution: 'Implemented graph projections and materialized views for common traversals. We tuned the Cypher queries to utilize node-local indexes effectively.',
      section07_result: 'Reduced p99 query latency from over 800ms to just 45ms, enabling real-time exploratory analytics across the entire university data model.'
    }
  }
];
