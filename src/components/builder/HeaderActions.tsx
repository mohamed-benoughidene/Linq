'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Save, Undo2, Redo2 } from 'lucide-react'

export function HeaderActions() {
    const [isSaving, setIsSaving] = useState(false)
    const pageTitle = useBuilderStore((state) => state.pageTitle)
    const setPageTitle = useBuilderStore((state) => state.setPageTitle)
    const saveToDatabase = useBuilderStore((state) => state.saveToDatabase)
    const undo = useBuilderStore((state) => state.undo)
    const redo = useBuilderStore((state) => state.redo)
    const past = useBuilderStore((state) => state.past)
    const future = useBuilderStore((state) => state.future)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const success = await saveToDatabase()
            if (success) {
                toast.success('Page saved successfully')
            } else {
                toast.error('Failed to save page')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 mr-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={undo}
                    disabled={past.length === 0}
                >
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={redo}
                    disabled={future.length === 0}
                >
                    <Redo2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="h-8 w-[200px] font-medium"
                    placeholder="Untitled Page"
                />
            </div>
            <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <Save className="h-4 w-4 mr-2" />
                )}
                Save
            </Button>
        </div>
    )
}
