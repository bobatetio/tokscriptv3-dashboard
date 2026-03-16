# LEARNING.md — Project-Specific Knowledge

## User Preferences
- When the user explicitly confirms keeping a UI element, NEVER remove it in implementation. If the plan says "remove" but user says "keep," the user wins.
- Modals must be sized to fit ALL content without internal scrollbars. The Retranslate dropdown must open fully visible inside the modal — no nested scroll containers.

## Architecture
- `DashboardPage.tsx` is the largest component file (~3500+ lines after modal extraction).
- The New Transcript modal was extracted to `src/app/components/NewTranscriptModal.tsx` with global context at `src/app/context/NewTranscriptContext.tsx`. It's accessible from ANY page via `useNewTranscript().open()`.
- `App.tsx` uses a layout route (`AppLayout`) wrapping all routes with `NewTranscriptProvider` + `NewTranscriptModal` — the modal renders alongside `<Outlet />` inside the router tree so `useNavigate` works.
- `AppSidebar` uses `useNewTranscript()` directly — no more `onNewTranscript` prop needed.
- `LANGUAGES`, `MAX_LINKS`, `isValidUrl`, `InputTab`, `INPUT_TABS`, `TAB_PLATFORMS`, `TAB_STEPS`, `TAB_HOW_DESC` all live in `NewTranscriptModal.tsx` now.
- Vite handles TypeScript transforms; no standalone `tsc` devDep. Use `vite build` to verify.
- `VIDEOS_DATA` lives in `src/app/components/videos/videoData.ts` (re-exported from `VideosPage.tsx` for backwards compat). Do NOT import it from `VideosPage.tsx` in sibling `videos/` files — creates a circular dependency that silently breaks the SPA at runtime.
- `NewTranscriptContext` now also holds `pendingVideoLinks`, `setPendingVideoLinks`, `videoSessions`, `addVideoSession` for the video download workflow. Also holds `initialTab` so `open('profiles')` can open the modal to a specific tab.
- The Profiles tab in NewTranscriptModal has a wizard flow: scanning → scanDone → **preview** (mock profile card) → configure (date range + download types) → finalScan → scanDone → navigate to CreatorProfilePage with `justScanned` + `scanConfig` in location state.
- `generateMockProfile(handle, platform)` creates deterministic fake data from a handle hash. `formatCount(n)` formats large numbers (1.2M, 542K).
- `formatRelativeTime(date)` in CreatorProfilePage formats dates as "just now", "Xm ago", "Xh ago", "Xd ago".
- `ScanNewProfileModal` was removed from ProfilesPage — the CTA card now calls `useNewTranscript().open('profiles')` instead.
- Video download utilities (`simulateVideoDownload`, `simulateCoverDownload`, `simulateZipDownload`) are in `src/app/components/videos/downloadUtils.ts`.

## Grid Layout
- All video card grids use simple `repeat(auto-fill, minmax(195px, 1fr))` (or 200px for collection folders). The 6-column cap comes from a `max-w-[1280px] mx-auto` container on the page content, NOT from a CSS calc formula. At 1280px, `auto-fill` with 195px min naturally gives 6 columns.
- CreatorProfilePage has `max-w-[1280px] mx-auto` wrappers on 4 areas: header body, filter bar, platform stats row, and grid scroll area. Outer divs keep backgrounds/borders/overflow, inner divs constrain content width.
- `SessionDetailView.tsx` also has a video grid that must stay in sync with the same `minmax(195px, 1fr)` pattern.

## JSX / esbuild
- Multi-line JSX ternary chains using `? (` and `) : (` in deeply nested JSX can cause esbuild parse errors. Pre-compute values into variables before the JSX, then reference them inline.

## Patterns
- Filter bars use mutual-exclusion dropdown pattern: `openDropdown === 'name'` to close others when one opens.
- Retranslate dropdown in the old code had hardcoded `bg-white border-gray-200` — must use theme-aware colors (`isDark` conditional).
- The `PromptCategory` type is `Exclude<PromptCategory, 'All'>` — adding new categories requires updating CATEGORY_IMAGES, CATEGORY_COLORS, and CATEGORY_ICONS Records for TypeScript exhaustiveness.
- Singles Sort dropdown was migrated from `showSortMenu` to `openSinglesDropdown === 'sort'` for consistency.
- `AppHeader` takes `sidebarCollapsed` prop in addition to `onToggleSidebar` — both required for the standard page layout pattern (ProfilesPage, VideosPage, etc.).
- When using useState initializers that reference other variables, ensure the variable is declared BEFORE the useState call. `const` is not hoisted — initializers using `handle` must come after `handle` is declared, or compute the value inline (e.g. `creator.startsWith('@') ? creator : \`@${creator}\``).

## Design / Color Rules
- NEVER use teal (#00b8b2) as a primary accent color in components that belong to a different tab context. Each tab has its own color: Transcripts=#00b8b2, Videos=#3b82f6, Collections=#8b5cf6, Profiles=#f59e0b. Use the tab's own color for accents in that tab's UI.
- Active state pills: use subtle tint background (e.g. `rgba(color, 0.15)`) with colored text — NOT solid fill with white text. Match the ScanWizardModal pattern in CreatorProfilePage.
- Inactive state pills/buttons: `#f3f4f6` background in light mode, `rgba(255,255,255,0.05)` in dark.
- Borders: always use the `border` token variable — never colored borders on inactive elements.
- After a CTA action (like "Start Scanning"), ALWAYS show a progress/loading phase before navigating away. Never jump immediately.
