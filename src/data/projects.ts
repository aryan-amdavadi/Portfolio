export interface DiagramNode {
  id: string;
  label: string;
  category?: string;
  x: number;
  y: number;
  description: string;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
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
  figureLabel?: string;
  accentColor?: string;
  accentColorLight?: string;
  caseStudy?: CaseStudyData;
}

export const projects: Project[] = [
  {
    id: 'splitsphere',
    title: 'SplitSphere',
    category: 'Full-Stack Application',
    problem: 'Managing shared expenses across connected groups creates cyclic debt patterns that are computationally complex to resolve.',
    solution: 'Built a collaborative expense splitting platform with a greedy minimum cash flow engine to resolve cyclic debts into minimal settlement transactions.',
    technology: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Better Auth', 'Swagger'],
    role: 'Full-Stack Engineer',
    githubUrl: 'https://github.com/aryan-amdavadi/SplitSphere',
    caseStudyRoute: '/projects/splitsphere',
    artifactIndex: 0,
    image: '/images/projects/splitsphere.webp',
    alt: 'SplitSphere architectural balance flow and node graph installation',
    figureLabel: 'FIG. 01 // DIRECTED DEBT GRAPH & SETTLEMENT ENGINE',
    accentColor: '#00A896',
    accentColorLight: '#006466',
    caseStudy: {
      problem: 'When individuals share expenses in highly connected social groups, the resulting obligations form a dense directed graph with cyclic debt paths. Naive pairwise settlement requires up to N*(N-1)/2 individual transactions, creating high friction for participants and messy financial reconciliation.',
      idea: 'A collaborative financial coordination platform that ingests group expenses, calculates net individual balances, and automatically runs a graph-simplification algorithm to settle group debts in at most N - 1 discrete transactions.',
      system: 'The backend is built with Node.js and Express in TypeScript. Session security uses Better Auth with HTTP-only cookies and a PostgreSQL-backed persistent session store. Expense splits are stored in normalized relational tables via Prisma ORM, and the settlement engine operates on in-memory net balance vectors derived from transaction ledgers.',
      architecture: {
        nodes: [
          { id: 'auth', label: 'Better Auth Session', category: 'AUTH', x: 14, y: 50, description: 'Manages user authentication and HTTP-only session tokens persisted in PostgreSQL.' },
          { id: 'api', label: 'Express REST Gateway', category: 'API', x: 38, y: 28, description: 'Validates group membership, ingests expense payloads, and exposes Swagger documentation.' },
          { id: 'engine', label: 'minCashFlow Engine', category: 'ALGO', x: 62, y: 72, description: 'Extracts net balances and executes recursive greedy matching between max debtors and max creditors.' },
          { id: 'db', label: 'PostgreSQL & Prisma', category: 'STORAGE', x: 86, y: 50, description: 'Relational data store persisting users, groups, expense items, and itemized participant splits.' }
        ],
        edges: [
          { source: 'auth', target: 'api', label: 'Session Token', animated: true },
          { source: 'api', target: 'engine', label: 'Balance Vector', animated: true },
          { source: 'engine', target: 'db', label: 'Acyclic Plan', animated: false },
          { source: 'api', target: 'db', label: 'Ledger Writes', animated: false }
        ]
      },
      challenge: 'Resolving multi-payer group expenses without creating orphaned fractions or circular transfers, ensuring that settlement amounts sum exactly to zero across all participating members.',
      solution: 'Implemented a recursive greedy minimum cash flow algorithm. For any expense graph, the engine computes each participant\'s net balance (total credits minus total debts). It then repeatedly pairs the maximum debtor with the maximum creditor for the minimum of their absolute balances, reducing the problem size by at least one participant per step.',
      details: [
        { title: 'Session Authentication', content: 'Integrated Better Auth using HTTP-only cookies and persistent database sessions to keep authentication state isolated from client scripting.' },
        { title: 'Graph Settlement Engine', content: 'Developed the minCashFlow solver that condenses multi-edge debt graphs into an acyclic minimum transaction settlement plan.' },
        { title: 'Relational Ledger Design', content: 'Structured Prisma models for Groups, GroupMembers, Expenses, and ExpenseSplits to guarantee referential integrity and auditability.' }
      ],
      result: 'The engine successfully simplifies multi-party debt graphs into at most N - 1 transactions. The backend API is fully typed in TypeScript and documented via OpenAPI/Swagger endpoints.'
    }
  },
  {
    id: 'rapaport',
    title: 'Rapaport Calculator',
    category: 'Data Pricing Engine',
    problem: 'Diamond and crystalline asset valuation relies on dense multi-dimensional matrix sheets that are tedious to query manually.',
    solution: 'Built an automated matrix-parsing pipeline and valuation interface to transform complex pricing sheets into indexed relational tables.',
    technology: ['Next.js', 'React', 'TypeScript', 'Zod', 'TanStack Table', 'Prisma', 'PostgreSQL'],
    role: 'Lead Developer',
    githubUrl: 'https://github.com/aryan-amdavadi/Rapaport-Calculator',
    caseStudyRoute: '/projects/rapaport',
    artifactIndex: 1,
    image: '/images/projects/rapaport.webp',
    alt: 'Rapaport crystalline diamond pricing matrix coordinate structure',
    figureLabel: 'FIG. 02 // 2D CARAT-CLARITY PRICING MATRIX PIPELINE',
    accentColor: '#4EA8DE',
    accentColorLight: '#1D6996',
    caseStudy: {
      problem: 'Diamond market pricing depends on the Rapaport Price List, a dense grid structured across weight tiers, color grades, and clarity ratings. Market operators frequently perform pricing calculations manually or through brittle spreadsheets, increasing the likelihood of input errors in high-value transactions.',
      idea: 'A specialized pricing engine and search workflow that parses 2D matrix sheets directly into a normalized relational database, providing instant coordinate lookups, custom discount formulas, and historical calculation logs.',
      system: 'The frontend is engineered with Next.js and TanStack Table for rapid client-side filtering and sorting. Input payloads are validated with Zod schemas. The backend parses workbook sheets into normalized coordinate vectors and stores them in PostgreSQL using Prisma batch operations.',
      architecture: {
        nodes: [
          { id: 'excel', label: 'Matrix Ingestion', category: 'INGEST', x: 14, y: 50, description: 'Parses 2D pricing grids across carat brackets, clarity grades, and color tiers.' },
          { id: 'api', label: 'Zod Validation Layer', category: 'VALIDATOR', x: 38, y: 28, description: 'Sanitizes matrix coordinates and verifies numerical consistency across pricing vectors.' },
          { id: 'db', label: 'PostgreSQL Store', category: 'STORAGE', x: 62, y: 72, description: 'Persists normalized price entries and calculation audit records using Prisma transactions.' },
          { id: 'ui', label: 'TanStack Table UI', category: 'CLIENT', x: 86, y: 50, description: 'Renders high-density pricing tables with instant filtering, discount multipliers, and history.' }
        ],
        edges: [
          { source: 'excel', target: 'api', label: 'Workbook Sheets', animated: true },
          { source: 'api', target: 'db', label: 'Atomic Batch', animated: false },
          { source: 'db', target: 'ui', label: 'Fast Lookup', animated: true }
        ]
      },
      challenge: 'Parsing denormalized 2D matrix spreadsheets where column and row headers represent continuous ranges (e.g., 0.90–0.99 ct) without losing precision or failing on malformed rows.',
      solution: 'Constructed an extraction pipeline that validates cell coordinates against a strict Zod schema before batch insertion. Wrapped database updates in Prisma transactions so that partial spreadsheet corruptions trigger a clean rollback rather than leaving fragmented pricing records.',
      details: [
        { title: 'Coordinate Ingestion Pipeline', content: 'Built a custom parser that translates multi-header Excel tables into indexed relational records with defined carat boundaries.' },
        { title: 'Transactional Integrity', content: 'Used atomic Prisma transactions to guarantee that pricing updates are committed only when every table coordinate is verified.' },
        { title: 'Interactive Valuation UI', content: 'Leveraged TanStack Table to deliver sub-millisecond filtering across thousands of pricing permutations with customizable discount percentages.' }
      ],
      result: 'The platform eliminates manual spreadsheet cross-referencing, providing immediate pricing calculations based on carat, cut, color, and clarity with zero database inconsistency during updates.'
    }
  },
  {
    id: 'secretspeak',
    title: 'SecretSpeak',
    category: 'Procedural Language Studio',
    problem: 'Standard character encodings produce predictable structural signatures that reveal message formats under inspection.',
    solution: 'Engineered a deterministic procedural language studio that transforms plain text into symbolic linguistic structures using seeded rule sets.',
    technology: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    role: 'Backend Architect',
    githubUrl: 'https://github.com/aryan-amdavadi/SecretSpeak',
    caseStudyRoute: '/projects/secretspeak',
    artifactIndex: 2,
    image: '/images/projects/secretspeak.webp',
    alt: 'SecretSpeak symbolic typographic glyphs and modular language sculpture',
    figureLabel: 'FIG. 03 // DETERMINISTIC TOKEN-SYMBOL BINDING',
    accentColor: '#A855F7',
    accentColorLight: '#6B21A8',
    caseStudy: {
      problem: 'Direct text encoding schemes (like base64 or hexadecimal) produce immediate structural patterns that make the underlying payload obvious. Exploring alternative visual and syntactic representations requires a deterministic system capable of mapping text into novel symbolic forms and back without data loss.',
      idea: 'An exploratory studio for deterministic procedural language generation that maps input text through seeded dictionaries to generate syntactically coherent symbolic passages.',
      system: 'Built on Next.js with TypeScript and backed by PostgreSQL via Prisma. A procedural mapping engine segments input strings, resolves tokens against persisted dictionary matrices, and generates symbolic representations that can be reliably reversed.',
      architecture: {
        nodes: [
          { id: 'input', label: 'Token Ingestion', category: 'INPUT', x: 14, y: 50, description: 'Accepts source text, normalizes character casings, and segments input into token arrays.' },
          { id: 'engine', label: 'Procedural Mapping Engine', category: 'ALGO', x: 38, y: 28, description: 'Applies deterministic translation rules using seeded dictionary matrices.' },
          { id: 'db', label: 'PostgreSQL Dictionary', category: 'STORAGE', x: 62, y: 72, description: 'Stores persisted symbol tables, grammar templates, and reverse mapping lookups.' },
          { id: 'output', label: 'Bidirectional Decoder', category: 'DECODER', x: 86, y: 50, description: 'Emits structured symbolic passages and supports exact lossless reverse reconstruction.' }
        ],
        edges: [
          { source: 'input', target: 'engine', label: 'Token Chunks', animated: true },
          { source: 'db', target: 'engine', label: 'Symbol Matrices', animated: false },
          { source: 'engine', target: 'output', label: 'Bijective Pass', animated: true }
        ]
      },
      challenge: 'Ensuring that the procedural translation is strictly bijective and deterministic: every token must map to an unambiguous symbolic construct that reconstructs the exact original text upon decoding.',
      solution: 'Engineered a two-way symbol table with mathematical token index seeds. Unmapped characters and punctuation follow consistent fallback rules stored in PostgreSQL, ensuring complete determinism across successive runs.',
      details: [
        { title: 'Deterministic Tokenization', content: 'Constructed a parser that maps text sequences into structured token trees based on seeded dictionary rules.' },
        { title: 'Persisted Dictionary Model', content: 'Designed a Prisma relational schema to manage symbol vocabularies, versioned translation rules, and metadata.' },
        { title: 'Bidirectional Translation', content: 'Verified complete round-trip fidelity between source messages and generated procedural passages.' }
      ],
      result: 'The application operates as an interactive linguistics and procedural generation lab, demonstrating deterministic transformation and reconstruction without state drift. (Note: SecretSpeak is an educational procedural generation project, not a cryptographic tool.)'
    }
  },
  {
    id: 'tabster',
    title: 'Tabster',
    category: 'Commerce Platform',
    problem: 'Managing complex retail checkout flows—combining inventory reservations, coupons, and external payment states—often creates data desynchronization.',
    solution: 'Built a full-stack commerce architecture featuring a webhook-driven state machine to maintain strict transactional consistency across payment gateways.',
    technology: ['React', 'Node.js', 'Express', 'MySQL', 'Stripe'],
    role: 'Software Engineer',
    caseStudyRoute: '/projects/tabster',
    artifactIndex: 3,
    image: '/images/projects/tabster.webp',
    alt: 'Tabster transactional order state machine and modular commerce trays',
    figureLabel: 'FIG. 04 // ASYNCHRONOUS PAYMENT STATE MACHINE',
    accentColor: '#F4A261',
    accentColorLight: '#BC6C25',
    caseStudy: {
      problem: 'E-commerce transactional flows become brittle when multiple settlement factors—such as promotional discount codes, gift card balances, and third-party credit card authorizations—must be reconciled before inventory is decremented. Client-side network drops during checkout can leave orders in limbo.',
      idea: 'A full-stack commerce engine designed around an asynchronous order state machine that defers final database commits until verified payment webhooks are received.',
      system: 'A React single-page frontend communicates with an Express/Node.js backend API. Relational product and customer data is stored in MySQL. External payments are processed via Stripe PaymentIntents, with order lifecycle transitions driven by cryptographically verified webhook events.',
      architecture: {
        nodes: [
          { id: 'react', label: 'React Storefront', category: 'CLIENT', x: 14, y: 50, description: 'Manages catalog browsing, shopping cart state, discount inputs, and Stripe Elements checkout.' },
          { id: 'api', label: 'Express Order API', category: 'API', x: 38, y: 28, description: 'Validates cart totals, reserves inventory locks, and initializes Stripe PaymentIntents.' },
          { id: 'mysql', label: 'MySQL Ledger', category: 'STORAGE', x: 62, y: 72, description: 'ACID storage for products, orders, coupon usage, and customer balance ledgers.' },
          { id: 'stripe', label: 'Stripe Webhook Gateway', category: 'GATEWAY', x: 86, y: 50, description: 'Dispatches signed webhook events to transition orders from pending to completed.' }
        ],
        edges: [
          { source: 'react', target: 'api', label: 'Checkout Session', animated: true },
          { source: 'api', target: 'mysql', label: 'Pending Hold', animated: false },
          { source: 'api', target: 'stripe', label: 'PaymentIntent', animated: true },
          { source: 'stripe', target: 'api', label: 'Signed Webhooks', animated: true }
        ]
      },
      challenge: 'Preventing race conditions where user cart manipulation or double-submissions could cause duplicate discount deductions or invalid inventory counts during asynchronous payment processing.',
      solution: 'Separated the checkout process into distinct transactional phases: orders are created in a provisional `PENDING` state with temporary stock reservations. Final commitment and stock decrement occur only inside a database transaction triggered by a verified `payment_intent.succeeded` webhook.',
      details: [
        { title: 'Webhook-Driven State Machine', content: 'Designed strict order state transitions (Created → Payment_Pending → Fulfilled / Cancelled) governed by Stripe event signatures.' },
        { title: 'Transactional Ledger Schema', content: 'Modeled customer credit, promotional coupons, and itemized orders in MySQL with foreign-key constraints.' },
        { title: 'Inventory Reservation Locks', content: 'Implemented provisional stock holds with expiration timeouts to prevent stock overselling during active payment sessions.' }
      ],
      result: 'The architecture maintains database integrity across asynchronous payment flows, successfully preventing duplicate charges and desynchronized inventory records.'
    }
  },
  {
    id: 'pulsesync',
    title: 'PulseSync',
    category: 'Hardware Prototype',
    problem: 'Acquiring high-frequency analog biometric signals on microcontrollers often introduces jitter when processing and display tasks compete for CPU cycles.',
    solution: 'Engineered an ESP32 embedded prototype using FreeRTOS dual-core task pinning to isolate sensor sampling interrupts from OLED rendering and telemetry streams.',
    technology: ['ESP32', 'MAX30102', 'AD8232', 'FreeRTOS', 'C++'],
    role: 'Embedded Systems Engineer',
    caseStudyRoute: '/projects/pulsesync',
    artifactIndex: 4,
    image: '/images/projects/pulsesync.webp',
    alt: 'PulseSync analog telemetry waveform ribbon and hardware sensor substrate',
    figureLabel: 'FIG. 05 // DUAL-CORE FREERTOS TELEMETRY FLOW',
    accentColor: '#FF5964',
    accentColorLight: '#C1121F',
    caseStudy: {
      problem: 'Continuous physiological monitoring requires deterministic, high-frequency analog-to-digital sampling. When single-threaded microcontrollers attempt to update an I2C/SPI display while reading analog sensors, display refresh latencies introduce timing jitter that distorts the recorded waveforms.',
      idea: 'An embedded physiological sensor monitoring prototype built on the dual-core ESP32, using FreeRTOS symmetric multiprocessing to pin sensor data acquisition to one core and telemetry display to the other.',
      system: 'The hardware setup pairs an ESP32 microcontroller with a MAX30102 pulse oximeter (I2C) and an AD8232 single-lead ECG monitor (analog ADC). Firmware is written in C++ under the ESP-IDF/Arduino framework, utilizing FreeRTOS queues for inter-task communication.',
      architecture: {
        nodes: [
          { id: 'sensors', label: 'Biosensors (MAX/AD)', category: 'HARDWARE', x: 14, y: 50, description: 'MAX30102 pulse oximeter (I2C) and AD8232 analog ECG sensor electrodes.' },
          { id: 'core0', label: 'ADC Sampling Task', category: 'RTOS C0', x: 38, y: 28, description: 'Dedicated FreeRTOS task running high-frequency ADC sampling and ring-buffer filtering.' },
          { id: 'core1', label: 'Waveform & Display', category: 'RTOS C1', x: 62, y: 72, description: 'Drives SSD1306 OLED waveform rendering and serial/Bluetooth telemetry streaming.' },
          { id: 'app', label: 'Monitoring Layer', category: 'CLIENT', x: 86, y: 50, description: 'Visualizes real-time pulse and cardiac rhythm traces for testing and validation.' }
        ],
        edges: [
          { source: 'sensors', target: 'core0', label: 'ADC Interrupt', animated: true },
          { source: 'core0', target: 'core1', label: 'Queue / Ring Buffer', animated: true },
          { source: 'core1', target: 'app', label: 'Serial Stream', animated: true }
        ]
      },
      challenge: 'Eliminating sampling rate instability caused by blocking I2C screen-refresh routines, ensuring that ECG waveform features remain intact during continuous operation.',
      solution: 'Pinned the ADC sampling interrupt handler strictly to ESP32 Core 0 with high FreeRTOS priority. Filtered samples are pushed into a thread-safe circular ring buffer. Core 1 consumes buffered samples asynchronously to render waveforms to the SSD1306 display and transmit telemetry.',
      details: [
        { title: 'FreeRTOS Task Pinning', content: 'Utilized `xTaskCreatePinnedToCore` to separate time-critical ADC sampling from display refresh routines across the two ESP32 cores.' },
        { title: 'Signal Acquisition & Filtering', content: 'Implemented moving-average digital filtering to suppress power-line noise and baseline wander in raw ECG signals.' },
        { title: 'Local Waveform Rendering', content: 'Constructed an efficient pixel-buffer scrolling routine on the SSD1306 OLED to visualize cardiac rhythms in real time.' }
      ],
      result: 'The prototype maintains a stable sampling frequency without dropped samples or screen-induced jitter. (Disclaimer: PulseSync is an experimental engineering prototype and is not intended for medical diagnosis.)'
    }
  },
  {
    id: 'enginexus',
    title: 'EngiNexus',
    category: 'Analytics Dashboard',
    problem: 'Academic institutions struggle with fragmented departmental silos, making it difficult to map shared research equipment, lab availability, and student skill sets.',
    solution: 'Built an institutional intelligence and analytics dashboard using a 15-model relational database schema to map student capabilities and laboratory resources.',
    technology: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Data Visualization'],
    role: 'Full-Stack Engineer',
    caseStudyRoute: '/projects/enginexus',
    artifactIndex: 5,
    image: '/images/projects/enginexus.webp',
    alt: 'EngiNexus spatial knowledge graph constellation and academic entity network',
    figureLabel: 'FIG. 06 // 15-MODEL RELATIONAL CAMPUS ONTOLOGY',
    accentColor: '#2A9D8F',
    accentColorLight: '#1B4D3E',
    caseStudy: {
      problem: 'Universities frequently operate in departmental silos: engineering laboratories underutilize high-cost testing equipment, while interdisciplinary student teams struggle to find peers with complementary technical skills or access to relevant fabrication facilities.',
      idea: 'An institutional intelligence platform developed as a prototype for SIH to map relationships between academic talent, active research projects, and physical laboratory resources.',
      system: 'Built on Next.js 15 with TypeScript and PostgreSQL. The application is centered around a 15-model Prisma relational schema that normalizes student profiles, skill taxonomies, laboratory equipment schedules, and project collaborations into a unified queryable graph.',
      architecture: {
        nodes: [
          { id: 'sources', label: 'Entity Ingestion', category: 'DATA', x: 14, y: 50, description: 'Captures student skill vectors, department project listings, and lab equipment inventories.' },
          { id: 'schema', label: '15-Model Schema', category: 'CORE', x: 38, y: 28, description: 'Normalized PostgreSQL schema via Prisma modeling students, labs, equipment, and projects.' },
          { id: 'analytics', label: 'Matching Engine', category: 'ALGO', x: 62, y: 72, description: 'Aggregates facility utilization metrics and computes skill-match compatibility scores.' },
          { id: 'ui', label: 'Analytics Dashboard', category: 'CLIENT', x: 86, y: 50, description: 'Interactive visualization interfaces for resource allocation and collaborative project discovery.' }
        ],
        edges: [
          { source: 'sources', target: 'schema', label: 'Campus Rosters', animated: true },
          { source: 'schema', target: 'analytics', label: 'Relational Graph', animated: true },
          { source: 'analytics', target: 'ui', label: 'Matchmaking Views', animated: true }
        ]
      },
      challenge: 'Structuring a relational schema capable of handling many-to-many associations between students, multidisciplinary projects, faculty advisors, and lab facilities without degrading query performance.',
      solution: 'Engineered an explicit junction model architecture in Prisma with composite unique indexes on relationship pairs. Designed indexed lookup views for aggregate analytics queries, allowing fast retrieval of facility availability and candidate matchmaking.',
      details: [
        { title: 'Relational Entity Architecture', content: 'Designed a comprehensive 15-model schema in Prisma covering Students, Projects, Equipment, Labs, and Skill Tags.' },
        { title: 'Resource Matchmaking Logic', content: 'Implemented algorithmic search queries to identify skill alignments between student portfolios and active research vacancies.' },
        { title: 'Institutional Dashboard UI', content: 'Constructed responsive dashboard modules in Next.js to display facility utilization metrics and cross-departmental networks.' }
      ],
      result: 'The prototype successfully unifies disparate campus data sets into an interactive intelligence dashboard, providing clear visibility into lab utilization and student collaboration opportunities.'
    }
  }
];
