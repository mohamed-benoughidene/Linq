
import { Block } from "@/types/builder";
import { Label } from "@/components/ui/label";

interface ColorEditorProps {
    color?: string;
    onChange: (color: string) => void;
}

export function ColorEditor({ color = "#ffffff", onChange }: ColorEditorProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-2">
                <Label htmlFor="solid-color" className="text-xs">Color</Label>
                <div className="flex gap-2 items-center">
                    <input
                        id="solid-color"
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-9 w-12 rounded-md border border-input p-0.5 cursor-pointer"
                    />
                    <div className="flex-1 text-xs text-muted-foreground">
                        {color.toUpperCase()}
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground">
                Text color will automatically adjust for optimal contrast.
            </p>
        </div>
    );
}
