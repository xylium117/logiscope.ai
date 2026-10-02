import { useState, useEffect } from 'react';

const LS_QUERY = '(orientation: landscape) and (max-height: 500px)';
const LM_QUERY = '(orientation: landscape) and (max-height: 700px)';

export function useIsLandscapeSmall(): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(LS_QUERY).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(LS_QUERY);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return matches;
}

export function useIsLandscapeMedium(): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(LM_QUERY).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(LM_QUERY);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return matches;
}
