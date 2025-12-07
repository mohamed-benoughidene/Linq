
import { GradientConfig, PatternConfig } from "@/types/builder";

export const presetGradients: (GradientConfig & { id: string, name: string })[] = [
    {
        id: 'sunset',
        name: 'Sunset',
        type: 'linear',
        angle: 45,
        stops: [
            { color: '#FF6B6B', position: 0 },
            { color: '#FFE66D', position: 100 }
        ]
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        type: 'linear',
        angle: 180,
        stops: [
            { color: '#2E3192', position: 0 },
            { color: '#1BFFFF', position: 100 }
        ]
    },
    {
        id: 'purple-rain',
        name: 'Purple Rain',
        type: 'radial',
        stops: [
            { color: '#654ea3', position: 0 },
            { color: '#eaafc8', position: 100 }
        ]
    },
    {
        id: 'mint',
        name: 'Fresh Mint',
        type: 'conic',
        angle: 0,
        stops: [
            { color: '#00b09b', position: 0 },
            { color: '#96c93d', position: 50 },
            { color: '#00b09b', position: 100 }
        ]
    },
    {
        id: 'cherry',
        name: 'Cherry Blossom',
        type: 'linear',
        angle: 135,
        stops: [
            { color: '#eb3349', position: 0 },
            { color: '#f45c43', position: 100 }
        ]
    },
    {
        id: 'midnight',
        name: 'Midnight',
        type: 'linear',
        angle: 180,
        stops: [
            { color: '#232526', position: 0 },
            { color: '#414345', position: 100 }
        ]
    }
];

export const presetPatterns: (PatternConfig & { name: string, svg: string })[] = [
    {
        id: 'dots',
        name: 'Dots',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="currentColor" opacity="0.4"/></svg>`,
    },
    {
        id: 'grid',
        name: 'Grid',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>`
    },
    {
        id: 'checkerboard',
        name: 'Checkerboard',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10" fill="currentColor" opacity="0.2"/><rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.2"/></svg>`
    },
    {
        id: 'stripes-diagonal',
        name: 'Diagonal Stripes',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L20 0" stroke="currentColor" stroke-width="2" opacity="0.3"/></svg>`
    },
    {
        id: 'waves',
        name: 'Waves',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></svg>`
    },
    {
        id: 'circles',
        name: 'Circles',
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/></svg>`
    }
];
