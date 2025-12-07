
import { Block, GradientConfig, PatternConfig } from "@/types/builder";
import { presetPatterns } from "@/lib/backgrounds";

export const buildGradientCSS = (gradient: GradientConfig) => {
    const stops = [...gradient.stops]
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');

    switch (gradient.type) {
        case 'linear':
            return `linear-gradient(${gradient.angle || 90}deg, ${stops})`;
        case 'radial':
            return `radial-gradient(circle, ${stops})`;
        case 'conic':
            return `conic-gradient(from ${gradient.angle || 0}deg, ${stops})`;
        default:
            return '';
    }
};

export const generatePatternSVG = (pattern: PatternConfig): string => {
    const preset = presetPatterns.find(p => p.id === pattern.id);
    if (!preset) return '';

    let svgContent = preset.svg;

    // Inject user color if provided, otherwise default to black (which opacity will affect)
    // We replace 'currentColor' with the specific color
    if (pattern.color) {
        svgContent = svgContent.replaceAll('currentColor', pattern.color);
    } else {
        svgContent = svgContent.replaceAll('currentColor', '#000000');
    }

    // Encode SVG to safe data URI
    const encodedSvg = encodeURIComponent(svgContent);
    return `url("data:image/svg+xml,${encodedSvg}")`;
};

export const buildBackgroundStyle = (backgroundConfig?: Block['backgroundConfig']): React.CSSProperties => {
    if (!backgroundConfig) return {};

    const style: React.CSSProperties = {};

    switch (backgroundConfig.type) {
        case 'color':
            if (backgroundConfig.color) {
                style.backgroundColor = backgroundConfig.color;
            }
            break;

        case 'gradient':
            if (backgroundConfig.gradient) {
                style.background = buildGradientCSS(backgroundConfig.gradient);
            }
            break;

        case 'pattern':
            if (backgroundConfig.pattern) {
                const patternUrl = generatePatternSVG(backgroundConfig.pattern);
                style.backgroundImage = patternUrl;

                // background-color allows the pattern to sit on top of a solid color
                if (backgroundConfig.pattern.backgroundColor) {
                    style.backgroundColor = backgroundConfig.pattern.backgroundColor;
                }

                // Scaling
                const size = backgroundConfig.pattern.scale ? `${backgroundConfig.pattern.scale / 5}px` : '20px'; // Adjusted base divider for better default size
                style.backgroundSize = size;

                style.backgroundRepeat = 'repeat';

                // Rotation (Note: Only applies to the pattern image in some browsers via tricky syntax, 
                // or we accept it won't rotate without complex DOM changes. 
                // For now, simpler to leave rotation out of inline styles or use it if we had a dedicated container.
                // We will skip rotation application in this inline-style helper to keep it safe.)

                // Opacity: The opacity in PatternConfig (0-100) is best handled by
                // modifying the stroke-opacity/fill-opacity in the SVG itself.
                // We haven't implemented that injection yet in generatePatternSVG above, 
                // but we can add it if needed. Structure is there.
            }
            break;

        case 'none':
        default:
            style.background = 'none';
            style.backgroundColor = 'transparent';
            break;
    }

    return style;
};
