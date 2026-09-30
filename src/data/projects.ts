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
  problem: string;
  idea: string;
  system: string;
  architecture?: {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
  challenge: string;
  solution: string;
  details: { title: string; content: string }[];
  result: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  technology: string[];
  role: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyRoute?: string;
  artifactIndex: number;
  image: string;
  alt: string;
  caseStudy?: CaseStudyData;
}

export const projects: Project[] = [
  {
    id: 'splitsphere',
    title: 'SplitSphere',
    category: 'Full-Stack Application',
    problem: 'Managing shared expenses across connected groups creates cyclic debt patterns that are computationally expensive to resolve.',
    solution: 'Built an AI-first collaborative expense splitting and financial coordination platform to calculate optimal settlements.',
    technology: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Better Auth', 'Swagger'],
    role: 'Full-Stack Engineer',
    githubUrl: 'https://github.com/aryan-amdavadi/SplitSphere',
    caseStudyRoute: '/projects/splitsphere',
    artifactIndex: 0,
    image: '/images/projects/splitsphere.jpg',
    alt: 'SplitSphere application architecture',
    caseStudy: {
      problem: 'When individuals share expenses in highly connected groups, the resulting debt graph contains complex cycles. Resolving these using naive approaches results in N^2 transactions, degrading both UX and backend performance.',
      idea: 'An AI-first collaborative expense splitting and financial coordination platform to manage groups and automatically calculate minimum cash flow settlements.',
      system: 'The system uses a graph-based representation where users are nodes and debts are directed edges. It includes session-based authentication via Better Auth (HTTP-only cookies), PostgreSQL for persistent sessions, and a Node.js/Express API layer that ingests structured expense data.',
      architecture: {
        nodes: [
          { id: 'auth', label: 'Auth Layer (Better Auth)', x: 10, y: 50, description: 'Handles session/cookies.' },
          { id: 'api', label: 'Node/Express API', x: 50, y: 20, description: 'Groups and expenses.' },
          { id: 'engine', label: 'Balance Engine', x: 50, y: 80, description: 'Calculates optimal settlement.' },
          { id: 'db', label: 'PostgreSQL (Prisma)', x: 90, y: 50, description: 'Relational data store.' }
        ],
        edges: [
          { source: 'auth', target: 'api', animated: true },
          { source: 'api', target: 'db', animated: false },
          { source: 'api', target: 'engine', animated: true },
          { source: 'engine', target: 'db', animated: false }
        ]
      },
      challenge: 'Calculating net balances and applying a minimum cash flow settlement across a complex graph of debts, eliminating cyclic debt without dropping any financial obligations.',
      solution: 'Built a minimum cash-flow settlement algorithm on the backend that recalculates the optimal settlement path anytime a group expense is added or modified. The engine traverses multiple users, maps individual obligations, reduces debts, and yields an optimized settlement graph.',
      details: [
        { title: 'Authentication', content: 'Implemented secure session authentication using Better Auth with HTTP-only cookies and persistent PostgreSQL-backed sessions.' },
        { title: 'Balance Calculation', content: 'Developed a minimum cash flow algorithm to resolve cyclic debts and calculate the fewest required transactions to settle all group balances.' },
        { title: 'State Management', content: 'Managed users, groups, memberships, expenses, and splits in relational PostgreSQL tables via Prisma ORM.' }
      ],
      result: 'The system accurately computes optimal settlement paths for any number of users and expenses, successfully reducing the total number of transactions required to settle balances within a group.'
    }
  },
  {
    id: 'rapaport',
    title: 'Rapaport Calculator',
    category: 'Data Pricing Engine',
    problem: 'Pricing models for crystalline assets require complex matrix evaluations against structured data.',
    solution: 'Built a pricing-data and calculation system for diamond-market workflows to ingest and query large matrices.',
    technology: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'ShadCN', 'Zod', 'TanStack Table', 'Node.js', 'PostgreSQL'],
    role: 'Lead Developer',
    githubUrl: 'https://github.com/aryan-amdavadi/Rapaport-Calculator',
    caseStudyRoute: '/projects/rapaport',
    artifactIndex: 1,
    image: '/images/projects/rapaport.jpg',
    alt: 'Rapaport Calculator interface',
    caseStudy: {
      problem: 'The diamond and gemstone industry relies on the Rapaport pricing matrix. Transforming this vast, structured pricing data via Excel ingestion into a usable, searchable database calculation workflow is typically a brittle process.',
      idea: 'A pricing-data and calculation system for diamond-market workflows that ingests Excel pricing matrices and exposes them for fast historical and recent calculations.',
      system: 'The architecture features a Next.js frontend with TanStack Table for data presentation and Zod for strict input validation. The backend utilizes Node.js and Express to parse Excel files, transforming the data into a normalized PostgreSQL schema via Prisma.',
      architecture: {
        nodes: [
          { id: 'excel', label: 'Excel Ingestion', x: 10, y: 50, description: 'Parses Rapaport files.' },
          { id: 'api', label: 'Express API', x: 50, y: 20, description: 'Validates structure.' },
          { id: 'db', label: 'PostgreSQL', x: 50, y: 80, description: 'Stores pricing data.' },
          { id: 'ui', label: 'Next.js Frontend', x: 90, y: 50, description: 'Calculates/Searches.' }
        ],
        edges: [
          { source: 'excel', target: 'api', animated: true },
          { source: 'api', target: 'db', animated: false },
          { source: 'db', target: 'ui', animated: true }
        ]
      },
      challenge: 'Accurately transforming denormalized, two-dimensional Excel grid data into a queryable relational database format without losing the implicit pricing rules governed by stone shape, clarity, and color combinations.',
      solution: 'Built a custom parser in Node.js that maps the matrix coordinates to specific database columns. Utilized Prisma transactions to ensure that if any part of the pricing update fails, the entire ingestion rolls back to preserve data integrity.',
      details: [
        { title: 'Data Ingestion', content: 'Built a robust Excel file parsing and data transformation pipeline for structured pricing data.' },
        { title: 'Database Representation', content: 'Designed a normalized PostgreSQL schema to ensure referential integrity of pricing vectors.' },
        { title: 'Search & Calculation', content: 'Implemented a high-performance React table using TanStack Table to handle large datasets, calculation workflows, and track recent calculations.' }
      ],
      result: 'The application successfully ingests complex pricing matrices and provides instant, accurate calculations for users, maintaining a robust history of recent calculations.'
    }
  },
  {
    id: 'secretspeak',
    title: 'SecretSpeak',
    category: 'Procedural Language Studio',
    problem: 'Standard protocols often possess identifiable metadata that makes them vulnerable to structural analysis.',
    solution: 'Built a deterministic procedural language-generation studio to translate standard inputs into symbolic representations.',
    technology: ['Next.js', 'Prisma', 'PostgreSQL'],
    role: 'Backend Architect',
    githubUrl: 'https://github.com/aryan-amdavadi/SecretSpeak',
    caseStudyRoute: '/projects/secretspeak',
    artifactIndex: 2,
    image: '/images/projects/secretspeak.jpg',
    alt: 'SecretSpeak procedural language generation',
    caseStudy: {
      problem: 'Data transformed through standard encoding schemes often retains identifiable metadata structures. Converting input into truly innocuous, readable text requires complex, repeatable procedural generation.',
      idea: 'A deterministic procedural language-generation studio that transforms structured inputs into symbolic, procedurally generated human-readable text.',
      system: 'The system uses a Next.js framework backed by PostgreSQL (Prisma) to store deterministic translation dictionaries. A core engine maps standard inputs to a symbolic procedural representation based on these persisted dictionaries.',
      architecture: {
        nodes: [
          { id: 'input', label: 'Input Text', x: 10, y: 50, description: 'Raw user message.' },
          { id: 'engine', label: 'Generation Engine', x: 50, y: 20, description: 'Deterministic mapping.' },
          { id: 'db', label: 'PostgreSQL', x: 50, y: 80, description: 'Symbol dictionaries.' },
          { id: 'output', label: 'Procedural Output', x: 90, y: 50, description: 'Obfuscated text.' }
        ],
        edges: [
          { source: 'input', target: 'engine', animated: true },
          { source: 'db', target: 'engine', animated: false },
          { source: 'engine', target: 'output', animated: true }
        ]
      },
      challenge: 'Ensuring that the procedural generation is perfectly deterministic. If the same input does not yield the exact same procedural structure—or if the inverse operation fails to decode it—the symbolic representation breaks.',
      solution: 'Engineered a strict symbolic representation engine where every token in the source message is mapped to a specific sequence of procedurally generated grammar blocks based on a seeded dictionary.',
      details: [
        { title: 'Procedural Generation', content: 'Algorithm deterministically converts inputs into repeatable, structurally valid grammar trees.' },
        { title: 'Symbolic Representation', content: 'Mappings are firmly stored and retrieved from PostgreSQL to ensure identical output for specific inputs.' },
        { title: 'Data Persistence', content: 'Designed robust database tables to persist the translation dictionaries necessary for the procedural generation.' }
      ],
      result: 'The system reliably transforms messages into procedural structures and back, providing a functional symbolic representation layer that operates predictably.'
    }
  },
  {
    id: 'tabster',
    title: 'Tabster',
    category: 'Commerce Platform',
    problem: 'Commerce tracking systems often lack the flexibility to handle modular, multi-party transactions effectively.',
    solution: 'Built a full-stack commerce platform to orchestrate complex transactional workflows.',
    technology: ['React', 'Node.js', 'Express', 'MySQL', 'Stripe'],
    role: 'Software Engineer',
    caseStudyRoute: '/projects/tabster',
    artifactIndex: 3,
    image: '/images/projects/tabster.jpg',
    alt: 'Tabster commerce platform',
    caseStudy: {
      problem: 'Building a full-stack commerce platform requires a rigid transactional backbone. Managing product search, order lifecycles, coupons, gift cards, and credits across separate backend APIs often leads to fragmented state and desynced data.',
      idea: 'A full-stack commerce platform that handles complex transactional workflows and integrates with Stripe.',
      system: 'A React frontend communicates with a Node.js/Express backend API. Product and transactional state is stored in MySQL. The system integrates tightly with Stripe for payment processing, mapping Stripe webhooks to internal order states.',
      architecture: {
        nodes: [
          { id: 'react', label: 'React Client', x: 10, y: 50, description: 'Commerce UI.' },
          { id: 'api', label: 'Backend APIs', x: 50, y: 20, description: 'Order orchestration.' },
          { id: 'mysql', label: 'MySQL', x: 50, y: 80, description: 'Transactional state.' },
          { id: 'stripe', label: 'Stripe', x: 90, y: 50, description: 'Payment processing.' }
        ],
        edges: [
          { source: 'react', target: 'api', animated: true },
          { source: 'api', target: 'mysql', animated: false },
          { source: 'api', target: 'stripe', animated: true },
          { source: 'stripe', target: 'api', animated: true }
        ]
      },
      challenge: 'Managing the commerce transaction flow, specifically ensuring that internal order states (credits, gift cards, coupons) remain perfectly synchronized with Stripe\'s external payment intents and webhooks.',
      solution: 'Implemented a webhook-driven state machine. When an order is placed, it is stored in a pending state in MySQL. The backend relies on Stripe webhooks (e.g., payment_intent.succeeded) to execute the final transactional commits and fulfill the order.',
      details: [
        { title: 'Commerce Transaction Architecture', content: 'Built complete order lifecycle handling from intent creation to final fulfillment using a webhook-driven state machine.' },
        { title: 'Product Workflows', content: 'Implemented comprehensive features including products, orders, coupons, cards, gift cards, and credits.' },
        { title: 'Administrative Functionality', content: 'Developed secure endpoints for managing product inventory and monitoring transactional workflows.' }
      ],
      result: 'The platform provides a reliable, end-to-end commerce flow, successfully processing transactions and managing administrative workflows.'
    }
  },
  {
    id: 'pulsesync',
    title: 'PulseSync',
    category: 'Hardware Prototype',
    problem: 'Health monitoring signals generate noisy data that is difficult to capture and represent efficiently.',
    solution: 'Built an embedded/IoT physiological-signal monitoring prototype for real-time sensor acquisition.',
    technology: ['ESP32', 'MAX30102', 'AD8232', 'C++'],
    role: 'Hardware/Software Engineer',
    caseStudyRoute: '/projects/pulsesync',
    artifactIndex: 4,
    image: '/images/projects/pulsesync.jpg',
    alt: 'PulseSync hardware prototype',
    caseStudy: {
      problem: 'Acquiring continuous physiological telemetry (like pulse and ECG) requires precise timing. If the embedded system blocks or lags, the resulting signal representation is distorted.',
      idea: 'An embedded/IoT physiological-signal monitoring prototype to acquire, process, and transmit high-frequency sensor data from an embedded device to an application layer.',
      system: 'The hardware prototype uses an ESP32 microcontroller connected to a MAX30102 pulse oximeter and an AD8232 ECG sensor. It acquires analog signals, applies digital processing, displays data locally on an OLED, and transmits it via device-to-application communication.',
      architecture: {
        nodes: [
          { id: 'sensors', label: 'Biometric Sensors', x: 10, y: 50, description: 'MAX30102 / AD8232' },
          { id: 'esp32', label: 'ESP32', x: 50, y: 20, description: 'Signal acquisition.' },
          { id: 'oled', label: 'OLED Display', x: 50, y: 80, description: 'Local monitoring.' },
          { id: 'app', label: 'Application Layer', x: 90, y: 50, description: 'Telemetry visualization.' }
        ],
        edges: [
          { source: 'sensors', target: 'esp32', animated: true },
          { source: 'esp32', target: 'oled', animated: false },
          { source: 'esp32', target: 'app', animated: true }
        ]
      },
      challenge: 'Managing the ESP32\'s interrupt routines and ADC polling to sample the AD8232 ECG sensor at a consistent, high frequency without overwhelming the main loop.',
      solution: 'Utilized FreeRTOS on the ESP32 to pin the sensor acquisition task to a dedicated core. This ensured that the tight timing requirements for signal sampling were met, while the other core handled the OLED display and network transmission.',
      details: [
        { title: 'Embedded Processing', content: 'Utilized dual-core task pinning using FreeRTOS for uninterrupted sensor polling.' },
        { title: 'Sensor Acquisition', content: 'Acquired raw analog data from MAX30102 and AD8232 sensors, converting and filtering it before transmission.' },
        { title: 'Signal Visualization', content: 'Displayed physiological signals in real-time on a connected OLED display and built device-to-application communication for remote monitoring.' }
      ],
      result: 'The prototype successfully acquires and visualizes pulse and ECG signals on the OLED display and transmits a stable data pipeline to the application layer. (Note: This is a prototype and makes no medical diagnostic claims.)'
    }
  },
  {
    id: 'enginexus',
    title: 'EngiNexus',
    category: 'Analytics Dashboard',
    problem: 'University data systems are fragmented, making it difficult to construct a unified view of resources and talent.',
    solution: 'Built a university intelligence and analytics prototype to facilitate cross-domain discovery and data visualization.',
    technology: ['React', 'Node.js', 'PostgreSQL', 'Data Visualization'],
    role: 'Full-Stack Engineer',
    caseStudyRoute: '/projects/enginexus',
    artifactIndex: 5,
    image: '/images/projects/enginexus.jpg',
    alt: 'EngiNexus university analytics dashboard',
    caseStudy: {
      problem: 'University resources—students, projects, faculty, labs, and talent—are typically siloed. Finding cross-disciplinary connections or analyzing aggregate project intelligence across departments is a manual, inefficient process.',
      idea: 'A university intelligence and analytics prototype developed for SIH to map student, faculty, and resource relationships.',
      system: 'Built as a hackathon prototype, the platform ingests university data sets into a relational database and exposes it through a data visualization dashboard. It maps relationships between users, projects, and lab resources.',
      architecture: {
        nodes: [
          { id: 'data', label: 'University Data', x: 10, y: 50, description: 'Siloed datasets.' },
          { id: 'backend', label: 'API Layer', x: 50, y: 20, description: 'Data aggregation.' },
          { id: 'db', label: 'PostgreSQL', x: 50, y: 80, description: 'Relational intelligence.' },
          { id: 'dashboard', label: 'Analytics Dashboard', x: 90, y: 50, description: 'Data-driven navigation.' }
        ],
        edges: [
          { source: 'data', target: 'backend', animated: true },
          { source: 'backend', target: 'db', animated: false },
          { source: 'db', target: 'dashboard', animated: true }
        ]
      },
      challenge: 'Designing a schema flexible enough to handle variable project and talent data while remaining performant enough to serve aggregate university analytics.',
      solution: 'Engineered a normalized relational schema that separates core entities (Users, Labs, Projects) while using extensive junction tables to map the many-to-many relationships, facilitating complex SQL joins for the analytics views.',
      details: [
        { title: 'Project Intelligence', content: 'Built systems for cross-domain discovery and analysis of students, projects, and lab resources.' },
        { title: 'Database Functionality', content: 'Designed a normalized relational schema in PostgreSQL optimized for aggregate analytics and complex joins.' },
        { title: 'Data Visualization', content: 'Implemented interactive frontend components to visualize student/faculty/resource relationships.' }
      ],
      result: 'The prototype successfully demonstrates how disparate university data can be aggregated to provide actionable intelligence on lab utilization and student project alignment.'
    }
  }
];
