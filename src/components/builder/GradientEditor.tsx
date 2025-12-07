
import { GradientConfig, GradientStop } from "@/types/builder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { presetGradients } from "@/lib/backgrounds";
import { buildGradientCSS } from "@/lib/gradientUtils";
import { Plus, Trash2 } from "lucide-react";

interface GradientEditorProps {
    gradient: GradientConfig;
    onChange: (gradient: GradientConfig) => void;
}

export function GradientEditor({ gradient, onChange }: GradientEditorProps) {

    // Ensure we always have valid defaults
    const currentGradient = gradient || { type: 'linear', stops: [], angle: 90 };

    const handleTypeChange = (type: GradientConfig['type']) => {
        onChange({ ...currentGradient, type });
    };

    const handleAngleChange = (value: number[]) => {
        onChange({ ...currentGradient, angle: value[0] });
    };

    const updateStop = (index: number, updates: Partial<GradientStop>) => {
        const newStops = [...currentGradient.stops];
        newStops[index] = { ...newStops[index], ...updates };
        onChange({ ...currentGradient, stops: newStops });
    };

    const addStop = () => {
        // Add a new stop at 100% or midway
        const newStop: GradientStop = { color: '#ffffff', position: 100 };
        onChange({ ...currentGradient, stops: [...currentGradient.stops, newStop] });
    };

    const removeStop = (index: number) => {
        if (currentGradient.stops.length <= 2) return; // Prevent removing if only 2 stops
        const newStops = currentGradient.stops.filter((_, i) => i !== index);
        onChange({ ...currentGradient, stops: newStops });
    };

    const applyPreset = (presetId: string) => {
        const preset = presetGradients.find(p => p.id === presetId);
        if (preset) {
            // Create a clean copy without the extra 'id' and 'name' fields from preset
            const { id, name, ...config } = preset;
            onChange(config);
        }
    }

    return (
        <div className="space-y-4 pt-2">
            {/* Type Selector */}
            <div className="space-y-2">
                <Label className="text-xs">Type</Label>
                <Select value={currentGradient.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Conic</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Angle Slider (Linear/Conic only) */}
            {currentGradient.type !== 'radial' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs">Angle</Label>
                        <span className="text-[10px] text-muted-foreground">{currentGradient.angle || 0}°</span>
                    </div>
                    <Slider
                        value={[currentGradient.angle || 0]}
                        onValueChange={handleAngleChange}
                        max={360}
                        step={1}
                        className="py-1"
                    />
                </div>
            )}

            {/* Presets */}
            <div className="space-y-2">
                <Label className="text-xs">Presets</Label>
                <div className="grid grid-cols-4 gap-2">
                    {presetGradients.map(preset => (
                        <button
                            key={preset.id}
                            className="h-8 rounded-md ring-offset-background transition-all hover:ring-2 hover:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            style={{ background: buildGradientCSS(preset) }}
                            onClick={() => applyPreset(preset.id)}
                            aria-label={`Apply ${preset.name} gradient`}
                        />
                    ))}
                </div>
            </div>

            {/* Stops Editor */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs">Color Stops</Label>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addStop}>
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                <div className="space-y-2">
                    {currentGradient.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="color"
                                value={stop.color}
                                onChange={(e) => updateStop(index, { color: e.target.value })}
                                className="h-8 w-8 rounded-md border border-input p-0.5 cursor-pointer shrink-0"
                            />
                            <div className="flex-1">
                                <Slider
                                    value={[stop.position]}
                                    onValueChange={(vals) => updateStop(index, { position: vals[0] })}
                                    max={100}
                                    step={1}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                disabled={currentGradient.stops.length <= 2}
                                onClick={() => removeStop(index)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
