"use client"

import React, { useState, useEffect } from "react"
import { Check, Search, Type, X } from "lucide-react"
import { GOOGLE_FONTS } from "@/lib/google-fonts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"

interface FontPickerProps {
    value: string
    onChange: (value: string) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
    const [open, setOpen] = useState(false)
    const isMobile = useIsMobile()
    const currentFontName = value ? value.split(',')[0].replace(/['"]/g, '').trim() : ""

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal bg-white h-12"
                        data-id="font-picker-mobile-trigger"
                    >
                        <span className="truncate flex items-center gap-3">
                            <Type className="h-5 w-5 text-slate-400" />
                            <span className="text-base" style={{ fontFamily: value }}>
                                {currentFontName || "Select font..."}
                            </span>
                        </span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col rounded-t-[20px]" data-id="font-picker-mobile-content">
                    <SheetHeader className="p-4 border-b border-slate-100">
                        <SheetTitle className="text-center">Select Font</SheetTitle>
                    </SheetHeader>
                    <FontPickerContent
                        value={value}
                        onChange={(val) => {
                            onChange(val)
                            setOpen(false)
                        }}
                    />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal bg-white h-10 px-3 py-2 text-sm"
                    data-id="font-picker-desktop-trigger"
                >
                    <span className="truncate flex items-center gap-2">
                        <span style={{ fontFamily: value }}>
                            {currentFontName || "Select font..."}
                        </span>
                    </span>
                    <Type className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" data-id="font-picker-desktop-content">
                <div className="flex flex-col h-[300px]">
                    <FontPickerContent
                        value={value}
                        onChange={(val) => {
                            onChange(val)
                            setOpen(false)
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

function FontPickerContent({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [search, setSearch] = useState("")

    // Filter fonts
    const filteredFonts = GOOGLE_FONTS.filter(font =>
        font.toLowerCase().includes(search.toLowerCase())
    )

    const currentFontName = value ? value.split(',')[0].replace(/['"]/g, '').trim() : ""

    return (
        <>
            {/* Header / Search */}
            <div className="p-4 pb-2 border-b border-slate-100/50">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search fonts..."
                        className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-id="font-picker-search"
                    />
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-2 grid grid-cols-1 gap-1">
                    {filteredFonts.map((font) => (
                        <FontItem
                            key={font}
                            font={font}
                            isSelected={currentFontName === font}
                            onSelect={() => onChange(`'${font}', sans-serif`)}
                        />
                    ))}
                    {filteredFonts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                            <Search className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No fonts found.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </>
    )
}

function FontItem({ font, isSelected, onSelect }: { font: string, isSelected: boolean, onSelect: () => void }) {
    // Load preview font lazily
    useEffect(() => {
        // Optimization: Only load the characters needed for the font name
        const text = encodeURIComponent(font)
        const linkId = `preview-font-${font.replace(/\s+/g, '-')}`

        if (!document.getElementById(linkId)) {
            const link = document.createElement('link')
            link.id = linkId
            link.rel = 'stylesheet'
            link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&text=${text}&display=swap`
            document.head.appendChild(link)
        }
    }, [font])

    return (
        <Button
            variant="ghost"
            onClick={onSelect}
            className={cn(
                "justify-between font-normal text-base h-auto py-3 px-3 w-full transition-all duration-200",
                isSelected
                    ? "bg-slate-900 text-white hover:bg-slate-800 hover:text-white shadow-md transform scale-[1.02]"
                    : "text-slate-700 hover:bg-slate-50 hover:pl-4",
            )}
            style={{ fontFamily: `'${font}', sans-serif` }}
            data-id={`font-item-${font.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <span className="truncate">{font}</span>
            {isSelected && <Check className="ml-2 h-4 w-4 shrink-0 text-white" />}
        </Button>
    )
}
