'use client';

import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/text/ScrollReveal';

export const AlgorithmVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: "1. Raw Expenses",
      desc: "Users create a tangled web of shared expenses.",
      graph: [
        { from: "A", to: "B", amount: 100 },
        { from: "B", to: "C", amount: 150 },
        { from: "C", to: "A", amount: 50 },
        { from: "C", to: "D", amount: 50 },
        { from: "D", to: "A", amount: 50 }
      ]
    },
    {
      title: "2. Individual Balances",
      desc: "Calculate what everyone owes vs what they paid.",
      graph: [
        { node: "A", balance: -50 },
        { node: "B", balance: -50 },
        { node: "C", balance: 100 },
        { node: "D", balance: 0 }
      ]
    },
    {
      title: "3. Net Balances",
      desc: "Identify net debtors (-) and net creditors (+).",
      graph: [
        { node: "A", type: "Debtor", amount: 50 },
        { node: "B", type: "Debtor", amount: 50 },
        { node: "C", type: "Creditor", amount: 100 }
      ]
    },
    {
      title: "4. Max-Flow Min-Cut Reduction",
      desc: "Graph algorithms find the shortest path to zero.",
      graph: "ALGORITHM_PROCESSING"
    },
    {
      title: "5. Optimized Settlement",
      desc: "Only two transactions needed to settle a 5-transaction cycle.",
      graph: [
        { from: "A", to: "C", amount: 50 },
        { from: "B", to: "C", amount: 50 }
      ]
    }
  ];

  const current = steps[step];

  return (
    <div className="algorithm-visualizer" style={{ 
      marginTop: 'var(--space-6)', 
      padding: 'var(--space-6)', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: '8px',
      border: '1px solid var(--border)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{current.title}</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              style={{
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                backgroundColor: step === i ? 'var(--accent-base)' : 'var(--border)',
                transition: 'background-color 0.3s'
              }} 
            />
          ))}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>{current.desc}</p>
      
      <div className="algo-graph-container" style={{ 
        minHeight: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '1.1rem'
      }}>
        <ScrollReveal baseOpacity={0} blurStrength={0} baseRotation={0} key={step}>
          {Array.isArray(current.graph) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {current.graph.map((item: { from?: string; to?: string; amount?: number; type?: string; node?: string; balance?: number }, i) => (
                <div key={i} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--bg)' }}>
                  {item.from ? (
                    <span>User {item.from} → User {item.to} : ${item.amount}</span>
                  ) : item.type ? (
                    <span style={{ color: item.type === 'Debtor' ? 'var(--error, #e57373)' : 'var(--success, #81c784)' }}>
                      User {item.node} : {item.type} (${item.amount})
                    </span>
                  ) : (
                    <span>User {item.node} : Balance ${item.balance}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="processing-animation" style={{ color: 'var(--accent-base)', animation: 'pulse 1s infinite alternate' }}>
              {'[ RECALCULATING DIRECTED ACYCLIC GRAPH... ]'}
            </div>
          )}
        </ScrollReveal>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
