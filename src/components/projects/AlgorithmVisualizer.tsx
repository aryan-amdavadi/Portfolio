'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface WorkflowItem {
  primary: string;
  secondary?: string;
  tag?: string;
  highlight?: 'debtor' | 'creditor' | 'neutral' | 'success' | 'accent';
}

interface StepData {
  number: string;
  title: string;
  description: string;
  type: 'items' | 'processing';
  processingMsg?: string;
  items?: WorkflowItem[];
}

const PROJECT_WORKFLOWS: Record<string, { pipelineTitle: string; steps: StepData[] }> = {
  splitsphere: {
    pipelineTitle: 'GREEDY GRAPH SETTLEMENT ALGORITHM',
    steps: [
      {
        number: '01 / 05',
        title: 'Input: Cyclic Group Expenses',
        description: 'A shared trip generates 5 separate expense transfers between 4 participants, creating circular debt cycles.',
        type: 'items',
        items: [
          { primary: 'Alice → Bob', secondary: '$100.00', tag: 'Transfer' },
          { primary: 'Bob → Charlie', secondary: '$150.00', tag: 'Transfer' },
          { primary: 'Charlie → Alice', secondary: '$50.00', tag: 'Transfer' },
          { primary: 'Charlie → Dana', secondary: '$50.00', tag: 'Transfer' },
          { primary: 'Dana → Alice', secondary: '$50.00', tag: 'Transfer' }
        ]
      },
      {
        number: '02 / 05',
        title: 'Ledger Aggregation: Net Balance Vector',
        description: 'The engine sums all incoming and outgoing payments for each member to obtain a net financial position.',
        type: 'items',
        items: [
          { primary: 'Alice', secondary: '-$50.00 (Net Owed)', highlight: 'debtor' },
          { primary: 'Bob', secondary: '-$50.00 (Net Owed)', highlight: 'debtor' },
          { primary: 'Charlie', secondary: '+$100.00 (Net Surplus)', highlight: 'creditor' },
          { primary: 'Dana', secondary: '$0.00 (Settled)', highlight: 'neutral' }
        ]
      },
      {
        number: '03 / 05',
        title: 'Partitioning: Debtors vs Creditors',
        description: 'Members with net zero are eliminated. Remaining members are sorted into maximum debtor and maximum creditor heaps.',
        type: 'items',
        items: [
          { primary: 'Alice (Debtor)', secondary: 'Owes $50.00', highlight: 'debtor', tag: 'Debtor' },
          { primary: 'Bob (Debtor)', secondary: 'Owes $50.00', highlight: 'debtor', tag: 'Debtor' },
          { primary: 'Charlie (Creditor)', secondary: 'Owed $100.00', highlight: 'creditor', tag: 'Creditor' }
        ]
      },
      {
        number: '04 / 05',
        title: 'Execution: Recursive minCashFlow()',
        description: 'The greedy solver identifies max debtor (Alice) and max creditor (Charlie), transfers min(50, 100) = $50, and recurses.',
        type: 'processing',
        processingMsg: '[ COMPUTING GREEDY PAIRINGS: MIN(DEBTOR, CREDITOR) → ACYCLIC GRAPH REDUCTION ]'
      },
      {
        number: '05 / 05',
        title: 'Output: Optimized Settlement Plan',
        description: 'Cyclic debt completely resolved. Total transactions reduced from 5 down to 2, with zero leftover balances.',
        type: 'items',
        items: [
          { primary: 'Alice → Charlie', secondary: '$50.00', tag: 'Optimal Transfer', highlight: 'success' },
          { primary: 'Bob → Charlie', secondary: '$50.00', tag: 'Optimal Transfer', highlight: 'success' }
        ]
      }
    ]
  },
  rapaport: {
    pipelineTitle: '2D MATRIX PRICING & INGESTION PIPELINE',
    steps: [
      {
        number: '01 / 04',
        title: 'Matrix Ingestion: Multi-Tier Carat Workbooks',
        description: 'Raw 2D Excel workbook grids parsed across carat brackets (e.g. 0.90–0.99 ct) with multi-header coordinate grids.',
        type: 'items',
        items: [
          { primary: 'Carat Range 0.90–0.99 ct', secondary: '100 Matrix Points', tag: 'Grid Tier' },
          { primary: 'Carat Range 1.00–1.49 ct', secondary: '100 Matrix Points', tag: 'Grid Tier' },
          { primary: 'Coordinate Ingestion Pipeline', secondary: 'Structured Normalization', highlight: 'accent' }
        ]
      },
      {
        number: '02 / 04',
        title: 'Validation: Zod Strict Coordinate Schema',
        description: 'Cell coordinates validated against strict Zod types before batch insertion to ensure referential safety.',
        type: 'items',
        items: [
          { primary: 'Clarity Schema Bounds', secondary: 'IF → I3 Scale Verified', highlight: 'success' },
          { primary: 'Color Tier Bounds', secondary: 'D → M Scale Verified', highlight: 'success' },
          { primary: 'Price Vector Sanitization', secondary: 'Strict Positive Floats', highlight: 'neutral' }
        ]
      },
      {
        number: '03 / 04',
        title: 'Commit: Prisma Atomic Batch Transactions',
        description: 'Batch insertion is wrapped in an atomic Prisma transaction block to eliminate partial corruption.',
        type: 'processing',
        processingMsg: '[ PRISMA TRANSACTION: ATOMIC TABLE TRUNCATE & BULK RECORD COMMIT ]'
      },
      {
        number: '04 / 04',
        title: 'Valuation: Sub-Millisecond Table Lookup',
        description: 'Client TanStack Table evaluates instant asset pricing based on weight, grade, and custom discount multiplier.',
        type: 'items',
        items: [
          { primary: 'Lookup: 1.25 ct, E Color, VVS1', secondary: 'Base: $9,800.00 / ct', highlight: 'accent' },
          { primary: 'Custom Market Discount', secondary: '-14.0% Discount Applied', highlight: 'debtor' },
          { primary: 'Final Asset Valuation', secondary: '$10,535.00 Total', highlight: 'success' }
        ]
      }
    ]
  },
  secretspeak: {
    pipelineTitle: 'DETERMINISTIC PROCEDURAL MAPPING PIPELINE',
    steps: [
      {
        number: '01 / 04',
        title: 'Segmentation: Token Ingestion & Sanitization',
        description: 'Source message is normalized and segmented into distinct semantic tokens while preserving structural syntax.',
        type: 'items',
        items: [
          { primary: 'Raw Input Stream', secondary: '"SYSTEM_ONLINE_PROTOCOL_SECURE"', tag: 'Source' },
          { primary: 'Token Chunker', secondary: '4 Semantic Segments', highlight: 'accent' },
          { primary: 'Punctuation Isolation', secondary: 'Delimiters Mapped', highlight: 'neutral' }
        ]
      },
      {
        number: '02 / 04',
        title: 'Dictionary Lookup: Seeded PostgreSQL Mappings',
        description: 'Tokens resolve deterministically against persisted dictionary matrices using indexed mathematical seeds.',
        type: 'items',
        items: [
          { primary: 'Token "SYSTEM"', secondary: '→ Glyph Block [Ψ-09]', highlight: 'accent' },
          { primary: 'Token "ONLINE"', secondary: '→ Glyph Block [Ω-42]', highlight: 'accent' },
          { primary: 'Token "PROTOCOL"', secondary: '→ Glyph Block [Δ-18]', highlight: 'accent' },
          { primary: 'Token "SECURE"', secondary: '→ Glyph Block [Θ-88]', highlight: 'accent' }
        ]
      },
      {
        number: '03 / 04',
        title: 'Synthesis: Seeded Grammatical Composition',
        description: 'Bijective replacement passes assemble procedurally generated symbolic passages without character loss.',
        type: 'processing',
        processingMsg: '[ PROCEDURAL SYNTHESIS: SEEDED BIJECTIVE REPLACEMENT APPLIED ]'
      },
      {
        number: '04 / 04',
        title: 'Verification: Lossless Bijective Decoding',
        description: 'Inverse procedural decoder reconstructs the exact original plain-text message with 100% roundtrip fidelity.',
        type: 'items',
        items: [
          { primary: 'Input Symbolic Passage', secondary: '[Ψ-09]-[Ω-42]-[Δ-18]-[Θ-88]', tag: 'Glyph Stream' },
          { primary: 'Decoded Output Message', secondary: '"SYSTEM_ONLINE_PROTOCOL_SECURE"', highlight: 'success' },
          { primary: 'Character Drift Metric', secondary: '0% Drift (Exact Lossless Match)', highlight: 'success' }
        ]
      }
    ]
  },
  tabster: {
    pipelineTitle: 'ASYNCHRONOUS PAYMENT STATE MACHINE',
    steps: [
      {
        number: '01 / 04',
        title: 'Cart Reservation: Inventory Lock & TTL',
        description: 'Checkout initiation locks selected inventory rows in MySQL with a provisional 15-minute expiration timer.',
        type: 'items',
        items: [
          { primary: 'Order Items In Cart', secondary: '2x Units Reserved', tag: 'Inventory Hold' },
          { primary: 'Stock Lock Mode', secondary: 'Provisional Hold (15 Min TTL)', highlight: 'accent' },
          { primary: 'Coupon Verification', secondary: '-15% Discount Validated', highlight: 'neutral' }
        ]
      },
      {
        number: '02 / 04',
        title: 'Payment Dispatch: Stripe PaymentIntent',
        description: 'Backend initializes Stripe PaymentIntent with calculated subtotal, locking client-side payment parameters.',
        type: 'items',
        items: [
          { primary: 'Calculated Order Total', secondary: '$142.50 USD', tag: 'Gross Charge' },
          { primary: 'Stripe PaymentIntent', secondary: 'pi_3M... Client Secret Issued', highlight: 'accent' },
          { primary: 'Initial Order Status', secondary: 'PENDING_PAYMENT', highlight: 'debtor' }
        ]
      },
      {
        number: '03 / 04',
        title: 'Webhook Reception: Cryptographic Signature Verification',
        description: 'Stripe webhook dispatches asynchronously. Server verifies the HMAC SHA-256 event signature.',
        type: 'processing',
        processingMsg: '[ STRIPE WEBHOOK DISPATCH: VERIFYING CRYPTOGRAPHIC SIGNATURE ]'
      },
      {
        number: '04 / 04',
        title: 'Fulfillment: Atomic Order State Transition',
        description: 'Verified payment triggers MySQL transaction: order status updates to PAID and inventory decrements permanently.',
        type: 'items',
        items: [
          { primary: 'Verified Event Type', secondary: 'payment_intent.succeeded', highlight: 'success' },
          { primary: 'Final Order Status', secondary: 'ORDER_FULFILLED', highlight: 'success' },
          { primary: 'Inventory Ledger', secondary: 'Permanent Decrement Committed', highlight: 'success' }
        ]
      }
    ]
  },
  pulsesync: {
    pipelineTitle: 'DUAL-CORE FREERTOS TELEMETRY PIPELINE',
    steps: [
      {
        number: '01 / 04',
        title: 'Sensor Sampling: High-Frequency Biometric Ingestion',
        description: 'MAX30102 pulse oximeter (I2C) and AD8232 analog ECG sensor electrodes acquire physiological telemetry at 250 Hz.',
        type: 'items',
        items: [
          { primary: 'MAX30102 Optical PPG', secondary: 'Red & IR LED Reflectance (I2C)', tag: 'Sensor 1' },
          { primary: 'AD8232 Cardiac Lead', secondary: 'Analog Voltage Potential (ADC)', tag: 'Sensor 2' },
          { primary: 'Sampling Clock', secondary: '250 Hz Interrupt Driven', highlight: 'accent' }
        ]
      },
      {
        number: '02 / 04',
        title: 'FreeRTOS Core 0: Pinned ADC Interrupt Task',
        description: 'Sensor task pinned strictly to ESP32 Core 0 with maximum priority, queuing samples to a lockless ring buffer.',
        type: 'items',
        items: [
          { primary: 'Task Pinning Config', secondary: 'Core 0 (xTaskCreatePinnedToCore)', highlight: 'accent' },
          { primary: 'Buffer Architecture', secondary: 'Thread-Safe Circular Ring Buffer', highlight: 'neutral' },
          { primary: 'Interrupt Jitter', secondary: '< 5 Microseconds (Deterministic)', highlight: 'success' }
        ]
      },
      {
        number: '03 / 04',
        title: 'Firmware: Moving-Average Digital Filter',
        description: 'Digital filter in C++ suppresses 50/60 Hz mains electrical noise and baseline motion artifacts.',
        type: 'processing',
        processingMsg: '[ DIGITAL FIR FILTER: NOTCH 50/60HZ & SUPPRESS BASELINE DRIFT ]'
      },
      {
        number: '04 / 04',
        title: 'FreeRTOS Core 1: OLED Waveform & Telemetry Broadcast',
        description: 'Core 1 consumes buffered samples asynchronously to render waveforms to the SSD1306 OLED and broadcast serial telemetry.',
        type: 'items',
        items: [
          { primary: 'SSD1306 Display Driver', secondary: '128x64 Rolling Pixel Rhythm Buffer', highlight: 'accent' },
          { primary: 'Telemetry Stream', secondary: 'Continuous UART Broadcast', highlight: 'accent' },
          { primary: 'Sample Loss Metric', secondary: '0 Dropped Samples During Screen Refresh', highlight: 'success' }
        ]
      }
    ]
  },
  enginexus: {
    pipelineTitle: 'CAMPUS ENTITY MATCHMAKING PIPELINE',
    steps: [
      {
        number: '01 / 04',
        title: 'Data Ingestion: Campus Entity Taxonomy',
        description: 'Captures student technical skill vectors, open project listings, and fabrication lab equipment schedules.',
        type: 'items',
        items: [
          { primary: 'Student Talent Profiles', secondary: 'Verified Skill Taxonomies', tag: 'Entity 1' },
          { primary: 'Departmental Labs', secondary: 'Testing & Fabrication Schedules', tag: 'Entity 2' },
          { primary: 'Active Project Roster', secondary: 'Interdisciplinary Vacancies', tag: 'Entity 3' }
        ]
      },
      {
        number: '02 / 04',
        title: 'Relational Schema: 15-Model Prisma Core',
        description: 'Normalized PostgreSQL schema models many-to-many associations with indexed composite junction tables.',
        type: 'items',
        items: [
          { primary: 'Prisma Relational Models', secondary: '15 Normalized Entity Definitions', highlight: 'accent' },
          { primary: 'Junction Constraints', secondary: 'StudentSkill & ProjectRole Indices', highlight: 'neutral' },
          { primary: 'Relational Store', secondary: 'PostgreSQL Relational Engine', highlight: 'neutral' }
        ]
      },
      {
        number: '03 / 04',
        title: 'Aggregation: Cross-Domain Compatibility Matcher',
        description: 'Algorithmic matching queries compute skill alignment between student skill vectors and project vacancies.',
        type: 'processing',
        processingMsg: '[ COMPUTING TALENT-RESOURCE COMPATIBILITY & LAB UTILIZATION ]'
      },
      {
        number: '04 / 04',
        title: 'Dashboard: Institutional Utilization Intelligence',
        description: 'Generates indexed SQL views displaying laboratory capacity metrics and interdisciplinary team matches.',
        type: 'items',
        items: [
          { primary: 'Cross-Domain Match Metric', secondary: '84% Interdisciplinary Alignment', highlight: 'success' },
          { primary: 'Lab Equipment Utilization', secondary: 'Off-Peak Capacity Rebalanced', highlight: 'success' },
          { primary: 'Visual Analytics View', secondary: 'Dynamic Collaboration Network', highlight: 'accent' }
        ]
      }
    ]
  }
};

interface AlgorithmVisualizerProps {
  projectId?: string;
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ projectId = 'splitsphere' }) => {
  const workflowConfig = PROJECT_WORKFLOWS[projectId] || PROJECT_WORKFLOWS.splitsphere;
  const { pipelineTitle, steps } = workflowConfig;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const step = steps[currentStep] || steps[0];

  return (
    <div className="algo-visualizer" role="region" aria-label={`${pipelineTitle} Interactive Walkthrough`}>
      {/* Top Banner Tag */}
      <div className="algo-pipeline-badge">
        <span className="algo-pipeline-icon">⚙</span>
        <span>{pipelineTitle}</span>
      </div>

      {/* Header and Step Information */}
      <div className="algo-header">
        <div className="algo-title-group">
          <span className="algo-step-badge">{step.number}</span>
          <h3 className="algo-step-title">{step.title}</h3>
        </div>

        {/* Interactive Controls */}
        <div className="algo-controls">
          <button
            type="button"
            className="algo-ctrl-btn"
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Previous step"
          >
            ← PREV
          </button>

          <button
            type="button"
            className="algo-ctrl-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause walkthrough' : 'Play walkthrough'}
          >
            {isPlaying ? 'PAUSE ❚❚' : 'PLAY ▶'}
          </button>

          <button
            type="button"
            className="algo-ctrl-btn"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            aria-label="Next step"
          >
            NEXT →
          </button>

          <div className="algo-pills" role="tablist" aria-label="Step progress indicators">
            {steps.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`algo-pill-dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => {
                  setCurrentStep(index);
                  setIsPlaying(false);
                }}
                aria-label={`Jump to step ${index + 1}`}
                role="tab"
                aria-selected={index === currentStep}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Narrative explanation */}
      <p className="algo-desc">{step.description}</p>

      {/* Stage Visualizer */}
      <div className="algo-stage">
        {step.type === 'processing' ? (
          <div className="algo-calculating-msg" aria-live="polite">
            {step.processingMsg || '[ EXECUTING TECHNICAL PIPELINE TRANSFORM ]'}
          </div>
        ) : (
          <div className="algo-cards-container">
            {step.items?.map((item, idx) => (
              <div
                key={idx}
                className={`algo-card-row ${item.highlight === 'success' ? 'optimized' : ''} ${
                  item.highlight === 'accent' ? 'accented' : ''
                }`}
              >
                <div className="algo-card-primary-col">
                  {item.tag && <span className="algo-item-tag">{item.tag}</span>}
                  <span className="algo-item-name">{item.primary}</span>
                </div>
                <span
                  className={
                    item.highlight === 'debtor'
                      ? 'algo-debtor'
                      : item.highlight === 'creditor'
                      ? 'algo-creditor'
                      : item.highlight === 'success'
                      ? 'algo-creditor'
                      : item.highlight === 'accent'
                      ? 'algo-accent'
                      : ''
                  }
                >
                  {item.secondary}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
