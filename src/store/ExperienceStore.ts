import { useSyncExternalStore } from 'react';

export type ExperiencePhase = 'BOOT' | 'ENVIRONMENT' | 'INTERACTION' | 'IDENTITY' | 'READY';

export interface ExperienceState {
  webglReady: boolean;
  fontsReady: boolean;
  heroReady: boolean;
  timeoutTriggered: boolean;
  hasInitialized: boolean;
  phase: ExperiencePhase;
}

class ExperienceStore {
  private state: ExperienceState = {
    webglReady: false,
    fontsReady: false,
    heroReady: false,
    timeoutTriggered: false,
    hasInitialized: false,
    phase: 'BOOT',
  };

  private listeners: Set<() => void> = new Set();
  private maxTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public getState = () => this.state;

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private calculatePhase(state: ExperienceState): ExperiencePhase {
    if (state.hasInitialized) return 'READY';
    if (state.timeoutTriggered) return 'READY';
    
    // Evaluate readiness sequentially
    if (state.webglReady && state.fontsReady && state.heroReady) return 'READY';
    if (state.webglReady && state.fontsReady) return 'IDENTITY';
    if (state.webglReady) return 'INTERACTION'; // After WebGL, interaction layer is conceptually ready
    
    return 'ENVIRONMENT'; // Initial attempt to load WebGL
  }

  private updateState(updates: Partial<ExperienceState>) {
    if (this.state.hasInitialized) return; // Prevent retroactive updates if already done

    const nextState = { ...this.state, ...updates };
    const nextPhase = this.calculatePhase(nextState);

    // If we transition to READY, set hasInitialized permanently
    if (nextPhase === 'READY' && this.state.phase !== 'READY') {
      nextState.hasInitialized = true;
      if (this.maxTimeoutId) {
        clearTimeout(this.maxTimeoutId);
        this.maxTimeoutId = null;
      }
    }

    nextState.phase = nextPhase;
    this.state = nextState;
    this.notify();
  }

  public setWebglReady = () => this.updateState({ webglReady: true });
  public setFontsReady = () => this.updateState({ fontsReady: true });
  public setHeroReady = () => this.updateState({ heroReady: true });
  
  public startMaxTimeout = (ms: number = 4000) => {
    if (this.state.hasInitialized || this.maxTimeoutId) return;
    this.maxTimeoutId = setTimeout(() => {
      if (!this.state.hasInitialized) {
        console.warn('ExperienceStore: Max initialization timeout reached. Forcing READY state.');
        this.updateState({ timeoutTriggered: true });
      }
    }, ms);
  };
}

export const experienceStore = new ExperienceStore();

export function useExperienceState() {
  return useSyncExternalStore(experienceStore.subscribe, experienceStore.getState, experienceStore.getState);
}
