import { useEffect } from "react";

/**
 * Calls the provided callback every 20 milliseconds. This is provided as a convenience to ensure
 * that the patterns are updated at a consistent rate across the frontend. It also removes the
 * boilerplate of having to set up an interval in each component that needs to update.
 */
export function useCanopyFrame(callback: () => void, deps: any[]) {
  useEffect(() => {
    const FPS = 20;
    const patternInterval = setInterval(updatePattern, 1000 / FPS);
    return () => clearInterval(patternInterval);

    function updatePattern() {
      callback();
    }
  }, [...deps, callback]); // eslint-disable-line react-hooks/exhaustive-deps
}
