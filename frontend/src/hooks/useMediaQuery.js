// useMediaQuery.js — Custom hooks for responsive breakpoint detection

// --- Imports ---
import { useState, useEffect } from "react";

// --- useMediaQuery Hook ---
// Returns whether the given CSS media query currently matches
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}

// --- useResponsive Hook ---
// Returns { isMobile, isTablet, isDesktop } booleans based on viewport width
export function useResponsive() {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
    const isDesktop = useMediaQuery("(min-width: 1025px)");

    return { isMobile, isTablet, isDesktop };
}
