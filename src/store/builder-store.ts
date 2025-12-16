import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Layout } from 'react-grid-layout'
import { ThemePreset, THEMES } from '@/lib/themes'

export interface BuilderBlock {
    id: string
    type: 'link' | 'header' | 'video' | 'audio' | 'image' | 'newsletter' | 'gallery' | 'timer' | 'text' | 'map' | 'socials' | 'contact' | 'calendly' | 'embed'
    content: {
        title: string
        description?: string // For bio or extra text
        url: string
        isActive: boolean
        icon?: string
        thumbnail?: string
        variant?: 'icon' | 'square' | 'classic' | 'wide' | 'hero'
        highlight?: boolean
        items?: { id: string; title: string; url: string; icon?: string }[]
        // Gallery specific
        galleryType?: 'carousel' | 'accordion' | 'creative' | 'stack'
        images?: { id: string; url: string; alt?: string }[]
        // Timer specific
        targetDate?: string
        timerLabel?: string
        // Newsletter specific
        placeholderText?: string
        buttonText?: string
        // Text specific
        textTitle?: string
        textContent?: string
        // Map specific
        address?: string
        mapUrl?: string
        // Socials specific
        socialLinks?: { platform: 'instagram' | 'twitter' | 'linkedin' | 'github' | 'youtube'; url: string }[]
        // Contact Form specific
        contactEmail?: string
        submitButtonText?: string
        // Calendly specific
        calendlyUrl?: string
        // Embed specific
        embedUrl?: string
    }
    layout: {
        i: string
        x: number
        y: number
        w: number
        h: number
    }
}

interface BuilderState {
    blocks: BuilderBlock[]
    addBlock: (type: BuilderBlock['type']) => void
    updateBlock: (id: string, data: Partial<BuilderBlock['content']>) => void
    removeBlock: (id: string) => void
    updateLayout: (newLayouts: Layout[]) => void
    activePanel: 'none' | 'themes' | 'settings'
    setActivePanel: (panel: 'none' | 'themes' | 'settings') => void
    togglePanel: (panel: 'themes' | 'settings') => void
    currentTheme: ThemePreset
    setTheme: (themeId: string) => void
    updateThemeProperty: (section: 'colors' | 'styles', key: string, value: any) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
    blocks: [],
    currentTheme: THEMES[0],

    setTheme: (themeId: string) => {
        const theme = THEMES.find((t) => t.id === themeId)
        if (theme) {
            set({ currentTheme: theme })
        }
    },

    updateThemeProperty: (section, key, value) => {
        set((state) => ({
            currentTheme: {
                ...state.currentTheme,
                [section]: {
                    ...state.currentTheme[section],
                    [key]: value
                }
            }
        }))
    },

    addBlock: (type: BuilderBlock['type']) => {
        const id = uuidv4()

        // Define default layouts for different block types
        let defaultW = 6
        let defaultH = 1

        switch (type) {
            case 'header':
                defaultH = 4 // ~220px
                break
            case 'video':
                defaultH = 4 // ~220px (Aspect Videoish)
                break
            case 'audio':
                defaultH = 2 // ~136px
                break
            case 'gallery':
                defaultH = 4 // Start with a decent height for images
                break
            case 'image':
                defaultH = 4
                break
            case 'timer':
                defaultH = 2
                break
            case 'newsletter':
                defaultH = 2
                break
            case 'text':
                defaultH = 2
                break
            case 'map':
                defaultH = 4
                break
            case 'socials':
                defaultH = 1
                break
            case 'contact':
                defaultH = 5
                break
            case 'calendly':
                defaultH = 5
                break
            case 'embed':
                defaultH = 5
                break
            default:
                defaultH = 1
        }

        const newBlock: BuilderBlock = {
            id,
            type,
            content: {
                title: type === 'header' ? 'Profile Header' :
                    type === 'video' ? 'New Video' :
                        type === 'audio' ? 'New Audio' :
                            type === 'gallery' ? 'Gallery' :
                                type === 'timer' ? 'Countdown' :
                                    type === 'newsletter' ? 'Newsletter' :
                                        type === 'text' ? 'Text Block' :
                                            type === 'map' ? 'Map' :
                                                type === 'socials' ? 'Social Links' :
                                                    type === 'contact' ? 'Contact Me' :
                                                        type === 'calendly' ? 'Booking' :
                                                            type === 'embed' ? 'Embed' : '',
                url: '',
                isActive: true,
                variant: type === 'gallery' ? 'wide' : type === 'calendly' || type === 'embed' ? 'hero' : 'classic',
                galleryType: 'carousel',
                images: [],
                // Default content
                targetDate: type === 'timer' ? new Date(Date.now() + 86400000).toISOString() : undefined,
                timerLabel: type === 'timer' ? 'Launching in:' : undefined,
                placeholderText: type === 'newsletter' ? 'email@example.com' : undefined,
                buttonText: type === 'newsletter' ? 'Subscribe' : undefined,
                textTitle: type === 'text' ? 'Welcome' : undefined,
                textContent: type === 'text' ? 'Add clear and concise text here.' : undefined,
                address: type === 'map' ? 'New York, NY' : undefined,
                socialLinks: type === 'socials' ? [
                    { platform: 'instagram', url: 'https://instagram.com' },
                    { platform: 'twitter', url: 'https://twitter.com' }
                ] : undefined,
                contactEmail: type === 'contact' ? 'me@example.com' : undefined,
                submitButtonText: type === 'contact' ? 'Send Message' : undefined,
                calendlyUrl: type === 'calendly' ? '' : undefined,
                embedUrl: type === 'embed' ? '' : undefined
            },
            layout: {
                i: id,
                x: 0,
                y: Infinity, // Puts it at the bottom
                w: defaultW,
                h: defaultH
            }
        }

        set((state) => ({
            blocks: [...state.blocks, newBlock],
        }))
    },

    updateBlock: (id: string, data: Partial<BuilderBlock['content']>) => {
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id
                    ? { ...block, content: { ...block.content, ...data } }
                    : block
            ),
        }))
    },

    removeBlock: (id: string) => {
        set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
        }))
    },

    updateLayout: (newLayouts: Layout[]) => {
        set((state) => {
            // Create a map for faster lookup
            const layoutMap = new Map(newLayouts.map(l => [l.i, l]))

            return {
                blocks: state.blocks.map(block => {
                    const newLayout = layoutMap.get(block.id)
                    if (newLayout) {
                        return {
                            ...block,
                            layout: {
                                ...block.layout,
                                x: newLayout.x,
                                y: newLayout.y,
                                w: newLayout.w,
                                h: newLayout.h
                            }
                        }
                    }
                    return block
                })
            }
        })
    },

    activePanel: 'none',
    setActivePanel: (panel) => set({ activePanel: panel }),
    togglePanel: (panel) => set((state) => ({
        activePanel: state.activePanel === panel ? 'none' : panel
    }))
}))
