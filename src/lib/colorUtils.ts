/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

/**
 * Calculates relative luminance of a color
 * Formula from WCAG 2.0
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Determines if a background color is dark
 * Returns true if background is dark, false if light
 */
export function isColorDark(hexColor: string): boolean {
    const rgb = hexToRgb(hexColor)
    if (!rgb) return false

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
    // WCAG threshold: 0.5 is roughly the middle point
    return luminance < 0.5
}

/**
 * Gets appropriate text color (white or black) based on background
 */
export function getContrastTextColor(backgroundColor: string): string {
    return isColorDark(backgroundColor) ? '#FFFFFF' : '#000000'
}
