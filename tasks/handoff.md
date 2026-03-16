# Handoff — Force Dark-Mode Styling on Thumbnail Platform Badges

## Status: DONE

## What was done
Hardcoded dark-mode styling (`rgba(255,255,255,0.06)` bg, `rgba(255,255,255,0.6)` text, `rgba(255,255,255,0.1)` border) on all `VideoPlatformBadge`/`PlatformBadge` components that render on thumbnail overlays. Content-area badges (FolderPage table rows, CreatorProfile list rows, CreatorProfile header) keep their `isDark` conditionals.

## Files Modified
1. `src/app/components/VideosPage.tsx` — `VideoPlatformBadge`: removed isDark prop, hardcoded dark styling, updated 1 call site
2. `src/app/components/DashboardPage.tsx` — `VideoPlatformBadge`: removed isDark prop, hardcoded dark styling, updated 3 call sites
3. `src/app/components/DiscoverPage.tsx` — `PlatformBadge`: removed isDark prop, hardcoded dark styling, updated 2 call sites
4. `src/app/components/CreatorProfilePage.tsx` — `VideoPlatformBadge`: removed isDark, hardcoded dark styling, updated grid call site; list row switched from `VideoPlatformBadge` → `PlatformBadge` (content-area badge with isDark)
5. `src/app/components/videos/VideoResultsPage.tsx` — `PlatformBadge`: removed isDark prop, hardcoded dark styling, updated 2 call sites

## Build: clean
## Verification: Screenshots confirm dark translucent badges on thumbnails in light mode across Videos, Discover pages
