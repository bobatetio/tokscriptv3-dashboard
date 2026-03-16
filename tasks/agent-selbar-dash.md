# Agent: selbar-dash
## Mission
Add `onSelectPage` and `totalPageCount` props to existing `<SelectionBar>` usages in:
1. DashboardPage.tsx — Singles SelectionBar (~line 2042)
2. DashboardPage.tsx — Groups SelectionBar (~line 2967)
3. CreatorProfilePage.tsx — SelectionBar (~line 2015)

## Status: DONE

## Files Modified
- `/Users/michaelsanchez/Downloads/tokscriptv3/src/app/components/DashboardPage.tsx`
- `/Users/michaelsanchez/Downloads/tokscriptv3/src/app/components/CreatorProfilePage.tsx`

## Changes Made

### DashboardPage.tsx — Singles SelectionBar
Added to `<SelectionBar>` (view.category === 'singles' block):
- `onSelectPage`: selects all IDs from `items` array using `setSinglesSelectedIds`
- `totalPageCount`: `items.length`
- Items variable confirmed as `items` (used in GroupStatCards and the grid below)

### DashboardPage.tsx — Groups SelectionBar
Added to `<SelectionBar>` (collections/bulk + groupId block):
- `onSelectPage`: selects all IDs from `items` array using `setGroupSelectedIds`
- `totalPageCount`: `items.length`
- Items variable confirmed as `items` (used in `GroupStatCards videos={items as VideoItem[]}` at line 2956)

### CreatorProfilePage.tsx — SelectionBar
Added to `<SelectionBar>` (selectedIds.size > 0 block):
- `onSelectPage`: selects all IDs from `filteredVideos` using `setSelectedIds`
- `totalPageCount`: `filteredVideos.length`
- Variable confirmed as `filteredVideos` (used in all download handlers in same block)

## Build Verification
`npx vite build` — PASSED. Clean compile, 1676 modules transformed, no TypeScript errors.

## Learnings
None — props were straightforward optional additions; `items` is the correct variable name in both DashboardPage SelectionBar contexts.
