import { useBuilderStore } from '@/store/builderStore'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Save, Loader2, Check, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface HeaderActionsProps {
    username: string
    slug: string
}

export function HeaderActions({ username, slug }: HeaderActionsProps) {
    const undo = useBuilderStore((state) => state.undo)
    const redo = useBuilderStore((state) => state.redo)
    const history = useBuilderStore((state) => state.history)
    const saveToDatabase = useBuilderStore((state) => state.saveToDatabase)
    const isSaving = useBuilderStore((state) => state.isSaving)
    const lastSaved = useBuilderStore((state) => state.lastSaved)

    const handleSave = async () => {
        const success = await saveToDatabase()
        if (success) {
            toast.success('Page saved successfully')
        } else {
            toast.error('Failed to save page')
        }
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
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

            <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${username}/${slug}`, '_blank')}
                title="Preview Page"
            >
                <Eye className="mr-2 h-4 w-4" />
                Preview
            </Button>

            <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[100px]"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : lastSaved ? (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </>
                )}
            </Button>
        </div>
    )
}
