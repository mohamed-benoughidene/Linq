import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Layout } from 'react-grid-layout'
import { ThemePreset, THEMES } from '@/lib/themes'

export interface BuilderBlock {
    id: string
    type: 'link'
    content: {
        title: string
        url: string
        isActive: boolean
        icon?: string
        thumbnail?: string
        variant?: 'icon' | 'square' | 'classic' | 'wide' | 'hero'
        highlight?: boolean
        items?: { id: string; title: string; url: string; icon?: string }[]
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

    addBlock: (type: BuilderBlock['type']) => {
        const id = uuidv4()
        const newBlock: BuilderBlock = {
            id,
            type,
            content: {
                title: '',
                url: '',
                isActive: true,
                variant: 'classic' // Default to classic
            },
            layout: {
                i: id,
                x: 0,
                y: Infinity, // Puts it at the bottom
                w: 6,        // Full width (lg=6)
                h: 1         // Default height (Classic: 60px = 1 row)
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
