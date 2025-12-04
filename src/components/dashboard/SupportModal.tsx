'use client'

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createTicket } from '@/app/actions/support'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useComponentId } from '@/lib/component-id'

interface SupportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Ticket
        </Button>
    )
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
    const componentId = useComponentId("SupportModal")
    const [state, formAction] = useFormState(createTicket, {})

    useEffect(() => {
        if (state.success) {
            toast.success('Support ticket submitted successfully')
            onOpenChange(false)
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" data-component-id={componentId}>
                <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                    <DialogDescription>
                        Need help? Fill out the form below and we'll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Brief summary of the issue"
                            required
                        />
                        {state.errors?.subject && (
                            <p className="text-sm text-destructive">{state.errors.subject[0]}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low - General Question</SelectItem>
                                <SelectItem value="medium">Medium - Minor Issue</SelectItem>
                                <SelectItem value="high">High - Critical Bug</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Describe your issue in detail..."
                            className="min-h-[100px]"
                            required
                        />
                        {state.errors?.message && (
                            <p className="text-sm text-destructive">{state.errors.message[0]}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
