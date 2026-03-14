# Agent: videos

## Mission
Replace `BulkSelectionBar` with shared `SelectionBar` component in `VideosPage.tsx`.

## Assigned Files
- `src/app/components/VideosPage.tsx`

## Status
DONE

## Changes Made
- `src/app/components/VideosPage.tsx`:
  - Added `import { SelectionBar } from './SelectionBar';` after the downloadUtils import (line 23)
  - Deleted entire `BulkSelectionBar` function definition (was lines 476-529)
  - Updated render site to use `<SelectionBar>` with `selectedCount`, `isDark`, `accentColor="#00b8b2"`, `onDeselect`, `onDownloadVideos`, `onDownloadCovers`, `onDownloadTranscripts`, `onDownloadData`, `onDownloadAll` props
  - Verified zero remaining references to `BulkSelectionBar`
