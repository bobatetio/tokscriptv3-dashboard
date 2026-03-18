# Handoff — Chrome Extension Install Modal

## Status: DONE

## What Was Done
Created a Chrome Extension install modal that replaces raw `window.open()` calls. Mounted once in AppLayout via context provider (same pattern as NewTranscriptModal).

## Files Created (2)

### `src/app/context/ChromeExtensionModalContext.tsx` — NEW
Minimal context with `isOpen`/`open`/`close` + `useExtensionModal()` hook.

### `src/app/components/ChromeExtensionModal.tsx` — NEW
Modal matching NewTranscriptModal shell: blurred backdrop, maxWidth 680, rounded-2xl, same shadows. Content: centered header, two-column card (browser mockup left + 3 numbered steps right), teal CTA "Add to Chrome — it's free", browser compat pills. Escape key + scroll lock + backdrop click to close.

## Files Modified (4)

### `src/app/App.tsx`
Wrapped AppLayout with `ChromeExtensionModalProvider`, mounted `<ChromeExtensionModal />` alongside `<NewTranscriptModal />`.

### `src/app/components/AppHeader.tsx`
Replaced `window.open(webstore)` with `useExtensionModal().open()`.

### `src/app/components/FreeResultPage.tsx`
Same — replaced `window.open(webstore)` with `useExtensionModal().open()`.

### `src/app/components/LandingPage.tsx`
Wired dead "Add to Chrome" button in ChromeExtensionSection with `onClick={openExtModal}`.

## Verified
- vite build passes (zero errors)
- Dashboard: "Install Chrome Extension" → modal opens
- FreeResultPage: "Install Extension" → modal opens
- LandingPage: "Add to Chrome" button wired (code verified)
- Escape key closes modal
- Dark mode: all theme tokens switch correctly
- Modal matches NewTranscriptModal visual language (same sizing, backdrop, shadows)
