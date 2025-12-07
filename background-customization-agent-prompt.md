
## Overview
Implement a comprehensive background customization system in the Linq builder's Design sidebar (BlockEditor.tsx). This feature allows users to customize block backgrounds with three options: **Solid Color**, **Gradient**, and **Pattern**.

---

## Project Context
- **Project**: Linq (Next.js + TypeScript + shadcn/ui)
- **Location**: `src/components/builder/BlockEditor.tsx`
- **State Management**: Zustand (`src/store/builderStore.ts`)
- **Types**: `src/types/builder.ts`
- **Styling**: Tailwind CSS + Inline styles hybrid system
- **UI Components**: shadcn/ui (Input, Select, Button, Collapsible, Textarea, etc.)

---

## Feature Requirements

### 1. Background Customization Options

#### A. Solid Color
- Use existing color picker implementation from Typography section
- Allow users to select any hex color
- Display preview of selected color
- Auto-adjust text color for contrast (already implemented via `getContrastTextColor`)

#### B. Gradient
- Support three gradient types:
  - **Linear**: Angle-based (0-360 degrees)
  - **Radial**: Center-based
  - **Conic**: Rotational gradients
- Include preset gradient swatches (6-8 popular gradient combinations)
- Visual gradient editor with draggable color stops
- Color stop controls:
  - Add/remove color stops
  - Adjust position (0-100%)
  - Change color at each stop
- Angle/Direction controls (for linear gradients)
- Real-time preview of gradient

#### C. Pattern
- Predefined pattern library (8-12 patterns):
  - Dots
  - Stripes (horizontal/vertical)
  - Checkerboard
  - Grid
  - Waves
  - Geometric patterns
- Pattern customization:
  - Pattern opacity (0-100%)
  - Pattern scale (50-200%)
  - Pattern rotation (0-360 degrees)
- Toggle pattern overlay on/off

### 2. UI/UX Design Principles

#### Progressive Disclosure
- Add a "Background Type" selector dropdown at top of Background section
- Three options: None, Solid Color, Gradient, Pattern
- Only show relevant controls based on selected type

#### Real-Time Preview
- Display a preview thumbnail (60px height, full width) showing how background looks
- Update preview immediately as user adjusts settings
- Show preview inside the collapsible section header (optional, for context)

#### Visual Feedback
- Selected type indicator (highlight active tab/button)
- Color swatches for quick preset selection
- Hover states on all interactive elements
- Success toast on save/apply

#### Mobile Responsive
- Ensure controls work on mobile (already tested in current sidebar)
- Use compact button layouts for pattern/gradient selectors
- Stack controls vertically (already done in sidebar pattern)

### 3. Data Model Extension

**Update `src/types/builder.ts`:**

```typescript
interface Block {
  // ... existing properties
  backgroundConfig?: {
    type: 'color' | 'gradient' | 'pattern' | 'none'
    
    // Solid Color
    color?: string
    
    // Gradient
    gradient?: {
      type: 'linear' | 'radial' | 'conic'
      angle?: number // 0-360 for linear
      stops: Array<{
        color: string
        position: number // 0-100
      }>
    }
    
    // Pattern
    pattern?: {
      id: string // unique pattern identifier
      opacity?: number // 0-100
      scale?: number // 50-200
      rotation?: number // 0-360
    }
  }
}
```

### 4. Store Actions

**Add to `src/store/builderStore.ts`:**

```typescript
// Update existing block styling
updateBlockBackground(
  blockId: string,
  backgroundConfig: Block['backgroundConfig']
): void

// Apply preset gradient
applyPresetGradient(blockId: string, gradientId: string): void

// Apply preset pattern
applyPresetPattern(blockId: string, patternId: string): void
```

### 5. Component Implementation

#### A. New Sub-Component: `BackgroundSection.tsx`
Location: `src/components/builder/BackgroundSection.tsx`

Responsibilities:
- Render background type selector
- Conditionally render color/gradient/pattern editors
- Manage local UI state for editors
- Call store actions on changes
- Display real-time preview

Structure:
```typescript
interface BackgroundSectionProps {
  block: Block
  onUpdate: (backgroundConfig: Block['backgroundConfig']) => void
}

export function BackgroundSection({ block, onUpdate }: BackgroundSectionProps)
```

#### B. Sub-Components for Each Type

**ColorEditor.tsx**:
- Color picker input
- Recent colors display (optional)
- Preview thumbnail

**GradientEditor.tsx**:
- Gradient type selector (linear/radial/conic)
- Preset gradient swatches (6-8 options)
- Color stop editor (add/remove/modify)
- Angle slider (for linear)
- Preview canvas showing gradient

**PatternEditor.tsx**:
- Pattern grid selector (thumbnail previews)
- Opacity slider (0-100)
- Scale slider (50-200)
- Rotation slider (0-360)
- Toggle enable/disable
- Preview thumbnail

#### C. Integration in BlockEditor.tsx
- Replace existing "Background Color" section with new `BackgroundSection`
- Keep the collapsible structure (already in place)
- Maintain consistency with other sections (Typography, Spacing, Border)

### 6. Styling & CSS

**Inline Style Application:**
```typescript
const buildBackgroundStyle = (backgroundConfig?: Block['backgroundConfig']) => {
  if (!backgroundConfig) return {}
  
  switch (backgroundConfig.type) {
    case 'color':
      return { backgroundColor: backgroundConfig.color }
    
    case 'gradient':
      return { background: buildGradientCSS(backgroundConfig.gradient!) }
    
    case 'pattern':
      return { 
        background: generatePatternSVG(backgroundConfig.pattern!),
        backgroundSize: `${backgroundConfig.pattern!.scale}%`
      }
    
    default:
      return {}
  }
}
```

**Gradient CSS Generation:**
```typescript
const buildGradientCSS = (gradient: Block['backgroundConfig']['gradient']) => {
  const stops = gradient.stops
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  
  switch (gradient.type) {
    case 'linear':
      return `linear-gradient(${gradient.angle}deg, ${stops})`
    case 'radial':
      return `radial-gradient(circle, ${stops})`
    case 'conic':
      return `conic-gradient(from ${gradient.angle}deg, ${stops})`
  }
}
```

### 7. Preset Data

**Create `src/lib/backgrounds.ts`:**

```typescript
export const presetGradients = [
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
  // ... 7 more presets
]

export const presetPatterns = [
  {
    id: 'dots',
    name: 'Dots',
    svgPattern: '...'
  },
  // ... 11 more patterns
]
```

### 8. Implementation Phases

#### Phase 1: Data Model & Types
- [ ] Update `src/types/builder.ts` with `backgroundConfig` interface
- [ ] Update Zustand store with new actions
- [ ] Create `src/lib/backgrounds.ts` with presets

#### Phase 2: Color Editor
- [ ] Create `BackgroundSection.tsx` with type selector
- [ ] Create `ColorEditor.tsx` with color picker
- [ ] Integrate into BlockEditor.tsx (replace old Background section)
- [ ] Test color functionality

#### Phase 3: Gradient Editor
- [ ] Create `GradientEditor.tsx` with full functionality
- [ ] Implement gradient CSS generation
- [ ] Add preset gradients
- [ ] Test gradient on canvas

#### Phase 4: Pattern Editor
- [ ] Create `PatternEditor.tsx` with pattern library
- [ ] Generate SVG pattern data
- [ ] Add pattern controls (opacity, scale, rotation)
- [ ] Test pattern rendering

#### Phase 5: Polish & Testing
- [ ] Real-time preview in all editors
- [ ] Mobile responsiveness testing
- [ ] Keyboard navigation (Tab, Enter)
- [ ] Accessibility (ARIA labels, contrast)
- [ ] Error handling & edge cases

---

## Implementation Guidelines

### Code Quality Standards
1. **Type Safety**: No `any` types; strict TypeScript
2. **Component Separation**: Each editor is its own file
3. **State Management**: Use Zustand actions (avoid local useState for persistence)
4. **Styling**: Hybrid approach
   - Inline styles for user-customizable values (backgroundColor, backgroundImage)
   - Tailwind classes for UI structure only
5. **Naming**: Descriptive, consistent with existing patterns
   - `BackgroundSection`, `ColorEditor`, `GradientEditor`, `PatternEditor`

### Compatibility
- Works with existing block types: heading, paragraph, image, link
- Doesn't break existing functionality (Theme, Micro-interactions, Typography)
- Maintains localStorage persistence (Zustand handles this)

### Performance
- Debounce gradient/pattern updates during dragging
- Memoize gradient CSS generation to avoid recalculation
- Use CSS containment for background preview (`contain: layout`)

### Accessibility
- All inputs have labels with `htmlFor` attributes
- Color inputs have accessible contrast checks
- Slider controls have min/max/step attributes
- ARIA labels for icon buttons (e.g., "Add color stop")

---

## Testing Checklist

- [ ] Solid color picker works on all block types
- [ ] Text auto-adjusts color for contrast
- [ ] Gradient type selector changes UI correctly
- [ ] Gradient stops can be added/removed/modified
- [ ] Gradient preview updates in real-time
- [ ] Angle slider affects linear gradients
- [ ] Pattern selector displays all patterns
- [ ] Pattern opacity/scale/rotation controls work
- [ ] Background persists after saving and reloading
- [ ] Mobile layout is responsive
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Preview thumbnail displays correctly
- [ ] Can switch between background types
- [ ] "None" option clears background
- [ ] Works with undo/redo

---

## Success Criteria

1. ✅ Users can select solid colors for block backgrounds
2. ✅ Users can create and customize gradients (linear, radial, conic)
3. ✅ Users can apply and customize patterns
4. ✅ Real-time preview of changes
5. ✅ Seamless integration with existing BlockEditor
6. ✅ Proper data persistence (localStorage + database)
7. ✅ Accessible and mobile-responsive
8. ✅ No breaking changes to existing features

---

## Additional Notes

### Integration Points
- **BlockEditor.tsx**: Replace Background section (lines ~680-699)
- **builderStore.ts**: Add `updateBlockBackground`, `applyPresetGradient`, `applyPresetPattern` actions
- **BlockRenderer.tsx**: Use background styles when rendering blocks
- **types/builder.ts**: Extend Block interface with `backgroundConfig`

### Future Enhancements
- Image backgrounds (allow user upload)
- Animated gradients
- Custom SVG pattern uploads
- Gradient animation presets
- Background parallax effects
- Preset library editor (save custom gradients/patterns)

### Dependencies Required
- `lucide-react`: Icons (already installed)
- `shadcn/ui`: Components (already installed)
- No additional npm packages needed

---

## File Structure
```
src/
  components/builder/
    BackgroundSection.tsx         # Main background section component
    ColorEditor.tsx               # Solid color picker
    GradientEditor.tsx            # Gradient builder
    PatternEditor.tsx             # Pattern selector & customizer
    BlockEditor.tsx               # (Modified to use BackgroundSection)
  
  lib/
    backgrounds.ts                # Preset gradients and patterns
    gradientUtils.ts              # CSS generation utilities
  
  types/
    builder.ts                    # (Updated with backgroundConfig)
  
  store/
    builderStore.ts               # (Updated with new actions)
```

---

## Questions for Clarification

Before starting, confirm:
1. Should patterns be CSS-based (gradients) or SVG?
2. Should gradients support 3+ color stops or just 2?
3. How many preset gradients/patterns? (Suggested: 6-8 each)
4. Should background affect all block types equally?
5. Should there be a "Lock Background" feature like Theme/Interactions?

---

## Contact & Support

For questions during implementation:
- Refer to existing code patterns in `BlockEditor.tsx`
- Check `builderStore.ts` for Zustand action patterns
- Review TypeScript types in `src/types/builder.ts`
- Test with actual blocks in the builder before finalizing

Good luck! 🚀