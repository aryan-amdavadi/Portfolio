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
    <div className="flex flex-col gap-8 w-full">
      {/* Mobile view (Stacked) */}
      <div className="flex flex-col gap-4 md:hidden">
        {nodes.map((node) => {
          const isDimmed = activeNode !== null && !connectedNodeIds.has(node.id);
          const isActive = activeNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`p-4 border rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'border-primary bg-primary/10 text-primary scale-[1.02]' 
                  : isDimmed 
                    ? 'border-border/50 bg-background/30 text-muted-foreground opacity-50' 
                    : 'border-border bg-card text-card-foreground hover:border-primary/50'
              }`}
              onClick={() => setActiveNode(isActive ? null : node.id)}
            >
              <div className="font-technical text-sm tracking-wide uppercase mb-1">{node.label}</div>
              <div className={`text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {node.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view (Spatial) */}
      <div 
        className="hidden md:block relative w-full h-[400px] border border-border bg-card rounded-2xl overflow-hidden"
        onMouseLeave={() => setActiveNode(null)}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
            </linearGradient>
          </defs>
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;

            const isActive = activeNode === edge.source || activeNode === edge.target;
            const isDimmed = activeNode !== null && !isActive;

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={`${sourceNode.x}%`}
                  y1={`${sourceNode.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-all duration-500 ${
                    isActive ? 'text-primary' : isDimmed ? 'text-border opacity-20' : 'text-border'
                  }`}
                  strokeDasharray={edge.animated ? '6,6' : 'none'}
                />
                {edge.animated && isActive && (
                  <circle r="4" fill="var(--primary)">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${sourceNode.x * 8} ${sourceNode.y * 4} L ${targetNode.x * 8} ${targetNode.y * 4}`}
                      // Note: animateMotion in % is tricky in raw SVG without proper viewbox, 
                      // but CSS animations or just highlighting the path works better.
                      // We will use a simpler CSS approach for dash offset if needed.
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => {
          const isDimmed = activeNode !== null && !connectedNodeIds.has(node.id);
          const isActive = activeNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-6 py-3 border rounded-xl backdrop-blur-md cursor-pointer transition-all duration-300 font-technical text-sm tracking-wide uppercase whitespace-nowrap ${
                isActive 
                  ? 'border-primary bg-primary/10 text-primary scale-110 shadow-[0_0_20px_rgba(var(--primary),0.2)]' 
                  : isDimmed 
                    ? 'border-border/30 bg-background/30 text-muted-foreground opacity-40' 
                    : 'border-border bg-card/80 text-card-foreground hover:border-primary/50 hover:bg-card hover:scale-105'
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveNode(node.id)}
              {...exploreCursor}
            >
              {node.label}
            </div>
          );
        })}
      </div>
      
      {/* Dynamic explanation panel (Desktop only) */}
      <div className="hidden md:flex p-6 border border-border bg-muted/30 rounded-xl min-h-[100px] items-center justify-center text-center transition-all duration-300">
        <p className="font-body text-lg text-secondary-foreground">
          {activeDescription}
        </p>
      </div>
    </div>
  );
};
