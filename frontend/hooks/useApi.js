"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async loader on mount (and whenever `deps` change), tracking
 * loading / error state so pages can render skeletons + error UI consistently.
 *
 * const { loading, error, run } = useAsync(() => loadMatches(), [profileId]);
 */
export function useAsync(loader, deps = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loader();
    } catch (err) {
      if (mounted.current) setError(err?.message || "Something went wrong.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    run();
  }, [run]);

  return { loading, error, retry: run };
}
