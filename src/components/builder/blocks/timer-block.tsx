
"use client"

import { useEffect, useState } from "react"
import { useBuilderStore, BuilderBlock } from "@/store/builder-store"
import { cn } from "@/lib/utils"
import { Clock, GripHorizontal } from "lucide-react"

interface TimerBlockProps {
    id: string
    data: {
        targetDate?: string
        timerLabel?: string
        variant?: BuilderBlock['content']['variant']
        isActive: boolean
        highlight?: boolean
    }
}

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export function TimerBlock({ id, data }: TimerBlockProps) {
    const { currentTheme } = useBuilderStore()
    const { targetDate, timerLabel, variant = 'wide' } = data

    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        if (!targetDate) return

        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
                setIsExpired(false)
            } else {
                setIsExpired(true)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    // Empty State
    if (!targetDate) {
        return (
            <div
                className="w-full h-full flex flex-col items-center justify-center text-sm font-medium border-2 border-dashed p-4 gap-2"
                style={{
                    borderRadius: currentTheme.styles.borderRadius,
                    borderColor: currentTheme.colors.border,
                    background: 'var(--theme-block-bg)',
                    color: 'var(--theme-block-text)',
                    opacity: 0.5
                }}
            >
                <Clock className="h-6 w-6 opacity-50" />
                <span>Set Date</span>
            </div>
        )
    }

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center justify-center min-w-[3rem]">
            <span className="text-2xl font-bold font-mono leading-none">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--theme-block-label)' }}>{label}</span>
        </div>
    )

    const Separator = () => (
        <span className="text-xl font-bold opacity-30 pb-4">:</span>
    )

    return (
        <div
            className={cn(
                "w-full h-full p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border outline-none",
                data.highlight && "ring-2 ring-violet-500 ring-offset-2 animate-pulse"
            )}
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
                color: 'var(--theme-block-text)' // Ensure numbers use text color
            }}
        >
            {/* Visual Drag Handle (Optional for Timer? It's usually draggable by surface. Let's add it for consistency if space allows, but Timer is often small. LinkBlock doesn't have visible handle. Let's skip valid handle for Timer for now to avoid clutter, or add it? Plan said "blocks with internal interactions". Timer is static. Skip handle.) */}

            {/* Hidden Badge */}
            {!data.isActive && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">Hidden</span>
                </div>
            )}
            {timerLabel && (
                <div
                    className="text-sm font-medium mb-2 uppercase tracking-wide"
                    style={{ color: 'var(--theme-block-label)' }}
                >
                    {timerLabel}
                </div>
            )}

            <div className={cn(
                "flex items-center justify-center gap-2",
                variant === 'square' ? "flex-col gap-4" : "flex-row" // Square stacks, others horizontal
            )}>
                {variant === 'square' ? (
                    // Stacked Layout for Square
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <TimeUnit value={timeLeft.hours} label="Hrs" />
                        <TimeUnit value={timeLeft.minutes} label="Min" />
                        <TimeUnit value={timeLeft.seconds} label="Sec" />
                    </div>
                ) : (
                    // Horizontal Layout for Wide/Hero
                    <>
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <Separator />
                        <TimeUnit value={timeLeft.hours} label="Hrs" />
                        <Separator />
                        <TimeUnit value={timeLeft.minutes} label="Min" />
                        <Separator />
                        <TimeUnit value={timeLeft.seconds} label="Sec" />
                    </>
                )}
            </div>
        </div>
    )
}
