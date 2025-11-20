import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Block, GlobalTheme } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme
    currentPageId: string | null
    pageTitle: string
    past: Block[][]
    future: Block[][]

    /** Adds a new block to the end of the list and records history */
    addBlock: (block: Block) => void
    /** Updates a specific block by ID and records history */
    updateBlock: (id: string, updates: Partial<Block>) => void
    /** Deletes a block by ID and records history */
    deleteBlock: (id: string) => void
    /** Selects a block for editing in the PropertiesPanel */
    selectBlock: (id: string | null) => void
    /** Moves a block up one position and records history */
    moveBlockUp: (id: string) => void
    /** Moves a block down one position and records history */
    moveBlockDown: (id: string) => void
    /** Updates the global theme state without applying it to blocks */
    updateGlobalTheme: (theme: GlobalTheme) => void
    /** Applies the global theme to all unlocked blocks and records history */
    applyGlobalTheme: (theme: GlobalTheme) => void
    /** Sets the current database page ID */
    setCurrentPageId: (id: string | null) => void
    /** Sets the page title */
    setPageTitle: (title: string) => void
    /** Loads a page from Supabase by ID */
    loadFromDatabase: (pageId: string) => Promise<boolean>
    /** Saves the current page to Supabase (create or update) */
    saveToDatabase: (title?: string, slug?: string) => Promise<boolean>
    /** Reverts the last action */
    undo: () => void
    /** Re-applies the last undone action */
    redo: () => void
}

export const useBuilderStore = create<BuilderStore>()(
    persist(
        (set) => ({
            blocks: [],
            selectedBlockId: null,
            currentPageId: null,
            pageTitle: 'Untitled Page',
            past: [],
            future: [],
            globalTheme: {
                name: 'minimal',
                colors: {
                    primary: '#000000',
                    background: '#FFFFFF',
                    text: '#000000',
                    accent: '#666666'
                },
                typography: {
                    font: 'Inter',
                    headingSize: 32,
                    bodySize: 16
                }
            },

            addBlock: (block: Block) => set((state) => ({
                past: [...state.past, state.blocks],
                blocks: [...state.blocks, block],
                future: []
            })),

            updateBlock: (id: string, updates: Partial<Block>) => set((state) => ({
                past: [...state.past, state.blocks],
                blocks: state.blocks.map(block =>
                    block.id === id ? { ...block, ...updates } : block
                ),
                future: []
            })),

            deleteBlock: (id: string) => set((state) => ({
                past: [...state.past, state.blocks],
                blocks: state.blocks.filter(block => block.id !== id),
                future: []
            })),

            selectBlock: (id: string | null) => set({ selectedBlockId: id }),

            moveBlockUp: (id: string) => set((state) => {
                const index = state.blocks.findIndex(b => b.id === id)
                if (index <= 0) return state
                const newBlocks = [...state.blocks]
                    ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
                return {
                    past: [...state.past, state.blocks],
                    blocks: newBlocks,
                    future: []
                }
            }),

            moveBlockDown: (id: string) => set((state) => {
                const index = state.blocks.findIndex(b => b.id === id)
                if (index < 0 || index >= state.blocks.length - 1) return state
                const newBlocks = [...state.blocks]
                    ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
                return {
                    past: [...state.past, state.blocks],
                    blocks: newBlocks,
                    future: []
                }
            }),

            updateGlobalTheme: (theme: GlobalTheme) => set({ globalTheme: theme }),

            /**
             * Applies the global theme to all blocks that don't have themeLocked set to true.
             * Updates colors, fonts, and sizes based on block type.
             */
            applyGlobalTheme: (theme: GlobalTheme) => set((state) => ({
                globalTheme: theme,
                past: [...state.past, state.blocks],
                blocks: state.blocks.map(block => {
                    if (block.themeLocked) return block
                    return {
                        ...block,
                        styles: {
                            ...block.styles,
                            color: theme.colors.text,
                            backgroundColor: 'transparent',
                            fontFamily: theme.typography.font,
                            fontSize: block.type === 'heading' ? theme.typography.headingSize : theme.typography.bodySize
                        }
                    }
                }),
                future: []
            })),

            setCurrentPageId: (id: string | null) => set({ currentPageId: id }),

            setPageTitle: (title: string) => set({ pageTitle: title }),

            loadFromDatabase: async (pageId: string) => {
                try {
                    const { loadPage } = await import('@/app/actions/pages')
                    const result = await loadPage(pageId)

                    if (result.success && result.data) {
                        set({
                            blocks: result.data.blocks,
                            globalTheme: result.data.global_theme,
                            currentPageId: result.data.id,
                            pageTitle: result.data.title
                        })
                        return true
                    }
                    return false
                } catch (error) {
                    console.error('Failed to load from database:', error)
                    return false
                }
            },

            /**
             * Saves the current state to the database.
             * If currentPageId exists, updates the existing record.
             * Otherwise, creates a new record.
             */
            saveToDatabase: async (title?: string, slug?: string) => {
                try {
                    const state = useBuilderStore.getState()
                    const { savePage } = await import('@/app/actions/pages')

                    const result = await savePage(state.currentPageId, {
                        title: title || state.pageTitle,
                        slug: slug || (title || state.pageTitle).toLowerCase().replace(/\s+/g, '-'),
                        blocks: state.blocks,
                        global_theme: state.globalTheme,
                        is_published: false
                    })

                    if (result.success && result.data) {
                        set({
                            currentPageId: result.data.id,
                            pageTitle: result.data.title
                        })
                        return true
                    }
                    return false
                } catch (error) {
                    console.error('Failed to save to database:', error)
                    return false
                }
            },

            undo: () => set((state) => {
                if (state.past.length === 0) return state
                const previous = state.past[state.past.length - 1]
                const newPast = state.past.slice(0, state.past.length - 1)
                return {
                    past: newPast,
                    blocks: previous,
                    future: [state.blocks, ...state.future]
                }
            }),

            redo: () => set((state) => {
                if (state.future.length === 0) return state
                const next = state.future[0]
                const newFuture = state.future.slice(1)
                return {
                    past: [...state.past, state.blocks],
                    blocks: next,
                    future: newFuture
                }
            })
        }),
        {
            name: 'linq-builder-storage',
            partialize: (state) => ({
                blocks: state.blocks,
                globalTheme: state.globalTheme,
                currentPageId: state.currentPageId,
                pageTitle: state.pageTitle
            })
        }
    )
)
