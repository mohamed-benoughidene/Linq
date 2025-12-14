
import { ThemePreset } from "@/lib/themes";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
    theme: ThemePreset;
    isActive: boolean;
    onClick: () => void;
}

export function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative flex w-full flex-col gap-3 p-4 text-left transition-all hover:scale-[1.02]",
                isActive && "ring-2 ring-blue-500 ring-offset-2"
            )}
            style={{
                backgroundColor: theme.colors.background, // Use page background for context
                borderRadius: theme.styles.borderRadius,
            }}
        >
            {/* Mini Preview Card */}
            <div
                className="flex h-24 w-full flex-col items-center justify-center gap-2 border transition-all"
                style={{
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    borderWidth: theme.styles.borderWidth,
                    borderRadius: theme.styles.borderRadius,
                    boxShadow: theme.styles.shadow,
                }}
            >
                <span
                    className="text-sm font-medium"
                    style={{
                        fontFamily: theme.styles.fontFamily,
                        color: theme.colors.text,
                    }}
                >
                    {theme.name}
                </span>

                {/* Simulated content lines to show contrast */}
                <div className="flex gap-1">
                    <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="h-2 w-4 rounded-full" style={{ backgroundColor: theme.colors.border }} />
                </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-muted-foreground">{theme.type}</span>
                <div className="flex gap-1">
                    <div
                        className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                        className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.background }}
                    />
                    <div
                        className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.text }}
                    />
                </div>
            </div>

            {isActive && (
                <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-1 text-white shadow-sm">
                    <Check className="h-3 w-3" />
                </div>
            )}
        </button>
    );
}
