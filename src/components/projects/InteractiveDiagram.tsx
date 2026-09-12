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

  const activeDescription = activeNode 
    ? nodes.find(n => n.id === activeNode)?.description 
    : 'Hover over a system component to explore its function and relationships.';

  return (
    <div>
      <div className="interactive-diagram" onMouseLeave={() => setActiveNode(null)}>
        {/* SVG layer for drawing connecting lines */}
        <svg className="diagram-svg" preserveAspectRatio="none">
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;

            const isActive = activeNode === edge.source || activeNode === edge.target;
            const className = `diagram-edge ${isActive ? 'active' : ''} ${edge.animated ? 'animated' : ''}`;

            return (
              <line
                key={`edge-${i}`}
                x1={`${sourceNode.x}%`}
                y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                className={className}
              />
            );
          })}
        </svg>

        {/* DOM layer for interactive nodes */}
        {nodes.map((node) => {
          const isDimmed = activeNode !== null && !connectedNodeIds.has(node.id);
          const isActive = activeNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`diagram-node ${isDimmed ? 'dimmed' : ''} ${isActive ? 'active' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => {
                setActiveNode(node.id);
                exploreCursor.onMouseEnter();
              }}
              onMouseLeave={() => exploreCursor.onMouseLeave()}
            >
              {node.label}
            </div>
          );
        })}
      </div>
      
      {/* Dynamic explanation panel */}
      <div className="node-info-panel">
        {activeDescription}
      </div>
    </div>
  );
};
