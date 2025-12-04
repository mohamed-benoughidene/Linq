'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const ticketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(100),
    message: z.string().min(1, 'Message is required'),
    priority: z.enum(['low', 'medium', 'high']),
})

export type CreateTicketState = {
    success?: boolean
    error?: string
    errors?: {
        subject?: string[]
        message?: string[]
        priority?: string[]
    }
}

export async function createTicket(prevState: CreateTicketState, formData: FormData): Promise<CreateTicketState> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to submit a ticket' }
    }

    const validatedFields = ticketSchema.safeParse({
        subject: formData.get('subject'),
        message: formData.get('message'),
        priority: formData.get('priority'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { subject, message, priority } = validatedFields.data

    // Fetch user profile to get username
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    const { error } = await supabase
        .from('support_tickets')
        .insert({
            user_id: user.id,
            subject,
            message,
            priority,
            email: user.email,
            username: profile?.username || 'Unknown',
        })

    if (error) {
        console.error('Error creating ticket:', error)
        return { error: `Failed to submit ticket: ${error.message}` }
    }

    return { success: true }
}
