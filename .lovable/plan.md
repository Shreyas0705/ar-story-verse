

# Headset Mode: Gaze-Select with Center Reticle and Dwell Timer

## Overview
Add a "Headset Mode" toggle to the AR Preview page (`/ar-preview`) that replaces touch/click interaction with gaze-based selection. A center-screen reticle acts as a cursor; when it hovers over an interactive element for a configurable dwell time (~1.5s), that element is "clicked."

## What Changes

### 1. New Hook: `src/hooks/useGazeSelect.ts`
- Manages headset mode state (on/off)
- Renders a fixed center reticle (crosshair circle) via CSS
- Uses `document.elementFromPoint(centerX, centerY)` on a polling interval (~100ms) to detect which interactive element is under the reticle
- Tracks dwell time on the current element; when threshold (~1.5s) is reached, triggers a synthetic `click()`
- Shows a circular progress indicator around the reticle filling up during dwell
- Resets timer when the gazed element changes

### 2. New Component: `src/components/ar/GazeReticle.tsx`
- Fixed-position overlay at screen center (pointer-events: none)
- Animated ring that fills as dwell timer progresses (SVG circle with `stroke-dashoffset` animation)
- Subtle pulse animation when idle, solid fill animation during dwell
- Shows the name/label of the currently gazed element

### 3. Update: `src/pages/ARPreview.tsx`
- Add a "Headset Mode" toggle (Switch component) in the top control bar next to the Back button
- When enabled:
  - Mount `<GazeReticle />` overlay
  - Add `data-gaze-target` and `data-gaze-label` attributes to all interactive buttons (play, pause, next, prev, narrate, scene dots, zoom controls)
  - Hide the drag-to-position bar (not usable in headset mode)
  - Auto-center the story card and lock position
- When disabled: remove reticle, restore normal touch/drag interaction

### 4. Update: `src/pages/AR.tsx` (A-Frame AR page)
- Add the same Headset Mode toggle in the top control bar
- Tag existing buttons with `data-gaze-target` attributes
- Mount `<GazeReticle />` when enabled

## Technical Details

**Gaze detection approach**: Pure DOM-based using `document.elementFromPoint()` at the viewport center. No WebXR or external library needed — works with any device that can display the page (phone in cardboard, browser, etc.).

**Dwell timer UX**: 
- SVG ring (radius ~24px) with `stroke-dasharray` animated over 1.5s
- Element highlight: gazed button gets a `ring-2 ring-primary` outline via a dynamically toggled class
- Audio tick (optional small beep via Web Audio API) on successful selection

**Performance**: polling at 100ms intervals is lightweight; cleanup on unmount.

## Files to Create/Modify
| File | Action |
|------|--------|
| `src/hooks/useGazeSelect.ts` | Create |
| `src/components/ar/GazeReticle.tsx` | Create |
| `src/pages/ARPreview.tsx` | Modify — add toggle + gaze attributes |
| `src/pages/AR.tsx` | Modify — add toggle + gaze attributes |

