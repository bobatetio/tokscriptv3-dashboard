2. Show More Videos in Recently Scanned Transcripts Grid

Current behavior: The Discover page shows one full row and a partial second row (only 2 items) in the recently scanned transcripts section.

Requested change: Populate at least 3-4 full rows so the page feels complete and filled out. The current sparse layout makes the page look empty.

Acceptance criteria:

At least 3-4 fully populated rows of recently scanned transcripts on the Discover page

No partial rows with large empty gaps

Content should fill the available horizontal space per row

3. Add Pagination Controls with "Show Per Page" Options

Current behavior: No pagination controls or "show per page" selector.

Requested change: Add pagination with a "show per page" selector. Default to 30, with options for 50 and 100. Users can page through results.

Acceptance criteria:

Pagination controls at the bottom of the Discover grid

"Show per page" selector with options: 30 (default), 50, 100

Page navigation (next/previous or numbered pages)

Applies to the default grid view on the Discover page

4. Clean Up the Third View (Note-Style Layout)

Current behavior: The third view option (note-style layout) has alignment issues on the left side. The sidebar for scrolling through videos has a large gap/whitespace and feels too wide. When expanding a video to see transcript, caption, analytics, and prompts, the content area feels stretched out beyond what's necessary.

Requested change:

Fix left-side alignment issues in the note-style view

Slim down the sidebar (the video list column): it doesn't need to be as wide as it currently is

Tighten up the expanded video detail area so it matches the proportions and alignment of other views. Keep it clean without unnecessary stretching.

Acceptance criteria:

Left-side content is properly aligned

Sidebar (video list) is narrower and more compact

Expanded video detail area uses space proportionally without feeling stretched

Overall layout matches the polish level of the other two view options

5. Reposition Copy & Retranslate Buttons on Transcript/Caption Tabs

Current behavior: In the transcript detail pop-out, the Copy and Retranslate buttons are positioned at the far right of the header row. When a user is reading the transcript (content is centered/left), their eye focus is on the text body, but the actions are far away at the opposite edge.

Requested change: Move Copy and Retranslate buttons so they sit directly above the transcript text (or directly underneath the Transcript/Caption tab selector), on the left side. The actions should feel visually connected to the content they operate on.

This applies to both the Transcript tab and the Caption tab. Wherever the user is reading content, the copy/retranslate actions should be nearby, not at the far right edge.

Acceptance criteria:

Copy and Retranslate buttons are positioned above the transcript/caption text area, left-aligned

Buttons feel visually connected to the content they act on

Consistent placement across both Transcript and Caption tabs

No buttons stranded at the far right of the header

6. Fix Caption Tab Content (Showing Timestamps Instead of Caption)

Current behavior: The Caption tab is displaying timestamped transcript divisions instead of the actual video caption.

Requested change: Fix so the Caption tab shows the actual video caption content, not a timestamped/divided version of the transcript.

Acceptance criteria:

Caption tab displays the correct caption content

No timestamp divisions in the caption view

7. Remove Division Lines from Transcript Tab

Current behavior: The Transcript tab text appears to have division/separator lines (similar to what's showing in the Caption tab).

Requested change: Display transcript as normal, clean text with no division lines. Division lines will confuse users.

Acceptance criteria:

Transcript tab shows plain, continuous text

No horizontal division lines or timestamp separators in the transcript view

8. Remove "Video Title Analysis" from Analytics Tab

Current behavior: The Analytics tab includes a "Video Title Analysis" section.

Problem: Short-form videos on TikTok, Reels, and Shorts don't have traditional video titles. This section has no real data source and isn't useful. It appears to be synthesizing a summary, but it's not something users will interact with.

Requested change: Remove the "Video Title Analysis" section from the Analytics tab entirely.

Acceptance criteria:

"Video Title Analysis" section is removed from the Analytics tab

Remaining analytics content (most common words, etc.) stays as-is

9. Fix "About the Creator" Section Styling

Current behavior: The "About the Creator" section in the transcript detail view feels cramped, boxy, and like an afterthought. There's a divider bar between "About the Creator" and "More From Them" that adds visual clutter. The creator has double @ symbols and displays two usernames (should be display name + username).

Reference: TokScribe's version of this section looks cleaner, more polished, and more visually enticing. We should emulate their layout.

Requested changes:

Restyle the "About the Creator" section to match TokScribe's cleaner layout

Fix the double @ symbol issue: show display name + @username (one of each)

Remove or soften the hard divider between "About the Creator" and "More From Them"

Give the section more breathing room so it doesn't feel smashed together in a square box

Acceptance criteria:

Creator section looks polished, not like an afterthought

Display name and @username shown correctly (no double @@)

Layout matches TokScribe's style for this section

Visual flow between "About the Creator" and "More From Them" feels natural

10. Show 4 Prompt Cards in Prompts Sub-Tab (Fill Blank Space)

Current behavior: The Prompts sub-tab within the transcript detail pop-out shows a small number of prompt cards with blank space below, especially on larger screens.

Requested change: Show at least 4 prompt cards by default to fill the available space. Cards should use the same image/header card style as the Prompt Base page (the small visual cards with category imagery).

Acceptance criteria:

At least 4 prompt cards displayed in the Prompts sub-tab

Cards use the same image header style as Prompt Base cards (smaller version)

Minimal blank space on standard and larger screen sizes

11. Keep Prompt Navigation Inside the Detail Pop-Out (Don't Navigate Away)

Current behavior: When a user clicks a prompt from the Prompts sub-tab within the transcript detail pop-out, it navigates them away to the Prompt Base page for that specific prompt. This pulls them completely out of the Discover context and they lose their place (especially painful if they were 200+ videos deep in a list).

Requested change: When clicking a prompt from the Prompts sub-tab, load the prompt detail view INSIDE the existing pop-out panel. Do not navigate away from the current page.

Implementation options (simplest preferred):

Load a compact version of the prompt detail view within the Prompts sub-tab area of the pop-out

Include a back button or breadcrumb so users can return to the video they were viewing

Skip the "Must Try Prompts" sidebar; just show the main prompt content area (the prompt text, copy/download actions)

Rationale: We want to cross-pollinate users between features, but not at the cost of losing their place. If someone is deep in Discover browsing and clicks a prompt, yanking them to a completely different page is frustrating. They won't remember where they were and they'll get annoyed.

Acceptance criteria:

Clicking a prompt from the Prompts sub-tab loads the prompt detail within the pop-out panel

User can navigate back to the video they were viewing

No full-page navigation away from Discover

Prompt detail shows the core content (prompt text, copy, download) without the full Prompt Base sidebar

12. Fix Scrollbar Color in Light Mode (Global)

Current behavior: Same issue as noted in the Prompt Base issue. The scrollbar in light mode uses a dark color that doesn't match the light theme. Dark mode scrollbar looks fine.

Note: This was already logged in the Prompt Base issue but applies globally. Flagging again here since it's especially noticeable when scrolling through Discover content.

Acceptance criteria:

Light mode scrollbar matches the light theme across the entire platform

Dark mode scrollbar unchanged