# agent-profile — Mission

## Task
Replace `ProfileBulkBar` component with shared `SelectionBar` component in `CreatorProfilePage.tsx`.

## Files Modified
- `src/app/components/CreatorProfilePage.tsx`

## Status: DONE

## Changes Made
1. **Added imports** (lines 31-32): `SelectionBar` from `./SelectionBar` and `simulateCoverDownload`, `simulateZipDownload` from `./videos/downloadUtils`.
2. **Deleted `ProfileBulkBar`** function definition (was lines 1092-1148, ~57 lines removed).
3. **Updated render site**: Replaced `<ProfileBulkBar ...>` with `<SelectionBar ...>` with real download handlers using `filteredVideos`, `simulateZipDownload`, and `simulateCoverDownload`. Added `onDownloadData` and `onDownloadAll` handlers.
4. **`Image` from lucide-react kept**: Still used at lines 645 and 1002 — not removed from imports.
5. **Verified**: 0 references to `ProfileBulkBar` remain. `filteredVideos` has 10 usages confirming it exists in scope.
