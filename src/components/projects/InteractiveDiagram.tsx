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
      {/* Mobile Stack View (visible strictly < 768px via CSS) */}
      <div className="diagram-mobile-view" role="region" aria-label="System Components List">
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
              <span className="diagram-node-title">{node.label}</span>
              <span className="diagram-node-desc">{node.description}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Spatial View (visible strictly >= 768px via CSS) */}
      <div
        className="diagram-desktop-view"
        role="region"
        aria-label="Interactive Architecture Diagram"
      >
        <svg className="diagram-svg" aria-hidden="true">
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const isActive = activeNode === edge.source || activeNode === edge.target;
            const isDimmed = activeNode !== null && !isActive;

            return (
              <line
                key={`edge-${i}`}
                x1={`${sourceNode.x}%`}
                y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                className={`diagram-edge-line ${isActive ? 'active' : ''} ${
                  isDimmed ? 'dimmed' : ''
                } ${edge.animated ? 'diagram-edge-animated' : ''}`}
              />
            );
          })}
        </svg>

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
              {node.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Architecture Inspector Panel */}
      <div className="diagram-inspector" aria-live="polite">
        <p className="diagram-inspector-text">
          {activeNodeData ? (
            <>
              <strong>[{activeNodeData.label}]</strong>
              {activeNodeData.description}
            </>
          ) : (
            'Select or hover over any architectural component above to inspect its data flow and implementation responsibilities.'
          )}
        </p>
      </div>
    </div>
  );
};
