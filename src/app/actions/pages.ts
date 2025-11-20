'use server'

import { createClient } from '@/utils/supabase/server'
import { CreatePageInput, UpdatePageInput, PageRecord } from '@/types/database'
import { revalidatePath } from 'next/cache'

export async function savePage(pageId: string | null, data: CreatePageInput | UpdatePageInput) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        if (pageId) {
            // Update existing page
            const { data: page, error } = await supabase
                .from('pages')
                .update(data)
                .eq('id', pageId)
                .eq('user_id', user.id)
                .select()
                .single()

            if (error) {
                console.error('Error updating page:', error)
                return { success: false, error: error.message }
            }

            revalidatePath('/dashboard')
            return { success: true, data: page as PageRecord }
        } else {
            // Create new page
            const { data: page, error } = await supabase
                .from('pages')
                .insert({
                    ...data,
                    user_id: user.id
                })
                .select()
                .single()

            if (error) {
                console.error('Error creating page:', error)
                return { success: false, error: error.message }
            }

            revalidatePath('/dashboard')
            return { success: true, data: page as PageRecord }
        }
    } catch (error) {
        console.error('Server error in savePage:', error)
        return { success: false, error: 'Server error' }
    }
}

export async function loadPage(pageId: string) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { data: page, error } = await supabase
            .from('pages')
            .select('*')
            .eq('id', pageId)
            .eq('user_id', user.id)
            .single()

        if (error) {
            console.error('Error loading page:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data: page as PageRecord }
    } catch (error) {
        console.error('Server error in loadPage:', error)
        return { success: false, error: 'Server error' }
    }
}

export async function listPages() {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { data: pages, error } = await supabase
            .from('pages')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })

        if (error) {
            console.error('Error listing pages:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data: pages as PageRecord[] }
    } catch (error) {
        console.error('Server error in listPages:', error)
        return { success: false, error: 'Server error' }
    }
}

export async function deletePage(pageId: string) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { error } = await supabase
            .from('pages')
            .delete()
            .eq('id', pageId)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error deleting page:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Server error in deletePage:', error)
        return { success: false, error: 'Server error' }
    }
}
