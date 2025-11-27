import { Block, GlobalTheme } from './builder'

export interface PageRecord {
    id: string
    user_id: string
    title: string
    slug: string
    blocks: Block[]
    global_theme: GlobalTheme
    is_published: boolean
    created_at: string
    updated_at: string
}

export interface CreatePageInput {
    title: string
    slug: string
    blocks: Block[]
    global_theme: GlobalTheme
    is_published?: boolean
}

export interface UpdatePageInput {
    title?: string
    slug?: string
    blocks?: Block[]
    global_theme?: GlobalTheme
    is_published?: boolean
}

export interface PageWithProfile extends PageRecord {
    profiles: {
        username: string
        full_name: string | null
        avatar_url: string | null
    }
}
