"use client"

import React, { useState } from "react"
import { X, ChevronDown, ChevronRight, Globe, Search, Image as ImageIcon, CheckCircle, AlertTriangle, Loader2, Copy, Trash2, Edit2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

// Helper to render accordion item
const AccordionItem = ({
    isOpen,
    onToggle,
    title,
    children
}: {
    isOpen: boolean
    onToggle: () => void
    title: string
    children: React.ReactNode
}) => (
    <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className="border-b border-slate-100"
    >
        <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors text-left">
                <span className="text-sm font-medium text-slate-700">{title}</span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
            </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4">
                {children}
            </div>
        </CollapsibleContent>
    </Collapsible>
)

export function SettingsPanel() {
    const { setActivePanel, pageSettings, updatePageSettings } = useBuilderStore()

    // Accordion State
    const [openSection, setOpenSection] = useState<string | null>("general")

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section)
    }

    // Custom Domain State
    const [domainStatus, setDomainStatus] = useState<'idle' | 'pending' | 'active' | 'error'>(
        pageSettings.customDomain ? 'pending' : 'idle'
    )
    const [isVerifying, setIsVerifying] = useState(false)
    const [isEditingDomain, setIsEditingDomain] = useState(!pageSettings.customDomain)

    const handleVerifyDomain = () => {
        if (!pageSettings.customDomain) return

        setIsVerifying(true)
        // Mock verification
        setTimeout(() => {
            setIsVerifying(false)
            toast.info("DNS propagation can take up to 24 hours.", {
                description: "We will notify you when your domain is active."
            })
            // In a real app we would check backend status here
            // setDomainStatus('active') 
        }, 2000)
    }

    const handleSaveDomain = () => {
        if (pageSettings.customDomain) {
            setIsEditingDomain(false)
            setDomainStatus('pending')
        }
    }

    const handleRemoveDomain = () => {
        updatePageSettings({ customDomain: '' })
        setIsEditingDomain(true)
        setDomainStatus('idle')
    }



    return (
        <div className="h-full w-full flex flex-col bg-white border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Page Settings</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-md"
                    onClick={() => setActivePanel('none')}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">

                {/* 1. General & Domain */}
                <AccordionItem isOpen={openSection === "general"} onToggle={() => toggleSection("general")} title="General & Domain">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="slug">Page URL</Label>
                            <div className="flex items-center">
                                <span className="bg-slate-50 border border-r-0 border-slate-200 text-slate-500 text-xs px-2 h-9 flex items-center rounded-l-md truncate max-w-[100px]">
                                    your-app.com/
                                </span>
                                <Input
                                    id="slug"
                                    value={pageSettings.slug}
                                    onChange={(e) => updatePageSettings({ slug: e.target.value })}
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="customDomain">Custom Domain</Label>

                            <div className="flex gap-2">
                                <Input
                                    id="customDomain"
                                    placeholder="www.yourdomain.com"
                                    value={pageSettings.customDomain || ''}
                                    onChange={(e) => updatePageSettings({ customDomain: e.target.value })}
                                    disabled={!isEditingDomain}
                                    className={cn(!isEditingDomain && "bg-slate-50 text-slate-500")}
                                />
                                {isEditingDomain ? (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleSaveDomain}
                                        disabled={!pageSettings.customDomain}
                                        className="shrink-0"
                                        title="Save Domain"
                                    >
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
                                ) : (
                                    <div className="flex gap-1 shrink-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setIsEditingDomain(true)}
                                            className="h-9 w-9 text-slate-500 hover:text-slate-900"
                                            title="Edit Domain"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={handleRemoveDomain}
                                            className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                                            title="Remove Domain"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* DNS Instructions Card */}
                            {!isEditingDomain && pageSettings.customDomain && (
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-900">Configuration Required</h4>
                                                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                                    Add these <strong>two</strong> records to your domain provider to ensure both 'www' and your root domain work.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-md border border-blue-100 overflow-hidden text-xs">
                                            <div className="grid grid-cols-4 bg-slate-50 border-b border-blue-100 p-2 font-medium text-slate-500">
                                                <div>Type</div>
                                                <div>Name</div>
                                                <div className="col-span-2">Value</div>
                                            </div>
                                            {/* A Record */}
                                            <div className="grid grid-cols-4 p-2.5 items-center border-b border-slate-50">
                                                <div className="font-mono font-medium text-slate-900">A</div>
                                                <div className="font-mono text-slate-600">@</div>
                                                <div className="col-span-2 flex items-center justify-between gap-2">
                                                    <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 font-mono truncate">76.76.21.21</code>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
                                                        navigator.clipboard.writeText("76.76.21.21")
                                                        toast.success("IP copied to clipboard")
                                                    }}>
                                                        <Copy className="h-3 w-3 text-slate-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {/* CNAME Record */}
                                            <div className="grid grid-cols-4 p-2.5 items-center">
                                                <div className="font-mono font-medium text-slate-900">CNAME</div>
                                                <div className="font-mono text-slate-600">www</div>
                                                <div className="col-span-2 flex items-center justify-between gap-2">
                                                    <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 font-mono truncate text-[10px]">cname.vercel-dns.com</code>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
                                                        navigator.clipboard.writeText("cname.vercel-dns.com")
                                                        toast.success("CNAME copied to clipboard")
                                                    }}>
                                                        <Copy className="h-3 w-3 text-slate-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-blue-600/80 italic text-center">
                                            Note: DNS changes can take up to 24-48 hours to propagate globally.
                                        </p>
                                    </div>

                                    {/* Verify Button */}
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleVerifyDomain}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying Connection...
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="mr-2 h-4 w-4" />
                                                Check Connection
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                                        <div className={`h-1.5 w-1.5 rounded-full ${domainStatus === 'pending' ? 'bg-amber-400' : 'bg-green-500'}`} />
                                        <span>Status: {domainStatus === 'pending' ? 'Pending DNS Config' : 'Active'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="favicon">Favicon URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="favicon"
                                    placeholder="https://..."
                                    value={pageSettings.favicon || ''}
                                    onChange={(e) => updatePageSettings({ favicon: e.target.value })}
                                />
                                {pageSettings.favicon && (
                                    <div className="h-9 w-9 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                                        <img src={pageSettings.favicon} alt="Fav" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                {/* 2. SEO & Social Sharing */}
                <AccordionItem isOpen={openSection === "seo"} onToggle={() => toggleSection("seo")} title="SEO & Social Sharing">
                    <div className="space-y-4">
                        {/* Preview Area */}
                        <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                            <Tabs defaultValue="google" className="w-full">
                                <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-slate-200 bg-white p-0">
                                    <TabsTrigger value="google" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 text-xs py-2 h-auto ml-0">Google Search</TabsTrigger>
                                    <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 text-xs py-2 h-auto mr-0">Social Card</TabsTrigger>
                                </TabsList>

                                <div className="p-4 min-h-[160px] flex items-center justify-center">
                                    <TabsContent value="google" className="w-full mt-0">
                                        <div className="bg-white p-3 rounded shadow-sm border border-slate-100 max-w-full">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-500 overflow-hidden">
                                                    {pageSettings.favicon ? <img src={pageSettings.favicon} alt="" className="w-full h-full object-cover" /> : <Globe className="h-2.5 w-2.5" />}
                                                </div>
                                                <div className="text-[10px] text-slate-700 font-medium">your-app.com</div>
                                                <div className="text-[10px] text-slate-400">› {pageSettings.slug}</div>
                                            </div>
                                            <div className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                                                {pageSettings.seoTitle || 'Page Title'}
                                            </div>
                                            <div className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                                                {pageSettings.seoDescription || 'Add a description to see how it looks on search engines.'}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="social" className="w-full mt-0">
                                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm max-w-[240px] mx-auto">
                                            <div className="aspect-[1.91/1] bg-slate-100 w-full flex items-center justify-center overflow-hidden">
                                                {pageSettings.socialImage ? (
                                                    <img src={pageSettings.socialImage} alt="Social Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 bg-slate-50">
                                                <div className="text-[10px] uppercase text-slate-400 font-medium tracking-wide mb-0.5">your-app.com</div>
                                                <div className="text-xs font-semibold text-slate-800 truncate mb-1">{pageSettings.seoTitle || 'Page Title'}</div>
                                                <div className="text-[10px] text-slate-500 line-clamp-2">{pageSettings.seoDescription}</div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="seoTitle" className="flex justify-between">
                                    SEO Title
                                    <span className={cn("text-[10px]", pageSettings.seoTitle.length > 60 ? "text-red-500" : "text-slate-400")}>
                                        {pageSettings.seoTitle.length}/60
                                    </span>
                                </Label>
                                <Input
                                    id="seoTitle"
                                    value={pageSettings.seoTitle}
                                    onChange={(e) => updatePageSettings({ seoTitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="seoDescription" className="flex justify-between">
                                    Description
                                    <span className={cn("text-[10px]", pageSettings.seoDescription.length > 160 ? "text-red-500" : "text-slate-400")}>
                                        {pageSettings.seoDescription.length}/160
                                    </span>
                                </Label>
                                <Textarea
                                    id="seoDescription"
                                    rows={3}
                                    value={pageSettings.seoDescription}
                                    onChange={(e) => updatePageSettings({ seoDescription: e.target.value })}
                                    className="resize-none text-xs leading-relaxed"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="socialImage">Social Image URL</Label>
                                <Input
                                    id="socialImage"
                                    placeholder="https://..."
                                    value={pageSettings.socialImage || ''}
                                    onChange={(e) => updatePageSettings({ socialImage: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                {/* 3. Integrations & Compliance */}
                <AccordionItem isOpen={openSection === "integrations"} onToggle={() => toggleSection("integrations")} title="Integrations & Compliance">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-slate-900 uppercase tracking-wider">Analytics</h4>

                            <div className="space-y-1">
                                <Label htmlFor="gaId">Google Measurement ID</Label>
                                <Input
                                    id="gaId"
                                    placeholder="G-XXXXXXXXXX"
                                    value={pageSettings.googleAnalyticsId || ''}
                                    onChange={(e) => updatePageSettings({ googleAnalyticsId: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="pixelId">Meta Pixel ID</Label>
                                <Input
                                    id="pixelId"
                                    placeholder="123456789"
                                    value={pageSettings.metaPixelId || ''}
                                    onChange={(e) => updatePageSettings({ metaPixelId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-slate-900 uppercase tracking-wider">Legal</h4>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Cookie Banner</Label>
                                    <p className="text-xs text-slate-500">Show consent banner to visitors</p>
                                </div>
                                <Switch
                                    checked={pageSettings.cookieBanner}
                                    onCheckedChange={(checked) => updatePageSettings({ cookieBanner: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionItem>

            </div >
        </div >
    )
}
