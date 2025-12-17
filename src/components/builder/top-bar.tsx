
"use client"

import { Button } from "@/components/ui/button"
import { useBuilderStore } from "@/store/builder-store"
import { RotateCcw, RotateCw, Smartphone } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { SharePopover } from "@/components/builder/share-popover"
import { ExternalLink, Copy, Trash } from "lucide-react"
import { SplitButton } from "@/components/ui/split-button"
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function TopBar() {
    const { history, undo, redo, isPreview, togglePreview, pageSettings } = useBuilderStore()

    const handlePublish = () => {
        // Mock publish action
        alert("Published successfully! (Mock)")
    }

    const handleCopyLink = () => {
        const url = `${window.location.origin}/${pageSettings.slug}`
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
    }

    const handleViewLive = () => {
        const url = `${window.location.origin}/${pageSettings.slug}`
        window.open(url, '_blank')
    }

    const handleUnpublish = () => {
        if (confirm("Are you sure you want to unpublish? Your site will no longer be visible.")) {
            alert("Unpublished! (Mock)")
        }
    }

    // Derived state for disabled buttons
    const canUndo = history.past.length > 0
    const canRedo = history.future.length > 0

    return (
        <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={undo}
                            disabled={!canUndo}
                            data-id="builder-undo-btn"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="sr-only">Undo</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={redo}
                            disabled={!canRedo}
                            data-id="builder-redo-btn"
                        >
                            <RotateCw className="h-4 w-4" />
                            <span className="sr-only">Redo</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isPreview ? "secondary" : "ghost"}
                        size="icon"
                        onClick={togglePreview}
                        className={isPreview ? "bg-slate-100 text-indigo-600" : "text-slate-500"}
                        data-id="builder-preview-btn"
                    >
                        <Smartphone className="h-4 w-4" />
                        <span className="sr-only">Mobile Preview</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile Preview</TooltipContent>
            </Tooltip>


            <div className="flex items-center ml-2">
                <SplitButton
                    onMainAction={handlePublish}
                    data-id="builder-publish-split-btn"
                    menuContent={
                        <>
                            <DropdownMenuItem onClick={handleViewLive}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Live Site
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyLink}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleUnpublish}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Unpublish
                            </DropdownMenuItem>
                        </>
                    }
                >
                    Publish
                </SplitButton>
            </div>
        </div >
    )
}
