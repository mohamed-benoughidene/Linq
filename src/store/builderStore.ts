import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Block, GlobalTheme, HistoryState } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme
    history: HistoryState

    addBlock: (block: Block) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    selectBlock: (id: string | null) => void
    duplicateBlock: (id: string) => void
    applyGlobalTheme: (theme: GlobalTheme) => void
    applyBlockTheme: (id: string, theme: GlobalTheme) => void
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
            history: {
                past: [],
                present: [],
                future: []
            },

            addBlock: (block: Block) => set((state) => {
                if (state.blocks.some(b => b.id === block.id)) {
                    return state
                }
                return { blocks: [...state.blocks, block] }
            }),

            updateBlock: (id: string, updates: Partial<Block>) => set((state) => ({
                blocks: state.blocks.map(block =>
                    block.id === id ? { ...block, ...updates } : block
                )
            })),

            deleteBlock: (id: string) => set((state) => ({
                blocks: state.blocks.filter(block => block.id !== id)
            })),

            selectBlock: (id: string | null) => set({ selectedBlockId: id }),

            duplicateBlock: (id: string) => set((state) => {
                const blockToDuplicate = state.blocks.find(b => b.id === id)
                if (!blockToDuplicate) return state

                const duplicatedBlock: Block = {
                    ...blockToDuplicate,
                    id: crypto.randomUUID(),
                    position: Date.now(),
                }

                return {
                    blocks: [...state.blocks, duplicatedBlock]
                }
            }),

            applyGlobalTheme: (theme: GlobalTheme) => set((state) => ({
                globalTheme: theme,
                blocks: state.blocks.map(block => {
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
            })),

            applyBlockTheme: (id: string, theme: GlobalTheme) => set((state) => ({
                blocks: state.blocks.map(block => {
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
            }))
        }),
        {
            name: 'linq-builder-storage',
            partialize: (state) => ({
                blocks: state.blocks,
                globalTheme: state.globalTheme
            })
        }
    )
)
