"use client"

import { useBuilderStore } from "@/store/builder-store"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Eye, MousePointerClick, Percent, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalyticsView() {
    const { stats, setView } = useBuilderStore()

    return (
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
                        <p className="text-slate-500">Track your page performance over the last 7 days.</p>
                    </div>
                    <Button variant="outline" onClick={() => setView('editor')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builder
                    </Button>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ScoreCard
                        title="Total Views"
                        value={stats.totalViews.toLocaleString()}
                        icon={Eye}
                        trend="+12%"
                    />
                    <ScoreCard
                        title="Total Clicks"
                        value={stats.totalClicks.toLocaleString()}
                        icon={MousePointerClick}
                        trend="+5%"
                    />
                    <ScoreCard
                        title="Click Rate (CTR)"
                        value={stats.ctr}
                        icon={Percent}
                        trend="+2.1%"
                    />
                </div>

                {/* Main Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900">Performance Overview</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Views
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Clicks
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.history}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Top Links */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4">Top Performing Links</h3>
                        <div className="space-y-4">
                            {stats.topLinks.map((link, i) => (
                                <div key={link.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-slate-700">{link.title}</span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {link.clicks} clicks
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Device Breakdown (Mock) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4">Device Breakdown</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">Mobile</span>
                                    <span className="text-slate-500">82%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">Desktop</span>
                                    <span className="text-slate-500">18%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '18%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ScoreCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    {trend}
                </span>
                <span className="text-slate-400 ml-2">vs last week</span>
            </div>
        </div>
    )
}
