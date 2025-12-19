import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Layout } from 'react-grid-layout'
import { ThemePreset, THEMES } from '@/lib/themes'

// ... imports
export interface PageSettings {
    // Identity
    slug: string
    customDomain?: string
    favicon?: string

    // SEO & Social
    seoTitle: string
    seoDescription: string
    socialImage?: string

    // Integrations & Compliance
    googleAnalyticsId?: string
    metaPixelId?: string

    cookieBanner: boolean
}

export interface AnalyticsStats {
    totalViews: number
    totalClicks: number
    ctr: string
    history: { date: string; views: number; clicks: number }[]
    topLinks: { id: string; title: string; clicks: number }[]
}

export interface HistoryState {
    past: BuilderBlock[][]
    future: BuilderBlock[][]
}

export interface BuilderBlock {
    id: string
    type: 'link' | 'header' | 'video' | 'audio' | 'image' | 'newsletter' | 'gallery' | 'timer' | 'text' | 'map' | 'socials' | 'contact' | 'calendly' | 'embed' | 'commerce'
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
        // Commerce specific
        price?: string
        currency?: string
        image?: string
        productUrl?: string // For external payment
    }
    layout: {
        i: string
        x: number
        y: number
        w: number
        h: number
    }
}

export interface Page {
    id: string
    name: string
    slug: string
    blocks: BuilderBlock[]
    currentTheme: ThemePreset
    pageSettings: PageSettings
    history: HistoryState
}

export interface BuilderState {
    // Multi-Page
    pages: Page[]
    activePageId: string
    createPage: (name: string, slug: string) => void
    setActivePage: (id: string) => void

    // Active Page State (Computed/Proxied getters would be ideal, but for Zustand we sync)
    // Actually, to avoid massive refactoring of all components, we can keep the "current" state
    // as the source of truth for the UI, and "snapshots" in the pages array.
    // When switching pages, we save current -> pages[old], and load pages[new] -> current.

    blocks: BuilderBlock[]
    addBlock: (type: BuilderBlock['type']) => void
    removeBlock: (id: string) => void
    updateBlock: (id: string, data: Partial<BuilderBlock['content']>) => void
    updateLayout: (newLayouts: Layout[]) => void
    reorderBlocks: (newBlocks: BuilderBlock[]) => void

    currentTheme: ThemePreset
    setTheme: (theme: ThemePreset) => void
    updateThemeProperty: (section: 'colors' | 'styles', key: string, value: string | number | boolean | null) => void

    pageSettings: PageSettings
    updatePageSettings: (settings: Partial<PageSettings>) => void

    activePanel: 'blocks' | 'settings' | 'themes' | null
    setActivePanel: (panel: 'blocks' | 'settings' | 'themes' | null) => void
    togglePanel: (panel: 'blocks' | 'settings' | 'themes') => void

    isSupportOpen: boolean
    openSupport: () => void
    closeSupport: () => void

    isCreatePageOpen: boolean
    openCreatePage: () => void
    closeCreatePage: () => void

    // Analytics
    view: 'editor' | 'analytics'
    setView: (view: 'editor' | 'analytics') => void
    stats: AnalyticsStats

    // Preview Mode
    isPreview: boolean
    togglePreview: () => void

    // History (Undo/Redo)
    history: HistoryState
    undo: () => void
    redo: () => void
    pushToHistory: () => void
}

const DEFAULT_THEME = THEMES[0]
const DEFAULT_SETTINGS = {
    slug: 'my-page',
    seoTitle: 'My Linq Page',
    seoDescription: 'Welcome to my page',
    cookieBanner: true
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    // Initial Pages
    pages: [
        {
            id: 'default',
            name: 'My Personal Page',
            slug: 'my-page',
            blocks: [], // will be populated
            currentTheme: DEFAULT_THEME,
            pageSettings: DEFAULT_SETTINGS,
            history: { past: [], future: [] }
        }
    ],
    activePageId: 'default',

    // Active State (Initialized with default)
    blocks: [],
    currentTheme: DEFAULT_THEME,
    pageSettings: DEFAULT_SETTINGS,
    history: { past: [], future: [] },

    createPage: (name, slug) => {
        const { pages, activePageId, blocks, currentTheme, pageSettings, history } = get()

        // 1. Save current state to the active page in the array
        const updatedPages = pages.map(p =>
            p.id === activePageId
                ? { ...p, blocks, currentTheme, pageSettings, history }
                : p
        )

        // 2. Create new page
        const newPage: Page = {
            id: crypto.randomUUID(),
            name,
            slug,
            blocks: [],
            currentTheme: DEFAULT_THEME,
            pageSettings: { ...DEFAULT_SETTINGS, slug },
            history: { past: [], future: [] }
        }

        // 3. Update state
        set({
            pages: [...updatedPages, newPage],
            activePageId: newPage.id,
            // Reset Active State
            blocks: [],
            currentTheme: DEFAULT_THEME,
            pageSettings: { ...DEFAULT_SETTINGS, slug },
            history: { past: [], future: [] },
            view: 'editor' // Force switch to editor
        })
    },

    setActivePage: (id) => {
        const { pages, activePageId, blocks, currentTheme, pageSettings, history } = get()
        if (id === activePageId) return

        // 1. Save current state
        const updatedPages = pages.map(p =>
            p.id === activePageId
                ? { ...p, blocks, currentTheme, pageSettings, history }
                : p
        )

        // 2. Find new page
        const targetPage = updatedPages.find(p => p.id === id)
        if (!targetPage) return

        // 3. Load state
        set({
            pages: updatedPages,
            activePageId: id,
            blocks: targetPage.blocks,
            currentTheme: targetPage.currentTheme,
            pageSettings: targetPage.pageSettings,
            history: targetPage.history,
            view: 'editor'
        })
    },

    updatePageSettings: (settings) => {
        set((state) => ({
            pageSettings: {
                ...state.pageSettings,
                ...settings
            }
        }))
    },

    setTheme: (theme) => {
        set({ currentTheme: theme })
    },

    updateThemeProperty: (section: 'colors' | 'styles', key: string, value: string | number | boolean | null) => {
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
        const defaultW = 6
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
            case 'commerce':
                defaultH = 5 // Card shape
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
                                                            type === 'embed' ? 'Embed' :
                                                                type === 'commerce' ? 'Digital Product' : '',
                url: '',
                isActive: true,
                variant: type === 'gallery' ? 'wide' : type === 'calendly' || type === 'embed' || type === 'commerce' ? 'hero' : 'classic',
                galleryType: 'carousel',
                images: [],
                // Default content
                targetDate: type === 'timer' ? new Date(Date.now() + 86400000).toISOString() : undefined,
                timerLabel: type === 'timer' ? 'Launching in:' : undefined,
                placeholderText: type === 'newsletter' ? 'email@example.com' : undefined,

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
                embedUrl: type === 'embed' ? '' : undefined,
                price: type === 'commerce' ? '10.00' : undefined,
                currency: type === 'commerce' ? '$' : undefined,
                image: type === 'commerce' ? '' : undefined,
                productUrl: type === 'commerce' ? '' : undefined,
                buttonText: type === 'commerce' ? 'Buy Now' : type === 'newsletter' ? 'Subscribe' : undefined,
                description: type === 'commerce' ? 'Description of your product.' : type === 'header' ? undefined : undefined // Header handles description differently/optionally, but keeping generic description field useable
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



    updateLayout: (newLayouts: Layout[]) => {
        const { pushToHistory } = get()
        // We might want to debounce history push here or trust the component's debounce.
        // The component is debouncing the call to this function (200ms).
        // So we can treat each call as a history point.
        pushToHistory()

        set((state) => {
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

    reorderBlocks: (newBlocks: BuilderBlock[]) => {
        const { pushToHistory } = get()
        pushToHistory()
        set({ blocks: newBlocks })
    },

    updateBlock: (id: string, data: Partial<BuilderBlock['content']>) => {
        const { pushToHistory } = get()
        pushToHistory()
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id
                    ? { ...block, content: { ...block.content, ...data } }
                    : block
            ),
        }))
    },

    removeBlock: (id) => {
        const { pushToHistory } = get()
        pushToHistory()
        set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
        }))
    },

    activePanel: null,
    setActivePanel: (panel) => set({ activePanel: panel }),
    togglePanel: (panel) => set((state) => ({
        activePanel: state.activePanel === panel ? null : panel
    })),

    isSupportOpen: false,
    openSupport: () => set({ isSupportOpen: true }),
    closeSupport: () => set({ isSupportOpen: false }),

    isCreatePageOpen: false,
    openCreatePage: () => set({ isCreatePageOpen: true }),
    closeCreatePage: () => set({ isCreatePageOpen: false }),

    view: 'editor',
    setView: (view) => set({ view }),

    isPreview: false,
    togglePreview: () => set((state) => ({ isPreview: !state.isPreview })),

    stats: {
        totalViews: 12450,
        totalClicks: 850,
        ctr: '6.8%',
        history: [
            { date: 'Mon', views: 120, clicks: 10 },
            { date: 'Tue', views: 240, clicks: 45 },
            { date: 'Wed', views: 180, clicks: 30 },
            { date: 'Thu', views: 320, clicks: 65 },
            { date: 'Fri', views: 450, clicks: 90 },
            { date: 'Sat', views: 520, clicks: 110 },
            { date: 'Sun', views: 600, clicks: 130 },
        ],
        topLinks: [
            { id: '1', title: 'My Portfolio', clicks: 340 },
            { id: '2', title: 'YouTube Channel', clicks: 120 },
            { id: '3', title: 'Book a Call', clicks: 85 },
        ]
    },

    // History Implementation defined above at line 166, actions below


    pushToHistory: () => {
        set((state) => {
            // Keep only last 50 states to prevent memory issues
            const newPast = [...state.history.past, state.blocks].slice(-50)
            return {
                history: {
                    past: newPast,
                    future: [] // Clear future on new action
                }
            }
        })
    },

    undo: () => {
        set((state) => {
            if (state.history.past.length === 0) return state

            const previous = state.history.past[state.history.past.length - 1]
            const newPast = state.history.past.slice(0, -1)

            return {
                blocks: previous,
                history: {
                    past: newPast,
                    future: [state.blocks, ...state.history.future]
                }
            }
        })
    },

    redo: () => {
        set((state) => {
            if (state.history.future.length === 0) return state

            const next = state.history.future[0]
            const newFuture = state.history.future.slice(1)

            return {
                blocks: next,
                history: {
                    past: [...state.history.past, state.blocks],
                    future: newFuture
                }
            }
        })
    }
}))
