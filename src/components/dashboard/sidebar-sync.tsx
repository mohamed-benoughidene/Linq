"use client"

import * as React from "react"
import { useEffect } from "react"
import { useBuilderStore } from "@/store/builder-store"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarSync() {
    const { activePanel } = useBuilderStore()
    const { setOpen, open } = useSidebar()

    // Track the last seen activePanel to ensure we only trigger side effects on change
    const prevPanelRef = React.useRef(activePanel)
    // Track if sidebar was open before we auto-collapsed it
    const wasOpenRef = React.useRef(open)

    useEffect(() => {
        // Only trigger if activePanel has changed
        if (prevPanelRef.current !== activePanel) {

            // Opening a panel (transitioning from 'none' -> 'something')
            if (activePanel !== 'none' && prevPanelRef.current === 'none') {
                wasOpenRef.current = open // Remember if it was open or closed
                setOpen(false) // Auto-collapse
            }
            // Closing a panel (transitioning from 'something' -> 'none')
            else if (activePanel === 'none') {
                setOpen(wasOpenRef.current) // Restore previous state
            }

            prevPanelRef.current = activePanel
        }
    }, [activePanel, setOpen, open])

    return null
}
