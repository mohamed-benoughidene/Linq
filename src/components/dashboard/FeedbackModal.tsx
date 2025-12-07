'use client'

import { useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createFeedback } from '@/app/actions/feedback'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { useComponentId } from '@/lib/component-id'

interface FeedbackModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
        </Button>
    )
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
    const componentId = useComponentId("FeedbackModal")
    const [state, formAction] = useActionState(createFeedback, {})

    useEffect(() => {
        if (state.success) {
            toast.success('Feedback submitted successfully')
            onOpenChange(false)
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]" data-component-id={componentId}>
                <DialogHeader>
                    <DialogTitle>Send Feedback</DialogTitle>
                    <DialogDescription>
                        We value your feedback! Let us know what you think or report any issues.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue="general">
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General Feedback</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="bug">Bug Report</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us more..."
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
