'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface StepData {
  number: string;
  title: string;
  description: string;
  type: 'transactions' | 'balances' | 'debtors_creditors' | 'processing' | 'settlement';
  items?: {
    primary: string;
    secondary?: string;
    tag?: string;
    highlight?: 'debtor' | 'creditor' | 'neutral' | 'success';
  }[];
}

const ALGO_STEPS: StepData[] = [
  {
    number: '01 / 05',
    title: 'Input: Cyclic Group Expenses',
    description: 'A shared trip generates 5 separate expense transfers between 4 participants, creating circular debt cycles.',
    type: 'transactions',
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
    type: 'balances',
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
    type: 'debtors_creditors',
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
    type: 'processing'
  },
  {
    number: '05 / 05',
    title: 'Output: Optimized Settlement Plan',
    description: 'Cyclic debt completely resolved. Total transactions reduced from 5 down to 2, with zero leftover balances.',
    type: 'settlement',
    items: [
      { primary: 'Alice → Charlie', secondary: '$50.00', tag: 'Optimal Transfer', highlight: 'success' },
      { primary: 'Bob → Charlie', secondary: '$50.00', tag: 'Optimal Transfer', highlight: 'success' }
    ]
  }
];

export const AlgorithmVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % ALGO_STEPS.length);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev - 1 + ALGO_STEPS.length) % ALGO_STEPS.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= ALGO_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = ALGO_STEPS[currentStep];

  return (
    <div className="algo-visualizer" role="region" aria-label="SplitSphere Algorithm Interactive Visualizer">
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
            aria-label="Previous algorithm step"
          >
            ← PREV
          </button>

          <button
            type="button"
            className="algo-ctrl-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause auto walkthrough' : 'Play auto walkthrough'}
          >
            {isPlaying ? 'PAUSE ❚❚' : 'PLAY ▶'}
          </button>

          <button
            type="button"
            className="algo-ctrl-btn"
            onClick={nextStep}
            disabled={currentStep === ALGO_STEPS.length - 1}
            aria-label="Next algorithm step"
          >
            NEXT →
          </button>

          <div className="algo-pills" role="tablist" aria-label="Step indicators">
            {ALGO_STEPS.map((_, index) => (
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
            [ RUNNING minCashFlow(netBalances) → RECURSIVE GREEDY GRAPH REDUCTION ]
          </div>
        ) : (
          <div className="algo-cards-container">
            {step.items?.map((item, idx) => (
              <div
                key={idx}
                className={`algo-card-row ${item.highlight === 'success' ? 'optimized' : ''}`}
              >
                <span>{item.primary}</span>
                <span
                  className={
                    item.highlight === 'debtor'
                      ? 'algo-debtor'
                      : item.highlight === 'creditor'
                      ? 'algo-creditor'
                      : item.highlight === 'success'
                      ? 'algo-creditor'
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
