"use client"

import * as React from "react"
import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import {
    X, Search,
    Link2,
    User as UserCircle,
    Video,
    Music,
    Image as ImageIcon,
    Clock,
    Mail,
    Type,
    MapPin,
    Share2,
    MessageSquare,
    CalendarClock,
    Globe,
    ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "../../ui/scroll-area"
import { cn } from "@/lib/utils"

// Define block metadata
const BLOCK_TYPES = [
    { type: 'link', label: 'Link', icon: Link2, category: 'Essentials' },
    { type: 'header', label: 'Header', icon: UserCircle, category: 'Essentials' },
    { type: 'text', label: 'Text', icon: Type, category: 'Essentials' },
    { type: 'socials', label: 'Socials', icon: Share2, category: 'Essentials' },
    { type: 'gallery', label: 'Gallery', icon: ImageIcon, category: 'Media' },
    { type: 'video', label: 'Video', icon: Video, category: 'Media' },
    { type: 'audio', label: 'Audio', icon: Music, category: 'Media' },
    { type: 'newsletter', label: 'Newsletter', icon: Mail, category: 'Growth' },
    { type: 'contact', label: 'Contact', icon: MessageSquare, category: 'Growth' },
    { type: 'commerce', label: 'Product', icon: ShoppingBag, category: 'Growth' },
    { type: 'calendly', label: 'Calendly', icon: CalendarClock, category: 'Growth' },
    { type: 'map', label: 'Map', icon: MapPin, category: 'Utility' },
    { type: 'timer', label: 'Timer', icon: Clock, category: 'Utility' },
    { type: 'embed', label: 'Embed', icon: Globe, category: 'Utility' },
] as const

export function BlocksPanel() {
    const { activePanel, setActivePanel, addBlock } = useBuilderStore()
    const [search, setSearch] = React.useState("")

    if (activePanel !== 'blocks') return null

    const filteredBlocks = BLOCK_TYPES.filter(block =>
        block.label.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="h-full w-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Add Block</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-md"
                    onClick={() => setActivePanel(null)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Find a block..."
                        className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-id="blocks-panel-search"
                    />
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-3 grid grid-cols-2 gap-2">
                    {filteredBlocks.map((block) => (
                        <div
                            key={block.type}
                            className={cn(
                                "h-20 flex flex-col items-center justify-center p-2 gap-1.5",
                                "border border-slate-200 rounded-lg bg-white",
                                "hover:border-indigo-600 hover:bg-indigo-50/10 hover:shadow-sm",
                                "cursor-grab active:cursor-grabbing transition-all duration-200 group relative overflow-hidden"
                            )}
                            draggable={true}
                            onDragStart={(e) => {
                                e.dataTransfer.setData("application/react-dnd-block-type", block.type)
                                e.dataTransfer.effectAllowed = "copy"
                            }}
                            onClick={() => addBlock(block.type)}
                            data-id={`blocks-panel-item-${block.type}`}
                        >
                            <block.icon className="h-5 w-5 text-slate-600 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
                            <span className="text-[10px] font-medium text-slate-500 group-hover:text-indigo-700 text-center leading-tight">
                                {block.label}
                            </span>
                        </div>
                    ))}
                    {filteredBlocks.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-sm text-slate-400">
                            No blocks found matching "{search}"
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
