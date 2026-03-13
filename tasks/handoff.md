# Handoff — Redesign Download Buttons as Dashboard-Style Cards

## Status: DONE

## File Modified
- `src/app/components/videos/VideoResultsPage.tsx` (lines 401-458)

## What Changed
- Replaced pill buttons with dashboard-style card shell (same border, padding, rounded-lg, transparent bg, hover as DashboardPage stat cards)
- Row 1: icon + label in muted (Download + "Videos" / ImageDown + "Covers")
- Row 2: "Download All" or "Download {N}" as bold action text (0.875rem, fontWeight 600)
- Row 3: "{N} selected" or "{N} of {total}" in teal (0.6875rem, fontWeight 500)
- Both cards: `minWidth: 150`, `px-4 pt-3 pb-3`, `1px solid border`, transparent bg
- Hover: `rgba(255,255,255,0.04)` dark / `rgba(0,0,0,0.025)` light — same as dashboard

## Verification
- Build: `vite build` clean (0 errors)
- Screenshot comparison: cards match dashboard stat card structure with action-appropriate content
