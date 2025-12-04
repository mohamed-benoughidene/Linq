export type BlockType = 'heading' | 'paragraph' | 'image' | 'link'

export type BlockStyles = {
    fontSize?: number
    color?: string
    backgroundColor?: string
    fontFamily?: string
    fontWeight?: number
    margin?: number
    padding?: number
    borderWidth?: number
    borderColor?: string
    borderRadius?: number
    textAlign?: 'left' | 'center' | 'right'
}

export type BlockMicroInteractions = {
    hover?: string
    click?: string
    scroll?: string
}

export type GlobalMicroInteractions = BlockMicroInteractions

export type Block = {
    id: string
    type: BlockType
    position: number
    content: string
    styles: BlockStyles
    microInteractions: BlockMicroInteractions
    themeLocked: boolean
    microInteractionsLocked: boolean
    // Image-specific fields
    imageUrl?: string
    imageDescription?: string
    // Link-specific fields
    linkUrl?: string
    linkText?: string
}

export type GlobalTheme = {
    name: string
    colors: {
        primary: string
        background: string
        text: string
        accent: string
    }
    typography: {
        font: string
        headingSize: number
        bodySize: number
    }
}

export type HistoryState = {
    past: Block[][]
    present: Block[]
    future: Block[][]
}
