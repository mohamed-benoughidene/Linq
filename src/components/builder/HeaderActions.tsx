'use client'

import { useBuilderStore } from '@/store/builderStore'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2 } from 'lucide-react'

export function HeaderActions() {
    const undo = useBuilderStore((state) => state.undo)
    const redo = useBuilderStore((state) => state.redo)
    const history = useBuilderStore((state) => state.history)

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={undo}
                disabled={history.past.length === 0}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={redo}
                disabled={history.future.length === 0}
                title="Redo (Ctrl+Shift+Z)"
            >
                <Redo2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
