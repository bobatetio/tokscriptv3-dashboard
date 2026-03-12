1. Fix Social Platform Icons Conflicting with Heart/Folder Icons on Profile Cards

Current behavior: Each profile card shows social platform icons (TikTok, YouTube, Instagram) indicating which platforms have saved content for that creator. These icons sit too close to the heart (favorite) and folder icons in the top-right corner. When the creator's username is long, the platform icons push into the heart/folder area. With 3 platform icons (the maximum), they'd directly overlap the heart button.

Requested change: Relocate the social platform icons so they don't conflict with the heart and folder actions. They need to be separated visually so neither set of icons is compromised.

Possible solutions: Move the platform icons to a different position on the card (below the username, bottom of the card, etc.). The exact placement is flexible as long as it doesn't collide with the action icons regardless of username length.

Acceptance criteria:

Platform icons never overlap or crowd the heart/folder icons, even with long usernames

Layout holds with 1, 2, or 3 platform icons (the max)

Both platform icons and action icons remain clearly visible and tappable

2. Add Platform Filter Tabs (All, TikTok, Instagram, YouTube)

Current behavior: There's a dropdown selector for filtering by platform. It works but isn't immediately obvious to users.

Requested change: Replace or supplement the dropdown with visible tab-style filters: All (default), TikTok, Instagram, YouTube. Place them between the search bar and the video grid, making them immediately visible and clickable.

Rationale: The dropdown is too hidden. Users need to see at a glance that they can filter by platform. Tabs make this self-evident.

Acceptance criteria:

Four visible tabs: All (default), TikTok, Instagram, YouTube

Clicking a tab filters the videos below to that platform only

"All" shows everything (default state)

Tabs are placed prominently between the search area and the video grid

3. Show Platform Stats When Filtering by Platform

Current behavior: When selecting a platform filter, the page just shows the filtered videos with no summary context.

Requested change: When a platform tab is selected (e.g., TikTok), show a summary stat row in the space between the tabs/search area and the video grid. Display metrics like: number of videos for that platform, total words transcribed, etc.

Example: Selecting TikTok shows "8 videos, 12,450 words transcribed" in a clean, concise row above the grid.

Acceptance criteria:

Stats row appears when a specific platform tab is selected

Shows relevant metrics (video count, words transcribed, or similar)

Clean, concise presentation that doesn't add clutter

Stats update when switching between platform tabs

4. Show More Videos Per Page (Fill the Grid)

Current behavior: Page 1 of a profile's videos shows only 6 items with visible empty space, even though pagination shows 2 pages.

Requested change: Fill out the grid so there's no wasted space. Show enough videos to fill the available viewport. Maintain consistent spacing that matches the rest of the platform (Discover, Singles, etc.).

Acceptance criteria:

Video grid fills the available space without large empty gaps

Consistent card spacing that matches other sections of the platform

Pagination still functions for overflow

5. Add Social Platform Icons to Individual Video Cards Within Profiles

Current behavior: When inside a profile viewing their videos, the individual video cards don't show which platform each video came from. The Discover section does show platform icons on video cards, but Profiles doesn't.

Requested change: Add platform icons (TikTok, Instagram, YouTube) to individual video cards within the Profiles view, matching how they appear in the Discover section.

Acceptance criteria:

Each video card within a profile shows its source platform icon

Consistent with how platform icons appear on Discover video cards

6. Fix Broken Sidebar Pop-Out on Profile Video Click

Current behavior: When clicking an individual video within a profile, the sidebar pop-out that appears looks broken. It doesn't match the consistent pop-out component used elsewhere (Discover, Singles, Collections).

Requested change: Use the exact same sidebar pop-out component that's used across the rest of the platform. Every time a user clicks an individual video anywhere in the logged-in experience and it sideloads, it should be the same component with the same layout, tabs, and behavior.

This includes all the fixes from previous issues:

Copy/Retranslate button repositioning

Caption tab fix

Transcript clean text (no division lines)

Remove "Video Title Analysis"

"About the Creator" restyle (match TokScribe)

Fix double @@ username

4 prompt cards in Prompts sub-tab

Prompt navigation stays inside the pop-out

Acceptance criteria:

Sidebar pop-out in Profiles uses the same shared component as Discover, Singles, Collections, and Bulks

All previously documented pop-out fixes apply here

Consistent experience regardless of where the user clicks a video