import { Block, BackgroundConfig, BackgroundType } from "@/types/builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { BackgroundControls } from "./BackgroundControls";
import { buildBackgroundStyle } from "@/lib/gradientUtils";

interface BackgroundSectionProps {
    block: Block;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (blockId: string, config: BackgroundConfig) => void;
    // Fallback legacy update
    onLegacyUpdate: (property: string, value: string) => void;
}

export function BackgroundSection({ block, open, onOpenChange, onUpdate, onLegacyUpdate }: BackgroundSectionProps) {
    const currentType = block.backgroundConfig?.type ||
        (block.styles.backgroundColor && block.styles.backgroundColor !== 'transparent' ? 'color' : 'none');

    return (
        <div className="border-t pt-4">
            <SidebarMenu>
                <Collapsible open={open} onOpenChange={onOpenChange} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                <div className="flex items-center gap-2">
                                    <span>Background</span>
                                    {/* Small Preview Dot */}
                                    {currentType !== 'none' && (
                                        <div
                                            className="h-3 w-3 rounded-full border shadow-sm"
                                            style={buildBackgroundStyle(block.backgroundConfig || { type: 'color', color: block.styles.backgroundColor })}
                                        />
                                    )}
                                </div>
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub className="px-4 py-2">
                                <BackgroundControls
                                    config={block.backgroundConfig}
                                    defaultColor={block.styles.backgroundColor}
                                    onUpdate={(config) => onUpdate(block.id, config)}
                                    onColorChange={(color) => onLegacyUpdate('backgroundColor', color)}
                                />
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </div>
    );
}
