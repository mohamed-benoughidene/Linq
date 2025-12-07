
import { useBuilderStore } from "@/store/builderStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar";
import { ChevronDown, Wallpaper } from "lucide-react";
import { BackgroundControls } from "./BackgroundControls";
import { buildBackgroundStyle } from "@/lib/gradientUtils";

export function PageBackgroundSection() {
    const { globalTheme, updatePageBackground } = useBuilderStore();

    // Use globalTheme.colors.background as fallback default color
    const defaultConfig = globalTheme.pageBackground;
    const defaultColor = globalTheme.colors.background || '#ffffff';

    const hasActiveBackground = defaultConfig?.type && defaultConfig.type !== 'none';

    return (
        <Collapsible className="group/collapsible">
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <Wallpaper className="mr-2 h-4 w-4" />
                    <span>Page Background</span>
                    {/* Small Preview Dot */}
                    {hasActiveBackground && (
                        <div
                            className="h-3 w-3 rounded-full border shadow-sm ml-auto mr-0"
                            style={buildBackgroundStyle(defaultConfig)}
                        />
                    )}
                    <ChevronDown className={`ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 ${hasActiveBackground ? '' : 'ml-auto'}`} />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub className="px-4 py-2">
                    <BackgroundControls
                        config={defaultConfig}
                        defaultColor={defaultColor}
                        onUpdate={updatePageBackground}
                    // We don't strictly Sync back to globalTheme.colors.background 
                    // because that might affect other things (like generic text contrast logic)
                    // For now we keep pageBackground as a distinct override layer.
                    />
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    );
}
