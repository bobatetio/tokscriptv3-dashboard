# Handoff: Always-On Checkbox Selection (Remove Toggle Mode)

## Status: DONE

## Changes Made
All 3 files modified in parallel by agents:

### 1. `src/app/components/VideosPage.tsx`
- Removed `selectionMode` state + `setSelectionMode` calls
- Removed Select pill + Select All from filter bar
- VideoCard: checkbox always visible, play icon always visible on hover, card click always opens detail
- VideoCardList: same pattern
- Floating bar gate: `selectedIds.size > 0`
- Removed `Square`/`CheckSquare` imports

### 2. `src/app/components/DashboardPage.tsx`
- Removed `singlesSelectionMode` + `groupSelectionMode` states
- Removed Select pill + Select All from both Singles and Collections/Bulks filter bars
- Singles grid: checkbox always visible, play icon always visible, card click always opens slide
- Collections/Bulks grid: same pattern
- Floating bar gates: `singlesSelectedIds.size > 0` / `groupSelectedIds.size > 0`
- Removed `Square`/`CheckSquare` imports

### 3. `src/app/components/CreatorProfilePage.tsx`
- Removed `selectionMode` state + `setSelectionMode` calls
- Removed Select pill + Select All from filter bar
- VideoCard: checkbox always visible, play icon always visible, card click always opens detail
- Floating bar gate: `selectedIds.size > 0`
- Removed `Square`/`CheckSquare` imports

## Verification
- `vite build` — clean, 0 errors
- Screenshots verified: Singles, Collection detail, Profile detail, Videos — all show always-on checkboxes, no Select pill
