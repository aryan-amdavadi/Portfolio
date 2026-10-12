'use client';

import React, { useState } from 'react';
import { DiagramNode, DiagramEdge } from '@/data/projects';
import { useCursorHandlers } from '@/hooks/useCursorState';

interface InteractiveDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({ nodes, edges }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const exploreCursor = useCursorHandlers('explore');

  // Find edges related to the active node
  const activeEdges = edges.filter(
    (e) => e.source === activeNode || e.target === activeNode
  );

  // Find nodes connected to the active node
  const connectedNodeIds = new Set([
    activeNode,
    ...activeEdges.map((e) => (e.source === activeNode ? e.target : e.source))
  ]);

  const activeNodeData = nodes.find((n) => n.id === activeNode);

  const handleNodeToggle = (nodeId: string) => {
    setActiveNode((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <div className="diagram-wrapper">
      {/* Mobile Stack View (strictly < 768px via CSS) */}
      <div className="diagram-mobile-view" role="region" aria-label="System Components List">
        <div className="diagram-view-header">
          <span className="diagram-view-label">COMPONENT TOPOLOGY // TOUCH TO INSPECT</span>
        </div>
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const isDimmed = activeNode !== null && !connectedNodeIds.has(node.id);

          return (
            <button
              type="button"
              key={`mob-${node.id}`}
              className={`diagram-mobile-node ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
              onClick={() => handleNodeToggle(node.id)}
              aria-expanded={isActive}
              aria-label={`${node.label}: ${node.description}`}
            >
              <div className="diagram-node-head-row">
                <span className="diagram-node-title">{node.label}</span>
                {node.category && (
                  <span className="diagram-node-badge">[{node.category}]</span>
                )}
              </div>
              <span className="diagram-node-desc">{node.description}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Spatial View (strictly >= 768px via CSS) */}
      <div
        className="diagram-desktop-view"
        role="region"
        aria-label="Interactive Architecture Diagram"
        onMouseLeave={() => setActiveNode(null)}
      >
        <div className="diagram-schematic-header">
          <span className="diagram-schematic-tag">SCHEMATIC CAD VIEW // INTERACTIVE TOPOLOGY</span>
          <span className="diagram-schematic-status">SYS // READY</span>
        </div>

        <svg className="diagram-svg" aria-hidden="true">
          <defs>
            <pattern id="diag-schematic-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.5" className="diagram-grid-pattern" />
            </pattern>
            <marker id="arrow-default" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor" className="diagram-marker-default" />
            </marker>
            <marker id="arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M 0 0 L 7 3.5 L 0 7 z" fill="var(--project-accent, var(--accent-base))" />
            </marker>
          </defs>

          {/* Blueprint Grid Background */}
          <rect width="100%" height="100%" fill="url(#diag-schematic-grid)" />

          {/* Connection Edges */}
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const isActive = activeNode === edge.source || activeNode === edge.target;
            const isDimmed = activeNode !== null && !isActive;

            // Compute midpoint for edge label pill
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            return (
              <g key={`edge-group-${i}`}>
                <line
                  x1={`${sourceNode.x}%`}
                  y1={`${sourceNode.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow-default)"}
                  className={`diagram-edge-line ${isActive ? 'active' : ''} ${
                    isDimmed ? 'dimmed' : ''
                  } ${edge.animated ? 'diagram-edge-animated' : ''}`}
                />
                {edge.label && (
                  <text
                    x={`${midX}%`}
                    y={`${midY - 2}%`}
                    textAnchor="middle"
                    className={`diagram-edge-label ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Spatial Node Buttons */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const isDimmed = activeNode !== null && !connectedNodeIds.has(node.id);

          return (
            <button
              type="button"
              key={`desk-${node.id}`}
              className={`diagram-desktop-node-btn ${isActive ? 'active' : ''} ${
                isDimmed ? 'dimmed' : ''
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => handleNodeToggle(node.id)}
              onMouseEnter={() => setActiveNode(node.id)}
              onFocus={() => setActiveNode(node.id)}
              aria-pressed={isActive}
              aria-label={`Inspect component: ${node.label}`}
              {...exploreCursor}
            >
              <span className="diagram-port left" aria-hidden="true" />
              <div className="diagram-btn-content">
                {node.category && (
                  <span className="diagram-btn-badge">[{node.category}]</span>
                )}
                <span className="diagram-btn-label">{node.label}</span>
              </div>
              <span className="diagram-port right" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Dynamic Architecture Inspector Panel */}
      <div className="diagram-inspector" aria-live="polite">
        <div className="diagram-inspector-icon" aria-hidden="true">
          ◈
        </div>
        <p className="diagram-inspector-text">
          {activeNodeData ? (
            <>
              <span className="diagram-inspector-tag">
                [{activeNodeData.category ? `${activeNodeData.category} // ` : ''}{activeNodeData.label}]
              </span>
              <span>{activeNodeData.description}</span>
            </>
          ) : (
            <span className="diagram-inspector-prompt">
              Select or hover over any architectural component above to inspect data flow, contracts, and internal execution roles.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
