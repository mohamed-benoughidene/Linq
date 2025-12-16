"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, Copy, QrCode, Share2 } from "lucide-react"
import { useState } from "react"
import { useBuilderStore } from "@/store/builder-store"

export function SharePopover() {
    const { pageSettings } = useBuilderStore()
    const [copied, setCopied] = useState(false)

    // Use page slug to generate realistic URL
    const url = `https://linq.com/${pageSettings.slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" className="gap-2 rounded-full px-4" data-id="builder-share-btn">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Share your page</h4>
                        <p className="text-sm text-muted-foreground">
                            Anyone with this link can view your page.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={url}
                                readOnly
                                className="h-9"
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                            <span className="sr-only">Copy</span>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-4 flex flex-col items-center justify-center gap-2">
                        <QrCode className="h-24 w-24 text-slate-800" />
                        <p className="text-xs text-slate-500 font-medium">Scan for mobile preview</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
