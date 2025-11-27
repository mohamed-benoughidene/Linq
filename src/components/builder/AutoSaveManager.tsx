'use client';

import { useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { toast } from 'sonner';

export function AutoSaveManager() {
    const saveToDatabase = useBuilderStore((state) => state.saveToDatabase);
    const currentPageId = useBuilderStore((state) => state.currentPageId);
    const blocks = useBuilderStore((state) => state.blocks);
    const globalTheme = useBuilderStore((state) => state.globalTheme);
    const pageTitle = useBuilderStore((state) => state.pageTitle);

    // Use a ref to track if it's the initial mount to avoid saving on load
    const isMounted = useRef(false);
    // Debounce timer
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        if (!currentPageId) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save (e.g., 2 seconds after last change)
        timeoutRef.current = setTimeout(async () => {
            const success = await saveToDatabase();
            if (!success) {
                console.error('Auto-save failed');
                // Optionally show a toast, but might be annoying if frequent
            }
        }, 2000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [blocks, globalTheme, pageTitle, currentPageId, saveToDatabase]);

    return null;
}
