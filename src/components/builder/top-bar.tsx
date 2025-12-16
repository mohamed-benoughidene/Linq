
"use client"

import { Button } from "@/components/ui/button"
import { useBuilderStore } from "@/store/builder-store"
import { RotateCcw, RotateCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { SharePopover } from "@/components/builder/share-popover"

export function TopBar() {
    const { history, undo, redo } = useBuilderStore()

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

            <SharePopover />
        </div>
    )
}

