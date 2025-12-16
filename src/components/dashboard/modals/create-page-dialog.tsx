"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useBuilderStore } from "@/store/builder-store"

export function CreatePageDialog() {
    const { isCreatePageOpen, closeCreatePage, createPage } = useBuilderStore()

    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            createPage(name, slug)
            closeCreatePage()

            // Reset form
            setName("")
            setSlug("")
        }, 500)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setName(newName)
        // Auto-generate slug from name if slug hasn't been manually edited (simple heuristic)
        if (slug === "" || slug === name.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
            setSlug(newName.toLowerCase().replace(/\s+/g, '-'))
        }
    }

    return (
        <Dialog open={isCreatePageOpen} onOpenChange={closeCreatePage}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new page</DialogTitle>
                    <DialogDescription>
                        Start building a new Linq page for your bio.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="page-name">Page Name</Label>
                        <Input
                            id="page-name"
                            placeholder="e.g. Work Profile"
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="page-slug">URL Slug</Label>
                        <div className="flex">
                            <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-slate-50 text-slate-500 text-sm">
                                linq.com/
                            </span>
                            <Input
                                id="page-slug"
                                placeholder="username"
                                className="rounded-l-none"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={closeCreatePage}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !name || !slug}>
                            {isLoading ? "Creating..." : "Create Page"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
