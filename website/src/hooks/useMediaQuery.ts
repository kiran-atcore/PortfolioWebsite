"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook that listens to a CSS media query and returns whether it matches.
 * SSR-safe: returns false until mounted on the client.
 *
 * @example
 * const isNarrow = useMediaQuery("(max-width: 400px)");
 * const isDesktop = useMediaQuery("(min-width: 992px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
