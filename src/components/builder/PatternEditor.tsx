
import { PatternConfig } from "@/types/builder";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { presetPatterns } from "@/lib/backgrounds";
import { cn } from "@/lib/utils";

interface PatternEditorProps {
    pattern: PatternConfig;
    onChange: (pattern: PatternConfig) => void;
}

export function PatternEditor({ pattern, onChange }: PatternEditorProps) {
    const currentPattern = pattern || { id: 'dots', scale: 100, opacity: 100, rotation: 0 };

    const handlePresetSelect = (id: string) => {
        onChange({ ...currentPattern, id });
    };

    const updateProperty = (prop: keyof PatternConfig, value: number | string) => {
        onChange({ ...currentPattern, [prop]: value });
    };

    return (
        <div className="space-y-4 pt-2">
            {/* Pattern Grid */}
            <div className="space-y-2">
                <Label className="text-xs">Pattern</Label>
                <div className="grid grid-cols-3 gap-2">
                    {presetPatterns.map(preset => {
                        // Create a mini preview of the pattern
                        // Since SVGs are data, we can render them inline or as bg
                        const encodedSvg = encodeURIComponent(preset.svg.replace('currentColor', '#000000'));
                        const bgImage = `url("data:image/svg+xml,${encodedSvg}")`;

                        return (
                            <button
                                key={preset.id}
                                className={cn(
                                    "h-12 rounded-md border bg-muted transition-all hover:border-primary",
                                    currentPattern.id === preset.id && "border-primary ring-1 ring-primary"
                                )}
                                style={{
                                    backgroundImage: bgImage,
                                    backgroundSize: '10px 10px',
                                    backgroundRepeat: 'repeat'
                                }}
                                onClick={() => handlePresetSelect(preset.id)}
                                aria-label={`Select ${preset.name} pattern`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs">Shape Color</Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={currentPattern.color || '#000000'}
                            onChange={(e) => updateProperty('color', e.target.value as any)}
                            className="h-8 w-full rounded-md border border-input p-0.5 cursor-pointer"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Background</Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={currentPattern.backgroundColor || '#ffffff'}
                            onChange={(e) => updateProperty('backgroundColor', e.target.value as any)}
                            className="h-8 w-full rounded-md border border-input p-0.5 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Scale */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-xs">Scale</Label>
                    <span className="text-[10px] text-muted-foreground">{currentPattern.scale || 100}%</span>
                </div>
                <Slider
                    value={[currentPattern.scale || 100]}
                    onValueChange={(vals) => updateProperty('scale', vals[0])}
                    min={50}
                    max={200}
                    step={10}
                />
            </div>

            {/* Opacity hint */}
            <p className="text-[10px] text-muted-foreground">
                Patterns use `currentColor` and inherit opacity from the SVG definition.
            </p>
        </div>
    );
}
