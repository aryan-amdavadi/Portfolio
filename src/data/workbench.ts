/**
 * Engineering Workbench: Data Models & Verified Project Specifications
 * 
 * Defines typed architectural diagrams, component responsibilities,
 * input/processing/output flows, and verified engineering trade-offs
 * for all catalog projects without fake metrics or external dependencies.
 */

export type FlowStageType = 'input' | 'processing' | 'storage' | 'output' | 'gateway' | 'hardware' | 'buffer';

export interface WorkbenchNode {
  id: string;
  label: string;
  category: string;
  stage: FlowStageType;
  responsibility: string;
  tech?: string;
  x: number; // Percentage coordinate (0-100) on SVG canvas
  y: number; // Percentage coordinate (0-100) on SVG canvas
}

export interface WorkbenchEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  protocol?: string;
}

export interface WorkbenchFlowStep {
  stepNumber: string; // e.g. '01', '02', '03'
  title: string;
  phase: 'INGESTION' | 'COMPUTATION' | 'PERSISTENCE' | 'DELIVERY' | 'VERIFICATION';
  summary: string;
  activeNodeIds: string[];
  activeEdgeIds: string[];
  inputPayload?: string;
  processingAction?: string;
  outputResult?: string;
}

export interface EngineeringDecision {
  id: string;
  title: string;
  choice: string;
  rationale: string;
  tradeOff: string;
}

export interface ProjectWorkbench {
  projectId: string;
  systemTitle: string;
  subsystem: string;
  primaryConstraint: string;
  verifiedScopeNote?: string;
  nodes: WorkbenchNode[];
  edges: WorkbenchEdge[];
  flowSteps: WorkbenchFlowStep[];
  decisions: EngineeringDecision[];
}

export const PROJECT_WORKBENCH_DATA: Record<string, ProjectWorkbench> = {
  splitsphere: {
    projectId: 'splitsphere',
    systemTitle: 'SplitSphere Settlement Engine',
    subsystem: 'Recursive minCashFlow Graph Simplifier',
    primaryConstraint:
      'Dense cyclic debts among N group participants generate up to N*(N-1)/2 raw pairwise transactions; the engine must condense this into at most N - 1 acyclic transfers with zero leftover fractions.',
    nodes: [
      {
        id: 'auth',
        label: 'Better Auth Session',
        category: 'AUTH',
        stage: 'input',
        responsibility: 'Validates user credentials via HTTP-only persistent cookies stored in PostgreSQL, isolating tokens from client-side script execution.',
        tech: 'Better Auth / Cookie Store',
        x: 14,
        y: 32
      },
      {
        id: 'api',
        label: 'Express REST Gateway',
        category: 'GATEWAY',
        stage: 'input',
        responsibility: 'Authenticates group membership, ingests expense payloads, and computes net participant balance vectors.',
        tech: 'Node.js / Express / TypeScript',
        x: 40,
        y: 32
      },
      {
        id: 'solver',
        label: 'minCashFlow Solver',
        category: 'ALGO',
        stage: 'processing',
        responsibility: 'Computes signed net balance vector (credits minus debts) and executes recursive greedy pairing between maximum debtors and maximum creditors.',
        tech: 'In-Memory Vector Math',
        x: 66,
        y: 72
      },
      {
        id: 'ledger',
        label: 'Prisma Relational Ledger',
        category: 'STORAGE',
        stage: 'storage',
        responsibility: 'Maintains normalized relational tables for Groups, Members, Expenses, and itemized ExpenseSplits with referential integrity.',
        tech: 'PostgreSQL / Prisma ORM',
        x: 88,
        y: 32
      }
    ],
    edges: [
      {
        id: 'e_auth_api',
        source: 'auth',
        target: 'api',
        label: 'HTTP-only Session Token',
        protocol: 'Bearer Cookie'
      },
      {
        id: 'e_api_solver',
        source: 'api',
        target: 'solver',
        label: 'Net Balance Vector',
        protocol: 'In-Memory Float Array'
      },
      {
        id: 'e_solver_ledger',
        source: 'solver',
        target: 'ledger',
        label: 'Acyclic Settlement Plan',
        protocol: 'Prisma Batch Writes'
      },
      {
        id: 'e_api_ledger',
        source: 'api',
        target: 'ledger',
        label: 'Raw Expense Records',
        protocol: 'Atomic SQL Insert'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Expense Ingestion & Membership Check',
        phase: 'INGESTION',
        summary: 'Client submits multi-payer expense record with participant split allocations; API validates session credentials against PostgreSQL session store.',
        activeNodeIds: ['auth', 'api'],
        activeEdgeIds: ['e_auth_api'],
        inputPayload: 'Expense payload ($300 total split across 4 members with unequal contributions)',
        processingAction: 'Better Auth verifies HTTP-only cookie; Express validates group membership',
        outputResult: 'Authenticated, validated expense draft'
      },
      {
        stepNumber: '02',
        title: 'Net Balance Vector Computation',
        phase: 'COMPUTATION',
        summary: 'The solver aggregates all incoming credits and outgoing debts into an array of signed individual net balance positions.',
        activeNodeIds: ['api', 'solver'],
        activeEdgeIds: ['e_api_solver'],
        inputPayload: 'Raw directed transaction graph: Alice owes Bob $100, Bob owes Charlie $150, Charlie owes Alice $50...',
        processingAction: 'Computes Net(i) = TotalPaid(i) - TotalShare(i); verifies sum(Net) === 0',
        outputResult: 'Net balance vector: [Alice: -$50, Bob: -$50, Charlie: +$100, Dana: $0]'
      },
      {
        stepNumber: '03',
        title: 'Recursive Greedy Pairing',
        phase: 'COMPUTATION',
        summary: 'Iteratively pairs the maximum debtor with the maximum creditor for min(|debtor|, |creditor|), reducing problem size by at least one participant per step.',
        activeNodeIds: ['solver'],
        activeEdgeIds: [],
        inputPayload: 'Sorted heaps: Max Debtor (Alice: -$50), Max Creditor (Charlie: +$100)',
        processingAction: 'Settles min(50, 100) = $50 from Alice → Charlie; decrements Charlie to +$50; recurses with Bob',
        outputResult: 'Two optimal transfers: Alice → Charlie ($50) and Bob → Charlie ($50)'
      },
      {
        stepNumber: '04',
        title: 'Acyclic Plan Persistence',
        phase: 'PERSISTENCE',
        summary: 'The simplified settlement graph is committed to PostgreSQL as an auditable settlement plan with zero circular obligations.',
        activeNodeIds: ['solver', 'ledger'],
        activeEdgeIds: ['e_solver_ledger'],
        inputPayload: 'Generated settlement plan with 2 transactions instead of 5 circular transfers',
        processingAction: 'Prisma executes atomic transaction writing settlement ledger records',
        outputResult: 'Audit-ready settlement plan persisted in database'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Greedy minCashFlow vs Exact Subset-Sum Partitioning',
        choice: 'Recursive greedy max-debtor / max-creditor pairing algorithm',
        rationale: 'Minimizing transactions down to at most N - 1 runs in deterministic O(N log N) time, whereas finding the absolute theoretical minimum is NP-hard (equivalent to the partition problem).',
        tradeOff: 'May produce 1 more transaction than an exponential partitioner in rare edge cases, in exchange for guaranteed sub-millisecond execution on arbitrary group sizes without CPU spikes.'
      },
      {
        id: 'd2',
        title: 'HTTP-Only Cookie Sessions vs Stateless JWTs in LocalStorage',
        choice: 'Persistent sessions stored in PostgreSQL with HTTP-only cookies via Better Auth',
        rationale: 'Prevents XSS attacks from extracting tokens out of browser storage and allows immediate server-side session revocation.',
        tradeOff: 'Requires a database lookup per authenticated request, mitigated by database indexing.'
      }
    ]
  },

  rapaport: {
    projectId: 'rapaport',
    systemTitle: 'Rapaport Pricing Engine',
    subsystem: '2D Matrix Pipeline & Atomic Valuation Store',
    primaryConstraint:
      'Diamond valuation sheets feature multi-tier continuous carat brackets (e.g. 0.90–0.99 ct); partial sheet corruption during updates can compromise active high-value trade valuations.',
    nodes: [
      {
        id: 'ingest',
        label: 'Matrix Ingestion Parser',
        category: 'INGEST',
        stage: 'input',
        responsibility: 'Decomposes raw 2D Excel workbook grids across multi-tiered carat, color, and clarity header coordinates into normalized tabular streams.',
        tech: 'ExcelJS / Stream Parser',
        x: 14,
        y: 32
      },
      {
        id: 'zod',
        label: 'Zod Coordinate Validator',
        category: 'VALIDATOR',
        stage: 'processing',
        responsibility: 'Validates coordinate bounds (clarity IF–I3, color D–M) and enforces positive float rates before DB persistence.',
        tech: 'Zod Runtime Schemas',
        x: 40,
        y: 72
      },
      {
        id: 'store',
        label: 'PostgreSQL Atomic Store',
        category: 'STORAGE',
        stage: 'storage',
        responsibility: 'Atomic Prisma $transaction block truncates and bulk-inserts price sheets with complete rollback on any bad cell.',
        tech: 'PostgreSQL / Prisma Transactions',
        x: 66,
        y: 32
      },
      {
        id: 'table',
        label: 'TanStack Table Client',
        category: 'CLIENT',
        stage: 'output',
        responsibility: 'Client interface providing sub-millisecond coordinate lookups, custom percentage discounts, and historical calculation logs.',
        tech: 'TanStack Table / React 19',
        x: 88,
        y: 72
      }
    ],
    edges: [
      {
        id: 'e_ingest_zod',
        source: 'ingest',
        target: 'zod',
        label: 'Raw Matrix Coordinates',
        protocol: 'Parsed JSON Stream'
      },
      {
        id: 'e_zod_store',
        source: 'zod',
        target: 'store',
        label: 'Sanitized Price Vectors',
        protocol: 'Prisma $transaction'
      },
      {
        id: 'e_store_table',
        source: 'store',
        target: 'table',
        label: 'Indexed Grid Queries',
        protocol: 'Cached Relational Queries'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Multi-Header Workbook Parsing',
        phase: 'INGESTION',
        summary: 'Ingests denormalized 2D matrix sheets where column and row headers span continuous ranges (e.g., 0.90–0.99 ct).',
        activeNodeIds: ['ingest'],
        activeEdgeIds: [],
        inputPayload: 'Multi-carat Excel workbook with hundreds of color-clarity matrix intersections',
        processingAction: 'Stream-parses cells and generates normalized (caratMin, caratMax, color, clarity, rate) tuples',
        outputResult: 'Stream of raw coordinate tuples'
      },
      {
        stepNumber: '02',
        title: 'Schema Coordinate Validation',
        phase: 'VERIFICATION',
        summary: 'Every cell tuple is validated against strict Zod type boundaries before database staging.',
        activeNodeIds: ['ingest', 'zod'],
        activeEdgeIds: ['e_ingest_zod'],
        inputPayload: 'Unchecked pricing coordinates',
        processingAction: 'Zod verifies: color in [D..M], clarity in [IF..I3], priceRate > 0',
        outputResult: 'Validated typed pricing vectors'
      },
      {
        stepNumber: '03',
        title: 'Atomic Transaction Commit',
        phase: 'PERSISTENCE',
        summary: 'Prisma wraps bulk insertion in a transaction. Any corrupted cell or range error aborts the operation cleanly.',
        activeNodeIds: ['zod', 'store'],
        activeEdgeIds: ['e_zod_store'],
        inputPayload: 'Validated matrix batch (~5,000 coordinate records)',
        processingAction: 'Executes atomic transaction: stage new records, verify counts, swap table pointer; rollback on error',
        outputResult: 'Cleanly committed, indexed pricing table'
      },
      {
        stepNumber: '04',
        title: 'Real-Time Valuation Lookup',
        phase: 'DELIVERY',
        summary: 'TanStack Table performs instant coordinate retrieval and computes final asset pricing with custom discounts.',
        activeNodeIds: ['store', 'table'],
        activeEdgeIds: ['e_store_table'],
        inputPayload: 'User query: 1.25 ct, E Color, VVS1 with -14% market discount',
        processingAction: 'Formula: CaratWeight * BaseRate * (1 - DiscountPercentage)',
        outputResult: 'Instant valuation: $10,535.00 total with itemized formula log'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Atomic Batch Replacement vs In-Place Cell Upserts',
        choice: 'Wrap entire workbook ingestion in an atomic Prisma transaction that rolls back completely on any cell failure',
        rationale: 'Pricing lists are interdependent; partial ingestion leaves orphaned tiers that can mislead high-value diamond trades.',
        tradeOff: 'Bulk transaction takes slightly longer to commit than async row upserts, but guarantees 100% database consistency.'
      },
      {
        id: 'd2',
        title: 'Client-Side TanStack Table vs Server-Side Pagination',
        choice: 'Client-side memoized TanStack Table index for active carat bracket',
        rationale: 'Allows traders to adjust discount percentages, carat bounds, and clarity filters with instant < 1ms response time without network roundtrips.',
        tradeOff: 'Initial payload transfers the selected bracket dataset to the client, trading minor network payload for instantaneous interaction.'
      }
    ]
  },

  secretspeak: {
    projectId: 'secretspeak',
    systemTitle: 'SecretSpeak Procedural Language Studio',
    subsystem: 'Deterministic Bijective Mapping Pipeline',
    primaryConstraint:
      'Must guarantee 100% lossless roundtrip reconstruction between source text and symbolic glyph sequences without semantic or character drift.',
    verifiedScopeNote:
      'SecretSpeak is strictly an educational linguistic and procedural generation laboratory exploring deterministic token-symbol mapping. It is not intended as a cryptographic tool and does not claim cryptanalysis resistance.',
    nodes: [
      {
        id: 'chunker',
        label: 'Token Ingestion Chunker',
        category: 'INPUT',
        stage: 'input',
        responsibility: 'Normalizes input character stream and segments words and punctuation into structured token sequences while preserving syntax.',
        tech: 'TypeScript Regex Parser',
        x: 14,
        y: 32
      },
      {
        id: 'engine',
        label: 'Procedural Mapping Engine',
        category: 'ALGO',
        stage: 'processing',
        responsibility: 'Applies deterministic mathematical index offsets against persisted symbol matrices using indexed seed offsets.',
        tech: 'Deterministic Seed Algorithm',
        x: 40,
        y: 72
      },
      {
        id: 'dict',
        label: 'PostgreSQL Dictionary Store',
        category: 'STORAGE',
        stage: 'storage',
        responsibility: 'Stores persisted symbol tables, grammar templates, and reverse mapping lookups in a normalized relational schema.',
        tech: 'PostgreSQL / Prisma ORM',
        x: 66,
        y: 32
      },
      {
        id: 'decoder',
        label: 'Bidirectional Decoder',
        category: 'DECODER',
        stage: 'output',
        responsibility: 'Reconstructs original plain-text input from generated symbolic glyph sequences with zero entropy drift.',
        tech: 'Inverse Mapping Engine',
        x: 88,
        y: 72
      }
    ],
    edges: [
      {
        id: 'e_chunk_eng',
        source: 'chunker',
        target: 'engine',
        label: 'Token Chunks & Delimiters',
        protocol: 'Typed Token Array'
      },
      {
        id: 'e_dict_eng',
        source: 'dict',
        target: 'engine',
        label: 'Symbol Dictionary Matrices',
        protocol: 'Cached Relational Lookups'
      },
      {
        id: 'e_eng_dec',
        source: 'engine',
        target: 'decoder',
        label: 'Bijective Glyph Stream',
        protocol: 'Lossless Symbol Stream'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Input Segmentation & Sanitization',
        phase: 'INGESTION',
        summary: 'Source message is parsed into normalized alphanumeric tokens and isolated structural punctuation.',
        activeNodeIds: ['chunker'],
        activeEdgeIds: [],
        inputPayload: '"SYSTEM_ONLINE_PROTOCOL_SECURE"',
        processingAction: 'Splits string on word delimiters while recording delimiter coordinates for lossless reversal',
        outputResult: 'Array of 4 semantic tokens + positional metadata'
      },
      {
        stepNumber: '02',
        title: 'Deterministic Seed Mapping',
        phase: 'COMPUTATION',
        summary: 'Each token is converted into a deterministic mathematical index that indexes into the persisted symbol dictionary.',
        activeNodeIds: ['chunker', 'engine', 'dict'],
        activeEdgeIds: ['e_chunk_eng', 'e_dict_eng'],
        inputPayload: 'Tokens: ["SYSTEM", "ONLINE", "PROTOCOL", "SECURE"]',
        processingAction: 'Computes SeedHash(token) % SymbolTableLength to pick deterministic symbol glyph block',
        outputResult: 'Mapped symbol glyphs: [Ψ-09, Ω-42, Δ-18, Θ-88]'
      },
      {
        stepNumber: '03',
        title: 'Procedural Passage Assembly',
        phase: 'DELIVERY',
        summary: 'Synthesizes mapped symbol glyphs and preserved delimiters into a formatted procedural passage.',
        activeNodeIds: ['engine', 'decoder'],
        activeEdgeIds: ['e_eng_dec'],
        inputPayload: 'Mapped symbol glyph array and positional punctuation map',
        processingAction: 'Formats into structured symbolic passage: [Ψ-09]-[Ω-42]-[Δ-18]-[Θ-88]',
        outputResult: 'Generated procedural symbolic passage'
      },
      {
        stepNumber: '04',
        title: 'Lossless Roundtrip Verification',
        phase: 'VERIFICATION',
        summary: 'Decoder executes inverse lookup against dictionary to verify 0% character drift and lossless reconstruction.',
        activeNodeIds: ['decoder', 'dict'],
        activeEdgeIds: [],
        inputPayload: '[Ψ-09]-[Ω-42]-[Δ-18]-[Θ-88]',
        processingAction: 'Applies inverse mapping: [Ψ-09] → "SYSTEM", [Ω-42] → "ONLINE"...',
        outputResult: 'Exact original string: "SYSTEM_ONLINE_PROTOCOL_SECURE" (0% drift)'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Relational Dictionary vs Ephemeral In-Memory Array',
        choice: 'Persist symbol matrices and grammar templates in PostgreSQL via Prisma',
        rationale: 'Allows versioning vocabulary sets, managing multi-tier grammar rules, and guaranteeing consistent deterministic seed mapping across application restarts.',
        tradeOff: 'Requires database queries during cold starts, mitigated by in-memory dictionary caching.'
      },
      {
        id: 'd2',
        title: 'Strict Bijective Mapping vs Heuristic Transformation',
        choice: 'Strict one-to-one bijective mapping for all alphanumeric and punctuation characters',
        rationale: 'Guarantees 100% roundtrip reconstructibility so users can verify that no information is lost during translation.',
        tradeOff: 'Limits procedural variability to seeded dictionary mutations rather than non-deterministic generative models.'
      }
    ]
  },

  tabster: {
    projectId: 'tabster',
    systemTitle: 'Tabster Asynchronous Commerce Engine',
    subsystem: 'Webhook-Driven Order State Machine',
    primaryConstraint:
      'Payment gateways are asynchronous; client network drops or race conditions during checkout must not cause duplicate charges or inventory desynchronization.',
    nodes: [
      {
        id: 'store',
        label: 'React Storefront',
        category: 'CLIENT',
        stage: 'input',
        responsibility: 'Manages shopping cart state, coupon codes, and mounts Stripe Elements payment forms.',
        tech: 'React / Next.js',
        x: 14,
        y: 32
      },
      {
        id: 'api',
        label: 'Express Order API',
        category: 'API',
        stage: 'processing',
        responsibility: 'Validates line items, acquires provisional stock reservations with 15m TTL, and issues Stripe PaymentIntents.',
        tech: 'Node.js / Express',
        x: 40,
        y: 32
      },
      {
        id: 'stripe',
        label: 'Stripe Webhook Gateway',
        category: 'GATEWAY',
        stage: 'gateway',
        responsibility: 'Authorizes credit card transactions and dispatches cryptographically signed webhook events.',
        tech: 'Stripe API / HMAC Signatures',
        x: 66,
        y: 72
      },
      {
        id: 'db',
        label: 'MySQL ACID Ledger',
        category: 'STORAGE',
        stage: 'storage',
        responsibility: 'Enforces ACID transactions for inventory locks, customer balance adjustments, and fulfilled orders.',
        tech: 'MySQL / Foreign Keys',
        x: 88,
        y: 32
      }
    ],
    edges: [
      {
        id: 'e_store_api',
        source: 'store',
        target: 'api',
        label: 'Checkout Session Request',
        protocol: 'HTTP POST / JSON'
      },
      {
        id: 'e_api_stripe',
        source: 'api',
        target: 'stripe',
        label: 'Initialize PaymentIntent',
        protocol: 'Stripe REST API'
      },
      {
        id: 'e_stripe_api',
        source: 'stripe',
        target: 'api',
        label: 'Signed Webhook Event',
        protocol: 'HMAC SHA-256 Webhook'
      },
      {
        id: 'e_api_db',
        source: 'api',
        target: 'db',
        label: 'Provisional Hold / Commit',
        protocol: 'MySQL Transaction'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Cart Checkout & Provisional Stock Lock',
        phase: 'INGESTION',
        summary: 'Customer initiates checkout; API creates provisional order with 15-minute expiration hold on inventory items.',
        activeNodeIds: ['store', 'api', 'db'],
        activeEdgeIds: ['e_store_api', 'e_api_db'],
        inputPayload: 'Cart containing 2x items ($142.50) with promo code applied',
        processingAction: 'Validates stock availability; inserts provisional hold in MySQL with expires_at = NOW() + 15m',
        outputResult: 'Order created with state: PENDING_PAYMENT'
      },
      {
        stepNumber: '02',
        title: 'PaymentIntent Initialization',
        phase: 'COMPUTATION',
        summary: 'Backend requests a Stripe PaymentIntent with server-verified amount, passing client secret back to frontend.',
        activeNodeIds: ['api', 'stripe'],
        activeEdgeIds: ['e_api_stripe'],
        inputPayload: 'Server-calculated subtotal ($142.50)',
        processingAction: 'Calls stripe.paymentIntents.create({ amount: 14250, currency: "usd" })',
        outputResult: 'Client secret issued; Stripe Elements displays payment form'
      },
      {
        stepNumber: '03',
        title: 'Asynchronous Webhook Reception',
        phase: 'VERIFICATION',
        summary: 'Customer completes payment; Stripe dispatches webhook event to server. Server verifies HMAC SHA-256 signature.',
        activeNodeIds: ['stripe', 'api'],
        activeEdgeIds: ['e_stripe_api'],
        inputPayload: 'Incoming HTTP POST to /api/webhooks/stripe with stripe-signature header',
        processingAction: 'stripe.webhooks.constructEvent(payload, signature, webhookSecret); rejects unsigned calls',
        outputResult: 'Verified payment_intent.succeeded event object'
      },
      {
        stepNumber: '04',
        title: 'Atomic Transaction Fulfillment',
        phase: 'PERSISTENCE',
        summary: 'Inside a single MySQL database transaction, order state transitions to PAID and inventory counts are permanently decremented.',
        activeNodeIds: ['api', 'db'],
        activeEdgeIds: ['e_api_db'],
        inputPayload: 'Verified PaymentIntent ID matching pending order record',
        processingAction: 'START TRANSACTION; UPDATE orders SET status = "PAID"; UPDATE products SET stock = stock - qty; COMMIT;',
        outputResult: 'Order permanently fulfilled; duplicate webhook attempts safely ignored'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Webhook-Driven State Machine vs Client Confirmation',
        choice: 'Commit final order settlement only on verified Stripe webhook events rather than client redirect',
        rationale: 'Client-side confirmation fails if the customer closes their browser or loses connectivity after charging.',
        tradeOff: 'Requires managing intermediate PENDING_PAYMENT states and handling webhook arrival delays of 500–2000ms.'
      },
      {
        id: 'd2',
        title: 'Provisional Inventory TTL Locks vs Immediate Decrement',
        choice: 'Reserve stock with an explicit 15-minute TTL lock released automatically on abandonment',
        rationale: 'Prevents abandoned carts from holding inventory indefinitely while stopping race conditions during active payments.',
        tradeOff: 'Requires a background cleanup job or query filter to treat expired reservations as available inventory.'
      }
    ]
  },

  pulsesync: {
    projectId: 'pulsesync',
    systemTitle: 'PulseSync Real-Time Telemetry Pipeline',
    subsystem: 'Dual-Core FreeRTOS SMP Biosensor Driver',
    primaryConstraint:
      'I2C/SPI OLED display refreshes take 10–25ms of blocking CPU time; running display code on a single thread injects severe jitter into 250 Hz analog biosensor sampling.',
    verifiedScopeNote:
      'PulseSync is an experimental hardware and firmware prototype exploring dual-core FreeRTOS task pinning. It is an engineering prototype and not certified for medical diagnostic use.',
    nodes: [
      {
        id: 'sensors',
        label: 'Biosensors (MAX30102 & AD8232)',
        category: 'HARDWARE',
        stage: 'hardware',
        responsibility: 'Acquires raw analog cardiac voltages (AD8232 ADC) and optical PPG pulse reflectance (MAX30102 I2C).',
        tech: 'Analog Electrodes & Optical LEDs',
        x: 14,
        y: 32
      },
      {
        id: 'core0',
        label: 'Core 0 ADC Sampling Task',
        category: 'RTOS C0',
        stage: 'processing',
        responsibility: 'High-priority task pinned strictly to ESP32 Core 0 handling deterministic 250 Hz timer interrupts.',
        tech: 'FreeRTOS / xTaskCreatePinnedToCore',
        x: 40,
        y: 32
      },
      {
        id: 'fifo',
        label: 'Lockless Circular Buffer',
        category: 'BUFFER',
        stage: 'buffer',
        responsibility: 'Thread-safe FIFO queue decoupling high-frequency sampling from lower-frequency rendering.',
        tech: 'FreeRTOS Queue / RingBuffer',
        x: 66,
        y: 72
      },
      {
        id: 'core1',
        label: 'Core 1 Display & Telemetry Task',
        category: 'RTOS C1',
        stage: 'output',
        responsibility: 'Applies digital FIR filter, renders rolling waveform to SSD1306 OLED, and streams serial UART telemetry.',
        tech: 'SSD1306 I2C / UART Telemetry',
        x: 88,
        y: 32
      }
    ],
    edges: [
      {
        id: 'e_sen_c0',
        source: 'sensors',
        target: 'core0',
        label: '250 Hz ADC Interrupts',
        protocol: 'Hardware Interrupt Line'
      },
      {
        id: 'e_c0_fifo',
        source: 'core0',
        target: 'fifo',
        label: 'Raw Sample Stream',
        protocol: 'Lockless FIFO Push'
      },
      {
        id: 'e_fifo_c1',
        source: 'fifo',
        target: 'core1',
        label: 'Buffered Telemetry Frames',
        protocol: 'xQueueReceive (Core 1)'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Hardware Sensor Acquisition',
        phase: 'INGESTION',
        summary: 'MAX30102 pulse oximeter and AD8232 ECG electrodes acquire analog cardiac voltage and optical reflectance.',
        activeNodeIds: ['sensors'],
        activeEdgeIds: [],
        inputPayload: 'Continuous analog physiological voltage potentials',
        processingAction: 'Sensors convert microvolt cardiac pulses into digital I2C words and ADC values',
        outputResult: 'Raw analog/digital sensor streams'
      },
      {
        stepNumber: '02',
        title: 'Core 0 Deterministic Sampling Interrupt',
        phase: 'COMPUTATION',
        summary: 'Dedicated task on ESP32 Core 0 runs at 250 Hz with < 5 μs jitter, pushing samples into ring buffer.',
        activeNodeIds: ['sensors', 'core0', 'fifo'],
        activeEdgeIds: ['e_sen_c0', 'e_c0_fifo'],
        inputPayload: '250 Hz hardware timer ticks',
        processingAction: 'Reads ADC register, pushes timestamped 16-bit integer sample into thread-safe FIFO',
        outputResult: 'Enqueued sample frame in circular buffer with zero dropped ticks'
      },
      {
        stepNumber: '03',
        title: 'Moving-Average FIR Noise Filtering',
        phase: 'COMPUTATION',
        summary: 'Firmware executes digital filtering in C++ to suppress 50/60 Hz power-line noise and baseline drift.',
        activeNodeIds: ['fifo', 'core1'],
        activeEdgeIds: ['e_fifo_c1'],
        inputPayload: 'Buffered raw cardiac voltage frames',
        processingAction: 'Applies discrete moving-average filter and baseline wander compensation',
        outputResult: 'Clean cardiac QRS waveform signal'
      },
      {
        stepNumber: '04',
        title: 'Asynchronous Display & Telemetry Broadcast',
        phase: 'DELIVERY',
        summary: 'Core 1 renders rolling 128x64 pixel buffer to SSD1306 OLED display and transmits UART telemetry stream.',
        activeNodeIds: ['core1'],
        activeEdgeIds: [],
        inputPayload: 'Filtered waveform samples',
        processingAction: 'Draws pixel column shift on OLED display; transmits byte packets over serial bus',
        outputResult: 'Continuous waveform visualization with zero sampling jitter'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Symmetric Multiprocessing (SMP) Core Pinning vs Single-Core Interrupts',
        choice: 'Pin ADC sampling task strictly to Core 0 with xTaskCreatePinnedToCore and display rendering to Core 1',
        rationale: 'On single-core MCUs, I2C display drawing blocks CPU execution for up to 25ms, causing dropped samples and waveform distortion.',
        tradeOff: 'Requires inter-core synchronization via thread-safe FIFO queues and careful memory management.'
      },
      {
        id: 'd2',
        title: 'Ring Buffer Queue vs Shared Memory Variables',
        choice: 'FreeRTOS circular ring buffer with mutex-free atomic read/write pointers',
        rationale: 'Allows Core 0 to push high-frequency samples without blocking on Core 1 display read operations.',
        tradeOff: 'Allocates a fixed RAM buffer (~4KB), trading small heap footprint for zero interrupt lock contention.'
      }
    ]
  },

  enginexus: {
    projectId: 'enginexus',
    systemTitle: 'EngiNexus Campus Relational Intelligence',
    subsystem: '15-Model Relational Schema & Matchmaking Engine',
    primaryConstraint:
      'Fragmented academic data sets (student skill profiles, project listings, lab equipment schedules) require many-to-many associations without query degradation.',
    verifiedScopeNote:
      'EngiNexus was developed as an institutional analytics prototype for Smart India Hackathon (SIH). This workbench explores the verified 15-model relational database schema and matchmaking query architecture, distinguishing the implemented prototype from planned distributed backend microservices.',
    nodes: [
      {
        id: 'ingest',
        label: 'Entity Ingestion Module',
        category: 'DATA',
        stage: 'input',
        responsibility: 'Captures student technical skill taxonomies, department project listings, and lab equipment inventories.',
        tech: 'Next.js API Routes / Zod',
        x: 14,
        y: 32
      },
      {
        id: 'schema',
        label: '15-Model Prisma Schema',
        category: 'CORE',
        stage: 'storage',
        responsibility: 'Normalized PostgreSQL relational model with explicit junction tables (StudentSkill, ProjectMember, LabEquipment).',
        tech: 'PostgreSQL / Prisma ORM',
        x: 40,
        y: 72
      },
      {
        id: 'matcher',
        label: 'Relational Matchmaking Engine',
        category: 'ALGO',
        stage: 'processing',
        responsibility: 'Executes indexed composite junction queries computing skill alignment and facility utilization scores.',
        tech: 'SQL Aggregations / In-Memory Math',
        x: 66,
        y: 32
      },
      {
        id: 'dash',
        label: 'Analytics Dashboard UI',
        category: 'CLIENT',
        stage: 'output',
        responsibility: 'Interactive visualization interfaces for campus resource allocation and collaborative project discovery.',
        tech: 'React 19 / Data Visualization',
        x: 88,
        y: 72
      }
    ],
    edges: [
      {
        id: 'e_ing_sch',
        source: 'ingest',
        target: 'schema',
        label: 'Normalized Campus Entities',
        protocol: 'Prisma Batch Writes'
      },
      {
        id: 'e_sch_mat',
        source: 'schema',
        target: 'matcher',
        label: 'Junction Relationship Vectors',
        protocol: 'Indexed SQL Joins'
      },
      {
        id: 'e_mat_dash',
        source: 'matcher',
        target: 'dash',
        label: 'Calculated Alignment Scores',
        protocol: 'Next.js Server Actions'
      }
    ],
    flowSteps: [
      {
        stepNumber: '01',
        title: 'Entity Roster Ingestion',
        phase: 'INGESTION',
        summary: 'Student technical skills, departmental research projects, and physical lab equipment schedules are ingested and normalized.',
        activeNodeIds: ['ingest'],
        activeEdgeIds: [],
        inputPayload: 'Unstructured student rosters, department project listings, and lab equipment schedules',
        processingAction: 'Parses taxonomies and maps into structured entity types',
        outputResult: 'Normalized entity records ready for relational storage'
      },
      {
        stepNumber: '02',
        title: '15-Model Relational Schema Storage',
        phase: 'PERSISTENCE',
        summary: 'PostgreSQL stores entities across 15 Prisma models with composite unique indexes on junction relationship pairs.',
        activeNodeIds: ['ingest', 'schema'],
        activeEdgeIds: ['e_ing_sch'],
        inputPayload: 'Normalized entity streams',
        processingAction: 'Prisma enforces foreign key constraints and populates junction tables (StudentSkill, LabEquipment, ProjectRole)',
        outputResult: 'Indexed relational campus ontology persisted in PostgreSQL'
      },
      {
        stepNumber: '03',
        title: 'Algorithmic Matchmaking Computation',
        phase: 'COMPUTATION',
        summary: 'Executes multi-table joins to identify skill alignments between student portfolios and active research vacancies.',
        activeNodeIds: ['schema', 'matcher'],
        activeEdgeIds: ['e_sch_mat'],
        inputPayload: 'Query: Match candidates for "Embedded Systems" research project vacancy',
        processingAction: 'Computes intersection score: |RequiredSkills ∩ CandidateSkills| / |RequiredSkills| weighted by skill level',
        outputResult: 'Ranked candidate list with verified compatibility percentages'
      },
      {
        stepNumber: '04',
        title: 'Utilization Analytics Dashboard',
        phase: 'DELIVERY',
        summary: 'Renders facility capacity metrics, off-peak equipment availability, and cross-departmental collaboration network views.',
        activeNodeIds: ['matcher', 'dash'],
        activeEdgeIds: ['e_mat_dash'],
        inputPayload: 'Calculated compatibility metrics and lab scheduling logs',
        processingAction: 'Aggregates capacity metrics across departmental silos into interactive views',
        outputResult: 'Institutional intelligence dashboard interface'
      }
    ],
    decisions: [
      {
        id: 'd1',
        title: 'Normalized 15-Model Relational Schema vs Unstructured Graph Store',
        choice: 'Explicit junction models with composite indexes in PostgreSQL via Prisma',
        rationale: 'Guarantees ACID transactions for equipment reservation locks and strict referential integrity across student records without requiring specialized graph database operational infrastructure.',
        tradeOff: 'Requires relational multi-table JOIN queries, requiring indexed composite keys for sub-10ms response times.'
      },
      {
        id: 'd2',
        title: 'Explicit Prototype Scope Boundaries',
        choice: 'Build prototype on unified Next.js full-stack monolith before introducing microservices',
        rationale: 'For the SIH competition prototype, a clean monolith allowed rapid iteration on the relational schema and instant deployment without distributed orchestration overhead.',
        tradeOff: 'Vertical scaling limits of a single Next.js backend, with planned modular microservices documented for production campus deployment.'
      }
    ]
  }
};

/**
 * Safely retrieves workbench specification data for a given project ID,
 * returning a graceful fallback if the project data is missing or incomplete.
 */
export function getWorkbenchData(projectId: string): ProjectWorkbench | null {
  if (!projectId) return null;
  return PROJECT_WORKBENCH_DATA[projectId] || null;
}
