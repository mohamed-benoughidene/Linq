# Builder Components

This directory contains the core components for the Linq Page Builder.

## Component Hierarchy

```
Canvas
├── AddBlockButton
└── BlockRenderer (list)
```

```
Dashboard Layout
├── Sidebar (ThemesSection)
├── Header (HeaderActions)
├── Main Content (Canvas)
└── Right Sidebar (PropertiesPanel)
```

## Components

### `Canvas.tsx`
The main editing area. It connects to the Zustand store to fetch blocks and renders them using `BlockRenderer`. It also handles background clicks to deselect blocks.

### `BlockRenderer.tsx`
Renders individual blocks based on their type (`heading`, `paragraph`, `image`, `link`). It handles:
- Inline styles (user-customizable)
- Tailwind classes (micro-interactions)
- Selection state (visual ring)

### `PropertiesPanel.tsx`
The right sidebar for editing the selected block. It provides controls for:
- Content (text, image URL)
- Typography (font, size, weight)
- Colors (text, background)
- Spacing (margin, padding)
- Borders (width, radius, color)
- Reordering and Deletion
- Theme Locking

### `ThemesSection.tsx`
The left sidebar component for selecting global themes. It displays color swatches and applies themes to all unlocked blocks.

### `HeaderActions.tsx`
The header component containing:
- Page Title input
- Save button
- Undo/Redo buttons

### `AutoSaveManager.tsx`
A utility component that runs in the background to auto-save the page every 30 seconds.

## State Management

All state is managed by `src/store/builderStore.ts` using Zustand.
- **Persistence**: `localStorage` (key: `linq-builder-storage`)
- **Database**: Supabase `pages` table (via server actions)
- **History**: Undo/Redo stack for all block changes

## Styling

We use a hybrid styling approach:
1. **Inline Styles**: For user-customizable properties (dynamic values).
2. **Tailwind Classes**: For static layout and micro-interactions (hover, click).
