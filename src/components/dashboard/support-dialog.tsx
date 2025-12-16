"use client"

import * as React from "react"
import { useBuilderStore } from "@/store/builder-store"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function SupportDialog() {
    const { isSupportOpen, closeSupport } = useBuilderStore()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock API call
        setTimeout(() => {
            setIsLoading(false)
            closeSupport()
            toast.success("Feedback sent!", {
                description: "We'll get back to you shortly."
            })
        }, 1000)
    }

    return (
        <Dialog open={isSupportOpen} onOpenChange={(open) => !open && closeSupport()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>How can we help?</DialogTitle>
                    <DialogDescription>
                        Send us your feedback, report a bug, or ask a question.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select required defaultValue="general">
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bug">🐛 Report a Bug</SelectItem>
                                <SelectItem value="feature">💡 Feature Request</SelectItem>
                                <SelectItem value="general">🙋 General Question</SelectItem>
                                <SelectItem value="billing">💳 Billing Issue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Describe your issue or idea..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Where should we reply?</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            defaultValue="m@example.com" // Mock pre-fill
                            required
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={closeSupport}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Message"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
