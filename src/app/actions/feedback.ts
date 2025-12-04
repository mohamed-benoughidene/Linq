'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const feedbackSchema = z.object({
    category: z.enum(['bug', 'feature', 'general']),
    message: z.string().min(1, 'Message is required'),
})

export type CreateFeedbackState = {
    success?: boolean
    error?: string
    errors?: {
        category?: string[]
        message?: string[]
    }
}

export async function createFeedback(prevState: CreateFeedbackState, formData: FormData): Promise<CreateFeedbackState> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to submit feedback' }
    }

    const validatedFields = feedbackSchema.safeParse({
        category: formData.get('category'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { category, message } = validatedFields.data

    // Fetch user profile to get username
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    const { error } = await supabase
        .from('feedback')
        .insert({
            user_id: user.id,
            category,
            message,
            email: user.email,
            username: profile?.username || 'Unknown',
        })

    if (error) {
        console.error('Error creating feedback:', error)
        return { error: `Failed to submit feedback: ${error.message}` }
    }

    return { success: true }
}
