'use client';

import React, { useState, useEffect, useId, useMemo } from 'react';
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

  const uniqueId = useId();
  const linkCursor = useCursorHandlers('link');
  const exploreCursor = useCursorHandlers('explore');

  const nodes = useMemo(() => workbenchData?.nodes || [], [workbenchData]);
  const edges = useMemo(() => workbenchData?.edges || [], [workbenchData]);
  const flowSteps = useMemo(() => workbenchData?.flowSteps || [], [workbenchData]);
  const decisions = useMemo(() => workbenchData?.decisions || [], [workbenchData]);
  const systemTitle = workbenchData?.systemTitle || '';
  const subsystem = workbenchData?.subsystem || '';
  const primaryConstraint = workbenchData?.primaryConstraint || '';
  const verifiedScopeNote = workbenchData?.verifiedScopeNote;

  const activeStep = flowSteps[activeStepIndex] || flowSteps[0];

  // Handle play/pause timer for flow step walkthrough
  useEffect(() => {
    if (!isPlaying || flowSteps.length === 0) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= flowSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying, flowSteps.length]);

  // Active elements derived from current step or manual node selection
  const highlightedNodeIds = useMemo(() => {
    if (activeTab === 'flow' && activeStep) {
      return new Set(activeStep.activeNodeIds);
    }
    if (activeTab === 'topology' && selectedNodeId) {
      const peerIds = edges
        .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
        .map((e) => (e.source === selectedNodeId ? e.target : e.source));
      return new Set([selectedNodeId, ...peerIds]);
    }
    return new Set<string>();
  }, [activeTab, activeStep, selectedNodeId, edges]);

  const highlightedEdgeIds = useMemo(() => {
    if (activeTab === 'flow' && activeStep) {
      return new Set(activeStep.activeEdgeIds);
    }
    if (activeTab === 'topology' && selectedNodeId) {
      return new Set(
        edges
          .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
          .map((e) => e.id)
      );
    }
    return new Set<string>();
  }, [activeTab, activeStep, selectedNodeId, edges]);

  const selectedNodeData: WorkbenchNode | undefined = nodes.find(
    (n) => n.id === selectedNodeId
  );

  // Connected edges for the selected node
  const nodeInboundEdges = edges.filter((e) => e.target === selectedNodeId);
  const nodeOutboundEdges = edges.filter((e) => e.source === selectedNodeId);

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
  };

  const handleNodeClick = (nodeId: string) => {
    if (activeTab !== 'topology') {
      setActiveTab('topology');
    }
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <div
      className={`workbench-container ${mode === 'compact' ? 'mode-compact' : 'mode-full'}`}
      role="region"
      aria-label={`${systemTitle} Interactive Engineering Workbench`}
    >
      {/* 1. Chrome / Header Bar */}
      <header className="workbench-chrome">
        <div className="workbench-chrome-left">
          <div className="workbench-badge-group">
            <span className="workbench-status-dot" aria-hidden="true" />
            <span className="workbench-badge">WORKBENCH // EXPLORER</span>
            <span className="workbench-sep">/</span>
            <span className="workbench-subsystem">{subsystem}</span>
          </div>
          <h4 className="workbench-title">{systemTitle}</h4>
        </div>

        <div className="workbench-chrome-right">
          {/* Mode Selector Tabs */}
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
                setSelectedNodeId(null);
              }}
              {...linkCursor}
            >
              <span>01 // SYSTEM FLOW</span>
            </button>

            <button
              type="button"
              role="tab"
              id={`${uniqueId}-tab-topology`}
              aria-selected={activeTab === 'topology'}
              aria-controls={`${uniqueId}-panel-topology`}
              className={`workbench-tab-btn ${activeTab === 'topology' ? 'active' : ''}`}
              onClick={() => setActiveTab('topology')}
              {...linkCursor}
            >
              <span>02 // TOPOLOGY</span>
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
              <span>03 // TRADE-OFFS</span>
            </button>
          </div>

          {/* Reset Control */}
          <button
            type="button"
            className="workbench-reset-btn"
            onClick={handleReset}
            title="Reset active step and component selections"
            aria-label="Reset workbench view"
            {...linkCursor}
          >
            <span>↺ RESET</span>
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              type="button"
              className="workbench-close-btn"
              onClick={onClose}
              aria-label="Close workbench view"
              {...linkCursor}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Verified Architectural Scope Disclaimer (if present) */}
      {verifiedScopeNote && (
        <div className="workbench-scope-banner" role="note">
          <span className="scope-tag">VERIFIED SCOPE NOTE //</span>
          <p className="scope-text">{verifiedScopeNote}</p>
        </div>
      )}

      {/* 2. Main Workbench Workspace (Split Stage: SVG Canvas + Contextual Inspector) */}
      <div className="workbench-workspace">
        {/* Left: Interactive Diagram Stage (Inline SVG) */}
        <div className="workbench-stage-wrapper">
          <div className="stage-top-meta">
            <span className="stage-meta-label">CANVAS // ARCHITECTURAL TOPOLOGY</span>
            <span className="stage-meta-hint">
              {activeTab === 'flow'
                ? `STEP ${activeStep.stepNumber}: ${activeStep.phase}`
                : selectedNodeId
                ? `SELECTED: ${selectedNodeData?.label}`
                : 'SELECT NODE TO INSPECT RESPONSIBILITY'}
            </span>
          </div>

          <div className="workbench-svg-stage">
            <svg
              className="workbench-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive architecture diagram"
            >
              <defs>
                <marker
                  id={`${uniqueId}-arrow`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--project-accent-color, var(--accent-base))" />
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
              </defs>

              {/* Grid Background Lines */}
              <g className="stage-grid-lines" opacity="0.3">
                <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border-subtle)" strokeDasharray="1 3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-subtle)" strokeDasharray="1 3" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border-subtle)" strokeDasharray="1 3" />
                <line x1="25" y1="0" x2="25" y2="100" stroke="var(--border-subtle)" strokeDasharray="1 3" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border-subtle)" strokeDasharray="1 3" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="var(--border-subtle)" strokeDasharray="1 3" />
              </g>

              {/* Render Connecting Edges */}
              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isEdgeHighlighted = highlightedEdgeIds.has(edge.id);
                const isEdgeDimmed =
                  (highlightedEdgeIds.size > 0 && !isEdgeHighlighted) ||
                  (activeTab === 'topology' && selectedNodeId && !highlightedEdgeIds.has(edge.id));

                // Calculate edge mid-point for label positioning
                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g
                    key={edge.id}
                    className={`workbench-edge ${isEdgeHighlighted ? 'active' : ''} ${isEdgeDimmed ? 'dimmed' : ''}`}
                  >
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      className="edge-path"
                      markerEnd={`url(#${uniqueId}-${isEdgeHighlighted ? 'arrow' : 'arrow-subtle'})`}
                    />
                    {isEdgeHighlighted && (
                      <g className="edge-payload-badge">
                        <rect
                          x={midX - 14}
                          y={midY - 3}
                          width="28"
                          height="6"
                          rx="1.5"
                          className="edge-badge-bg"
                        />
                        <text
                          x={midX}
                          y={midY + 1}
                          textAnchor="middle"
                          className="edge-badge-text"
                        >
                          {edge.label.length > 18 ? `${edge.label.slice(0, 16)}…` : edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Positioned HTML Nodes over SVG for full touch & keyboard accessibility */}
            <div className="workbench-nodes-overlay" role="group" aria-label="System Components">
              {nodes.map((node) => {
                const isNodeHighlighted = highlightedNodeIds.has(node.id);
                const isNodeSelected = selectedNodeId === node.id;
                const isNodeDimmed =
                  (highlightedNodeIds.size > 0 && !isNodeHighlighted && !isNodeSelected) ||
                  (activeTab === 'topology' && selectedNodeId && !isNodeHighlighted);

                return (
                  <button
                    key={node.id}
                    type="button"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`workbench-node-btn ${isNodeSelected ? 'selected' : ''} ${
                      isNodeHighlighted ? 'highlighted' : ''
                    } ${isNodeDimmed ? 'dimmed' : ''} stage-${node.stage}`}
                    onClick={() => handleNodeClick(node.id)}
                    aria-pressed={isNodeSelected}
                    aria-label={`${node.label} (${node.category}): ${node.responsibility}`}
                    {...exploreCursor}
                  >
                    <div className="node-badge-row">
                      <span className="node-category">[{node.category}]</span>
                      <span className="node-stage-tag">{node.stage.toUpperCase()}</span>
                    </div>
                    <div className="node-label">{node.label}</div>
                    {node.tech && <div className="node-tech">{node.tech}</div>}
                    <div className="node-anchor-pip" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="stage-footer-legend">
            <span className="legend-item"><span className="legend-dot input-dot" /> INPUT</span>
            <span className="legend-item"><span className="legend-dot proc-dot" /> PROCESSING</span>
            <span className="legend-item"><span className="legend-dot store-dot" /> STORAGE / BUFFER</span>
            <span className="legend-item"><span className="legend-dot out-dot" /> CLIENT / OUTPUT</span>
          </div>
        </div>

        {/* Right: Contextual Inspector Panel */}
        <aside className="workbench-inspector" aria-live="polite">
          {/* TAB 1: SYSTEM FLOW PIPELINE */}
          {activeTab === 'flow' && (
            <div
              id={`${uniqueId}-panel-flow`}
              role="tabpanel"
              aria-labelledby={`${uniqueId}-tab-flow`}
              className="inspector-flow-panel"
            >
              <div className="panel-header-row">
                <div className="panel-step-indicator">
                  <span className="panel-step-num">{activeStep.stepNumber}</span>
                  <span className="panel-step-total">/ 0{flowSteps.length}</span>
                  <span className="panel-step-phase">[{activeStep.phase}]</span>
                </div>

                <div className="flow-step-controls">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={activeStepIndex === 0}
                    className="flow-ctrl-btn"
                    aria-label="Previous step"
                    {...linkCursor}
                  >
                    ← PREV
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flow-ctrl-btn play-btn"
                    aria-label={isPlaying ? 'Pause automated walkthrough' : 'Play automated walkthrough'}
                    {...linkCursor}
                  >
                    {isPlaying ? 'PAUSE ❚❚' : 'PLAY ▶'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={activeStepIndex === flowSteps.length - 1}
                    className="flow-ctrl-btn"
                    aria-label="Next step"
                    {...linkCursor}
                  >
                    NEXT →
                  </button>
                </div>
              </div>

              {/* Step Title and Summary */}
              <div className="flow-step-identity">
                <h5 className="flow-step-title">{activeStep.title}</h5>
                <p className="flow-step-summary">{activeStep.summary}</p>
              </div>

              {/* Step Navigation Pills */}
              <div className="flow-step-pills" role="tablist" aria-label="Step progress index">
                {flowSteps.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeStepIndex}
                    aria-label={`Jump to step ${s.stepNumber}: ${s.title}`}
                    className={`flow-pill ${idx === activeStepIndex ? 'active' : ''}`}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStepIndex(idx);
                    }}
                    {...linkCursor}
                  >
                    <span>{s.stepNumber}</span>
                  </button>
                ))}
              </div>

              {/* Concrete Verified Flow Cards: Input -> Processing -> Output */}
              <div className="flow-card-stack">
                {activeStep.inputPayload && (
                  <div className="flow-card input-card">
                    <div className="flow-card-head">
                      <span className="flow-card-code">IN //</span>
                      <span className="flow-card-label">INPUT STATE & PAYLOAD</span>
                    </div>
                    <div className="flow-card-body">{activeStep.inputPayload}</div>
                  </div>
                )}

                {activeStep.processingAction && (
                  <div className="flow-card processing-card">
                    <div className="flow-card-head">
                      <span className="flow-card-code">PROC //</span>
                      <span className="flow-card-label">PROCESSING & TRANSFORMATION</span>
                    </div>
                    <div className="flow-card-body">{activeStep.processingAction}</div>
                  </div>
                )}

                {activeStep.outputResult && (
                  <div className="flow-card output-card">
                    <div className="flow-card-head">
                      <span className="flow-card-code">OUT //</span>
                      <span className="flow-card-label">VERIFIED OUTPUT STATE</span>
                    </div>
                    <div className="flow-card-body">{activeStep.outputResult}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT TOPOLOGY */}
          {activeTab === 'topology' && (
            <div
              id={`${uniqueId}-panel-topology`}
              role="tabpanel"
              aria-labelledby={`${uniqueId}-tab-topology`}
              className="inspector-topology-panel"
            >
              <div className="panel-header-row">
                <span className="panel-title-label">COMPONENT INSPECTOR</span>
                <span className="panel-count-badge">{nodes.length} REGISTERED UNITS</span>
              </div>

              {selectedNodeData ? (
                <div className="node-detail-card">
                  <div className="node-detail-header">
                    <div className="node-detail-title-group">
                      <span className="node-detail-cat">[{selectedNodeData.category}]</span>
                      <h5 className="node-detail-name">{selectedNodeData.label}</h5>
                    </div>
                    <span className="node-detail-stage">{selectedNodeData.stage.toUpperCase()}</span>
                  </div>

                  <div className="node-detail-section">
                    <span className="section-meta-label">PRIMARY RESPONSIBILITY //</span>
                    <p className="section-meta-text">{selectedNodeData.responsibility}</p>
                  </div>

                  {selectedNodeData.tech && (
                    <div className="node-detail-section">
                      <span className="section-meta-label">IMPLEMENTATION STACK //</span>
                      <span className="node-tech-badge">{selectedNodeData.tech}</span>
                    </div>
                  )}

                  {/* Connected Flows */}
                  <div className="node-detail-flows">
                    <div className="flow-channel-block">
                      <span className="channel-meta-label">INBOUND DATA CHANNELS ({nodeInboundEdges.length})</span>
                      {nodeInboundEdges.length === 0 ? (
                        <span className="channel-empty">No inbound channels (System Ingress)</span>
                      ) : (
                        <ul className="channel-list">
                          {nodeInboundEdges.map((e) => {
                            const sender = nodes.find((n) => n.id === e.source);
                            return (
                              <li key={e.id} className="channel-item">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNodeId(e.source)}
                                  className="channel-link-btn"
                                  title={`Inspect sender ${sender?.label}`}
                                >
                                  ← {sender?.label || e.source}
                                </button>
                                <span className="channel-protocol">[{e.label}]</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div className="flow-channel-block">
                      <span className="channel-meta-label">OUTBOUND DATA CHANNELS ({nodeOutboundEdges.length})</span>
                      {nodeOutboundEdges.length === 0 ? (
                        <span className="channel-empty">No outbound channels (Terminal Egress)</span>
                      ) : (
                        <ul className="channel-list">
                          {nodeOutboundEdges.map((e) => {
                            const receiver = nodes.find((n) => n.id === e.target);
                            return (
                              <li key={e.id} className="channel-item">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNodeId(e.target)}
                                  className="channel-link-btn"
                                  title={`Inspect receiver ${receiver?.label}`}
                                >
                                  → {receiver?.label || e.target}
                                </button>
                                <span className="channel-protocol">[{e.label}]</span>
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
                    className="clear-selection-btn"
                  >
                    ✕ CLEAR COMPONENT SELECTION
                  </button>
                </div>
              ) : (
                <div className="topology-selection-prompt">
                  <div className="prompt-icon">❖</div>
                  <h6 className="prompt-title">Select a Node to Inspect</h6>
                  <p className="prompt-text">
                    Click any component block in the diagram to inspect its exact system responsibility,
                    technology runtime, and inbound/outbound communication channels.
                  </p>
                  <div className="quick-node-list">
                    <span className="quick-list-label">DIRECT SELECTION //</span>
                    <div className="quick-chips">
                      {nodes.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setSelectedNodeId(n.id)}
                          className="quick-chip"
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
              {/* Primary Engineering Constraint */}
              <div className="constraint-callout-card">
                <div className="callout-head">
                  <span className="callout-tag">ENGINEERING CONSTRAINT //</span>
                  <span className="callout-title">CORE SYSTEM COMPLEXITY</span>
                </div>
                <p className="callout-body">{primaryConstraint}</p>
              </div>

              {/* Meaningful Decisions List */}
              <div className="decisions-list">
                <span className="decisions-section-label">VERIFIED ARCHITECTURAL CHOICES //</span>
                {decisions.map((decision, idx) => (
                  <div key={decision.id} className="decision-card">
                    <div className="decision-header">
                      <span className="decision-index">0{idx + 1}</span>
                      <h6 className="decision-title">{decision.title}</h6>
                    </div>

                    <div className="decision-block">
                      <span className="decision-sub-label">CHOSEN APPROACH //</span>
                      <p className="decision-sub-text">{decision.choice}</p>
                    </div>

                    <div className="decision-block">
                      <span className="decision-sub-label">ENGINEERING RATIONALE //</span>
                      <p className="decision-sub-text">{decision.rationale}</p>
                    </div>

                    <div className="decision-tradeoff-block">
                      <span className="tradeoff-sub-label">KEY TRADE-OFF & CONSTRAINTS //</span>
                      <p className="tradeoff-sub-text">{decision.tradeOff}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
