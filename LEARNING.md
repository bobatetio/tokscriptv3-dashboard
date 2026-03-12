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

## Patterns
- Filter bars use mutual-exclusion dropdown pattern: `openDropdown === 'name'` to close others when one opens.
- Retranslate dropdown in the old code had hardcoded `bg-white border-gray-200` — must use theme-aware colors (`isDark` conditional).
- The `PromptCategory` type is `Exclude<PromptCategory, 'All'>` — adding new categories requires updating CATEGORY_IMAGES, CATEGORY_COLORS, and CATEGORY_ICONS Records for TypeScript exhaustiveness.
- Singles Sort dropdown was migrated from `showSortMenu` to `openSinglesDropdown === 'sort'` for consistency.
