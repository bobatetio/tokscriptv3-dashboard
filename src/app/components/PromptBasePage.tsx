import React, { useState, useContext, useRef, useCallback } from 'react';
import {
  Search, Copy, CheckCheck, BookOpen, Zap, BarChart2,
  RefreshCw, FileText, MessageSquare, Layers, ChevronDown,
  X, TrendingUp, FolderPlus, Download, Heart, Play, Eye, Star,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import ReactDOM from 'react-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext } from '../context/FolderContext';
import { UserContext, FREE_LIMITS } from '../context/UserContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { SaveToFolderModal } from './SaveToFolderModal';

// ─── Prompt data ──────────────────────────────────────────────────────────────
type PromptCategory = 'All' | 'Featured' | 'Hooks' | 'Repurpose' | 'Analysis' | 'Script' | 'Summary' | 'Engagement' | 'SEO';

export interface Prompt {
  id: number;
  title: string;
  description: string;
  category: Exclude<PromptCategory, 'All'>;
  tags: string[];
  prompt: string;
  featured?: boolean;
  uses: number;
}

export const PROMPTS: Prompt[] = [
  {
    id: 1, category: 'Hooks', featured: true, uses: 8420,
    title: 'Viral Hook Generator',
    description: 'Turn your transcript into 5 scroll-stopping opening hooks that grab attention in the first 3 seconds.',
    tags: ['TikTok', 'Reels', 'Viral'],
    prompt: `You are a world-class viral content strategist with deep expertise in short-form video psychology, scroll-stopping copywriting, and platform-specific audience behaviour. Your task is to analyse the transcript below and generate 5 powerful, distinct opening hooks.\n\nWHAT MAKES A GREAT HOOK:\n- Creates an instant pattern interrupt — the viewer was on autopilot and you snapped them out of it\n- Opens a loop the viewer desperately wants to close (curiosity gap)\n- Makes a bold, specific, or counter-intuitive claim they haven't heard before\n- Speaks directly to a pain, desire, or identity the target viewer holds\n- Works in the first 1–3 seconds before the brain decides to scroll\n\nHOOK FRAMEWORKS TO USE (use a different one for each hook):\n1. The Bold Claim — State something surprising or counter-intuitive as absolute fact\n2. The Curiosity Gap — Tease information they don't have yet; make them need the answer\n3. The Relatable Problem — Open with a pain point they've definitely felt\n4. The Transformation Tease — Show the "after" without explaining the "how" yet\n5. The Contrarian Take — Directly challenge a widely-held belief your audience holds\n\nSTRICT OUTPUT FORMAT:\nFor each of the 5 hooks, provide:\n\nHook [N] — [Framework Name]\n[The hook text — max 2 sentences, max 30 words total]\nWhy it works: [1 sentence explaining the psychological trigger being activated]\n\nQUALITY RULES:\n- No filler openers like "In today's video..." or "Welcome back..."\n- No setup — start with the hook itself, not context about the video\n- Speak in first person or direct second person ("you")\n- Write for spoken delivery, not for reading — use short, punchy sentences\n- Each hook must feel completely different from the others in tone and structure\n- The viewer must feel something in the first 3 words: curiosity, recognition, or mild surprise\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 3, category: 'Summary', featured: true, uses: 11300,
    title: 'Executive Summary',
    description: 'Condense any transcript into a crisp 3-paragraph summary with key takeaways.',
    tags: ['Summary', 'Productivity'],
    prompt: `You are a senior communications consultant who specialises in distilling complex content into clear, executive-ready briefings. Your task is to produce a professional five-section executive summary from the transcript below.\n\nSECTION 1 — CONTEXT & BACKGROUND (3–4 sentences)\nWho is speaking, on what topic, and why it matters now. Establish the setting, the speaker's authority or perspective, and the core problem or opportunity being addressed.\n\nSECTION 2 — CORE ARGUMENT (3–4 sentences)\nThe central thesis or position being argued. Include the main evidence, examples, or reasoning used to support it. This should be understandable by someone who has never seen the original content.\n\nSECTION 3 — KEY INSIGHTS (bullet list, exactly 5 points)\nThe 5 most important ideas, data points, or conclusions from the transcript. Each bullet should be a complete, standalone sentence. Lead with the insight — no preamble, no "The speaker says...".\n\nSECTION 4 — RISKS & OPEN QUESTIONS (bullet list, 3 points)\nWhat was left unresolved, what assumptions were made that could be challenged, and what follow-up questions a decision-maker should ask before acting on this content.\n\nSECTION 5 — RECOMMENDED NEXT STEPS (bullet list, 3–5 points)\nConcrete, actionable steps that a reader should take based on the content. Each step should have an implied owner and time horizon where possible.\n\nWRITING STYLE:\n- Plain, professional English — no jargon, no buzzwords\n- Active voice throughout — passive voice weakens authority\n- Never start a bullet with "The" or "A" — lead with a verb or a strong noun\n- Total word count target: 350–450 words\n- Do not quote the transcript directly — paraphrase and synthesise\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 4, category: 'Script', featured: true, uses: 4890,
    title: 'Rewrite for Virality',
    description: 'Restructure and punch up a transcript so it flows better for short-form video.',
    tags: ['TikTok', 'Short-form', 'Edit'],
    prompt: `You are a short-form video editor and scriptwriter whose work has achieved 10M+ views. Your task is to take the raw transcript below and rewrite it into a tight, high-retention short-form video script.\n\nRETENTION PSYCHOLOGY:\n- The first 3 seconds determine whether someone watches or scrolls\n- Viewers drop off when they sense dead air, filler, or loss of momentum\n- Every sentence should either deliver value, create curiosity, or push the narrative forward\n- "Loops" (unresolved questions or teases) keep viewers watching — open them early, close them late\n- Pattern interrupts reset attention every 15–20 seconds\n\nREWRITING RULES:\n1. Front-load the single best insight, moment, or claim — it becomes the new opening\n2. Cut ruthlessly: um, uh, like, you know, sort of, basically, right?, I mean, you see\n3. Remove all filler intros: "Hey guys", "Welcome back", "So today we're going to..."\n4. Replace every passive construction with active voice\n5. Break long sentences into two short punchy ones\n6. Keep total script to 60–90 seconds at natural speech speed (~150 wpm = 150–225 words max)\n7. Mark [LOOP OPEN] where you create a question or tease\n8. Mark [LOOP CLOSE] where you pay it off\n9. End with a single punchy CTA sentence — not a paragraph\n\nOUTPUT FORMAT:\n\n[HOOK — first 3 seconds]\n[Hook text]\n\n[BODY — core content]\n[Body text with loop labels inline]\n\n[CLOSE — final 5 seconds]\n[CTA text]\n\n──────────────────────────────\nWORD COUNT: [X words / approx Y seconds]\nCUTS MADE: [Brief list of what was removed and why]\nMAIN LOOP: [What question/tease you opened and where you closed it]\n──────────────────────────────\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 5, category: 'Analysis', featured: false, uses: 3210,
    title: 'Virality Score & Breakdown',
    description: 'Get a detailed analysis of why a video did (or did not) go viral.',
    tags: ['Analytics', 'Strategy'],
    prompt: `Analyse the following video transcript and score it on a scale of 1–10 for virality potential. Break down your reasoning across: Hook strength, Emotional resonance, Shareability, Clarity of message, and Call-to-action. Provide 3 specific improvements.\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 6, category: 'Engagement', featured: true, uses: 5540,
    title: 'Comment Bait Questions',
    description: 'Generate 10 engagement-driving questions to pin as a comment or use in a caption.',
    tags: ['Comments', 'Engagement', 'Community'],
    prompt: `You are a community growth specialist who understands the psychology of online engagement. Your task is to generate 10 comment-bait questions from the transcript below — questions that trigger high comment volume, debate, and emotional response.\n\nWHAT MAKES A QUESTION GET COMMENTS:\n- It has no single "correct" answer — opinions genuinely differ\n- It makes the reader reflect on their own experience\n- It contains a mild element of controversy or friendly debate\n- It's short enough to answer quickly (lowers the barrier to reply)\n- It touches an identity, belief, or aspiration the viewer holds\n\nTHE 10 QUESTIONS MUST COVER THESE 5 TYPES (2 of each):\n\nTYPE 1 — OPINION SPLIT\nQuestions where reasonable people strongly disagree.\nFormat: "Which side are you on: [A] or [B]?"\n\nTYPE 2 — PERSONAL EXPERIENCE\nQuestions that prompt people to share a relevant story.\nFormat: "Have you ever [experience related to transcript topic]?"\n\nTYPE 3 — CONTRARIAN CHALLENGE\nQuestions that challenge a claim or belief from the transcript.\nFormat: "Hot take: is [claim from transcript] actually [counterpoint]?"\n\nTYPE 4 — PREDICTION / FUTURE STATE\nQuestions about where things are heading.\nFormat: "By [year], do you think [trend from transcript] will [X or Y]?"\n\nTYPE 5 — QUICK-FIRE SINGLE WORD\nUltra-low-friction questions answered in one word.\nFormat: "[Topic from transcript] in one word — go."\n\nOUTPUT FORMAT:\nFor each question, write:\n\nQ[N] — [Type Name]\n[The question — max 15 words]\nBest used as: [Caption / Pinned comment / Story poll / Community post]\n\nFINAL NOTE:\nAfter the 10 questions, add a "Top 3 Pick" — the 3 you predict will get the most comments, and one sentence on why each will perform.\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 7, category: 'Repurpose', featured: false, uses: 2980,
    title: 'Email Newsletter Section',
    description: 'Extract the key insight from a video and write it as a newsletter insert.',
    tags: ['Email', 'Newsletter', 'Content'],
    prompt: `Write a newsletter section based on the following transcript. Format:\n- A bold one-line headline\n- 2 short paragraphs covering the core insight\n- A "3 Quick Takeaways" bullet list\n- A two-sentence CTA linking back to the video\n\nTone: smart, conversational, slightly opinionated.\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 8, category: 'SEO', featured: true, uses: 4100,
    title: 'YouTube SEO Description',
    description: 'Write a keyword-rich YouTube description with timestamps and CTAs.',
    tags: ['YouTube', 'SEO', 'Description'],
    prompt: `You are a YouTube SEO specialist with deep expertise in video discoverability, click-through rate optimisation, and channel growth strategy. Your task is to write a complete, algorithm-optimised YouTube video description based on the transcript below.\n\nYOUTUBE DESCRIPTION ANATOMY:\n- Lines 1–2 are visible before "Show more" — must hook the click AND include the primary keyword\n- Lines 3–10 tell YouTube's algorithm what this video is about (keyword density matters here)\n- Timestamps increase average view duration by helping viewers navigate\n- Hashtags at the bottom help with topic categorisation\n\nYOUR OUTPUT MUST INCLUDE ALL 7 SECTIONS IN THIS ORDER:\n\nSECTION 1 — HOOK PARAGRAPH (shown before "Show more")\n2 sentences max. Must include the primary keyword in sentence 1. Must create enough curiosity or promise enough value that someone clicks "Show more".\n\nSECTION 2 — WHAT YOU'LL LEARN (bullet list, 5–7 points)\nStart each bullet with an action verb. Be specific — not "tips for X" but "How to do X in Y minutes". Weave in secondary keywords naturally.\n\nSECTION 3 — WHO THIS IS FOR (1 short paragraph)\nName the ideal viewer in plain terms. This helps YouTube match the video to the right audience segments.\n\nSECTION 4 — TIMESTAMPS\nGenerate logical chapter timestamps based on the transcript flow. Format:\n00:00 Intro\n[MM:SS] [Chapter title — keyword-rich, max 50 chars]\nMinimum 5 chapters. Final chapter should be a CTA, summary, or "What's Next".\n\nSECTION 5 — CTA BLOCK (3 CTAs)\n🔔 Subscribe CTA (1 sentence, mention the notification bell)\n💬 Comment CTA (ask a specific, answerable question from the content)\n🔗 Related video CTA (placeholder: "Watch this next: [RELATED VIDEO LINK]")\n\nSECTION 6 — ABOUT THIS CHANNEL (2 sentences)\nGeneric boilerplate the creator can customise. Should include at least one keyword.\n\nSECTION 7 — HASHTAGS (5 tags, bottom of description)\nMix: 1 broad + 3 mid-tail + 1 niche. Format: #keyword (no spaces).\n\nSEO NOTES (append at end for creator reference):\nPrimary keyword identified: [derive from transcript]\nSecondary keywords: [list 4]\nLSI / semantic terms: [list 3]\nSearch snippet potential: [High / Medium / Low + 1 sentence reason]\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 9, category: 'Hooks', featured: false, uses: 3760,
    title: 'Pattern-Interrupt Openers',
    description: "Create unexpected, counter-intuitive openers that disrupt a viewer's autopilot.",
    tags: ['Hooks', 'Creative', 'Pattern Interrupt'],
    prompt: `Using the content in this transcript, write 5 "pattern-interrupt" video openers. Each must subvert a common assumption or lead with a surprising statement that contradicts conventional wisdom. Max 25 words each.\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 10, category: 'Script', featured: false, uses: 2340,
    title: 'Talking-Head Script',
    description: 'Reformat a raw transcript into a polished talking-head camera script with delivery notes.',
    tags: ['Script', 'Delivery', 'Camera'],
    prompt: `Reformat the following raw transcript into a professional talking-head camera script. Add:\n- [PAUSE] markers for dramatic effect\n- [EMPHASIS] on key phrases\n- Stage directions in brackets\n- Clean punctuation for natural spoken delivery\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 11, category: 'Analysis', featured: false, uses: 1890,
    title: 'Competitor Content Audit',
    description: "Analyse a competitor's video transcript for content gaps and opportunities.",
    tags: ['Competitive', 'Research', 'Strategy'],
    prompt: `Analyse this video transcript as if it belongs to a competitor. Identify:\n1. Their core content angle\n2. Topics they cover well\n3. Gaps and missed opportunities\n4. The emotion they trigger in viewers\n5. How you could create a better version of this video\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 12, category: 'Engagement', featured: false, uses: 3020,
    title: 'Caption Pack (5 Styles)',
    description: 'Generate 5 captions in different tones: witty, emotional, direct, storytelling, and cliffhanger.',
    tags: ['Captions', 'Social', 'Multi-format'],
    prompt: `Using the transcript below, write 5 social media captions (max 150 characters each) in these styles:\n1. Witty / humorous\n2. Emotional / personal\n3. Direct / bold claim\n4. Mini-story (beginning cut off)\n5. Cliffhanger (ends mid-thought)\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 13, category: 'SEO', featured: false, uses: 2650,
    title: 'Blog Post from Transcript',
    description: 'Expand a short video transcript into a full SEO-optimised blog post.',
    tags: ['Blog', 'Long-form', 'SEO'],
    prompt: `Expand the following transcript into a 600-word blog post. Structure:\n- Compelling H1 title\n- Intro paragraph with a hook\n- 3 body sections with H2 subheadings\n- Conclusion with a CTA\n- Suggest 5 SEO meta keywords\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 14, category: 'Summary', featured: true, uses: 4430,
    title: 'TLDR Tweet',
    description: 'Compress a full transcript down to a single tweet-length summary.',
    tags: ['Short', 'Summary'],
    prompt: `You are a master of distillation — a copywriter who can compress complex ideas into a single sentence without losing their power. Your task is to write 3 TLDR tweet variations from the transcript below, then recommend the strongest one.\n\nTHE SCIENCE OF A GREAT TLDR TWEET:\n- It must be standalone — someone with zero context must understand AND be intrigued\n- It captures ONE insight, not many — dilution kills impact\n- It should feel slightly surprising — if it's obvious, it won't get retweeted\n- Under 240 characters (leave room for replies and quote-tweets)\n- No hashtags — they look like spam and kill organic reach\n- The best TLDRs make the reader feel smart for sharing them\n\nWRITE 3 VARIATIONS:\n\nVARIATION 1 — DIRECT INSIGHT\nThe core idea stated as plainly and powerfully as possible.\nBest for: Professional audiences, thought leadership, quoted tweet responses.\nFormat: State the insight as a fact or hard-won lesson.\n\nVARIATION 2 — CONTRARIAN ANGLE\nThe most counter-intuitive or unexpected conclusion from the transcript.\nBest for: Viral short-form content, debate, high engagement.\nFormat: Challenge a widely-held assumption with evidence from the content.\n\nVARIATION 3 — STORY COMPRESSION\nThe key narrative arc of the transcript boiled down to one sentence.\nBest for: Emotional resonance, shares, saves.\nFormat: "[BEFORE] → [WHAT CHANGED] → [RESULT/LESSON]" in one punchy sentence.\n\nOUTPUT FORMAT:\nFor each variation:\n\nVARIATION [N] — [Type Name]\n"[Tweet text — max 240 characters]"\nCharacter count: [X/240]\nEngagement prediction: [What type of response this is likely to drive]\n\n──────────────────────────────\nRECOMMENDATION: Variation [N]\nWhy: [2 sentences explaining the choice for this specific content]\n──────────────────────────────\n\nTHREAD SEED:\nIf Variation [N] got traction and you wanted to thread out from it, what would be the 3 most natural follow-up points to expand into a thread?\n\nTranscript:\n[TRANSCRIPT]`,
  },
  {
    id: 15, category: 'Repurpose', featured: false, uses: 1760,
    title: 'Podcast Show Notes',
    description: 'Turn a video or audio transcript into fully formatted podcast show notes.',
    tags: ['Podcast', 'Show Notes', 'Audio'],
    prompt: `Using the transcript below, write professional podcast show notes. Include:\n- Episode title suggestion\n- 3-sentence episode description\n- Key topics covered (bullet list)\n- Notable quotes (pull 3)\n- Resources/links section (placeholder)\n\nTranscript:\n[TRANSCRIPT]`,
  },
  { id: 16, category: 'Hooks', featured: false, uses: 3410, title: 'Cold Open Generator', description: 'Drop viewers straight into the action — 3 cold-open scripts that skip the intro and start mid-scene.', tags: ['Cold Open', 'Short-form', 'Retention'], prompt: `Using the transcript below, write 3 "cold open" video scripts. Each cold open must:\n- Drop the viewer mid-action (no intro, no context)\n- Use present tense, active voice\n- End on a cliffhanger that demands they keep watching\n- Be max 3 sentences\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 18, category: 'Analysis', featured: false, uses: 2140, title: 'Audience Persona Builder', description: 'Identify exactly who this content is for — demographics, desires, and objections.', tags: ['Research', 'Persona', 'Strategy'], prompt: `Based on the transcript below, define the ideal viewer persona:\n\n**Who they are**: (age range, job, lifestyle)\n**What they want**: (3 core desires)\n**What they fear**: (3 core objections)\n**Why this content resonates**: (2-3 sentences)\n**How to reach more like them**: (3 specific tactics)\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 19, category: 'Script', featured: false, uses: 1890, title: 'Tutorial Step-by-Step Script', description: 'Reformat a transcript into a numbered tutorial script with clear steps and transitions.', tags: ['Tutorial', 'How-to', 'Script'], prompt: `Reformat the transcript into a tutorial script:\n1. Title card suggestion\n2. One-sentence hook ("By the end of this, you'll know how to...")\n3. Numbered steps (action verb + what to do + why it matters)\n4. Common mistakes to avoid (3 bullets)\n5. Closing summary + CTA\n\nWrite for someone doing this for the first time.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 20, category: 'Summary', featured: true, uses: 6890, title: 'Action Items Extractor', description: 'Pull every explicit and implied action item from a transcript into a clean task list.', tags: ['Productivity', 'Tasks', 'Meeting'], prompt: `You are a professional executive assistant and project manager who has mastered turning messy meeting recordings and video transcripts into crisp, accountable task lists. Your task is to extract every action item from the transcript below — both explicit ones that were stated directly, and implied ones that any reasonable person in the conversation would understand are needed.\n\nHOW TO IDENTIFY ACTION ITEMS:\nEXPLICIT: Directly stated — "We need to...", "Can you...", "I'll handle...", "Let's make sure..."\nIMPLIED: Logical next steps that weren't stated but are obviously required for the discussed goal\nBLOCKED: Actions mentioned but unable to proceed without a dependency or decision first\nRECURRING: Actions that appear to be ongoing or need to happen on a regular schedule\n\nYOUR OUTPUT MUST CONTAIN 5 SECTIONS:\n\nSECTION 1 — IMMEDIATE ACTIONS (This week)\nTasks that need to happen within 7 days based on urgency or dependency chain.\nFormat for each:\n☐ [TASK — specific and actionable] — Owner: [Name if mentioned / "TBD"] — Due: [Date if mentioned / "ASAP"]\nSource: [Direct quote or "Implied from discussion of X"]\n\nSECTION 2 — SHORT-TERM ACTIONS (This month)\nTasks with a 2–4 week horizon. Same format as Section 1.\n\nSECTION 3 — BLOCKED ITEMS (Waiting on a decision or dependency)\nFormat:\n⏸ [TASK] — Blocked by: [What needs to happen first] — Owner once unblocked: [Name / TBD]\n\nSECTION 4 — DECISIONS REQUIRED (Before progress can continue)\nList every decision that was discussed but not resolved.\nFormat:\n? [DECISION NEEDED] — Decision-maker: [Name / TBD] — Deadline implication: [What breaks if not decided]\n\nSECTION 5 — SUMMARY STATS\nTotal action items identified: [N]\nOwners named: [N] / [N total items] — [X%]\nItems with clear deadlines: [N] / [N total items]\nRisk flag: [Yes/No — are there critical path items without owners?]\nRecommended next step: [1 sentence — what should happen in the next 24 hours]\n\nQUALITY CHECKS:\n- Do not create vague actions like "discuss further" — be specific about what needs to happen\n- If ownership is genuinely unclear, write "TBD (flag for clarification)" — never guess\n- Flag anything that sounds like a commitment but was said casually without acknowledgment\n- Where deadlines aren't stated, infer reasonable urgency from context and flag as [estimated]\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 21, category: 'Engagement', featured: false, uses: 4230, title: 'Poll & Quiz Generator', description: 'Generate 5 polls and a 5-question quiz from any transcript for stories, posts, or community tabs.', tags: ['Polls', 'Quiz', 'Interactive'], prompt: `From the transcript, generate:\n\n**5 Polls** (binary or 4-option, suitable for Instagram or TikTok stories)\n\n**5-Question Multiple Choice Quiz** (with correct answers)\n\nEach should tie directly to a claim or moment in the transcript. Keep options under 30 characters.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 22, category: 'SEO', featured: false, uses: 3760, title: 'Meta Tags Pack', description: 'Generate a complete SEO meta-tag set: title, description, keywords, and OG tags.', tags: ['SEO', 'Meta', 'Technical'], prompt: `Using the transcript, generate:\n\n**Page Title** (55-60 chars, front-load keyword)\n**Meta Description** (150-160 chars, include CTA)\n**Focus Keyword** (single phrase, 2-4 words)\n**Secondary Keywords** (5 supporting phrases)\n**OG Title** (social share headline)\n**OG Description** (social share blurb, max 125 chars)\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 23, category: 'Hooks', featured: false, uses: 2870, title: 'Curiosity Loop Opener', description: 'Open a video by creating an information gap — tease the answer without ever giving it away.', tags: ['Curiosity', 'Retention', 'Hooks'], prompt: `Write 5 "curiosity loop" video openers based on the transcript. Each opener must:\n- Create an information gap (the viewer doesn't have the answer yet)\n- Reference something specific from the transcript\n- Avoid clickbait — the payoff must actually exist in the content\n- Be max 2 sentences\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 24, category: 'Repurpose', featured: false, uses: 4110, title: 'Instagram Carousel (10 slides)', description: 'Turn a transcript into a swipe-worthy 10-slide Instagram carousel with slide-by-slide copy.', tags: ['Instagram', 'Carousel', 'Visual'], prompt: `Convert the transcript into a 10-slide Instagram carousel. For each slide provide:\n- **Slide headline** (max 8 words, bold claim or question)\n- **Body copy** (2-3 sentences max)\n- **Design note** (background colour suggestion or image type)\n\nSlide 1 = hook, Slide 10 = CTA + save prompt.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 25, category: 'Analysis', featured: false, uses: 1650, title: 'Key Quotes Extractor', description: 'Pull the 10 most quotable, share-worthy moments from any transcript.', tags: ['Quotes', 'Snippets', 'Repurpose'], prompt: `Extract the 10 most shareable quotes from the transcript. For each:\n- Present the quote exactly as spoken (cleaned of filler words)\n- Add a 1-sentence context note explaining why it lands\n- Rate its shareability: High / Medium / Low and one sentence why\n\nPrioritise bold claims, counter-intuitive ideas, and emotionally resonant moments.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 26, category: 'Script', featured: false, uses: 2310, title: 'Voiceover Script Cleaner', description: 'Remove all filler words, false starts, and spoken tics to produce a clean voiceover script.', tags: ['Voiceover', 'Audio', 'Clean'], prompt: `Clean the following transcript into a professional voiceover script:\n- Remove: um, uh, like, you know, sort of, kind of, basically, literally, right?\n- Remove: false starts, repeated phrases, tangents\n- Fix: run-on sentences, unclear pronoun references\n- Preserve: the speaker's authentic voice and all key points\n\nOutput the clean script only.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 27, category: 'Summary', featured: false, uses: 3180, title: 'Slack Message Format', description: 'Compress a full meeting or interview transcript into a Slack-ready summary anyone can skim in 30 seconds.', tags: ['Slack', 'Teams', 'Internal'], prompt: `Summarise the transcript as a Slack message. Format:\n\n:memo: *[Meeting/Video Title — Date]*\n\n*TL;DR:* (1 sentence)\n\n*Key decisions:*\n• ...\n\n*Action items:*\n• @[owner] — [task] by [date if mentioned]\n\n*Next steps:*\n• ...\n\nKeep it under 200 words.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 28, category: 'Engagement', featured: false, uses: 2890, title: 'Community Challenge Brief', description: 'Design a 7-day engagement challenge inspired by the transcript topic, with daily prompts.', tags: ['Community', 'Challenge', 'Retention'], prompt: `Based on the transcript, design a 7-day community challenge. For each day provide:\n- Challenge name\n- Daily prompt (1-2 sentences, action-focused)\n- Content hook (what people should post/share)\n- Engagement mechanic (tag, comment, DM, etc.)\n\nAlso write: the challenge headline (max 8 words) and a 2-sentence launch post.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 29, category: 'SEO', featured: true, uses: 4440, title: 'Video Chapter Timestamps', description: 'Generate chapter titles and timestamps to boost YouTube search discoverability and watch time.', tags: ['YouTube', 'Chapters', 'Timestamps'], prompt: `You are a YouTube SEO and viewer retention specialist who understands both algorithmic optimisation and the psychology of how viewers navigate long-form video content. Your task is to generate a complete, optimised set of chapter timestamps from the transcript below.\n\nWHY CHAPTERS MATTER:\n- Chapters appear as visual markers in the YouTube progress bar, increasing scrub click-through\n- YouTube uses chapter titles as additional text signals for search indexing\n- Well-named chapters improve "search within video" discoverability on Google\n- Chapters appearing in search results as "Key Moments" dramatically increase impressions\n- Viewers are more likely to share a video if they can send someone to a specific section\n\nCHAPTER CREATION RULES:\n\nSTRUCTURE:\n- Minimum: 5 chapters | Maximum: 12 chapters\n- First chapter must always start at 00:00 (titled "Intro" or a hook-style opening)\n- Last chapter should be a CTA, summary, or "What's Next" — never just "Outro"\n- Chapters must reflect genuine topic shifts, not arbitrary time splits\n\nTITLE FORMAT:\n- Max 50 characters per title (YouTube displays ~50 chars in most views)\n- Front-load the keyword — most important word first\n- Use search-friendly language: "How to..." / "Why..." / "The real reason..."\n- Avoid generic titles: "Part 1", "Middle Section", "More stuff"\n- Each title must make sense completely out of context (for search and snippet visibility)\n\nSEO OPTIMISATION:\n- Identify the primary keyword from the transcript\n- Include that keyword or a close variant in at least 2 chapter titles\n- Include at least 1 chapter title phrased as a question (triggers "People also ask")\n- Include at least 1 chapter title starting with a number ("3 ways to..." / "5 mistakes...")\n\nOUTPUT FORMAT:\n\n──────────────────────────────\nCHAPTER TIMESTAMPS\n──────────────────────────────\n00:00 [Chapter 1 title]\n[MM:SS] [Chapter 2 title]\n[MM:SS] [Chapter 3 title]\n... (continue for all chapters)\n\n──────────────────────────────\nSEO ANALYSIS\n──────────────────────────────\nPrimary keyword identified: [keyword]\nKeyword used in chapters: [list which chapters]\nQuestion-format chapter: [which one]\nNumber-format chapter: [which one]\nSearch snippet potential: [High / Medium / Low + 1 sentence reason]\nSuggested video title (SEO-optimised rewrite): [title suggestion]\n\n──────────────────────────────\nRETENTION NOTES\n──────────────────────────────\nBiggest potential drop-off point: [MM:SS — and why]\nBest chapter for sharing or clipping: [MM:SS — and why]\nRecommended thumbnail moment: [MM:SS — describe the frame in one sentence]\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 30, category: 'Hooks', featured: false, uses: 1980, title: 'Data-Led Hook', description: 'Extract or construct 5 statistic-led opening hooks that lead with a surprising number.', tags: ['Data', 'Stats', 'Credibility'], prompt: `Using numbers from the transcript, write 5 opening hooks. Format each as:\n[NUMBER/STAT] [SURPRISING IMPLICATION]\n\nIf the transcript lacks hard numbers, construct credible implied stats from the context (clearly label as estimates). Max 20 words each.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 31, category: 'Repurpose', featured: false, uses: 3650, title: 'YouTube Shorts Adaptation', description: 'Identify the single punchiest 60-second moment and write it as a standalone Shorts script.', tags: ['YouTube Shorts', 'Vertical', '60s'], prompt: `Find the single most engaging 60-second segment in this transcript. Then:\n1. Identify the timestamp range (approximate)\n2. Explain why this is the strongest standalone clip\n3. Rewrite it as a tight Shorts script (hook → insight → punchline/CTA)\n4. Add a suggested on-screen text overlay for the hook\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 32, category: 'Analysis', featured: false, uses: 2670, title: 'Content Gap Finder', description: 'Identify what this content missed — topics, objections, and follow-up questions left unanswered.', tags: ['Strategy', 'Gaps', 'Research'], prompt: `Analyse the transcript and identify what was NOT covered:\n\n**Missing context**: What background would a new viewer need?\n**Unaddressed objections**: What would a sceptic ask?\n**Unanswered questions**: What does this raise but not resolve?\n**Follow-up content ideas**: 5 specific video/post ideas this naturally leads to\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 33, category: 'Script', featured: false, uses: 1430, title: 'Debate Script Generator', description: 'Restructure a one-sided transcript into a two-person debate with opposing arguments included.', tags: ['Debate', 'Format', 'Engagement'], prompt: `Rewrite the transcript as a 2-person debate script:\n- Speaker A: argues the position in the original transcript\n- Speaker B: argues the strongest plausible counter-position\n\nFormat as alternating dialogue with at least 3 exchanges. End with both speakers agreeing on one common truth.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 34, category: 'Summary', featured: false, uses: 2010, title: 'Meeting Notes Template', description: 'Convert any transcript into structured meeting notes with agenda, decisions, and next steps.', tags: ['Meeting', 'Notes', 'Productivity'], prompt: `Format the transcript as professional meeting notes:\n\n**Meeting:** [derive from context]\n**Attendees:** [if named]\n\n**Agenda items covered:** ...\n**Key decisions made:** ...\n**Open issues:** ...\n**Action items:**\n| Owner | Task | Due |\n|---|---|---|\n**Next meeting topics:** ...\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 35, category: 'Engagement', featured: false, uses: 1740, title: 'Reaction Video Script', description: 'Write a reaction video script that comments on the original content while adding your perspective.', tags: ['Reaction', 'Commentary', 'Creator'], prompt: `Using the transcript as source material, write a reaction video script:\n1. Quick summary of what you're reacting to (15 seconds)\n2. First reaction moment: quote a key line + your 2-3 sentence take\n3. Repeat for 3-4 more moments\n4. Overall verdict (agree / disagree / nuanced)\n5. Your contrarian hot take\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 36, category: 'SEO', featured: false, uses: 1560, title: 'FAQ Section Generator', description: 'Generate a structured FAQ section from a transcript for use on landing pages or blog posts.', tags: ['FAQ', 'Landing Page', 'SEO'], prompt: `Using the transcript, generate a 10-question FAQ section:\n\n**Q: [Question]**\nA: [2-3 sentence answer, plain language]\n\nInstructions:\n- Questions should match what a first-time viewer would ask\n- Include at least 2 questions a sceptic would ask\n- Answers should be reassuring, not evasive\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 37, category: 'Hooks', featured: false, uses: 2250, title: 'Story Arc Opener', description: 'Write 3 narrative hooks that open with a personal story arc to create instant emotional connection.', tags: ['Storytelling', 'Narrative', 'Emotional'], prompt: `Write 3 "story arc" video openers based on the transcript. Each must follow BEFORE → TURNING POINT → AFTER (tease only):\n\nBefore: (1 sentence — the problem or old world)\nTurning point: (1 sentence — what changed)\nAfter: (1 sentence — tease the outcome, don't reveal it)\n\nUse first-person, past tense. Make it specific.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 38, category: 'Repurpose', featured: false, uses: 2940, title: 'Newsletter Subject Lines', description: 'Generate 10 email subject lines for a newsletter based on the transcript topic.', tags: ['Email', 'Subject Lines', 'Open Rate'], prompt: `Using the transcript, write 10 email newsletter subject lines (2 of each type):\n1. Curiosity gap ("Why ___")\n2. Direct benefit ("How to ___")\n3. Controversial claim ("Most people ___ wrong")\n4. Personal story ("The day I ___")\n5. Number-led ("7 reasons why ___")\n\nAlso suggest an A/B test pair.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 39, category: 'Analysis', featured: false, uses: 1320, title: 'Tone & Style Analyser', description: "Analyse the speaker's tone, vocabulary level, pacing, and brand voice in detail.", tags: ['Brand Voice', 'Tone', 'Style'], prompt: `Analyse the tone and style of the transcript:\n\n**Tone**: (e.g. authoritative, conversational, vulnerable, humorous)\n**Vocabulary level**: (Simple / Intermediate / Expert — with examples)\n**Pacing**: (Fast / Measured / Slow — is it consistent?)\n**Unique phrases or verbal tics**: (list 3-5)\n**Brand voice summary**: (2-sentence description suitable for a brand guide)\n**What to avoid**: (2-3 things that would break this voice)\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 40, category: 'Script', featured: false, uses: 1780, title: 'Pitch Deck Narration', description: 'Convert a talk or presentation transcript into a polished pitch deck narration script.', tags: ['Pitch', 'Presentation', 'Investor'], prompt: `Rewrite the transcript as a pitch deck narration:\n- Slide 1: Problem (30s max)\n- Slide 2: Solution (30s max)\n- Slide 3: Market opportunity (20s)\n- Slide 4: Traction (20s)\n- Slide 5: Ask / CTA (20s)\n\nFor each slide: spoken narration + suggested headline (max 8 words) + one data point or visual suggestion.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 41, category: 'Summary', featured: false, uses: 2780, title: 'One-Liner Distiller', description: 'Boil an entire transcript down to a single, shareable sentence under 25 words.', tags: ['Tagline', 'TL;DR', 'Minimal'], prompt: `Summarise the entire transcript in a single sentence (max 25 words). Must stand alone, capture the most important insight, and be worth sharing.\n\nProvide 3 variations from most direct to most provocative. Then recommend one.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 42, category: 'Engagement', featured: false, uses: 2100, title: 'Countdown Teaser Posts', description: 'Create a 5-day countdown post series to build anticipation before a launch or release.', tags: ['Launch', 'Countdown', 'Hype'], prompt: `Using the transcript as context, write a 5-day countdown post series:\n\nDay 5: Plant the seed (vague tease)\nDay 4: Reveal the problem it solves\nDay 3: Share a behind-the-scenes moment\nDay 2: Drop the biggest benefit\nDay 1: Final CTA with urgency\n\nEach post: max 150 words.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 43, category: 'SEO', featured: false, uses: 2030, title: 'Pinterest Description Pack', description: 'Generate 5 Pinterest pin descriptions optimised for search and repins.', tags: ['Pinterest', 'Visual Search', 'SEO'], prompt: `Using the transcript, write 5 Pinterest pin descriptions. Each must:\n- Be 100-150 words\n- Include 2-3 long-tail keywords naturally embedded\n- Start with an action word or question\n- End with a soft CTA ("Save this for later" / "Click to read more")\n\nAlso suggest 5 board names this content fits.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 44, category: 'Repurpose', featured: false, uses: 1890, title: 'Short-Form Ad Script', description: "Write a 15-second and a 30-second paid ad script based on the transcript's core message.", tags: ['Ads', 'Paid', 'Short-form'], prompt: `Using the core message from the transcript, write:\n\n**15-second ad script:**\nHook (3s) / Problem (4s) / Solution (5s) / CTA (3s)\n\n**30-second ad script:**\nHook (5s) / Problem/Agitation (8s) / Solution/Demo (10s) / Social proof (4s) / CTA (3s)\n\nInclude suggested visuals in [brackets].\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 45, category: 'Analysis', featured: false, uses: 1100, title: 'First-Comment Predictor', description: 'Predict the 10 most likely first comments this content will receive and how to respond.', tags: ['Comments', 'Community', 'Moderation'], prompt: `Based on the transcript, predict the 10 most likely comments. For each:\n- Quote the predicted comment\n- Categorise it: Positive / Sceptical / Hostile / Question\n- Write a suggested creator response (1-2 sentences, authentic tone)\n\nAlso flag claims likely to attract controversy.\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 46, category: 'Script', featured: false, uses: 2440, title: 'Documentary Narration', description: 'Rewrite a raw transcript in the style of a compelling documentary voice-over narration.', tags: ['Documentary', 'Narration', 'Cinematic'], prompt: `Rewrite the transcript in the style of a documentary narration:\n- Third person, past tense\n- Measured, authoritative tone\n- Short sentences for dramatic effect; longer for context\n- Include 2-3 [B-ROLL SUGGESTION] markers with visual descriptions\n- Include a 1-sentence chapter title every ~200 words\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 47, category: 'Engagement', featured: false, uses: 1950, title: 'Gamification Quiz Builder', description: 'Build a 10-question gamified quiz with scoring and result types for community engagement.', tags: ['Quiz', 'Gamification', 'Community'], prompt: `From the transcript, build a 10-question quiz with:\n- 10 multiple-choice questions (4 options each)\n- Scoring: A=3pts, B=2pts, C=1pt, D=0pts\n- 3 result types based on score ranges (with names, descriptions, and a share-worthy sentence)\n- A curiosity-driven quiz title (max 8 words)\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 48, category: 'SEO', featured: false, uses: 1280, title: 'Rich Snippet Schema', description: 'Generate JSON-LD schema markup suggestions for rich snippets based on the content type.', tags: ['Schema', 'Technical SEO', 'Rich Snippets'], prompt: `Based on the transcript content type, suggest appropriate JSON-LD schema markup:\n1. The primary schema type (e.g. Article, HowTo, FAQPage, VideoObject)\n2. A filled-in example schema block with values from the transcript\n3. 2 secondary schema types worth adding\n4. One sentence explaining the expected rich snippet benefit for each\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 49, category: 'Hooks', featured: false, uses: 2600, title: 'Reverse Hook Generator', description: 'Write 5 "reverse hooks" — start with the ending and work backwards to tease the journey.', tags: ['Reverse', 'Narrative', 'Retention'], prompt: `Using the conclusion from the transcript, write 5 "reverse hooks" that start at the ending and work backwards. Each hook must:\n- Open by stating the result/outcome first\n- Then create curiosity about how it was achieved\n- Max 2 sentences\n- Feel natural and conversational, not clickbait\n\nTranscript:\n[TRANSCRIPT]` },
  { id: 50, category: 'Summary', featured: false, uses: 3340, title: 'Decision Log', description: 'Extract every decision made or recommended in a transcript into a structured decision register.', tags: ['Decisions', 'Documentation', 'Strategy'], prompt: `Extract all decisions from the transcript into a decision log:\n\n| # | Decision | Rationale | Owner | Date | Revisit? |\n|---|---|---|---|---|---|\n\nAlso note:\n- Any decisions that seem rushed or under-supported\n- Any pending decisions that were deferred\n- One question that should be asked before finalising each major decision\n\nTranscript:\n[TRANSCRIPT]` },
];

export const CATEGORIES: PromptCategory[] = ['All', 'Featured', 'Hooks', 'Repurpose', 'Analysis', 'Script', 'Summary', 'Engagement', 'SEO'];

export const CATEGORY_IMAGES: Record<Exclude<PromptCategory, 'All'>, string> = {
  Featured:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  Hooks:      'https://images.unsplash.com/photo-1712331676372-2fc48f449c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJhbCUyMGhvb2slMjBzY3JvbGwlMjBzb2NpYWwlMjBtZWRpYXxlbnwxfHx8fDE3NzI3NTQ3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Repurpose:  'https://images.unsplash.com/photo-1607702706617-c1bb25e1d5e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwcmVwdXJwb3NlJTIwbXVsdGklMjBwbGF0Zm9ybSUyMHB1Ymxpc2hpbmd8ZW58MXx8fHwxNzcyNzU0NzExfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Analysis:   'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwY2hhcnQlMjBncmFwaHxlbnwxfHx8fDE3NzI2OTk3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Script:     'https://images.unsplash.com/photo-1571232151946-f7f00c61ade7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHNjcmlwdCUyMHdyaXRpbmclMjBzY3JlZW5wbGF5fGVufDF8fHx8MTc3Mjc1NDcxMXww&ixlib=rb-4.1.0&q=80&w=1080',
  Summary:    'https://images.unsplash.com/photo-1632965053624-eea7c66017de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGRlc2slMjBub3RlYm9vayUyMG1pbmltYWwlMjB3cml0aW5nfGVufDF8fHx8MTc3Mjc1NDcxNHww&ixlib=rb-4.1.0&q=80&w=1080',
  Engagement: 'https://images.unsplash.com/photo-1696041757950-62e2c030283b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBlbmdhZ2VtZW50JTIwY29tbWVudHMlMjBzb2NpYWx8ZW58MXx8fHwxNzcyNzU0NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  SEO:        'https://images.unsplash.com/photo-1674027001860-f9e3a94f4084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTRU8lMjBzZWFyY2glMjBlbmdpbmUlMjBvcHRpbWl6YXRpb24lMjByYW5raW5nfGVufDF8fHx8MTc3Mjc1NDcxMnww&ixlib=rb-4.1.0&q=80&w=1080',
};

export const CATEGORY_COLORS: Record<Exclude<PromptCategory, 'All'>, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Featured:   { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Hooks:      { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Repurpose:  { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Analysis:   { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Script:     { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Summary:    { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  Engagement: { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
  SEO:        { bg: '#f0f0f0', text: '#555555', darkBg: 'rgba(255,255,255,0.06)', darkText: '#888888' },
};

export const CATEGORY_ICONS: Record<Exclude<PromptCategory, 'All'>, React.ReactNode> = {
  Featured:   <Star className="w-3.5 h-3.5" />,
  Hooks:      <Zap className="w-3.5 h-3.5" />,
  Repurpose:  <RefreshCw className="w-3.5 h-3.5" />,
  Analysis:   <BarChart2 className="w-3.5 h-3.5" />,
  Script:     <FileText className="w-3.5 h-3.5" />,
  Summary:    <Layers className="w-3.5 h-3.5" />,
  Engagement: <MessageSquare className="w-3.5 h-3.5" />,
  SEO:        <Search className="w-3.5 h-3.5" />,
};

// ─── Prompt Card ──────────────────────────────────────────────────────────────
function PromptCard({ prompt, isDark, border, text, muted, hoverBg, gated, onGated, onAction, onOpen }: {
  prompt: Prompt; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  gated?: boolean; onGated?: () => void; onAction?: () => void; onOpen?: (p: Prompt) => void;
}) {
  const { getFoldersContaining } = useContext(FolderContext);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [folderModal, setFolderModal] = useState<DOMRect | null>(null);
  const [showDlDropdown, setShowDlDropdown] = useState(false);
  const [dlDone, setDlDone] = useState(false);
  const [favourited, setFavourited] = useState(false);

  const savedCount = getFoldersContaining('prompt', prompt.id).length;

  const guard = (): boolean => {
    if (gated) { onGated?.(); return false; }
    onAction?.();
    return true;
  };

  const handleCopy = () => {
    if (!guard()) return;
    navigator.clipboard.writeText(prompt.prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: 'txt' | 'md' | 'pdf' | 'docx', skipGuard = false) => {
    if (!skipGuard && !guard()) return;
    const slug = prompt.title.toLowerCase().replace(/\s+/g, '-');
    if (format === 'pdf') {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<!DOCTYPE html><html><head><title>${prompt.title}</title><style>body{font-family:sans-serif;max-width:700px;margin:48px auto;color:#111}h1{font-size:1.4rem;margin-bottom:8px}h2{font-size:1rem;margin-top:24px}pre{white-space:pre-wrap;word-break:break-word;font-size:0.85rem;color:#444;background:#f9fafb;padding:16px;border-radius:8px}p{color:#555;font-size:0.9rem}</style></head><body><h1>${prompt.title}</h1><p>${prompt.description}</p><h2>Prompt</h2><pre>${prompt.prompt}</pre></body></html>`);
        win.document.close(); win.focus(); win.print();
      }
    } else if (format === 'docx') {
      const content = `${prompt.title}\n\n${prompt.description}\n\nPrompt\n------\n${prompt.prompt}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${slug}.docx`; a.click(); URL.revokeObjectURL(url);
    } else {
      const content = format === 'md'
        ? `# ${prompt.title}\n\n${prompt.description}\n\n## Prompt\n\n\`\`\`\n${prompt.prompt}\n\`\`\``
        : prompt.prompt;
      const mime = format === 'md' ? 'text/markdown' : 'text/plain';
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${slug}.${format}`; a.click(); URL.revokeObjectURL(url);
    }
    setShowDlDropdown(false); setDlDone(true); setTimeout(() => setDlDone(false), 2000);
  };

  const handleDownloadSkill = () => {
    if (!guard()) return;
    const content = JSON.stringify({ id: prompt.id, title: prompt.title, category: prompt.category, tags: prompt.tags, prompt: prompt.prompt }, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}-skill.json`; a.click(); URL.revokeObjectURL(url);
  };

  const cardBg = isDark ? '#141414' : '#ffffff';

  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden transition-shadow"
      style={{
        background: cardBg,
        border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Category image banner ───────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden flex-shrink-0 cursor-pointer"
        style={{ height: 64 }}
        onClick={() => onOpen?.(prompt)}
      >
        <img
          src={CATEGORY_IMAGES[prompt.category]}
          alt={prompt.category}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Meta row ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {/* Category chip */}
          <span
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] flex-shrink-0"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
              color: isDark ? 'rgba(255,255,255,0.8)' : '#374151',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
              fontWeight: 500,
            }}
          >
            {CATEGORY_ICONS[prompt.category]}
            {prompt.category}
          </span>

        </div>
        {/* Uses + icon actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <span className="text-[11px] mr-1.5" style={{ color: muted, whiteSpace: 'nowrap' }}>
            {(prompt.uses / 1000).toFixed(1)}k uses
          </span>
          <button
            className="w-6 h-6 flex items-center justify-center transition-colors rounded"
            style={{ color: favourited ? '#ef4444' : muted, background: 'transparent', border: 'none' }}
            onClick={e => { e.stopPropagation(); setFavourited(v => !v); }}
            title={favourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center transition-colors rounded"
            style={{ color: savedCount > 0 ? (isDark ? '#ffffff' : '#374151') : muted, background: 'transparent', border: 'none' }}
            onClick={e => { e.stopPropagation(); setFolderModal(e.currentTarget.getBoundingClientRect()); }}
            title="Save to folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div
        className="px-4 pt-1 pb-3 flex flex-col gap-2.5 flex-1 cursor-pointer"
        onClick={() => onOpen?.(prompt)}
      >
        {/* Title */}
        <p style={{ color: text, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.3, margin: 0 }}>
          {prompt.title}
        </p>

        {/* Description */}
        <p style={{ color: muted, fontSize: '0.8125rem', lineHeight: 1.55, margin: 0 }}>
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-lg text-[11px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: muted }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Prompt preview */}
        <div
          className="rounded-xl px-3 py-2.5"
          style={{
            background: isDark ? '#0d0d0d' : '#f9fafb',
            border: `1px solid ${isDark ? '#1e1e1e' : '#efefef'}`,
          }}
          onClick={e => e.stopPropagation()}
        >
          <p
            className="text-[11.5px] whitespace-pre-wrap break-words m-0"
            style={{
              color: isDark ? 'rgba(255,255,255,0.38)' : '#9ca3af',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              maxHeight: expanded ? 280 : 58,
              overflow: 'hidden',
              transition: 'max-height 0.2s ease',
            }}
          >
            {prompt.prompt}
          </p>
          <button
            className="flex items-center gap-1 mt-1.5 text-[11px] hover:opacity-75 transition-opacity"
            style={{ color: '#00b8b2', fontWeight: 500, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
          >
            <span style={{ fontSize: '0.75rem' }}>{expanded ? '↑' : '→'}</span>
            {expanded ? 'Hide prompt' : 'Show full prompt'}
          </button>
        </div>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────── */}
      <div className="px-4 pb-4 flex items-center gap-1.5">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all flex-1 justify-center whitespace-nowrap"
          style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#ffffff', fontWeight: 500, border: `1px solid ${isDark ? '#2a2a2a' : 'transparent'}` }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#222' : '#2a2a2a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111'; }}
        >
          {copied ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Download Skill */}
        <button
          onClick={handleDownloadSkill}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all flex-1 justify-center whitespace-nowrap"
          style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: 500, background: 'transparent', border: `1px solid ${border}` }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <Download className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Download Skill</span>
        </button>

        {/* Download with format dropdown */}
        <div className="relative flex-1">
          <button
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap w-full justify-center"
            style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: 500, background: 'transparent', border: `1px solid ${border}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            onClick={() => { if (gated) { onGated?.(); return; } setShowDlDropdown(v => !v); }}
          >
            {dlDone ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{dlDone ? 'Done!' : 'Download'}</span>
            <ChevronDown className="w-2.5 h-2.5 ml-0.5" style={{ transform: showDlDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
          </button>
          {showDlDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDlDropdown(false)} />
              <div
                className="absolute bottom-full mb-1.5 right-0 rounded-xl overflow-hidden z-20 flex flex-col"
                style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', minWidth: 152 }}
              >
                {[
                  { label: 'Download .txt',  ext: 'txt'  as const },
                  { label: 'Download .md',   ext: 'md'   as const },
                  { label: 'Download .pdf',  ext: 'pdf'  as const },
                  { label: 'Download .docx', ext: 'docx' as const },
                ].map(opt => (
                  <button
                    key={opt.ext}
                    onClick={() => handleDownload(opt.ext, true)}
                    className="flex items-center gap-2 px-3 py-2 text-[11px] text-left transition-colors whitespace-nowrap w-full"
                    style={{ color: isDark ? '#ffffff' : '#111111', background: 'transparent' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <FileText className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {folderModal && (
        <SaveToFolderModal
          type="prompt"
          refId={prompt.id}
          name={prompt.title}
          meta={prompt.category}
          triggerRect={folderModal}
          onClose={() => setFolderModal(null)}
        />
      )}
    </div>
  );
}

// ─── Prompt Detail Panel ──────────────────────────────────────────────────────
function PromptDetailPanel({ prompt, isDark, onClose, gated, onGated, onAction, onSelectPrompt }: {
  prompt: Prompt | null;
  isDark: boolean;
  onClose: () => void;
  gated?: boolean;
  onGated?: () => void;
  onAction?: () => void;
  onSelectPrompt?: (p: Prompt) => void;
}) {
  const { getFoldersContaining } = useContext(FolderContext);
  const [copied, setCopied] = useState(false);
  const [dlDone, setDlDone] = useState(false);
  const [showDlDropdown, setShowDlDropdown] = useState(false);
  const [folderModal, setFolderModal] = useState<DOMRect | null>(null);
  const [favourited, setFavourited] = useState(false);
  const [mustTryTab, setMustTryTab] = useState<'recent' | 'related' | 'viral'>('related');

  const isOpen = !!prompt;
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';

  const savedCount = prompt ? getFoldersContaining('prompt', prompt.id).length : 0;

  const guard = (): boolean => {
    if (gated) { onGated?.(); return false; }
    onAction?.();
    return true;
  };

  const handleCopy = () => {
    if (!prompt || !guard()) return;
    navigator.clipboard.writeText(prompt.prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'md' | 'pdf' | 'docx') => {
    if (!prompt || !guard()) return;
    const slug = prompt.title.toLowerCase().replace(/\s+/g, '-');
    if (format === 'pdf') {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<!DOCTYPE html><html><head><title>${prompt.title}</title><style>body{font-family:sans-serif;max-width:700px;margin:48px auto;color:#111}h1{font-size:1.4rem;margin-bottom:8px}pre{white-space:pre-wrap;word-break:break-word;font-size:0.85rem;color:#444;background:#f9fafb;padding:16px;border-radius:8px}p{color:#555;font-size:0.9rem}</style></head><body><h1>${prompt.title}</h1><p>${prompt.description}</p><h2>Prompt</h2><pre>${prompt.prompt}</pre></body></html>`);
        win.document.close(); win.focus(); win.print();
      }
    } else if (format === 'docx') {
      const content = `${prompt.title}\n\n${prompt.description}\n\nPrompt\n------\n${prompt.prompt}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${slug}.docx`; a.click(); URL.revokeObjectURL(url);
    } else {
      const content = format === 'md'
        ? `# ${prompt.title}\n\n${prompt.description}\n\n## Prompt\n\n\`\`\`\n${prompt.prompt}\n\`\`\``
        : prompt.prompt;
      const mime = format === 'md' ? 'text/markdown' : 'text/plain';
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${slug}.${format}`; a.click(); URL.revokeObjectURL(url);
    }
    setShowDlDropdown(false); setDlDone(true); setTimeout(() => setDlDone(false), 2000);
  };

  const handleDownloadSkill = () => {
    if (!prompt || !guard()) return;
    const content = JSON.stringify({ id: prompt.id, title: prompt.title, category: prompt.category, tags: prompt.tags, prompt: prompt.prompt }, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}-skill.json`; a.click(); URL.revokeObjectURL(url);
  };

  // Reset state when a new prompt opens
  React.useEffect(() => {
    if (prompt) { setCopied(false); setDlDone(false); setShowDlDropdown(false); setFavourited(false); }
  }, [prompt?.id]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.45)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 760,
          background: isDark ? '#111111' : '#ffffff',
          borderLeft: `1px solid ${border}`,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {prompt && (
          <>
            {/* ── Slim header bar ─────────────────────────────────────────── */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-4"
              style={{ height: 48, borderBottom: `1px solid ${border}`, background: isDark ? '#111111' : '#ffffff' }}
            >
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', color: muted, border: `1px solid ${border}`, fontWeight: 500 }}
              >
                {CATEGORY_ICONS[prompt.category]}
                <span className="ml-0.5">{prompt.category}</span>
              </span>
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] mr-1.5" style={{ color: muted }}>{(prompt.uses / 1000).toFixed(1)}k uses</span>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                  style={{ color: favourited ? '#ef4444' : muted, background: 'transparent', border: 'none' }}
                  onClick={() => setFavourited(v => !v)}
                  title={favourited ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                  style={{ color: savedCount > 0 ? text : muted, background: 'transparent', border: 'none' }}
                  onClick={e => setFolderModal(e.currentTarget.getBoundingClientRect())}
                  title="Save to folder"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full ml-1.5 transition-colors"
                  style={{ background: isDark ? '#1e1e1e' : '#f3f4f6', color: muted, border: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#2a2a2a' : '#e5e7eb'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1e1e1e' : '#f3f4f6'; }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Two-column body ─────────────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden min-h-0">

              {/* Left: main content */}
              <div className="flex-1 px-5 py-5 flex flex-col gap-4" style={{ overflow: 'hidden', minHeight: 0 }}>

                {/* Title */}
                <h2 className="flex-shrink-0" style={{ color: text, fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3, margin: 0 }}>
                  {prompt.title}
                </h2>

                {/* Description */}
                <p className="flex-shrink-0" style={{ color: muted, fontSize: '0.8375rem', lineHeight: 1.6, margin: 0 }}>
                  {prompt.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                  {prompt.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[11px]"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: muted, border: `1px solid ${border}` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex-shrink-0" style={{ height: 1, background: border }} />

                {/* PROMPT section — grows to fill remaining space */}
                <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
                  <p className="text-[10px] flex-shrink-0" style={{ color: muted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Prompt
                  </p>
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{ background: isDark ? '#0a0a0a' : '#f9fafb', border: `1px solid ${isDark ? '#1e1e1e' : '#efefef'}`, flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  >
                    <p
                      className="text-[12px] whitespace-pre-wrap break-words m-0"
                      style={{ color: isDark ? 'rgba(255,255,255,0.65)' : '#374151', fontFamily: 'inherit', lineHeight: 1.75, overflowY: 'auto', scrollbarWidth: 'none', flex: 1, minHeight: 0 }}
                    >
                      {prompt.prompt}
                    </p>
                  </div>
                </div>

                {/* Action buttons (inline) */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] transition-all flex-1 justify-center"
                    style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 600, border: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSkill}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all flex-1 justify-center"
                    style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: 500, background: 'transparent', border: `1px solid ${border}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Download className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Download Skill</span>
                  </button>
                  <div className="relative flex-1">
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] transition-all"
                      style={{ color: isDark ? '#d1d5db' : '#374151', fontWeight: 500, background: 'transparent', border: `1px solid ${border}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      onClick={() => { if (gated) { onGated?.(); return; } setShowDlDropdown(v => !v); }}
                    >
                      {dlDone ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span>{dlDone ? 'Done!' : 'Download'}</span>
                      <ChevronDown className="w-2.5 h-2.5 ml-0.5" style={{ transform: showDlDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
                    </button>
                    {showDlDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDlDropdown(false)} />
                        <div
                          className="absolute bottom-full mb-1.5 right-0 rounded-xl overflow-hidden z-20 flex flex-col"
                          style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', minWidth: 152 }}
                        >
                          {([
                            { label: 'Download .txt',  ext: 'txt'  as const },
                            { label: 'Download .md',   ext: 'md'   as const },
                            { label: 'Download .pdf',  ext: 'pdf'  as const },
                            { label: 'Download .docx', ext: 'docx' as const },
                          ] as const).map(opt => (
                            <button
                              key={opt.ext}
                              onClick={() => handleDownload(opt.ext)}
                              className="flex items-center gap-2 px-3 py-2 text-[11px] text-left transition-colors whitespace-nowrap w-full"
                              style={{ color: isDark ? '#ffffff' : '#111111', background: 'transparent' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                              <FileText className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider before How to Use */}
                <div className="flex-shrink-0" style={{ height: 1, background: border }} />

                {/* HOW TO USE — pinned to bottom */}
                <div className="flex-shrink-0">
                  <p className="text-[10px]" style={{ color: muted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                    How to use
                  </p>
                  <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                    <img
                      src="https://images.unsplash.com/photo-1590010358311-55d7c0769a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjB0dXRvcmlhbCUyMHNjcmVlbiUyMGRhcmt8ZW58MXx8fHwxNzczMjgwODgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="How to use this prompt"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.28)' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: '1.5px solid rgba(255,255,255,0.45)' }}
                      >
                        <Play className="w-4 h-4 text-white ml-0.5" style={{ fill: 'white' }} />
                      </div>
                    </div>
                    <div
                      className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] text-white"
                      style={{ background: 'rgba(0,0,0,0.72)', fontWeight: 600 }}
                    >
                      1:24
                    </div>
                  </div>
                  <ol className="text-[11px] mt-2 m-0 pl-4 flex flex-col gap-1" style={{ color: muted }}>
                    <li>Copy or download the prompt above.</li>
                    <li>Open your preferred AI tool (ChatGPT, Claude, Gemini, etc.).</li>
                    <li>Paste the prompt and replace [TRANSCRIPT] with your transcript text.</li>
                    <li>Run and iterate — adjust tone or length as needed.</li>
                  </ol>
                </div>

              </div>

              {/* ── Right: sidebar ──────────────────────────────────────────── */}
              <div
                className="flex-shrink-0 overflow-y-auto flex flex-col"
                style={{ width: 256, borderLeft: `1px solid ${border}`, background: isDark ? '#0d0d0d' : '#fafafa' }}
              >
                {/* MUST TRY PROMPTS */}
                <div className="px-4 pt-4">
                  <p className="text-[10px] m-0 mb-3" style={{ color: muted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Must Try Prompts
                  </p>
                  {/* Tabs */}
                  <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
                    {(['Recent', 'Related', 'Viral'] as const).map((tab, i) => {
                      const key = i === 0 ? 'recent' : i === 1 ? 'related' : 'viral';
                      const active = mustTryTab === key;
                      return (
                        <button
                          key={tab}
                          onClick={() => setMustTryTab(key as typeof mustTryTab)}
                          className="flex-1 py-1.5 text-[11px] relative"
                          style={{ color: active ? text : muted, fontWeight: active ? 600 : 400, background: 'transparent', border: 'none' }}
                        >
                          {tab}
                          {active && (
                            <div
                              className="absolute bottom-0 left-0 right-0"
                              style={{ height: 2, background: '#00b8b2', borderRadius: '1px 1px 0 0' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Must try cards */}
                <div className="px-3 pt-3 pb-4 flex flex-col gap-2">
                  {(mustTryTab === 'related'
                    ? PROMPTS.filter(p => p.category === prompt.category && p.id !== prompt.id)
                    : mustTryTab === 'viral'
                    ? [...PROMPTS].filter(p => p.id !== prompt.id).sort((a, b) => b.uses - a.uses)
                    : [...PROMPTS].filter(p => p.id !== prompt.id)
                  ).slice(0, 3).map(p => (
                    <div
                      key={p.id}
                      className="rounded-xl px-3 py-2.5 flex flex-col gap-1 cursor-pointer"
                      style={{ background: isDark ? '#111111' : '#ffffff', border: `1px solid ${border}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#00b8b2'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? '#262626' : '#e5e7eb'; }}
                      onClick={() => onSelectPrompt?.(p)}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="flex items-center gap-0.5 px-1.5 py-px rounded-full text-[9px] [&>svg]:w-2.5 [&>svg]:h-2.5"
                          style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', color: muted, border: `1px solid ${border}` }}
                        >
                          {CATEGORY_ICONS[p.category]}
                          <span className="ml-0.5">{p.category}</span>
                        </span>
                        <span className="text-[10px]" style={{ color: muted }}>{(p.uses / 1000).toFixed(1)}k</span>
                      </div>
                      <p className="text-[12px] m-0" style={{ color: text, fontWeight: 600, lineHeight: 1.3 }}>{p.title}</p>
                      <p className="text-[11px] m-0 line-clamp-2" style={{ color: muted, lineHeight: 1.5 }}>{p.description}</p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: border, flexShrink: 0, marginTop: 12, marginBottom: 8 }} />

                {/* MOST RECENT TRANSCRIPTS */}
                <div className="px-4 pt-5 pb-2">
                  <p className="text-[10px] m-0" style={{ color: muted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Most Recent Transcripts
                  </p>
                </div>
                <div className="px-3 pb-5 flex flex-col">
                  {[
                    {
                      title: 'Product Launch Keynote 2026',
                      views: '2.4M',
                      duration: '0:58',
                      thumb: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNoJTIwa2V5bm90ZSUyMHN0YWdlJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc3MzI4MDkzOXww&ixlib=rb-4.1.0&q=80&w=400',
                    },
                    {
                      title: 'Growing to 1M Followers Fast',
                      views: '892K',
                      duration: '1:23',
                      thumb: 'https://images.unsplash.com/photo-1758273706007-f1524d2d963f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGZpbG1pbmclMjB2aWRlbyUyMHN0dWRpb3xlbnwxfHx8fDE3NzMyNzQ5MDB8MA&ixlib=rb-4.1.0&q=80&w=400',
                    },
                    {
                      title: 'AI Tools Every Creator Needs',
                      views: '541K',
                      duration: '3:47',
                      thumb: 'https://images.unsplash.com/photo-1590010358311-55d7c0769a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjB0dXRvcmlhbCUyMHNjcmVlbiUyMGRhcmt8ZW58MXx8fHwxNzczMjgwODgzfDA&ixlib=rb-4.1.0&q=80&w=400',
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-3 cursor-pointer group"
                      style={{ borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}
                    >
                      {/* Square thumbnail */}
                      <div
                        className="flex-shrink-0 rounded-xl overflow-hidden"
                        style={{ width: 56, height: 56 }}
                      >
                        <img src={t.thumb} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12.5px] m-0 mb-1.5 truncate"
                          style={{ color: text, fontWeight: 600, lineHeight: 1.3 }}
                        >
                          {t.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: muted }}>
                            <Eye className="w-3 h-3 flex-shrink-0" />
                            {t.views}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: muted }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {t.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {folderModal && prompt && (
          <SaveToFolderModal
            type="prompt"
            refId={prompt.id}
            name={prompt.title}
            meta={prompt.category}
            triggerRect={folderModal}
            onClose={() => setFolderModal(null)}
          />
        )}
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PromptBasePage() {
  const { isDark } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'az' | 'za'>('popular');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [promptPage, setPromptPage] = useState(1);
  const [promptsPerPage, setPromptsPerPage] = useState(30);
  const [ppDropdownPos, setPpDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const ppBtnRef = React.useRef<HTMLButtonElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkPillsScroll = useCallback(() => {
    const el = pillsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  React.useEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    checkPillsScroll();
    el.addEventListener('scroll', checkPillsScroll, { passive: true });
    window.addEventListener('resize', checkPillsScroll);
    return () => {
      el.removeEventListener('scroll', checkPillsScroll);
      window.removeEventListener('resize', checkPillsScroll);
    };
  }, [checkPillsScroll]);

  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const [actionsUsed, setActionsUsed] = useState(0);

  const SORT_OPTIONS = [
    { value: 'popular', label: 'Most popular' },
    { value: 'az',      label: 'A → Z' },
    { value: 'za',      label: 'Z → A' },
  ] as const;

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Most popular';

  React.useEffect(() => { setPromptPage(1); }, [activeCategory, searchQuery, sortBy]);

  const filtered = PROMPTS
    .filter(p => {
      const matchesCat = activeCategory === 'All' || activeCategory === 'Featured' ? true : p.category === activeCategory;
      const matchesFeatured = activeCategory === 'Featured' ? p.featured === true : true;
      const q = searchQuery.toLowerCase();
      const matchesQ = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      return matchesCat && matchesFeatured && matchesQ;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.uses - a.uses;
      if (sortBy === 'az')      return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

  const isFree = plan === 'free';
  // All prompts visible to everyone — gating is on action, not visibility
  const visibleFeatured = filtered.filter(p => p.featured);
  const visibleRest     = filtered.filter(p => !p.featured);

  // Pagination
  const paginationTarget = activeCategory === 'Featured' ? visibleFeatured : visibleRest;
  const paginatedItems = paginationTarget.slice((promptPage - 1) * promptsPerPage, promptPage * promptsPerPage);

  // Action gating: free users get FREE_LIMITS.prompts free actions, then see upgrade modal
  const isGated   = isFree && actionsUsed >= FREE_LIMITS.prompts;
  const onAction  = () => { if (isFree) setActionsUsed(v => v + 1); };

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0) + (sortBy !== 'popular' ? 1 : 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      {/* ══ TOP HEADER ══════════════════════════════════════════════════════ */}
      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        <AppSidebar activePage="prompt-base" collapsed={sidebarCollapsed} />

        {/* Main area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">



          {/* Page title bar */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                    Prompt Base
                  </h1>
                  <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6, maxWidth: 480 }}>
                    Browse and download ready-to-use prompts for your content — {filtered.length} prompt{filtered.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Filter Bar ──────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                border: `1px solid ${border}`,
                color: muted, width: 220, transition: 'all 0.15s',
              }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search prompts…"
                className="flex-1 bg-transparent outline-none text-xs min-w-0"
                style={{ color: text }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="flex-shrink-0 hover:opacity-60" style={{ color: muted }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sortBy !== 'popular' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: sortBy !== 'popular' ? '#00b8b2' : muted,
                  border: `1px solid ${sortBy !== 'popular' ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: sortBy !== 'popular' ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              >
                <TrendingUp className="w-3 h-3" />
                {sortLabel}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                        className="w-full text-left px-3 py-2 text-xs transition-colors"
                        style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Category pills — horizontally scrollable with arrows */}
            <div className="relative flex-1 min-w-0">
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => pillsRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                  className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-0.5 pr-2"
                  style={{
                    background: `linear-gradient(to right, ${bg} 60%, transparent)`,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: muted }} />
                </button>
              )}

              <div
                ref={pillsRef}
                className="flex items-center gap-2 overflow-x-auto prompt-pill-scroll"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.prompt-pill-scroll::-webkit-scrollbar { display: none; }`}</style>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                    style={{
                      background: activeCategory === cat ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                      color: activeCategory === cat ? (isDark ? '#111111' : '#ffffff') : (isDark ? 'rgba(255,255,255,0.55)' : muted),
                      fontWeight: activeCategory === cat ? 600 : 400,
                      border: `1px solid ${activeCategory === cat ? 'transparent' : border}`,
                    }}
                  >
                    {cat !== 'All' && CATEGORY_ICONS[cat as Exclude<PromptCategory, 'All'>]}
                    {cat}
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              {canScrollRight && (
                <button
                  onClick={() => pillsRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                  className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-0.5 pl-2"
                  style={{
                    background: `linear-gradient(to left, ${bg} 60%, transparent)`,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: muted }} />
                </button>
              )}
            </div>

            {/* Active filter count + clear */}
            {activeFilterCount > 0 && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setSortBy('popular'); }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                  style={{ color: muted, border: `1px solid ${border}`, background: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <X className="w-3 h-3" />
                  Clear ({activeFilterCount})
                </button>
              </>
            )}
          </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1280px] mx-auto w-full px-6 py-6">

            {/* Featured prompts - only when not on Featured tab */}
            {activeCategory !== 'Featured' && visibleFeatured.length > 0 && (
              <div className="mb-8">
                <p className="text-xs mb-3 px-0.5" style={{ color: muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Featured
                </p>
                <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {visibleFeatured.slice(0, 6).map((p) => (
                    <PromptCard key={p.id} prompt={p} isDark={isDark} border={border} text={text} muted={muted} hoverBg={isDark ? '#141414' : '#ffffff'} gated={isGated} onGated={openUpgrade} onAction={onAction} onOpen={setSelectedPrompt} />
                  ))}
                </div>
                {visibleFeatured.length > 6 && (
                  <button
                    onClick={() => setActiveCategory('Featured')}
                    className="mt-3 text-xs"
                    style={{ color: '#00b8b2', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    See all featured →
                  </button>
                )}
              </div>
            )}

            {/* Divider - only when both sections have content and not on Featured tab */}
            {activeCategory !== 'Featured' && visibleFeatured.length > 0 && visibleRest.length > 0 && (
              <div className="my-6" style={{ height: 1, background: border }} />
            )}

            {/* All/Featured Prompts grid + pagination */}
            {paginationTarget.length > 0 && (
              <div>
                <p className="text-xs mb-3 px-0.5" style={{ color: muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {activeCategory === 'Featured' ? 'Featured Prompts' : (visibleFeatured.length > 0 ? 'All Prompts' : '')}
                </p>
                <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {paginatedItems.map((p) => (
                    <PromptCard key={p.id} prompt={p} isDark={isDark} border={border} text={text} muted={muted} hoverBg={isDark ? '#141414' : '#ffffff'} gated={isGated} onGated={openUpgrade} onAction={onAction} onOpen={setSelectedPrompt} />
                  ))}
                </div>

                {/* Pagination bar */}
                {paginationTarget.length > promptsPerPage && (() => {
                  const totalPages = Math.ceil(paginationTarget.length / promptsPerPage);
                  return (
                    <div
                      className="mt-8 mb-2 rounded-2xl overflow-hidden"
                      style={{ border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff' }}
                    >
                      <div className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap">
                        {/* Left: prev + page numbers + next */}
                        <div className="flex items-center gap-0.5">
                          {/* Prev */}
                          <button
                            disabled={promptPage === 1}
                            onClick={() => setPromptPage(p => Math.max(1, p - 1))}
                            title="Previous page"
                            style={{
                              width: 32, height: 32, borderRadius: 8,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'transparent', border: 'none',
                              color: promptPage === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted,
                              cursor: promptPage === 1 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.12s',
                            }}
                            onMouseEnter={ev => { if (promptPage !== 1) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                            onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = promptPage === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted; }}
                          >
                            <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                          </button>

                          {/* Smart page numbers */}
                          {(() => {
                            const sp: (number | '…')[] = [];
                            if (totalPages <= 7) {
                              for (let i = 1; i <= totalPages; i++) sp.push(i);
                            } else if (promptPage <= 4) {
                              sp.push(1, 2, 3, 4, 5, '…', totalPages);
                            } else if (promptPage >= totalPages - 3) {
                              sp.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                            } else {
                              sp.push(1, '…', promptPage - 1, promptPage, promptPage + 1, '…', totalPages);
                            }
                            return sp.map((p, i) =>
                              p === '…' ? (
                                <span key={`el-${i}`} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: 12, flexShrink: 0, letterSpacing: 1 }}>···</span>
                              ) : (
                                <button
                                  key={p}
                                  onClick={() => setPromptPage(p as number)}
                                  style={{
                                    width: 32, height: 32, borderRadius: 8, fontSize: 13,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                                    background: promptPage === p ? text : 'transparent',
                                    color: promptPage === p ? bg : muted,
                                    border: 'none',
                                    fontWeight: promptPage === p ? 600 : 400,
                                  }}
                                  onMouseEnter={ev => { if (promptPage !== p) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                                  onMouseLeave={ev => { if (promptPage !== p) { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = muted; } }}
                                >{p}</button>
                              )
                            );
                          })()}

                          {/* Next */}
                          <button
                            disabled={promptPage === totalPages}
                            onClick={() => setPromptPage(p => Math.min(totalPages, p + 1))}
                            title="Next page"
                            style={{
                              width: 32, height: 32, borderRadius: 8,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'transparent', border: 'none',
                              color: promptPage === totalPages ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted,
                              cursor: promptPage === totalPages ? 'not-allowed' : 'pointer',
                              transition: 'all 0.12s',
                            }}
                            onMouseEnter={ev => { if (promptPage !== totalPages) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                            onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = promptPage === totalPages ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted; }}
                          >
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                          </button>
                        </div>

                        {/* Right: items per page dropdown */}
                        <div className="relative flex-shrink-0">
                          <button
                            ref={ppBtnRef}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                            style={{ background: 'transparent', border: `1px solid ${border}`, color: muted, transition: 'all 0.12s' }}
                            onClick={() => {
                              if (openDropdown === 'pg-pp') { setOpenDropdown(null); setPpDropdownPos(null); }
                              else {
                                const rect = ppBtnRef.current?.getBoundingClientRect();
                                if (rect) setPpDropdownPos({ top: rect.top - 8, right: window.innerWidth - rect.right });
                                setOpenDropdown('pg-pp');
                              }
                            }}
                            onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.color = text; (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.color = muted; (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            <span style={{ color: text, fontWeight: 600 }}>{promptsPerPage}</span>
                            <span style={{ color: muted }}>&thinsp;/ page</span>
                            <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${openDropdown === 'pg-pp' ? 'rotate-180' : ''}`} />
                          </button>

                          {openDropdown === 'pg-pp' && ppDropdownPos && ReactDOM.createPortal(
                            <>
                              <div className="fixed inset-0 z-[9998]" onClick={() => { setOpenDropdown(null); setPpDropdownPos(null); }} />
                              <div
                                className="rounded-xl overflow-hidden py-1"
                                style={{
                                  position: 'fixed', top: ppDropdownPos.top, right: ppDropdownPos.right,
                                  transform: 'translateY(-100%)', zIndex: 9999,
                                  background: isDark ? '#1a1a1a' : '#fff',
                                  border: `1px solid ${border}`,
                                  boxShadow: isDark ? '0 -8px 24px rgba(0,0,0,0.55)' : '0 -8px 24px rgba(0,0,0,0.14)',
                                  minWidth: 130,
                                }}
                              >
                                <div className="px-3 pt-2 pb-1.5">
                                  <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Per page</span>
                                </div>
                                {[12, 24, 30, 50, 100].map(n => (
                                  <button
                                    key={n}
                                    onClick={() => { setPromptsPerPage(n); setPromptPage(1); setOpenDropdown(null); setPpDropdownPos(null); }}
                                    className="w-full flex items-center justify-between px-3 py-2 text-xs"
                                    style={{
                                      color: promptsPerPage === n ? '#00b8b2' : muted,
                                      background: promptsPerPage === n ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                                      fontWeight: promptsPerPage === n ? 600 : 400,
                                      transition: 'background 0.1s', cursor: 'pointer',
                                    }}
                                    onMouseEnter={ev => { if (promptsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                                    onMouseLeave={ev => { if (promptsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                  >
                                    <span>{n} / page</span>
                                    {promptsPerPage === n && (
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="#00b8b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>,
                            document.body
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Search className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db' }} />
                <p style={{ color: muted, fontSize: '0.875rem' }}>No prompts match your search</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setSortBy('popular'); }} className="text-xs" style={{ color: '#00b8b2' }}>
                  Clear filters
                </button>
              </div>
            )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Prompt Detail Panel ────────────────────────────────────────────── */}
      <PromptDetailPanel
        prompt={selectedPrompt}
        isDark={isDark}
        onClose={() => setSelectedPrompt(null)}
        gated={isGated}
        onGated={openUpgrade}
        onAction={onAction}
        onSelectPrompt={setSelectedPrompt}
      />
    </div>
  );
}