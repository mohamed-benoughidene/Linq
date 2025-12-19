# Context.md

## 1. Project Status
* **Phase:** Phase 3: Beta Polish (Mock Mode)
* **Current Focus:** Resolving layout bugs, polishing UI interactions, and ensuring consistency.
* **Last Update:** 2025-12-19 18:08

## 2. Technical Decisions
- [2025-12-16] **Zustand Store**: Centralized builder state (blocks, pages, themes) in `builder-store.ts`.
- [2025-12-16] **Mock Phase**: `CURRENT_PHASE = "MOCK"` disables real DB interactions for rapid UI dev.
- [2025-12-17] **Components**: Using standard Shadcn UI components.
- [2025-12-17] **Styling**: Tailwind v4 with CSS variables for theming.
- [2025-12-18] **Navigation Rail**: Refactored Sidebar to collapsed rail + flyout panels for blocks/themes.
- [2025-12-18] **Mobile Preview**: Implemented as a responsive overlay (85vh) with conditional styling logic.
- [2025-12-18] **Split Button**: Created reusable `SplitButton` component for primary/secondary actions.
- [2025-12-18] **Google Fonts**: Integrated dynamic Google Fonts loading via `google-fonts.ts` and `font-loader.tsx`.

## 3. App Primitives
### Block Types
These are the currently implemented block types found in `block-renderer.tsx` and `builder-store.ts`.
- `link`
- `header` (Profile Header)
- `video` (YouTube/Vimeo)
- `audio` (Spotify)
- `gallery` (Carousel, Accordion, Cards, Stack)
- `timer` (Countdown)
- `newsletter` (Email capture)
- `text` (Title + Body)
- `map` (Address)
- `socials` (Icon list)
- `contact` (Form)
- `calendly` (Booking)
- `embed` (Iframe)
- `commerce` (Digital Product)

### Theme Presets
Available themes in `src/lib/themes.ts`.
- `clean` (Modern)
- `retro-pop` (Retro)
- `lavender` (Modern)
- `oceanic` (Modern)
- `volt` (Modern)
- `adventure` (Retro)
- `sunset` (Modern)
- `noir` (Minimal)
- `elegance` (Modern)
- `forest` (Modern)
- `azure` (Modern)

### Page States
- `draft` (implicitly supported via state)
- `published` (implicitly supported via state)

## 4. Architecture Map
### Store Shape (`BuilderState`)
- `pages`: `Page[]` (Multi-page support).
- `activePageId`: `string`.
- `blocks`: `BuilderBlock[]` (Active page content).
- `currentTheme`: `ThemePreset`.
- `pageSettings`: `PageSettings` (SEO, Integrations).
- `activePanel`: `'blocks' | 'settings' | 'themes' | null`.
- `view`: `'editor' | 'analytics'`.
- `history`: `HistoryState` (Undo/Redo stack).
- `isPreview`: `boolean` (Mobile Preview toggle).
- `isSupportOpen`: `boolean`.
- `isCreatePageOpen`: `boolean`.
- `stats`: `AnalyticsStats` (Mock data).

### Key Components
- `src/store/builder-store.ts`: The Brain (Zustand Global Store).
- `src/components/builder/builder-canvas.tsx`: Drag-and-drop grid area.
- `src/components/builder/block-renderer.tsx`: Switch statement rendering specific blocks.
- `src/components/app-sidebar.tsx`: Navigation Rail + Share Action.
- `src/app/dashboard/layout.tsx`: Layout wrapper managing Flyout Panels (Settings, Themes, Blocks).
- `src/components/builder/top-bar.tsx`: Floating canvas control (Undo/Redo, Mobile Preview, Publish).
- `src/components/ui/split-button.tsx`: Reusable Split Button component.
- `src/lib/google-fonts.ts`: Google Fonts configuration and fetching.

## 5. Known Issues / "Gotchas"
- **Drag & Drop**: Currently only supports reordering blocks on canvas. Dragging from sidebar to canvas is NOT implemented.
- **Video Block**: Only valid YouTube/Vimeo URLs are parsed; raw rendering may fail if invalid.
- **Mock Data**: Analytics are hardcoded in `builder-store.ts`.
- **Commerce Block**: Implementation primarily for display; external payment URL field provided but no native payment processing.
