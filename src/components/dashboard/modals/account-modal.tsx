"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, CreditCard, Bell } from "lucide-react"

export function AccountModal({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[500px] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Account Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account preferences and subscription.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="profile" className="flex-1 flex flex-col">
                    <div className="px-6">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 rounded-none mb-6">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3 h-auto">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Profile
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3 h-auto">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Billing
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3 h-auto">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4" />
                                    Notifications
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* Profile Tab */}
                        <TabsContent value="profile" className="mt-0 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400">
                                    S
                                </div>
                                <div className="space-y-1">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="display-name">Display Name</Label>
                                    <Input id="display-name" defaultValue="shadcn" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="m@example.com" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </TabsContent>

                        {/* Billing Tab */}
                        <TabsContent value="billing" className="mt-0 space-y-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Current Plan</p>
                                    <h4 className="text-lg font-bold text-slate-900">Free Tier</h4>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                    <h5 className="font-medium text-sm text-slate-900">Payment Method</h5>
                                </div>
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No payment method added.
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                                    Manage Subscription
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="mt-0 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between space-x-2 border-b border-slate-100 pb-4">
                                    <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                                        <span>Marketing Emails</span>
                                        <span className="font-normal text-xs text-slate-500">Receive news, updates, and promotions.</span>
                                    </Label>
                                    <Switch id="marketing-emails" />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border-b border-slate-100 pb-4">
                                    <Label htmlFor="security-emails" className="flex flex-col space-y-1">
                                        <span>Security Alerts</span>
                                        <span className="font-normal text-xs text-slate-500">Receive emails about your account security.</span>
                                    </Label>
                                    <Switch id="security-emails" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="analytics-emails" className="flex flex-col space-y-1">
                                        <span>Weekly Analytics</span>
                                        <span className="font-normal text-xs text-slate-500">Get a weekly summary of your page performance.</span>
                                    </Label>
                                    <Switch id="analytics-emails" defaultChecked />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
