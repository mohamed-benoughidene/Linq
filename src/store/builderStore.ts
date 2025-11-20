import { create } from 'zustand'
import { Block, GlobalTheme } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme

    addBlock: (block: Block) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    selectBlock: (id: string | null) => void
}

export const useBuilderStore = create<BuilderStore>((set) => ({
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

    selectBlock: (id: string | null) => set({ selectedBlockId: id })
}))
