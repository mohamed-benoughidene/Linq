"use client"

import { useEffect } from "react"
import { useBuilderStore } from "@/store/builder-store"

export function FontLoader() {
    const { currentTheme } = useBuilderStore()
    const fontFamily = currentTheme.styles.fontFamily

    useEffect(() => {
        if (!fontFamily) return

        // Extract font name from font-family string (e.g., "Inter, sans-serif" -> "Inter")
        const fontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim()

        // Check if it's a Google Font
        // We do a loose check or strict check. Custom fonts might not be in our list if added via other means, 
        // but for now we only support loading what's in our list + some defaults.
        // Assuming if it's selected via our picker, it's valid.
        // We'll just try to load it if it looks like a name.

        // Construct Google Fonts URL
        const linkId = `google-font-${fontName.replace(/\s+/g, '-')}`

        // Avoid duplicate links
        if (document.getElementById(linkId)) return

        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        // Load multiple weights
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`

        document.head.appendChild(link)

        // Cleanup function:
        // We might NOT want to remove it immediately if the user is just browsing, 
        // but to keep the head clean we should.
        // However, if we remove it, the text might flash.
        // Let's keep it simplen and return cleanup to remove it when component unmounts or font changes.
        // But if we switch from Inter to Roboto, Inter link is removed, Roboto added.
        return () => {
            const existingLink = document.getElementById(linkId)
            if (existingLink) {
                document.head.removeChild(existingLink)
            }
        }
    }, [fontFamily])

    return null
}
