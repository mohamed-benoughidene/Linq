"use client"

import { useId } from 'react';

// Global counter storage (deprecated, kept for non-React usage if any)
const componentCounters: Record<string, number> = {};

/**
 * Generates a unique component ID for debugging and inspection
 * Note: This is NOT stable for SSR/Hydration. Use useComponentId for React components.
 */
export function generateComponentId(componentName: string): string {
    const key = componentName.toLowerCase();
    if (typeof componentCounters[key] === 'undefined') {
        componentCounters[key] = 0;
    }
    componentCounters[key]++;
    return `${key}-${componentCounters[key]}`;
}

/**
 * React hook to generate a stable component ID that persists across re-renders
 * and matches between server and client (fixing hydration mismatches).
 * 
 * @param componentName - Name of the component (e.g., 'Button', 'Card', 'Navbar')
 * @returns Unique component ID (e.g., 'button-r1', 'card-r5')
 */
export function useComponentId(componentName: string): string {
    const uniqueId = useId();
    // React's useId returns tokens surrounded by colons, e.g., ":r1:"
    // We sanitize it to make it cleaner for DOM attributes
    const cleanId = uniqueId.replace(/:/g, '');
    return `${componentName.toLowerCase()}-${cleanId}`;
}

/**
 * Reset all counters (useful for testing or development)
 */
export function resetComponentCounters(): void {
    for (const key in componentCounters) {
        delete componentCounters[key];
    }
}
