import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Block, GlobalTheme } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme

    addBlock: (block: Block) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    selectBlock: (id: string | null) => void
    moveBlockUp: (id: string) => void
    moveBlockDown: (id: string) => void
}

export const useBuilderStore = create<BuilderStore>()(
    persist(
        (set) => ({
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

            addBlock: (block: Block) => set((state) => ({
                blocks: [...state.blocks, block]
            })),

            updateBlock: (id: string, updates: Partial<Block>) => set((state) => ({
                blocks: state.blocks.map(block =>
                    block.id === id ? { ...block, ...updates } : block
                )
            })),

            deleteBlock: (id: string) => set((state) => ({
                blocks: state.blocks.filter(block => block.id !== id)
            })),

            selectBlock: (id: string | null) => set({ selectedBlockId: id }),

            moveBlockUp: (id: string) => set((state) => {
                const index = state.blocks.findIndex(b => b.id === id)
                if (index <= 0) return state
                const newBlocks = [...state.blocks]
                    ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
                return { blocks: newBlocks }
            }),

            moveBlockDown: (id: string) => set((state) => {
                const index = state.blocks.findIndex(b => b.id === id)
                if (index < 0 || index >= state.blocks.length - 1) return state
                const newBlocks = [...state.blocks]
                    ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
                return { blocks: newBlocks }
            })
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
