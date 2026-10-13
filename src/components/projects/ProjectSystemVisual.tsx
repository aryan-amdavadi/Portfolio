'use client';

import React from 'react';
import { Project } from '@/data/projects';
import './ProjectSystemVisual.css';

interface ProjectSystemVisualProps {
  project: Project;
}

/**
 * Image-Free System Visualizer for Engineering Atlas
 * Renders data-driven, project-specific architecture maps and state flows
 * using inline SVG and semantic CSS surfaces.
 */
export const ProjectSystemVisual: React.FC<ProjectSystemVisualProps> = ({ project }) => {
  const accentColor = 'var(--project-accent-color)';

  const renderVisual = () => {
    switch (project.id) {
      case 'splitsphere':
        return <SplitSphereVisual accentColor={accentColor} />;
      case 'rapaport':
        return <RapaportVisual accentColor={accentColor} />;
      case 'secretspeak':
        return <SecretSpeakVisual accentColor={accentColor} />;
      case 'tabster':
        return <TabsterVisual accentColor={accentColor} />;
      case 'pulsesync':
        return <PulseSyncVisual accentColor={accentColor} />;
      case 'enginexus':
        return <EnginexusVisual accentColor={accentColor} />;
      default:
        return <DefaultVisual project={project} accentColor={accentColor} />;
    }
  };

  return (
    <div
      className="atlas-system-visual"
      data-project-id={project.id}
      aria-label={`${project.title} Architectural System Diagram`}
      style={{
        '--project-accent-dark': project.accentColor || 'var(--accent-base)',
        '--project-accent-light': project.accentColorLight || 'var(--accent-base)'
      } as React.CSSProperties}
    >
      <div className="atlas-visual-chrome">
        <div className="chrome-left">
          <span className="chrome-dot" aria-hidden="true" />
          <span className="chrome-label">{project.figureLabel || `FIG. ARCHITECTURE // ${project.id.toUpperCase()}`}</span>
        </div>
        <div className="chrome-right">
          <span className="chrome-status-badge">TOPOLOGY // VERIFIED</span>
        </div>
      </div>

      <div className="atlas-visual-stage">
        {renderVisual()}
      </div>

      <div className="atlas-visual-footer">
        <span className="footer-coord">SCALE // 1:1 VECTOR MAPPING</span>
        <span className="footer-legend">PROJECTION // STRUCTURAL DIRECTED GRAPH</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   1. SplitSphere: Directed Debt Graph & Greedy Minimum Cash Flow Engine
   ========================================================================== */
const SplitSphereVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container splitsphere-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="SplitSphere directed debt graph and greedy cash flow reduction diagram"
      >
        <defs>
          <marker id="arrow-raw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="rgba(255, 255, 255, 0.25)" />
          </marker>
          <marker id="arrow-settle" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
          <pattern id="grid-splitsphere" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.07" />
          </pattern>
        </defs>

        {/* Blueprint Grid & Alignment Lines */}
        <rect width="100%" height="100%" fill="url(#grid-splitsphere)" />
        <line x1="40" y1="180" x2="720" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.15" />
        <line x1="380" y1="30" x2="380" y2="330" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.15" />

        {/* Raw Cyclic Transactions (Dashed, muted arcs) */}
        <path d="M 130 90 Q 220 40 310 90" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" markerEnd="url(#arrow-raw)" />
        <text x="220" y="55" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">$45.00</text>

        <path d="M 310 110 Q 360 200 310 270" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" markerEnd="url(#arrow-raw)" />
        <text x="345" y="190" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">$60.00</text>

        <path d="M 310 280 Q 200 320 130 270" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" markerEnd="url(#arrow-raw)" />
        <text x="210" y="315" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">$35.00</text>

        <path d="M 110 260 Q 70 180 110 110" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.3" markerEnd="url(#arrow-raw)" />
        <text x="75" y="185" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">$70.00</text>

        {/* Greedy Settlement Vectors (Active, Highlighted) */}
        {/* Debtor A to Creditor B via minCashFlow */}
        <path d="M 150 90 C 260 80, 500 80, 600 100" fill="none" stroke={accentColor} strokeWidth="2.5" markerEnd="url(#arrow-settle)" />
        <rect x="330" y="70" width="100" height="20" rx="3" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1" />
        <text x="380" y="84" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">SETTLE // $85.00</text>

        {/* Debtor C to Creditor D */}
        <path d="M 150 270 C 260 280, 500 280, 600 260" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="6 2" markerEnd="url(#arrow-settle)" />
        <rect x="330" y="270" width="100" height="20" rx="3" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1" />
        <text x="380" y="284" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">SETTLE // $40.00</text>

        {/* PARTICIPANT NODES */}
        {/* Node A: Max Debtor */}
        <g transform="translate(120, 90)">
          <circle r="28" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle r="3" fill="#FB7185" />
          <text y="-8" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">PEER A</text>
          <text y="8" fill="#FB7185" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">NET -$85.00</text>
          <text y="20" fill="currentColor" fillOpacity="0.4" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">MAX DEBTOR</text>
        </g>

        {/* Node C: Secondary Debtor */}
        <g transform="translate(120, 270)">
          <circle r="28" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle r="3" fill="#FB7185" />
          <text y="-8" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">PEER C</text>
          <text y="8" fill="#FB7185" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">NET -$40.00</text>
          <text y="20" fill="currentColor" fillOpacity="0.4" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">DEBTOR</text>
        </g>

        {/* Node B: Max Creditor */}
        <g transform="translate(630, 100)">
          <circle r="32" fill="var(--bg-surface)" stroke={accentColor} strokeWidth="2" />
          <circle r="3" fill={accentColor} />
          <text y="-9" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">PEER B</text>
          <text y="8" fill={accentColor} fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">NET +$110.00</text>
          <text y="22" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">MAX CREDITOR</text>
        </g>

        {/* Node D: Creditor */}
        <g transform="translate(630, 260)">
          <circle r="28" fill="var(--bg-surface)" stroke={accentColor} strokeWidth="1.5" />
          <circle r="3" fill={accentColor} />
          <text y="-8" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">PEER D</text>
          <text y="8" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">NET +$15.00</text>
          <text y="20" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">CREDITOR</text>
        </g>

        {/* Central Engine Badge */}
        <g transform="translate(380, 180)">
          <rect x="-85" y="-22" width="170" height="44" rx="4" fill="var(--bg-base)" stroke={accentColor} strokeWidth="1.5" />
          <text y="-5" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">minCashFlow() SOLVER</text>
          <text y="12" fill={accentColor} fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">ACYCLIC PLAN // O(N) GREEDY</text>
        </g>

        {/* Telemetry Legend */}
        <g transform="translate(50, 335)">
          <circle cx="0" cy="0" r="3" fill="#FB7185" />
          <text x="8" y="3" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">RAW GRAPH: 6 CYCLIC TRANSFERS</text>
          <circle cx="230" cy="0" r="3" fill={accentColor} />
          <text x="238" y="3" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">OPTIMIZED: ≤ 3 SETTLEMENTS (N - 1)</text>
          <text x="520" y="3" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">BALANCE CONSERVATION: ΣΔ = $0.00</text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   2. Rapaport Calculator: 2D Pricing Matrix & Coordinate Lookup Pipeline
   ========================================================================== */
const RapaportVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container rapaport-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="Rapaport pricing matrix grid and ingestion pipeline"
      >
        <defs>
          <marker id="arrow-pipeline" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
        </defs>

        {/* SECTION 1: 2D PRICING MATRIX GRID (Left) */}
        <g transform="translate(40, 40)">
          <rect width="360" height="220" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="14" y="22" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">CARAT / CLARITY MATRIX // 2D INDEX</text>
          <text x="345" y="22" fill="currentColor" fillOpacity="0.4" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">POSTGRES TABLE</text>

          {/* Matrix Columns (Color Grades) */}
          <g transform="translate(70, 40)">
            <text x="25" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">D</text>
            <text x="85" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">E</text>
            <text x="145" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">F</text>
            <text x="205" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">G</text>
            <text x="265" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">H</text>
          </g>

          {/* Matrix Rows (Clarity Grades & Values) */}
          {/* Row 1: IF */}
          <g transform="translate(15, 65)">
            <text x="15" y="16" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">IF</text>
            {/* Active Cell (D, IF) with CAD crosshair */}
            <rect x="55" y="0" width="55" height="26" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1.5" />
            <text x="82" y="17" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">14.2k</text>
            <line x1="82" y1="-4" x2="82" y2="30" stroke={accentColor} strokeWidth="0.75" strokeDasharray="2 2" />

            <rect x="115" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="142" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">12.8k</text>

            <rect x="175" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="202" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">11.4k</text>

            <rect x="235" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="262" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">10.1k</text>

            <rect x="295" y="0" width="45" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="317" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">8.9k</text>
          </g>

          {/* Row 2: VVS1 */}
          <g transform="translate(15, 100)">
            <text x="15" y="16" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">VVS1</text>
            <rect x="55" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="82" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">12.5k</text>
            <rect x="115" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="142" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">11.2k</text>
            <rect x="175" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="202" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">10.0k</text>
            <rect x="235" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="262" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">8.9k</text>
            <rect x="295" y="0" width="45" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="317" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">7.8k</text>
          </g>

          {/* Row 3: VS1 */}
          <g transform="translate(15, 135)">
            <text x="15" y="16" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">VS1</text>
            <rect x="55" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="82" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">10.8k</text>
            <rect x="115" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="142" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">9.7k</text>
            <rect x="175" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="202" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">8.8k</text>
            <rect x="235" y="0" width="55" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="262" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">7.9k</text>
            <rect x="295" y="0" width="45" height="26" fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />
            <text x="317" y="17" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">6.9k</text>
          </g>

          {/* Carat Bracket Tag */}
          <rect x="14" y="180" width="130" height="24" rx="2" fill="var(--bg-base)" stroke="var(--border-subtle)" />
          <text x="22" y="196" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">BRACKET: 1.00–1.49 CT</text>
        </g>

        {/* SECTION 2: PARSER & QUERY PIPELINE (Right) */}
        <g transform="translate(430, 40)">
          <rect width="290" height="220" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="14" y="22" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">INGESTION & VALUATION FLOW</text>

          {/* Step 1 */}
          <g transform="translate(14, 45)">
            <rect width="260" height="32" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="12" y="20" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">01 // EXCEL 2D WORKBOOK</text>
            <text x="248" y="20" fill="currentColor" fillOpacity="0.4" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">RAW SHEET</text>
          </g>

          <line x1="144" y1="77" x2="144" y2="92" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-pipeline)" />

          {/* Step 2 */}
          <g transform="translate(14, 95)">
            <rect width="260" height="32" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="12" y="20" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">02 // ZOD COORDINATE SANITIZER</text>
            <text x="248" y="20" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">VERIFIED</text>
          </g>

          <line x1="144" y1="127" x2="144" y2="142" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-pipeline)" />

          {/* Step 3 */}
          <g transform="translate(14, 145)">
            <rect width="260" height="42" rx="2" fill="var(--bg-base)" stroke={accentColor} strokeWidth="1.2" />
            <text x="12" y="18" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">03 // TANSTACK VALUATION QUERY</text>
            <text x="12" y="32" fill={accentColor} fontSize="8.5" fontFamily="var(--font-mono)">RATE: $14,200 × CARAT × (1 - DISC%)</text>
          </g>
        </g>

        {/* Telemetry Footer Row */}
        <g transform="translate(50, 310)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">COORDINATE LOOKUP LATENCY: &lt; 1ms</text>
          <text x="260" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">ATOMIC BATCH PRISMA ROLLBACK ON ERROR</text>
          <text x="560" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">INDEXED POSTGRES ENGINE</text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   3. SecretSpeak: Deterministic Procedural Language Studio
   ========================================================================== */
const SecretSpeakVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container secretspeak-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="SecretSpeak procedural token-to-symbol lattice diagram"
      >
        <defs>
          <marker id="arrow-symbol" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
        </defs>

        {/* Top Tier: Source Tokens */}
        <g transform="translate(60, 40)">
          <text x="0" y="-12" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">REGISTER 01 // NORMALIZED INPUT TOKENS</text>

          <g transform="translate(0, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface)" stroke="var(--border-subtle)" />
            <text x="14" y="24" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">TOKEN_01: &quot;KERNEL&quot;</text>
          </g>

          <g transform="translate(230, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface)" stroke="var(--border-subtle)" />
            <text x="14" y="24" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">TOKEN_02: &quot;BUFFER&quot;</text>
          </g>

          <g transform="translate(460, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface)" stroke="var(--border-subtle)" />
            <text x="14" y="24" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">TOKEN_03: &quot;SYNTAX&quot;</text>
          </g>
        </g>

        {/* Inter-tier Vector Lines */}
        <line x1="150" y1="80" x2="190" y2="150" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />
        <line x1="380" y1="80" x2="380" y2="150" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />
        <line x1="610" y1="80" x2="570" y2="150" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />

        {/* Center: Seeded Transformation Matrix */}
        <g transform="translate(160, 150)">
          <rect width="440" height="60" rx="3" fill="var(--bg-base)" stroke={accentColor} strokeWidth="1.5" />
          <text x="220" y="26" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
            DETERMINISTIC PROCEDURAL MAPPING ENGINE
          </text>
          <text x="220" y="44" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            POSTGRESQL SEED MATRIX // BIJECTIVE 1:1 SYMBOL BINDING
          </text>
        </g>

        {/* Downward Reversibility Vectors */}
        <line x1="220" y1="210" x2="150" y2="260" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />
        <line x1="380" y1="210" x2="380" y2="260" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />
        <line x1="540" y1="210" x2="610" y2="260" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-symbol)" />

        {/* Bottom Tier: Structured Procedural Glyphs */}
        <g transform="translate(60, 260)">
          <text x="0" y="55" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
            REGISTER 02 // LOSSLESS SYMBOLIC EMISSION (BIDIRECTIONAL DECODE VERIFIED)
          </text>

          <g transform="translate(0, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1" />
            <text x="14" y="24" fill={accentColor} fontSize="12" fontFamily="var(--font-mono)" fontWeight="700">⟠-92 // [KRNL_Ω]</text>
          </g>

          <g transform="translate(230, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1" />
            <text x="14" y="24" fill={accentColor} fontSize="12" fontFamily="var(--font-mono)" fontWeight="700">⎊-04 // [BFFR_Ψ]</text>
          </g>

          <g transform="translate(460, 0)">
            <rect width="180" height="40" rx="2" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1" />
            <text x="14" y="24" fill={accentColor} fontSize="12" fontFamily="var(--font-mono)" fontWeight="700">⍟-61 // [SYNT_Δ]</text>
          </g>
        </g>

        {/* Verification Invariant Note */}
        <g transform="translate(60, 340)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">
            DISCLAIMER: PROCEDURAL GENERATION LAB // NON-CRYPTOGRAPHIC LOSSLESS SYNTAX EXPERIMENT
          </text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   4. Tabster: Asynchronous Commerce Order State Machine
   ========================================================================== */
const TabsterVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container tabster-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="Tabster asynchronous commerce state machine flowchart"
      >
        <defs>
          <marker id="arrow-tabster" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
        </defs>

        {/* Linear State Progression */}
        {/* State 1: CART_LOCK */}
        <g transform="translate(40, 110)">
          <rect width="140" height="85" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1.2" />
          <text x="12" y="22" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">STAGE 01</text>
          <text x="12" y="42" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">CART_LOCK</text>
          <text x="12" y="60" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Provisional hold</text>
          <text x="12" y="72" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">Stock TTL: 15 min</text>
        </g>

        <line x1="180" y1="152" x2="220" y2="152" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-tabster)" />

        {/* State 2: PAYMENT_INTENT */}
        <g transform="translate(220, 110)">
          <rect width="150" height="85" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1.2" />
          <text x="12" y="22" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">STAGE 02</text>
          <text x="12" y="42" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">PAYMENT_INTENT</text>
          <text x="12" y="60" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Stripe client secret</text>
          <text x="12" y="72" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Coupon deducted</text>
        </g>

        <line x1="370" y1="152" x2="410" y2="152" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-tabster)" />

        {/* State 3: WEBHOOK_HMAC */}
        <g transform="translate(410, 110)">
          <rect width="145" height="85" rx="3" fill="var(--bg-surface-elevated)" stroke={accentColor} strokeWidth="1.5" />
          <text x="12" y="22" fill={accentColor} fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600">CRITICAL GATE</text>
          <text x="12" y="42" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">WEBHOOK_HMAC</text>
          <text x="12" y="60" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Signed signature</text>
          <text x="12" y="72" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">payment.succeeded</text>
        </g>

        <line x1="555" y1="152" x2="595" y2="152" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-tabster)" />

        {/* State 4: ORDER_FULFILLED */}
        <g transform="translate(595, 110)">
          <rect width="130" height="85" rx="3" fill="var(--bg-surface)" stroke={accentColor} strokeWidth="1.2" />
          <text x="12" y="22" fill={accentColor} fontSize="8.5" fontFamily="var(--font-mono)">FINAL STATE</text>
          <text x="12" y="42" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">FULFILLED</text>
          <text x="12" y="60" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Stock committed</text>
          <text x="12" y="72" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Invoice recorded</text>
        </g>

        {/* Rollback Branch on Timeout/Failure */}
        <path d="M 295 195 L 295 240 L 110 240 L 110 195" fill="none" stroke="#FB7185" strokeWidth="1.2" strokeDasharray="4 4" />
        <rect x="150" y="230" width="105" height="20" rx="2" fill="var(--bg-base)" stroke="#FB7185" strokeWidth="0.75" />
        <text x="202" y="244" fill="#FB7185" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">ROLLBACK // RELEASE LOCK</text>

        {/* Telemetry Footer */}
        <g transform="translate(50, 310)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">CONCURRENCY GUARD: DEFERRED STOCK DECREMENT PREVENTS OVERSOLD INVENTORY</text>
          <text x="560" y="0" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">STRIPE WEBHOOK HMAC-SHA256</text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   5. PulseSync: Dual-Core FreeRTOS Telemetry Flow
   ========================================================================== */
const PulseSyncVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container pulsesync-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="PulseSync dual-core FreeRTOS task pinning and telemetry oscilloscope trace"
      >
        <defs>
          <marker id="arrow-rtos" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
        </defs>

        {/* LANE A: ESP32 CORE 0 (ADC INTERRUPT SAMPLING) */}
        <g transform="translate(40, 40)">
          <rect width="680" height="100" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <rect x="0" y="0" width="130" height="24" rx="2" fill="var(--bg-base)" stroke="var(--border-subtle)" />
          <text x="12" y="16" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">CORE 0 // SENSOR PINNED</text>
          <text x="665" y="18" fill="currentColor" fillOpacity="0.4" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="end">PRIORITY: HIGH (RTOS)</text>

          {/* Core 0 Processing Steps */}
          <g transform="translate(20, 36)">
            {/* Input Sensor */}
            <rect x="0" y="0" width="130" height="48" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="10" y="20" fill="var(--text-primary)" fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="600">MAX30102 / AD8232</text>
            <text x="10" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Analog ECG + I2C PPG</text>

            <line x1="130" y1="24" x2="165" y2="24" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-rtos)" />

            {/* ADC Interrupt */}
            <rect x="170" y="0" width="140" height="48" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="10" y="20" fill="var(--text-primary)" fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="600">ADC SAMPLER</text>
            <text x="10" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">250 Hz Continuous ISR</text>

            <line x1="310" y1="24" x2="345" y2="24" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-rtos)" />

            {/* Ring Buffer */}
            <rect x="350" y="0" width="140" height="48" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="10" y="20" fill="var(--text-primary)" fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="600">RING BUFFER</text>
            <text x="10" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Moving-Avg Digital Filter</text>

            <line x1="490" y1="24" x2="525" y2="24" stroke={accentColor} strokeWidth="1.5" markerEnd="url(#arrow-rtos)" />

            {/* FreeRTOS Queue Out */}
            <rect x="530" y="0" width="120" height="48" rx="2" fill="var(--bg-base)" stroke={accentColor} strokeWidth="1.2" />
            <text x="10" y="20" fill={accentColor} fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="700">xQueueSend()</text>
            <text x="10" y="36" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Thread-safe push</text>
          </g>
        </g>

        {/* INTER-CORE BRIDGE VECTOR */}
        <line x1="630" y1="140" x2="630" y2="175" stroke={accentColor} strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow-rtos)" />

        {/* LANE B: ESP32 CORE 1 (TELEMETRY & DISPLAY) */}
        <g transform="translate(40, 180)">
          <rect width="680" height="110" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <rect x="0" y="0" width="140" height="24" rx="2" fill="var(--bg-base)" stroke="var(--border-subtle)" />
          <text x="12" y="16" fill="var(--text-primary)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">CORE 1 // DISPLAY & COMM</text>
          <text x="665" y="18" fill="currentColor" fillOpacity="0.4" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="end">ISOLATED FROM ADC JITTER</text>

          {/* Oscilloscope ECG Cardiac Spline Trace */}
          <g transform="translate(20, 36)">
            {/* Background Scope Grid */}
            <rect width="400" height="58" rx="2" fill="var(--bg-base)" stroke="var(--border-subtle)" />
            <line x1="0" y1="29" x2="400" y2="29" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.15" />

            {/* Cardiac ECG Spline (P-Q-R-S-T wave) */}
            <path
              d="M 10 29 L 50 29 Q 60 25 70 29 L 85 29 L 90 34 L 100 8 L 108 48 L 115 29 L 140 29 Q 155 22 170 29 L 230 29 L 235 34 L 245 8 L 253 48 L 260 29 L 285 29 Q 300 22 315 29 L 390 29"
              fill="none"
              stroke={accentColor}
              strokeWidth="1.8"
            />
            <text x="15" y="14" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">SSD1306 OLED BUFFER // ECG TRACE</text>
          </g>

          {/* Serial Telemetry Block */}
          <g transform="translate(440, 36)">
            <rect width="210" height="58" rx="2" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" />
            <text x="14" y="22" fill="var(--text-primary)" fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="600">SERIAL & BLUETOOTH</text>
            <text x="14" y="38" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">115200 Baud Telemetry Stream</text>
            <text x="14" y="49" fill={accentColor} fontSize="7.5" fontFamily="var(--font-mono)">JITTER FREE SAMPLING: 0% LOSS</text>
          </g>
        </g>

        {/* Telemetry Footer */}
        <g transform="translate(50, 325)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">TASK PINNING: xTaskCreatePinnedToCore()</text>
          <text x="320" y="0" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">DISCLAIMER: ENGINEERING SENSOR PROTOTYPE</text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   6. EngiNexus: 15-Model Relational Campus Ontology & Matchmaking Graph
   ========================================================================== */
const EnginexusVisual: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <div className="visual-container enginexus-canvas">
      <svg
        viewBox="0 0 760 360"
        className="atlas-svg"
        role="img"
        aria-label="EngiNexus 15-model relational database campus ontology diagram"
      >
        <defs>
          <marker id="arrow-rel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill={accentColor} />
          </marker>
        </defs>

        {/* Central Core: Prisma 15-Model Relational Core */}
        <g transform="translate(380, 170)">
          <rect x="-110" y="-35" width="220" height="70" rx="4" fill="var(--bg-base)" stroke={accentColor} strokeWidth="2" />
          <text y="-14" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">PRISMA RELATIONAL CORE</text>
          <text y="4" fill={accentColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">15-MODEL POSTGRESQL SCHEMA</text>
          <text y="20" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">COMPOSITE JUNCTION INDEXES</text>
        </g>

        {/* Satellite Node 1: Students & Skills (Top Left) */}
        <line x1="170" y1="85" x2="280" y2="145" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 2" />
        <g transform="translate(60, 45)">
          <rect width="180" height="60" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="12" y="20" fill="var(--text-primary)" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="700">STUDENT_PROFILES</text>
          <text x="12" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Skill Taxonomies & Ratings</text>
          <text x="12" y="48" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">Department Affiliation</text>
        </g>

        {/* Satellite Node 2: Multi-disciplinary Projects (Top Right) */}
        <line x1="590" y1="85" x2="480" y2="145" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 2" />
        <g transform="translate(520, 45)">
          <rect width="180" height="60" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="12" y="20" fill="var(--text-primary)" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="700">RESEARCH_PROJECTS</text>
          <text x="12" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">SIH Hackathon Teams</text>
          <text x="12" y="48" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">Required Capability Vectors</text>
        </g>

        {/* Satellite Node 3: Laboratories (Bottom Left) */}
        <line x1="170" y1="260" x2="280" y2="195" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 2" />
        <g transform="translate(60, 230)">
          <rect width="180" height="60" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="12" y="20" fill="var(--text-primary)" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="700">LAB_FACILITIES</text>
          <text x="12" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Department Testing Labs</text>
          <text x="12" y="48" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">Access Schedules & Hours</text>
        </g>

        {/* Satellite Node 4: Equipment & Inventory (Bottom Right) */}
        <line x1="590" y1="260" x2="480" y2="195" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 2" />
        <g transform="translate(520, 230)">
          <rect width="180" height="60" rx="3" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
          <text x="12" y="20" fill="var(--text-primary)" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="700">EQUIPMENT_INVENTORY</text>
          <text x="12" y="36" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="var(--font-mono)">Specialized Hardware Rigs</text>
          <text x="12" y="48" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)">Calibration & Booking Logs</text>
        </g>

        {/* Telemetry Footer */}
        <g transform="translate(50, 335)">
          <text x="0" y="0" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">ONTOLOGY COVERAGE: 15 RELATIONAL PRISMA MODELS</text>
          <text x="350" y="0" fill="var(--text-muted)" fontSize="8.5" fontFamily="var(--font-mono)">MATCHMAKING ALGORITHM: COMPOSITE UNIQUE KEYS</text>
        </g>
      </svg>
    </div>
  );
};

/* ==========================================================================
   Default Generic Visual Fallback (Self-contained, image-free)
   ========================================================================== */
const DefaultVisual: React.FC<{ project: Project; accentColor: string }> = ({ project, accentColor }) => {
  return (
    <div className="visual-container default-canvas">
      <svg viewBox="0 0 760 360" className="atlas-svg" role="img" aria-label="System topology diagram">
        <rect width="100%" height="100%" fill="none" stroke="var(--border-subtle)" strokeDasharray="4 4" />
        <text x="380" y="170" fill="var(--text-primary)" fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">
          {`${project.title.toUpperCase()} // TOPOLOGY`}
        </text>
        <text x="380" y="195" fill={accentColor} fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
          {project.category.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};
