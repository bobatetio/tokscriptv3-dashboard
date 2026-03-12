# LEARNING.md — Project-Specific Knowledge

## User Preferences
- When the user explicitly confirms keeping a UI element, NEVER remove it in implementation. If the plan says "remove" but user says "keep," the user wins.
- Modals must be sized to fit ALL content without internal scrollbars. The Retranslate dropdown must open fully visible inside the modal — no nested scroll containers.

## Architecture
- `DashboardPage.tsx` is the largest component file (~3900+ lines). The `InlineNewTranscriptionView` component lives inside it (starts ~line 297).
- The modal shell for New Transcript is at ~line 3835-3850 — overlay + dialog box + close button. The `InlineNewTranscriptionView` renders inside it.
- The modal dialog uses `max-w-2xl` and `max-h-[90vh]` with `overflow-y-auto` — this constrains height and causes nested scrollbars if content is too tall.
- `LANGUAGES`, `MAX_LINKS`, `isValidUrl` are defined OUTSIDE `InlineNewTranscriptionView` (~lines 286-294) — shared utilities, do not delete.
- Vite handles TypeScript transforms; no standalone `tsc` devDep. Use `vite build` to verify.

## Patterns
- Filter bars use mutual-exclusion dropdown pattern: `openDropdown === 'name'` to close others when one opens.
- Retranslate dropdown in the old code had hardcoded `bg-white border-gray-200` — must use theme-aware colors (`isDark` conditional).
- The `PromptCategory` type is `Exclude<PromptCategory, 'All'>` — adding new categories requires updating CATEGORY_IMAGES, CATEGORY_COLORS, and CATEGORY_ICONS Records for TypeScript exhaustiveness.
- Singles Sort dropdown was migrated from `showSortMenu` to `openSinglesDropdown === 'sort'` for consistency.
