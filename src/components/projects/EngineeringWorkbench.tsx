'use client';

import React, { useState, useEffect, useId, useMemo, useRef } from 'react';
import { Project } from '@/data/projects';
import {
  ProjectWorkbench,
  WorkbenchNode,
  getWorkbenchData
} from '@/data/workbench';
import { useCursorHandlers } from '@/hooks/useCursorState';
import './EngineeringWorkbench.css';

interface EngineeringWorkbenchProps {
  project: Project;
  mode?: 'compact' | 'full';
  onClose?: () => void;
}

type WorkbenchTab = 'flow' | 'topology' | 'decisions';

// SVG Diagram Canvas Coordinate Space
const SVG_WIDTH = 960;
const SVG_HEIGHT = 480;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 88;

// Color mapping for pipeline stages
const STAGE_COLORS: Record<string, string> = {
  input: '#38BDF8', // Ingress Blue
  processing: 'var(--wb-accent)', // Algorithmic Accent
  hardware: '#A78BFA', // Hardware Violet
  storage: '#FBBF24', // Storage Amber
  buffer: '#F472B6', // Buffer Pink
  output: '#34D399', // Egress Emerald
  gateway: '#2DD4BF' // Gateway Cyan
};

export const EngineeringWorkbench: React.FC<EngineeringWorkbenchProps> = ({
  project,
  mode = 'full',
  onClose
}) => {
  const workbenchData: ProjectWorkbench | null = useMemo(
    () => getWorkbenchData(project?.id),
    [project?.id]
  );

  const [activeTab, setActiveTab] = useState<WorkbenchTab>('flow');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedDecisionId, setHighlightedDecisionId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const uniqueId = useId();
  const linkCursor = useCursorHandlers('link');
  const exploreCursor = useCursorHandlers('explore');
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nodes = useMemo(() => workbenchData?.nodes || [], [workbenchData]);
  const edges = useMemo(() => workbenchData?.edges || [], [workbenchData]);
  const flowSteps = useMemo(() => workbenchData?.flowSteps || [], [workbenchData]);
  const decisions = useMemo(() => workbenchData?.decisions || [], [workbenchData]);
  const systemTitle = workbenchData?.systemTitle || project?.title || 'System Architecture';
  const subsystem = workbenchData?.subsystem || 'Core Pipeline';
  const primaryConstraint = workbenchData?.primaryConstraint || '';
  const verifiedScopeNote = workbenchData?.verifiedScopeNote;

  const activeStep = flowSteps[activeStepIndex] || flowSteps[0];

  // Fullscreen management: handle body overflow & Escape key
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isFullscreen]);

  // Automated step progression when playing
  useEffect(() => {
    if (!isPlaying || flowSteps.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= flowSteps.length - 1) {
          setIsPlaying(false);
          return 0; // Return to start when complete
        }
        return prev + 1;
      });
    }, 4200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, flowSteps.length]);

  // Compute active nodes for highlighting
  const highlightedNodeIds = useMemo(() => {
    if (highlightedDecisionId) {
      return new Set(nodes.map((n) => n.id));
    }
    if (selectedNodeId) {
      const connectedPeerIds = edges
        .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
        .map((e) => (e.source === selectedNodeId ? e.target : e.source));
      return new Set([selectedNodeId, ...connectedPeerIds]);
    }
    if (activeTab === 'flow' && activeStep) {
      return new Set(activeStep.activeNodeIds);
    }
    return new Set<string>();
  }, [activeTab, activeStep, selectedNodeId, edges, highlightedDecisionId, nodes]);

  // Compute active edges for highlighting
  const highlightedEdgeIds = useMemo(() => {
    if (selectedNodeId) {
      return new Set(
        edges
          .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
          .map((e) => e.id)
      );
    }
    if (activeTab === 'flow' && activeStep) {
      return new Set(activeStep.activeEdgeIds);
    }
    return new Set<string>();
  }, [activeTab, activeStep, selectedNodeId, edges]);

  const selectedNodeData: WorkbenchNode | undefined = nodes.find(
    (n) => n.id === selectedNodeId
  );

  // Inbound & outbound channels for the selected node
  const nodeInboundEdges = edges.filter((e) => e.target === selectedNodeId);
  const nodeOutboundEdges = edges.filter((e) => e.source === selectedNodeId);

  // Calculate pixel coordinates within the unified SVG space (960 x 480)
  const nodeLayoutMap = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number; x: number; y: number }>();
    nodes.forEach((node) => {
      const cx = (node.x / 100) * SVG_WIDTH;
      const cy = (node.y / 100) * SVG_HEIGHT;
      map.set(node.id, {
        cx,
        cy,
        x: cx - NODE_WIDTH / 2,
        y: cy - NODE_HEIGHT / 2
      });
    });
    return map;
  }, [nodes]);

  // Edge curve calculations (smooth cubic bezier)
  const edgeCurves = useMemo(() => {
    return edges.map((edge) => {
      const sourceCoord = nodeLayoutMap.get(edge.source);
      const targetCoord = nodeLayoutMap.get(edge.target);
      if (!sourceCoord || !targetCoord) return null;

      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;

      if (targetCoord.cx > sourceCoord.cx) {
        // Forward flow: right center of source -> left center of target
        startX = sourceCoord.cx + NODE_WIDTH / 2;
        startY = sourceCoord.cy;
        endX = targetCoord.cx - NODE_WIDTH / 2;
        endY = targetCoord.cy;
      } else {
        // Reverse/loopback flow: bottom center to bottom center
        startX = sourceCoord.cx;
        startY = sourceCoord.cy + NODE_HEIGHT / 2;
        endX = targetCoord.cx;
        endY = targetCoord.cy + NODE_HEIGHT / 2;
      }

      const dx = Math.max(45, Math.abs(endX - startX) * 0.45);
      const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      return {
        edge,
        pathD,
        midX,
        midY,
        startX,
        startY,
        endX,
        endY
      };
    }).filter(Boolean);
  }, [edges, nodeLayoutMap]);

  // Graceful fallback for missing or incomplete workbench data
  if (!workbenchData || nodes.length === 0) {
    return (
      <div className="workbench-container fallback-mode" role="region" aria-label="Engineering Workbench">
        <div className="workbench-chrome">
          <div className="workbench-title-group">
            <span className="workbench-badge">WORKBENCH // OFFLINE</span>
            <span className="workbench-system-title">{project?.title || 'System Explorer'}</span>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="workbench-close-btn" aria-label="Close workbench">
              ✕
            </button>
          )}
        </div>
        <div className="workbench-fallback-body">
          <p className="workbench-fallback-text">
            Interactive system topologies and engineering trade-offs are currently being cataloged for this entry.
          </p>
        </div>
      </div>
    );
  }

  const handlePrevStep = () => {
    setIsPlaying(false);
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setActiveStepIndex((prev) => Math.min(flowSteps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
    setSelectedNodeId(null);
    setHighlightedDecisionId(null);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextStep();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevStep();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`workbench-container ${mode === 'compact' ? 'mode-compact' : 'mode-full'} ${
        isFullscreen ? 'is-fullscreen' : ''
      }`}
      role="region"
      aria-label={`${systemTitle} Interactive Engineering Workbench`}
      onKeyDown={handleKeyDown}
      style={{
        '--workbench-accent': project.accentColor || 'var(--accent-base)',
        '--workbench-accent-light': project.accentColorLight || 'var(--accent-base)'
      } as React.CSSProperties}
    >
      {/* 1. Command Center Chrome / Telemetry Bar */}
      <header className="workbench-chrome">
        <div className="workbench-chrome-left">
          <div className="workbench-badge-group">
            <span className="workbench-status-dot pulse" aria-hidden="true" />
            <span className="workbench-badge">SYSTEM WORKBENCH</span>
            <span className="workbench-sep">/</span>
            <span className="workbench-subsystem">{subsystem}</span>
          </div>
          <h4 className="workbench-title">{systemTitle}</h4>
        </div>

        {/* Center: Lens Navigation Tabs */}
        <div className="workbench-chrome-center">
          <div className="workbench-tabs" role="tablist" aria-label="Workbench Exploration Modes">
            <button
              type="button"
              role="tab"
              id={`${uniqueId}-tab-flow`}
              aria-selected={activeTab === 'flow'}
              aria-controls={`${uniqueId}-panel-flow`}
              className={`workbench-tab-btn ${activeTab === 'flow' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('flow');
                setHighlightedDecisionId(null);
              }}
              {...linkCursor}
            >
              <span className="tab-num">01</span>
              <span>EXECUTION FLOW</span>
            </button>

            <button
              type="button"
              role="tab"
              id={`${uniqueId}-tab-topology`}
              aria-selected={activeTab === 'topology'}
              aria-controls={`${uniqueId}-panel-topology`}
              className={`workbench-tab-btn ${activeTab === 'topology' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('topology');
                setHighlightedDecisionId(null);
              }}
              {...linkCursor}
            >
              <span className="tab-num">02</span>
              <span>TOPOLOGY</span>
            </button>

            <button
              type="button"
              role="tab"
              id={`${uniqueId}-tab-decisions`}
              aria-selected={activeTab === 'decisions'}
              aria-controls={`${uniqueId}-panel-decisions`}
              className={`workbench-tab-btn ${activeTab === 'decisions' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('decisions');
                setSelectedNodeId(null);
              }}
              {...linkCursor}
            >
              <span className="tab-num">03</span>
              <span>TRADE-OFFS</span>
            </button>
          </div>
        </div>

        {/* Right: Fullscreen, Reset & Telemetry Actions */}
        <div className="workbench-chrome-right">
          <div className="workbench-telemetry-badge" title="Active registered components">
            <span className="telemetry-key">NODES:</span>
            <span className="telemetry-val">{nodes.length}</span>
            <span className="telemetry-key">PIPELINE:</span>
            <span className="telemetry-val">{flowSteps.length} STEPS</span>
          </div>

          {/* Full Screen Toggle Button */}
          <button
            type="button"
            className={`workbench-fullscreen-btn ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen mode (Esc)' : 'Expand workbench to full screen'}
            title={isFullscreen ? 'Exit full screen (Esc)' : 'Expand to full screen mode'}
            {...linkCursor}
          >
            {isFullscreen ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
                <span className="btn-label">EXIT FULLSCREEN</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                <span className="btn-label">FULLSCREEN</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="workbench-reset-btn"
            onClick={handleReset}
            title="Reset active flow step and component selection"
            aria-label="Reset workbench view"
            {...linkCursor}
          >
            <span>↺ RESET</span>
          </button>

          {onClose && (
            <button
              type="button"
              className="workbench-close-btn"
              onClick={onClose}
              aria-label="Close workbench view"
              title="Return to Schematic View"
              {...linkCursor}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Verified Architectural Scope Disclaimer */}
      {verifiedScopeNote && (
        <div className="workbench-scope-banner" role="note">
          <span className="scope-tag">SCOPE SPECIFICATION //</span>
          <p className="scope-text">{verifiedScopeNote}</p>
        </div>
      )}

      {/* 2. Main Workbench Workspace (Split Stage: Vector Canvas + Contextual Inspector) */}
      <div className="workbench-workspace">
        {/* Left Stage: Interactive SVG Vector Architecture Canvas */}
        <div className="workbench-stage-wrapper">
          <div className="stage-top-meta">
            <div className="stage-meta-left">
              <span className="stage-meta-label">CANVAS // DIRECTED TOPOLOGY</span>
              <span className="stage-meta-tag">1:1 VECTOR PROJECTION</span>
            </div>
            <div className="stage-meta-right">
              {selectedNodeId ? (
                <div className="stage-meta-selected-group">
                  <span className="stage-meta-hint">
                    SELECTED // {selectedNodeData?.label}
                  </span>
                  {activeTab !== 'topology' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('topology')}
                      className="stage-meta-jump-btn"
                      title="Inspect component parameters and channels in dossier"
                      {...linkCursor}
                    >
                      VIEW DOSSIER ➔
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(null)}
                    className="stage-meta-clear-btn"
                    title="Deselect component"
                    aria-label="Deselect component"
                    {...linkCursor}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="stage-meta-hint">
                  {activeTab === 'flow'
                    ? `STEP ${activeStep.stepNumber}: ${activeStep.phase} ACTIVE`
                    : 'CLICK ANY NODE TO INSPECT CHANNELS'}
                </span>
              )}
            </div>
          </div>

          <div className="workbench-svg-stage">
            <svg
              className="workbench-svg"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive architecture topology diagram"
            >
              <defs>
                {/* Glow Filter for Active Edges & Nodes */}
                <filter id={`${uniqueId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Arrowhead Markers */}
                <marker
                  id={`${uniqueId}-arrow-active`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--wb-accent)" />
                </marker>
                <marker
                  id={`${uniqueId}-arrow-subtle`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 6 5 L 0 8 z" fill="var(--border-strong)" />
                </marker>

                {/* Architectural Blueprint Grid Pattern */}
                <pattern id={`${uniqueId}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="0.6" strokeOpacity="0.4" />
                  <circle cx="0" cy="0" r="1" fill="var(--border-strong)" opacity="0.6" />
                </pattern>
              </defs>

              {/* Blueprint Grid Background */}
              <rect width="100%" height="100%" fill={`url(#${uniqueId}-grid)`} />

              {/* Technical Corner Brackets */}
              <g className="stage-corner-brackets" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" opacity="0.5">
                <path d="M 24 38 L 24 24 L 38 24" />
                <path d="M 936 38 L 936 24 L 922 24" />
                <path d="M 24 442 L 24 456 L 38 456" />
                <path d="M 936 442 L 936 456 L 922 456" />
              </g>

              {/* Subtle Center Crosshairs */}
              <g className="stage-crosshairs" opacity="0.2">
                <line x1="480" y1="24" x2="480" y2="456" stroke="var(--border-subtle)" strokeDasharray="3 6" />
                <line x1="24" y1="240" x2="936" y2="240" stroke="var(--border-subtle)" strokeDasharray="3 6" />
              </g>

              {/* Connecting Directed Edges (Orthogonal Bezier Paths) */}
              <g className="workbench-edges-group">
                {edgeCurves.map((curve) => {
                  if (!curve) return null;
                  const { edge, pathD, midX, midY } = curve;
                  const isEdgeHighlighted = highlightedEdgeIds.has(edge.id);
                  const isEdgeDimmed =
                    highlightedEdgeIds.size > 0 && !isEdgeHighlighted;

                  return (
                    <g
                      key={edge.id}
                      className={`workbench-edge-group ${isEdgeHighlighted ? 'active' : ''} ${
                        isEdgeDimmed ? 'dimmed' : ''
                      }`}
                    >
                      {/* Base Track Line */}
                      <path
                        d={pathD}
                        className="edge-path-base"
                        markerEnd={`url(#${uniqueId}-${isEdgeHighlighted ? 'arrow-active' : 'arrow-subtle'})`}
                      />

                      {/* Illuminated Flow Track */}
                      {isEdgeHighlighted && (
                        <path d={pathD} className="edge-path-glow" filter={`url(#${uniqueId}-glow)`} />
                      )}

                      {/* Animated Flowing Data Packets on Active Paths */}
                      {isEdgeHighlighted && (
                        <>
                          <circle r="4" fill="var(--wb-accent)">
                            <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" />
                          </circle>
                          <circle r="2.2" fill="#FFFFFF" opacity="0.9">
                            <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" begin="0.16s" />
                          </circle>
                        </>
                      )}

                      {/* Edge Protocol Badge */}
                      <g
                        className="edge-badge-anchor"
                        transform={`translate(${midX}, ${midY})`}
                      >
                        <rect
                          x="-65"
                          y="-11"
                          width="130"
                          height="22"
                          rx="4"
                          className="edge-badge-rect"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          className="edge-badge-label"
                        >
                          {edge.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Positioned Vector Architecture Node Cards */}
              <g className="workbench-nodes-group">
                {nodes.map((node) => {
                  const coord = nodeLayoutMap.get(node.id);
                  if (!coord) return null;

                  const isNodeHighlighted = highlightedNodeIds.has(node.id);
                  const isNodeSelected = selectedNodeId === node.id;
                  const isNodeDimmed =
                    highlightedNodeIds.size > 0 && !isNodeHighlighted && !isNodeSelected;
                  const stageColor = STAGE_COLORS[node.stage] || 'var(--wb-accent)';

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${coord.x}, ${coord.y})`}
                      className={`workbench-node-group stage-${node.stage} ${isNodeSelected ? 'selected' : ''} ${
                        isNodeHighlighted ? 'highlighted' : ''
                      } ${isNodeDimmed ? 'dimmed' : ''}`}
                      onClick={() => handleNodeClick(node.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNodeClick(node.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isNodeSelected}
                      aria-label={`${node.label} (${node.category}): ${node.responsibility}`}
                      {...exploreCursor}
                    >
                      {/* Node Card Container Rect (No CSS Transform on hover = zero glitch) */}
                      <rect
                        width={NODE_WIDTH}
                        height={NODE_HEIGHT}
                        rx="8"
                        className="node-card-rect"
                        filter={isNodeHighlighted || isNodeSelected ? `url(#${uniqueId}-glow)` : undefined}
                      />

                      {/* Top Accent Strip per stage */}
                      <rect
                        width={NODE_WIDTH}
                        height="3"
                        rx="1.5"
                        fill={stageColor}
                        className="node-stage-strip"
                      />

                      {/* Category & Status Row */}
                      <text x="12" y="20" className="node-cat-text">
                        [{node.category}]
                      </text>

                      {/* Status Indicator LED */}
                      <circle
                        cx={NODE_WIDTH - 14}
                        cy="16"
                        r="3.5"
                        fill={isNodeHighlighted || isNodeSelected ? stageColor : 'var(--border-strong)'}
                        className="node-status-led"
                      />

                      {/* Component Label */}
                      <text x="12" y="44" className="node-title-text">
                        {node.label}
                      </text>

                      {/* Runtime Tech Stack Tag */}
                      {node.tech && (
                        <g transform="translate(12, 58)">
                          <rect width={NODE_WIDTH - 24} height="18" rx="3" className="node-tech-rect" />
                          <text x="6" y="12" className="node-tech-text">
                            {node.tech.length > 26 ? `${node.tech.slice(0, 24)}…` : node.tech}
                          </text>
                        </g>
                      )}

                      {/* Connection Pips on Ingress/Egress Sides */}
                      <circle cx="0" cy={NODE_HEIGHT / 2} r="3.5" className="node-pip left-pip" />
                      <circle cx={NODE_WIDTH} cy={NODE_HEIGHT / 2} r="3.5" className="node-pip right-pip" />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Stage Footer: Architecture Legend & Quick Selector */}
          <div className="stage-footer-bar">
            <div className="stage-footer-legend">
              <span className="legend-item"><span className="legend-dot input-dot" /> 01 INGRESS</span>
              <span className="legend-item"><span className="legend-dot proc-dot" /> 02 COMPUTE</span>
              <span className="legend-item"><span className="legend-dot store-dot" /> 03 STORAGE</span>
              <span className="legend-item"><span className="legend-dot out-dot" /> 04 EGRESS</span>
            </div>

            <div className="stage-quick-chips">
              <span className="quick-label">COMPONENTS //</span>
              {nodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNodeClick(n.id)}
                  className={`quick-node-chip ${selectedNodeId === n.id ? 'active' : ''}`}
                  {...linkCursor}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Stage: Contextual Engineering Inspector Console */}
        <aside className="workbench-inspector" aria-live="polite">
          {/* TAB 1: EXECUTION FLOW (Live Pipeline Walkthrough) */}
          {activeTab === 'flow' && (
            <div
              id={`${uniqueId}-panel-flow`}
              role="tabpanel"
              aria-labelledby={`${uniqueId}-tab-flow`}
              className="inspector-flow-panel"
            >
              {/* Stepper Header with Controls */}
              <div className="flow-stepper-header">
                <div className="stepper-step-info">
                  <span className="step-num">STEP {activeStep.stepNumber}</span>
                  <span className="step-total">OF 0{flowSteps.length}</span>
                  <span className="step-phase-badge">[{activeStep.phase}]</span>
                </div>

                <div className="flow-stepper-controls">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={activeStepIndex === 0}
                    className="stepper-btn"
                    aria-label="Previous execution step"
                    {...linkCursor}
                  >
                    ◀ PREV
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`stepper-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
                    aria-label={isPlaying ? 'Pause automated walkthrough' : 'Play automated walkthrough'}
                    {...linkCursor}
                  >
                    {isPlaying ? 'PAUSE ❚❚' : 'PLAY ▶'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={activeStepIndex === flowSteps.length - 1}
                    className="stepper-btn"
                    aria-label="Next execution step"
                    {...linkCursor}
                  >
                    NEXT ▶
                  </button>
                </div>
              </div>

              {/* Interactive Step Progress Pills */}
              <div className="flow-scrubber-track" role="tablist" aria-label="Step progress index">
                {flowSteps.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeStepIndex}
                    aria-label={`Jump to step ${s.stepNumber}: ${s.title}`}
                    className={`scrubber-pill ${idx === activeStepIndex ? 'active' : ''} ${
                      idx < activeStepIndex ? 'completed' : ''
                    }`}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStepIndex(idx);
                    }}
                    {...linkCursor}
                  >
                    <span className="pill-num">{s.stepNumber}</span>
                    <span className="pill-phase">{s.phase.slice(0, 4)}</span>
                  </button>
                ))}
              </div>

              {/* Step Overview */}
              <div className="flow-step-hero">
                <h5 className="flow-hero-title">{activeStep.title}</h5>
                <p className="flow-hero-summary">{activeStep.summary}</p>
              </div>

              {/* Structured 3-Tier Data Flow Cards */}
              <div className="flow-dossier-stack">
                {activeStep.inputPayload && (
                  <div className="flow-dossier-card in-card">
                    <div className="dossier-card-header">
                      <span className="dossier-tag in-tag">01 // INPUT INGRESS</span>
                      <span className="dossier-protocol">SOURCE STATE</span>
                    </div>
                    <div className="dossier-card-body">
                      <code className="dossier-code">{activeStep.inputPayload}</code>
                    </div>
                  </div>
                )}

                {activeStep.processingAction && (
                  <div className="flow-dossier-card proc-card">
                    <div className="dossier-card-header">
                      <span className="dossier-tag proc-tag">02 // COMPUTATIONAL ENGINE</span>
                      <span className="dossier-protocol">TRANSFORMATION</span>
                    </div>
                    <div className="dossier-card-body">
                      <p className="dossier-text">{activeStep.processingAction}</p>
                    </div>
                  </div>
                )}

                {activeStep.outputResult && (
                  <div className="flow-dossier-card out-card">
                    <div className="dossier-card-header">
                      <span className="dossier-tag out-tag">03 // VERIFIED OUTPUT</span>
                      <span className="dossier-protocol">POST-CONDITION</span>
                    </div>
                    <div className="dossier-card-body">
                      <p className="dossier-text">{activeStep.outputResult}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT TOPOLOGY (Deep Inspection) */}
          {activeTab === 'topology' && (
            <div
              id={`${uniqueId}-panel-topology`}
              role="tabpanel"
              aria-labelledby={`${uniqueId}-tab-topology`}
              className="inspector-topology-panel"
            >
              <div className="panel-header-row">
                <span className="panel-title-label">COMPONENT TELEMETRY</span>
                <span className="panel-count-badge">{nodes.length} REGISTERED UNITS</span>
              </div>

              {selectedNodeData ? (
                <div className="topology-card">
                  <div className="topology-header">
                    <div>
                      <span className="topology-category">[{selectedNodeData.category}]</span>
                      <h5 className="topology-name">{selectedNodeData.label}</h5>
                    </div>
                    <span className="topology-stage-badge">{selectedNodeData.stage.toUpperCase()}</span>
                  </div>

                  <div className="topology-section">
                    <span className="topology-label">PRIMARY ARCHITECTURAL RESPONSIBILITY //</span>
                    <p className="topology-desc">{selectedNodeData.responsibility}</p>
                  </div>

                  {selectedNodeData.tech && (
                    <div className="topology-section">
                      <span className="topology-label">IMPLEMENTATION RUNTIME //</span>
                      <span className="topology-tech-pill">{selectedNodeData.tech}</span>
                    </div>
                  )}

                  {/* Channel Matrix */}
                  <div className="topology-channels-grid">
                    <div className="channel-box inbound-box">
                      <span className="channel-header-tag">INBOUND CHANNELS ({nodeInboundEdges.length})</span>
                      {nodeInboundEdges.length === 0 ? (
                        <span className="channel-empty-msg">No inbound channels (Ingress Source)</span>
                      ) : (
                        <ul className="channel-items-list">
                          {nodeInboundEdges.map((e) => {
                            const sender = nodes.find((n) => n.id === e.source);
                            return (
                              <li key={e.id} className="channel-row">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNodeId(e.source)}
                                  className="channel-peer-btn"
                                  title={`Inspect sender ${sender?.label}`}
                                >
                                  ← {sender?.label || e.source}
                                </button>
                                <span className="channel-proto-tag">[{e.label}]</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div className="channel-box outbound-box">
                      <span className="channel-header-tag">OUTBOUND CHANNELS ({nodeOutboundEdges.length})</span>
                      {nodeOutboundEdges.length === 0 ? (
                        <span className="channel-empty-msg">No outbound channels (Terminal Egress)</span>
                      ) : (
                        <ul className="channel-items-list">
                          {nodeOutboundEdges.map((e) => {
                            const receiver = nodes.find((n) => n.id === e.target);
                            return (
                              <li key={e.id} className="channel-row">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNodeId(e.target)}
                                  className="channel-peer-btn"
                                  title={`Inspect receiver ${receiver?.label}`}
                                >
                                  → {receiver?.label || e.target}
                                </button>
                                <span className="channel-proto-tag">[{e.label}]</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(null)}
                    className="topology-clear-btn"
                  >
                    ✕ CLEAR SELECTION
                  </button>
                </div>
              ) : (
                <div className="topology-empty-state">
                  <div className="empty-state-symbol">❖</div>
                  <h6 className="empty-state-heading">Interactive Component Inspector</h6>
                  <p className="empty-state-text">
                    Click any node card in the vector stage to inspect its system boundaries, data contracts,
                    runtime stack, and dependency routing.
                  </p>
                  <div className="empty-state-chips">
                    <span className="empty-chips-label">SELECT COMPONENT TO INSPECT:</span>
                    <div className="chips-row">
                      {nodes.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setSelectedNodeId(n.id)}
                          className="quick-select-chip"
                          {...linkCursor}
                        >
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRADE-OFFS & CONSTRAINTS */}
          {activeTab === 'decisions' && (
            <div
              id={`${uniqueId}-panel-decisions`}
              role="tabpanel"
              aria-labelledby={`${uniqueId}-tab-decisions`}
              className="inspector-decisions-panel"
            >
              {/* Primary Engineering Constraint Banner */}
              <div className="primary-constraint-card">
                <div className="constraint-badge-row">
                  <span className="constraint-badge">CORE ENGINEERING CHALLENGE //</span>
                  <span className="constraint-status">SYSTEM DIFFICULTY FACTOR</span>
                </div>
                <p className="constraint-body">{primaryConstraint}</p>
              </div>

              {/* Verified Decision Cards */}
              <div className="decisions-feed">
                <span className="decisions-feed-label">VERIFIED ARCHITECTURAL CHOICES ({decisions.length})</span>
                {decisions.map((decision, idx) => {
                  const isHovered = highlightedDecisionId === decision.id;

                  return (
                    <div
                      key={decision.id}
                      className={`architectural-decision-card ${isHovered ? 'highlighted' : ''}`}
                      onMouseEnter={() => setHighlightedDecisionId(decision.id)}
                      onMouseLeave={() => setHighlightedDecisionId(null)}
                    >
                      <div className="decision-header-row">
                        <span className="decision-num">0{idx + 1}</span>
                        <h6 className="decision-heading">{decision.title}</h6>
                      </div>

                      <div className="decision-callout chosen-callout">
                        <div className="callout-tag-row">
                          <span className="tag-check">✓</span>
                          <span className="callout-label">CHOSEN ARCHITECTURAL PATH //</span>
                        </div>
                        <p className="callout-text">{decision.choice}</p>
                      </div>

                      <div className="decision-callout rationale-callout">
                        <span className="callout-label">ENGINEERING RATIONALE //</span>
                        <p className="callout-text">{decision.rationale}</p>
                      </div>

                      <div className="decision-callout tradeoff-callout">
                        <span className="callout-label">KEY TRADE-OFF & CONSTRAINTS //</span>
                        <p className="callout-text">{decision.tradeOff}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
export default EngineeringWorkbench;
