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

    // Background Customization
    backgroundConfig?: BackgroundConfig
}

export type BackgroundType = 'color' | 'gradient' | 'pattern' | 'none'

export type BackgroundConfig = {
    type: BackgroundType

    // Solid Color
    color?: string

    // Gradient
    gradient?: GradientConfig

    // Pattern
    pattern?: PatternConfig
}

export type GradientType = 'linear' | 'radial' | 'conic'

export type GradientStop = {
    color: string
    position: number // 0-100
}

export type GradientConfig = {
    type: GradientType
    angle?: number // 0-360 for linear
    stops: GradientStop[]
}

export type PatternConfig = {
    id: string
    color?: string // Foreground color of the pattern shapes
    backgroundColor?: string // Background color behind the pattern
    opacity?: number // 0-100
    scale?: number // 50-200
    rotation?: number // 0-360
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
    // Page-level background
    pageBackground?: BackgroundConfig
}

export type HistoryState = {
    past: Block[][]
    present: Block[]
    future: Block[][]
}
