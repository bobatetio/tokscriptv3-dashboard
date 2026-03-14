# Handoff — Unify Selection Bars with 5 Download Options

## Status: DONE

## Changes Made

### New file
- `src/app/components/SelectionBar.tsx` — Shared selection bar with 5 hollow buttons (Videos, Covers, Transcripts, Data, Download All), accent-colored count label, sticky positioning

### Modified files
1. **DashboardPage.tsx** — Removed `DashboardBulkBar`, imported `SelectionBar` + download utils, updated 2 render sites (singles + collections/bulk) with `accentColor="#00b8b2"`
2. **VideosPage.tsx** — Removed `BulkSelectionBar`, imported `SelectionBar`, updated 1 render site with `accentColor="#00b8b2"`, wired real download handlers using VIDEOS_DATA
3. **CreatorProfilePage.tsx** — Removed `ProfileBulkBar`, imported `SelectionBar` + download utils, updated 1 render site with `accentColor="#f59e0b"`, wired real download handlers using filteredVideos

## Verification
- `vite build` — clean compile
- Dev server running, pages load correctly
- All 5 buttons appear in all bars, all hollow by default
