'use client'

import { useEffect, useRef } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { toast } from 'sonner'

export function AutoSaveManager() {
    const saveToDatabase = useBuilderStore((state) => state.saveToDatabase)
    const currentPageId = useBuilderStore((state) => state.currentPageId)

    // Use a ref to keep track of the latest saveToDatabase function and currentPageId
    // without triggering the effect re-run
    const paramsRef = useRef({ saveToDatabase, currentPageId })

    useEffect(() => {
        paramsRef.current = { saveToDatabase, currentPageId }
    }, [saveToDatabase, currentPageId])

    useEffect(() => {
        const interval = setInterval(async () => {
            const { saveToDatabase, currentPageId } = paramsRef.current

            // Only auto-save if we have a current page ID (meaning it's already been saved once)
            if (currentPageId) {
                console.log('Auto-saving...')
                try {
                    const success = await saveToDatabase()
                    if (success) {
                        console.log('Auto-save successful')
                        // Optional: show a subtle toast
                        // toast.success('Auto-saved', { duration: 1000, position: 'bottom-right' })
                    } else {
                        console.error('Auto-save failed')
                    }
                } catch (error) {
                    console.error('Auto-save error:', error)
                }
            }
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
    }, [])

    return null // This component renders nothing
}
