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
      title: "4. Minimum Cash Flow Reduction",
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
    <div className="w-full bg-muted/30 p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-technical text-lg tracking-wide uppercase text-foreground">{current.title}</h3>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === i ? 'bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>
      </div>
      
      <p className="font-body text-secondary-foreground mb-8">{current.desc}</p>
      
      <div className="min-h-[200px] flex items-center justify-center font-technical text-sm md:text-base tracking-widest uppercase">
        <ScrollReveal baseOpacity={0} blurStrength={0} baseRotation={0} key={step}>
          {Array.isArray(current.graph) ? (
            <div className="flex flex-col gap-3">
              {current.graph.map((item: { from?: string; to?: string; amount?: number; type?: string; node?: string; balance?: number }, i) => (
                <div key={i} className="px-6 py-3 border border-border rounded-lg bg-card text-card-foreground">
                  {item.from ? (
                    <span>User {item.from} → User {item.to} : ${item.amount}</span>
                  ) : item.type ? (
                    <span className={item.type === 'Debtor' ? 'text-destructive' : 'text-primary'}>
                      User {item.node} : {item.type} (${item.amount})
                    </span>
                  ) : (
                    <span>User {item.node} : Balance ${item.balance}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary animate-pulse">
              {'[ RECALCULATING DIRECTED ACYCLIC GRAPH... ]'}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};
