## Always Do First

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Start the dev server IMMEDIATELY after plan approval, before writing any code.** This is step zero. If the server is not running, you cannot see what you're building. Confirm it's live with `curl` before doing anything else. If it dies mid-session, restart it before continuing. No exceptions.

## Mandatory Build-Verify Loop

After completing each meaningful section or component (a hero section, a nav bar, a pricing grid, a footer, etc.), you MUST:

1. **Screenshot** — `node screenshot.mjs http://localhost:3000` (or the relevant route)
2. **Read the screenshot** — Use the Read tool to look at the PNG. Actually evaluate what you built.
3. **Compare** — Against the reference image (if one exists) or against the design intent. Be specific about what matches and what doesn't.
4. **Fix problems before moving on** — If something is off, fix it now. Do not leave broken sections behind and plan to "come back to it."

Only after the section looks correct do you move to the next one.

**This applies to agents too.** Any agent doing frontend work MUST follow this loop. Include it in their briefing.

### What "blind building" looks like (DO NOT DO THIS):

- Building an entire page without ever starting the server
- Finishing multiple sections without a single screenshot
- Claiming something "should look correct" without actually looking at it
- Writing "I'll verify at the end" — verify as you go, section by section
- Reporting a task as DONE without a final full-page screenshot

## Reference Images

- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Screenshot Workflow

### Setup (if not already present)

- If `screenshot.mjs` does not exist in the project root, create it using Playwright with these requirements:
    - Takes two args: URL (required), label (optional)
    - Saves to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten)
    - If label is provided, saves as `screenshot-N-label.png`
    - Uses Playwright chromium, 1440x900 viewport, full-page capture
    - Creates the `temporary screenshots/` directory if it doesn't exist
    - If `temporary screenshots/` is not in `.gitignore`, add it

### Usage

- Always screenshot from localhost: `node screenshot.mjs http://localhost:3000`
- Optional label suffix: `node screenshot.mjs http://localhost:3000/about-us hero`
- `screenshot.mjs` lives in the project root. Use it as-is once created.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool. Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.

## Output Defaults

- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets

- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not report a task as complete without a final full-page screenshot proving it works
- Do not write frontend code while the dev server is not running
