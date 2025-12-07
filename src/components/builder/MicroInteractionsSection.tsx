'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Sparkles, ChevronDown } from 'lucide-react'
import { useBuilderStore } from '@/store/builderStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function MicroInteractionsSection() {
    const { applyGlobalMicroInteractions, globalMicroInteractions } = useBuilderStore()
    const [hover, setHover] = useState('')
    const [click, setClick] = useState('')
    const [scroll, setScroll] = useState('')

    const hasActiveInteractions = globalMicroInteractions.hover || globalMicroInteractions.click || globalMicroInteractions.scroll

    const handleApply = () => {
        applyGlobalMicroInteractions({ hover, click, scroll })
        toast.success('Micro-interactions applied', {
            description: 'Applied to all unlocked blocks',
        })
    }

    return (
        <Collapsible className="group/collapsible">
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Micro Interactions</span>
                    {hasActiveInteractions && (
                        <div className="h-2 w-2 rounded-full bg-primary ml-auto mr-0" />
                    )}
                    <ChevronDown className={cn("ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180", !hasActiveInteractions && "ml-auto")} />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub className="px-4 py-2 space-y-3">
                    {/* Hover Effect */}
                    <div>
                        <Label className="text-xs">Hover Effect</Label>
                        <Select value={hover} onValueChange={setHover}>
                            <SelectTrigger className="h-8 mt-1">
                                <SelectValue placeholder="Select effect" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None</SelectItem>
                                <SelectItem value="hover:scale-105">Scale Up</SelectItem>
                                <SelectItem value="hover:scale-95">Scale Down</SelectItem>
                                <SelectItem value="hover:opacity-80">Fade</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Click Animation */}
                    <div>
                        <Label className="text-xs">Click Animation</Label>
                        <Select value={click} onValueChange={setClick}>
                            <SelectTrigger className="h-8 mt-1">
                                <SelectValue placeholder="Select animation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None</SelectItem>
                                <SelectItem value="active:scale-95">Shrink</SelectItem>
                                <SelectItem value="active:scale-105">Grow</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Scroll Animation */}
                    <div>
                        <Label className="text-xs">Scroll Animation</Label>
                        <Select value={scroll} onValueChange={setScroll}>
                            <SelectTrigger className="h-8 mt-1">
                                <SelectValue placeholder="Select animation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None</SelectItem>
                                <SelectItem value="animate-fade-in">Fade In</SelectItem>
                                <SelectItem value="animate-slide-up">Slide Up</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* APPLY BUTTON: Expensive operation */}
                    <Button onClick={handleApply} className="w-full" size="sm">
                        Apply Interactions
                    </Button>
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}
