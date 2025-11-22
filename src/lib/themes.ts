import { GlobalTheme } from '@/types/builder'

export const themes: Record<string, GlobalTheme> = {
    minimal: {
        name: 'Minimal',
        colors: {
            primary: '#000000',
            background: '#FFFFFF',
            text: '#000000',
            accent: '#666666'
        },
        typography: {
            font: 'Inter',
            headingSize: 32,
            bodySize: 16
        }
    },
    dark: {
        name: 'Dark',
        colors: {
            primary: '#FFFFFF',
            background: '#1A1A1A',
            text: '#FFFFFF',
            accent: '#999999'
        },
        typography: {
            font: 'Inter',
            headingSize: 32,
            bodySize: 16
        }
    },
    vibrant: {
        name: 'Vibrant',
        colors: {
            primary: '#FF6B6B',
            background: '#F8F9FA',
            text: '#2D3748',
            accent: '#4ECDC4'
        },
        typography: {
            font: 'Inter',
            headingSize: 36,
            bodySize: 18
        }
    },
    ocean: {
        name: 'Ocean',
        colors: {
            primary: '#0077B6',
            background: '#F0F9FF',
            text: '#023E8A',
            accent: '#00B4D8'
        },
        typography: {
            font: 'Georgia',
            headingSize: 34,
            bodySize: 17
        }
    },
    sunset: {
        name: 'Sunset',
        colors: {
            primary: '#FF6F00',
            background: '#FFF8E1',
            text: '#5D4037',
            accent: '#FF9800'
        },
        typography: {
            font: 'Georgia',
            headingSize: 36,
            bodySize: 18
        }
    },
    forest: {
        name: 'Forest',
        colors: {
            primary: '#2D6A4F',
            background: '#F1F8F4',
            text: '#1B4332',
            accent: '#52B788'
        },
        typography: {
            font: 'Verdana',
            headingSize: 32,
            bodySize: 16
        }
    }
}
