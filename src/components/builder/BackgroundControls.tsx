
import { BackgroundConfig, BackgroundType } from "@/types/builder";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorEditor } from "./ColorEditor";
import { GradientEditor } from "./GradientEditor";
import { PatternEditor } from "./PatternEditor";

interface BackgroundControlsProps {
    config?: BackgroundConfig;
    defaultColor?: string;
    onUpdate: (config: BackgroundConfig) => void;
    // Callback to sync legacy color if needed
    onColorChange?: (color: string) => void;
}

export function BackgroundControls({ config, defaultColor = '#ffffff', onUpdate, onColorChange }: BackgroundControlsProps) {
    const currentType = config?.type || (defaultColor && defaultColor !== 'transparent' ? 'color' : 'none');

    const handleTypeChange = (type: BackgroundType) => {
        let newConfig: BackgroundConfig = { type };

        if (type === 'color') {
            newConfig.color = (config?.type === 'color' ? config.color : defaultColor) || '#ffffff';
        } else if (type === 'gradient') {
            newConfig.gradient = config?.gradient || {
                type: 'linear',
                angle: 90,
                stops: [
                    { color: '#ffffff', position: 0 },
                    { color: '#000000', position: 100 }
                ]
            };
        } else if (type === 'pattern') {
            newConfig.pattern = config?.pattern || {
                id: 'dots',
                scale: 100,
                opacity: 50,
                rotation: 0,
                color: '#000000',
                backgroundColor: 'transparent'
            };
        }

        onUpdate(newConfig);

        if (type === 'color' && newConfig.color && onColorChange) {
            onColorChange(newConfig.color);
        } else if (type !== 'color' && onColorChange) {
            // If switching away from color, maybe we want to clear legacy? 
            // Or keep it as fallback. Let's generic component not decide this too aggressively.
        }
    };

    const handleConfigUpdate = (updates: Partial<BackgroundConfig>) => {
        const currentConfig = config || { type: 'none' as BackgroundType };
        const newConfig = { ...currentConfig, ...updates };

        onUpdate(newConfig as BackgroundConfig);

        if (newConfig.type === 'color' && newConfig.color && onColorChange) {
            onColorChange(newConfig.color);
        }
    };

    return (
        <div className="space-y-4">
            {/* Type Selector */}
            <div className="space-y-2">
                <Label className="text-xs">Type</Label>
                <Select value={currentType} onValueChange={(v) => handleTypeChange(v as BackgroundType)}>
                    <SelectTrigger className="h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="color">Solid Color</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="pattern">Pattern</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Editors */}
            {currentType === 'color' && (
                <ColorEditor
                    color={config?.color || defaultColor}
                    onChange={(color) => handleConfigUpdate({ color })}
                />
            )}

            {currentType === 'gradient' && config?.gradient && (
                <GradientEditor
                    gradient={config.gradient}
                    onChange={(gradient) => handleConfigUpdate({ gradient })}
                />
            )}

            {currentType === 'pattern' && config?.pattern && (
                <PatternEditor
                    pattern={config.pattern}
                    onChange={(pattern) => handleConfigUpdate({ pattern })}
                />
            )}
        </div>
    );
}
