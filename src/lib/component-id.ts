"use client"

import { useRef } from 'react';

// Global counter storage
const componentCounters: Record<string, number> = {};

/**
 * Generates a unique component ID for debugging and inspection
 * Format: component-name-serial-number
 * Example: navbar-1, button-42, card-7
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
 * Use this in functional components to get a unique, stable ID
 * 
 * @param componentName - Name of the component (e.g., 'Button', 'Card', 'Navbar')
 * @returns Unique component ID (e.g., 'button-1', 'card-5')
 * 
 * @example
 * function MyButton() {
 *   const id = useComponentId('MyButton');
 *   return <button data-component-id={id}>Click me</button>;
 * }
 */
export function useComponentId(componentName: string): string {
    const idRef = useRef<string | null>(null);

    if (idRef.current === null) {
        idRef.current = generateComponentId(componentName);
    }

    return idRef.current;
}

/**
 * Reset all counters (useful for testing or development)
 */
export function resetComponentCounters(): void {
    for (const key in componentCounters) {
        delete componentCounters[key];
    }
}
