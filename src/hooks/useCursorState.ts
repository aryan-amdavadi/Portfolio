import { useEffect, useState } from 'react';

export type CursorState = 'default' | 'link' | 'project' | 'explore' | 'external' | 'disabled' | 'inspect' | 'view' | 'open';

let currentState: CursorState = 'default';
const listeners = new Set<(state: CursorState) => void>();

export const cursorManager = {
  setState: (state: CursorState) => {
    currentState = state;
    listeners.forEach(l => l(state));
  },
  getState: () => currentState,
  subscribe: (l: (state: CursorState) => void) => {
    listeners.add(l);
    return () => { listeners.delete(l); };
  }
};

export function useCursorState() {
  const [state, setState] = useState<CursorState>(currentState);

  useEffect(() => {
    return cursorManager.subscribe(setState);
  }, []);

  return state;
}

export function useCursorHandlers(state: CursorState = 'link') {
  return {
    'data-cursor': state
  };
}
