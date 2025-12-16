
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
                className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 p-4 gap-2"
                style={{ borderRadius: currentTheme.styles.borderRadius }}
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
            className="w-full h-full p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border"
            style={{
                background: 'var(--theme-block-bg)',
                borderRadius: 'var(--theme-radius)',
                borderColor: currentTheme.colors.border,
                color: 'var(--theme-block-text)' // Ensure numbers use text color
            }}
        >
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
