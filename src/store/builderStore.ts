import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Block, GlobalTheme, GlobalMicroInteractions, BlockMicroInteractions, HistoryState } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme
    globalMicroInteractions: GlobalMicroInteractions
    history: HistoryState

    addBlock: (block: Block) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    selectBlock: (id: string | null) => void
    duplicateBlock: (id: string) => void
    applyGlobalTheme: (theme: GlobalTheme) => void
    applyBlockTheme: (id: string, theme: GlobalTheme) => void
    applyGlobalMicroInteractions: (interactions: GlobalMicroInteractions) => void
    applyBlockMicroInteractions: (id: string, interactions: Partial<BlockMicroInteractions>) => void
    undo: () => void
    redo: () => void
}

export const useBuilderStore = create<BuilderStore>()(
    persist(
        (set, get) => ({
            blocks: [],
            selectedBlockId: null,
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
            globalMicroInteractions: {
                hover: '',
                click: '',
                scroll: ''
            },
            history: {
                past: [],
                present: [],
                future: []
            },

            addBlock: (block: Block) => set((state) => {
                if (state.blocks.some(b => b.id === block.id)) {
                    return state
                }
                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: [...state.blocks, block],
                    future: []
                }
                return {
                    blocks: [...state.blocks, block],
                    history: newHistory
                }
            }),

            updateBlock: (id: string, updates: Partial<Block>) => set((state) => {
                const newBlocks = state.blocks.map(block =>
                    block.id === id ? { ...block, ...updates } : block
                )
                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }
                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            deleteBlock: (id: string) => set((state) => {
                const newBlocks = state.blocks.filter(block => block.id !== id)
                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }
                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            selectBlock: (id: string | null) => set({ selectedBlockId: id }),

            duplicateBlock: (id: string) => set((state) => {
                const blockToDuplicate = state.blocks.find(b => b.id === id)
                if (!blockToDuplicate) return state

                const duplicatedBlock: Block = {
                    ...blockToDuplicate,
                    id: crypto.randomUUID(),
                    position: Date.now(),
                }

                const newBlocks = [...state.blocks, duplicatedBlock]
                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }

                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            applyGlobalTheme: (theme: GlobalTheme) => set((state) => {
                const newBlocks = state.blocks.map(block => {
                    if (block.themeLocked) return block

                    return {
                        ...block,
                        styles: {
                            ...block.styles,
                            color: theme.colors.text,
                            backgroundColor: theme.colors.background,
                            fontSize: block.type === 'heading' ? theme.typography.headingSize : theme.typography.bodySize,
                            fontFamily: theme.typography.font,
                        }
                    }
                })

                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }

                return {
                    globalTheme: theme,
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            applyBlockTheme: (id: string, theme: GlobalTheme) => set((state) => {
                const newBlocks = state.blocks.map(block => {
                    if (block.id !== id) return block

                    return {
                        ...block,
                        styles: {
                            ...block.styles,
                            color: theme.colors.text,
                            backgroundColor: theme.colors.background,
                            fontSize: block.type === 'heading' ? theme.typography.headingSize : theme.typography.bodySize,
                            fontFamily: theme.typography.font,
                        }
                    }
                })

                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }

                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            applyGlobalMicroInteractions: (interactions: GlobalMicroInteractions) => set((state) => {
                const newBlocks = state.blocks.map(block => {
                    if (block.microInteractionsLocked) return block

                    return {
                        ...block,
                        microInteractions: {
                            hover: interactions.hover,
                            click: interactions.click,
                            scroll: interactions.scroll,
                        }
                    }
                })

                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }

                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            applyBlockMicroInteractions: (id: string, interactions: Partial<BlockMicroInteractions>) => set((state) => {
                const newBlocks = state.blocks.map(block => {
                    if (block.id !== id) return block

                    return {
                        ...block,
                        microInteractions: {
                            ...block.microInteractions,
                            ...interactions
                        }
                    }
                })

                const newHistory = {
                    past: [...state.history.past, state.blocks],
                    present: newBlocks,
                    future: []
                }

                return {
                    blocks: newBlocks,
                    history: newHistory
                }
            }),

            undo: () => set((state) => {
                const { past, present, future } = state.history
                if (past.length === 0) return state

                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)

                return {
                    blocks: previous,
                    history: {
                        past: newPast,
                        present: previous,
                        future: [present, ...future]
                    }
                }
            }),

            redo: () => set((state) => {
                const { past, present, future } = state.history
                if (future.length === 0) return state

                const next = future[0]
                const newFuture = future.slice(1)

                return {
                    blocks: next,
                    history: {
                        past: [...past, present],
                        present: next,
                        future: newFuture
                    }
                }
            })
        }),
        {
            name: 'linq-builder-storage',
            partialize: (state) => ({
                blocks: state.blocks,
                globalTheme: state.globalTheme,
                globalMicroInteractions: state.globalMicroInteractions
            })
        }
    )
)
