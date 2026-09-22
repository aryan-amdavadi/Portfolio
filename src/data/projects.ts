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
    solution: 'A directed graph reduction algorithm modeling and settling complex financial relationships.',
    technology: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Better Auth', 'Swagger'],
    role: 'Full-Stack Engineer',
    githubUrl: 'https://github.com/aryan-amdavadi/SplitSphere',
    liveUrl: '#',
    caseStudyRoute: '/projects/splitsphere',
    artifactIndex: 0,
    image: '/images/projects/splitsphere.jpg',
    alt: 'SplitSphere application architecture',
    caseStudy: {
      problem: 'When individuals share expenses in highly connected groups, the resulting debt graph contains complex cycles. Resolving these using naive approaches results in N^2 transactions, degrading both UX and backend performance.',
      idea: 'A centralized system to manage group expenses that automatically calculates the minimum cash flow required to settle all debts.',
      system: 'The system uses a graph-based representation where users are nodes and debts are directed edges. It includes session-based authentication via Better Auth (HTTP-only cookies), PostgreSQL for state, and a Node.js/Express API layer that ingests structured split data.',
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
      challenge: 'The hardest engineering challenge is calculating the net balances and applying a minimum cash flow algorithm to a complex graph of debts, eliminating cyclic debt without dropping any financial obligations.',
      solution: 'We implemented a max-flow min-cut inspired graph reduction algorithm on the backend that recalculates the optimal settlement path anytime a group expense is added or modified. The engine traverses multiple users, maps individual obligations, reduces debts, and yields an optimized settlement graph.',
      details: [
        { title: 'Authentication', content: 'Session authentication implemented via Better Auth, utilizing HTTP-only cookies and persistent, PostgreSQL-backed sessions to secure protected user routes.' },
        { title: 'Algorithms', content: 'Minimum cash flow algorithm built for optimal settlement, executing efficiently over the structured expense split graph.' },
        { title: 'State Management', content: 'Group memberships and running expense balances are strictly managed in relational PostgreSQL tables via Prisma ORM.' }
      ],
      result: 'The system accurately computes optimal settlement paths for any number of users and expenses, significantly reducing the total number of transactions required to settle balances within a group.'
    }
  },
  {
    id: 'rapaport',
    title: 'Rapaport Calculator',
    category: 'Data Pricing Engine',
    problem: 'Pricing models for crystalline assets require complex matrix evaluations against volatile real-time data.',
    solution: 'A high-performance calculation flow utilizing structured pricing data ingestion.',
    technology: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'ShadCN', 'Zod', 'TanStack Table', 'Node.js', 'PostgreSQL'],
    role: 'Lead Developer',
    githubUrl: 'https://github.com/aryan-amdavadi/Rapaport-Calculator',
    liveUrl: '#',
    caseStudyRoute: '/projects/rapaport',
    artifactIndex: 1,
    image: '/images/projects/rapaport.jpg',
    alt: 'Rapaport Calculator interface',
    caseStudy: {
      problem: 'The diamond and gemstone industry relies on the Rapaport pricing matrix. Transforming this vast, structured pricing data via Excel ingestion into a usable, searchable database calculation workflow is typically a brittle, error-prone process.',
      idea: 'A reliable pipeline that ingests complex Excel pricing matrices and exposes them for lightning-fast historical and recent calculations.',
      system: 'The architecture features a Next.js frontend with TanStack Table for data presentation and React Hook Form / Zod for strict input validation. The backend utilizes Node.js and Express to parse Excel files, transforming the data into a normalized PostgreSQL schema via Prisma.',
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
      challenge: 'The most difficult engineering hurdle was accurately transforming the denormalized, two-dimensional Excel grid data into a queryable relational database format without losing the implicit pricing rules governed by stone shape, clarity, and color combinations.',
      solution: 'We built a custom parser in Node.js that maps the matrix coordinates to specific database columns, utilizing Prisma transactions to ensure that if any part of the pricing update fails, the entire ingestion rolls back to preserve historical accuracy.',
      details: [
        { title: 'Data Ingestion', content: 'Robust Excel file parsing and data transformation pipeline.' },
        { title: 'Database Representation', content: 'Normalized PostgreSQL schema ensuring referential integrity of volatile pricing vectors.' },
        { title: 'Search & Calculation', content: 'High-performance React implementation using TanStack Table to handle large datasets without UI lag, including recent calculations tracking.' }
      ],
      result: 'The application successfully ingests complex pricing matrices and provides instant, accurate calculations for users, maintaining a robust history of recent calculations.'
    }
  },
  {
    id: 'secretspeak',
    title: 'SecretSpeak',
    category: 'Procedural Language Studio',
    problem: 'Standard cryptographic protocols in secure messaging are easily identifiable by deep packet inspection.',
    solution: 'A deterministic procedural language-generation studio.',
    technology: ['Next.js', 'Prisma', 'PostgreSQL'],
    role: 'Backend Architect',
    githubUrl: 'https://github.com/aryan-amdavadi/SecretSpeak',
    liveUrl: '#',
    caseStudyRoute: '/projects/secretspeak',
    artifactIndex: 2,
    image: '/images/projects/secretspeak.jpg',
    alt: 'SecretSpeak procedural language generation',
    caseStudy: {
      problem: 'In highly restricted network environments, simply encrypting data is insufficient. Deep Packet Inspection (DPI) can identify standard cryptographic handshakes or structured metadata and block the traffic entirely.',
      idea: 'Disguise encoded communication streams to look like innocuous, procedurally generated human-readable text.',
      system: 'The system uses a Next.js framework backed by PostgreSQL (Prisma) to store deterministic translation dictionaries. A core engine maps standard inputs to a symbolic procedural representation that is structurally valid but meaningless to external observers.',
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
      challenge: 'Ensuring that the procedural generation is perfectly deterministic. If the same input does not yield the exact same procedural structure—or if the inverse operation fails to decode it—the communication is destroyed.',
      solution: 'We engineered a strict symbolic representation engine where every token in the source message is mapped to a specific sequence of procedurally generated grammar blocks based on a seeded dictionary.',
      details: [
        { title: 'Procedural Generation', content: 'Algorithm deterministically converts inputs into readable, obfuscated grammar trees.' },
        { title: 'Symbolic Representation', content: 'Mappings are firmly stored and retrieved from PostgreSQL without relying on unpredictable AI models.' }
      ],
      result: 'The system reliably transforms messages into procedural structures and back, providing a functional obfuscation layer that operates entirely predictably.'
    }
  },
  {
    id: 'tabster',
    title: 'Tabster',
    category: 'Commerce Platform',
    problem: 'Commerce tracking systems often lack the flexibility to handle modular, multi-party transactions effectively.',
    solution: 'A full-stack commerce platform with robust payment and administrative workflows.',
    technology: ['React', 'Node.js', 'Express', 'MySQL', 'Stripe'],
    role: 'Software Engineer',
    githubUrl: '#',
    liveUrl: '#',
    caseStudyRoute: '/projects/tabster',
    artifactIndex: 3,
    image: '/images/projects/tabster.jpg',
    alt: 'Tabster commerce platform',
    caseStudy: {
      problem: 'Building a full-stack commerce platform requires a rigid transactional backbone. Managing product search, order lifecycles, coupons, gift cards, and refunds across separate backend APIs often leads to fragmented state and desynced data.',
      idea: 'A payment orchestration layer that handles complex transactional states while maintaining strict ACID compliance.',
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
      challenge: 'The primary challenge is managing the commerce transaction flow, specifically ensuring that internal order states (credits, gift cards, coupons) remain perfectly synchronized with Stripe\'s external payment intents and webhooks.',
      solution: 'We implemented a webhook-driven state machine. When an order is placed, it is stored in a pending state in MySQL. The backend relies on Stripe webhooks (e.g., payment_intent.succeeded) to execute the final transactional commits, fulfilling the order and debiting gift cards.',
      details: [
        { title: 'Commerce Transaction Architecture', content: 'Complete order lifecycle handling from intent creation to final fulfillment using a webhook-driven state machine.' },
        { title: 'Product Workflows', content: 'Comprehensive features including product search, coupon validation, cards, gift cards, and credits.' },
        { title: 'Administrative Functionality', content: 'Secure endpoints for processing refunds and managing product inventory.' }
      ],
      result: 'The platform provides a reliable, end-to-end commerce flow, successfully processing simulated transactions, managing administrative workflows, and handling refunds without state corruption.'
    }
  },
  {
    id: 'pulsesync',
    title: 'PulseSync',
    category: 'Hardware Prototype',
    problem: 'Health monitoring signals generate massive amounts of noisy data that is difficult to capture and represent efficiently.',
    solution: 'An IoT healthcare monitoring prototype for real-time sensor acquisition.',
    technology: ['ESP32', 'MAX30102', 'AD8232', 'C++'],
    role: 'Hardware/Software Engineer',
    githubUrl: '#',
    liveUrl: '#',
    caseStudyRoute: '/projects/pulsesync',
    artifactIndex: 4,
    image: '/images/projects/pulsesync.jpg',
    alt: 'PulseSync hardware prototype',
    caseStudy: {
      problem: 'Acquiring continuous biological telemetry (like pulse and ECG) requires precise timing. If the embedded system blocks or lags, the resulting signal representation is distorted, making real-time monitoring impossible.',
      idea: 'Acquire, process, and transmit high-frequency sensor data from an embedded device to an application layer without losing signal fidelity.',
      system: 'The hardware prototype uses an ESP32 microcontroller connected to a MAX30102 pulse oximeter and an AD8232 ECG sensor. It acquires analog signals, applies basic digital filtering, and displays the data locally on an OLED display while transmitting over serial/WiFi.',
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
      challenge: 'The main engineering challenge was managing the ESP32\'s interrupt routines and ADC (Analog-to-Digital Converter) polling to sample the AD8232 ECG sensor at a consistent, high frequency without overwhelming the main loop.',
      solution: 'We utilized FreeRTOS on the ESP32 to pin the sensor acquisition task to a dedicated core. This ensured that the tight timing requirements for signal sampling were met, while the other core handled the OLED display and network transmission.',
      details: [
        { title: 'Embedded System', content: 'Dual-core task pinning using FreeRTOS for uninterrupted sensor polling.' },
        { title: 'Signal Flow & Sensor Acquisition', content: 'Raw analog data acquisition converted and filtered before display and transmission.' }
      ],
      result: 'The prototype successfully acquires and visualizes real-time pulse and ECG signals on the OLED display and transmits a stable data pipeline to the application layer. (Note: This is a prototype and makes no medical diagnostic claims.)'
    }
  },
  {
    id: 'enginexus',
    title: 'EngiNexus',
    category: 'Analytics Dashboard',
    problem: 'University data systems are fragmented, making it difficult to construct a unified view of resources and talent.',
    solution: 'A university intelligence and analytics platform prototype created for SIH.',
    technology: ['React', 'Node.js', 'PostgreSQL', 'Data Visualization'],
    role: 'Full-Stack Engineer',
    githubUrl: '#',
    liveUrl: '#',
    caseStudyRoute: '/projects/enginexus',
    artifactIndex: 5,
    image: '/images/projects/enginexus.jpg',
    alt: 'EngiNexus university analytics dashboard',
    caseStudy: {
      problem: 'University resources—students, projects, faculty, labs, and talent—are typically siloed. Finding cross-disciplinary connections or analyzing aggregate project intelligence across departments is a manual, inefficient process.',
      idea: 'Unify fragmented academic and project data to enable data-driven navigation and resource intelligence.',
      system: 'Built as a hackathon prototype for SIH, the platform ingests university data sets into a relational database and exposes it through a dashboard. It maps relationships between users, projects, and lab resources.',
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
      challenge: 'Designing a schema that was flexible enough to handle highly variable project and talent data while remaining performant enough to serve aggregate university analytics in a dashboard.',
      solution: 'We engineered a highly normalized relational schema that separates core entities (Users, Labs, Projects) while using extensive junction tables to map the many-to-many relationships, facilitating complex SQL joins for the analytics views.',
      details: [
        { title: 'Project & Resource Intelligence', content: 'Cross-disciplinary analysis of students, projects, and lab resources.' },
        { title: 'Database Design', content: 'Highly normalized relational schema optimized for aggregate analytics and complex joins.' }
      ],
      result: 'The prototype successfully demonstrates how disparate university data can be aggregated to provide actionable intelligence on lab utilization and student project alignment.'
    }
  }
];
