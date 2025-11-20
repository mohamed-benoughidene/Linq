import { create } from 'zustand'
import { Block, GlobalTheme } from '@/types/builder'

interface BuilderStore {
    blocks: Block[]
    selectedBlockId: string | null
    globalTheme: GlobalTheme
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
    }
}))
