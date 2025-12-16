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
import { Check, Zap } from "lucide-react"

export function UpgradeModal({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                <div className="bg-slate-950 p-6 text-white text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
                        <Zap className="w-8 h-8 text-blue-400" fill="currentColor" />
                    </div>
                    <DialogTitle className="text-2xl font-bold mb-2">Unlock the full potential</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Upgrade to Pro and take your link-in-bio to the next level.
                    </DialogDescription>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-6 bg-slate-50">
                    {/* Free Plan */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Free</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                Current
                            </span>
                        </div>
                        <div className="space-y-3 mb-6">
                            <FeatureItem>Unlimited Links</FeatureItem>
                            <FeatureItem>Basic Analytics</FeatureItem>
                            <FeatureItem>Standard Support</FeatureItem>
                            <FeatureItem>Linq Branding</FeatureItem>
                        </div>
                        <Button variant="outline" className="w-full" disabled>
                            Current Plan
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white p-6 rounded-xl border-2 border-blue-500 relative shadow-lg">
                        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Recommmended
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Pro</h3>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-slate-900">$9</span>
                                <span className="text-slate-500 text-sm">/mo</span>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <FeatureItem checked>Custom Domain</FeatureItem>
                            <FeatureItem checked>Remove Branding</FeatureItem>
                            <FeatureItem checked>Priority Support</FeatureItem>
                            <FeatureItem checked>Advanced Analytics</FeatureItem>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Upgrade to Pro
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function FeatureItem({ children, checked = false }: { children: React.ReactNode, checked?: boolean }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${checked ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span className={checked ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                {children}
            </span>
        </div>
    )
}
