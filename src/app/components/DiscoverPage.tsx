import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router';
import {
  Search, Clock, Copy, CheckCheck, Heart, Play,
  PanelLeftClose, PanelLeftOpen, Sun, Moon,
  Users, History, Compass, SlidersHorizontal, ChevronDown,
  TrendingUp, Calendar, Filter, LayoutGrid, List, X, FileText, MoreHorizontal, Columns2, FolderPlus,
  Download, ExternalLink, Link2,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatDuration';
import {
  TranscriptDetailPanel,
  TranscriptDetailVideo,
  RelatedVideo,
  DownloadFormat,
} from './TranscriptDetailPanel';
import { AppSidebar } from './AppSidebar';
import { AppLogo } from './AppLogo';
import { AppHeader } from './AppHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SaveToFolderModal } from './SaveToFolderModal';
import { SelectionBar } from './SelectionBar';
import { simulateVideoDownload, simulateCoverDownload, simulateZipDownload } from './videos/downloadUtils';
import { UserContext, FREE_LIMITS } from '../context/UserContext';
import Rd from '../../imports/Rd';

// ─── Verified creators ────────────────────────────────────────────────────────
const VERIFIED_CREATORS = new Set([
  '@tokcast', '@founders', '@engineering', '@productteam',
  '@fitwithjess', '@techbrosam', '@kitchenlabs', '@gamervault',
  '@keynoteking', '@aifuturist', '@productivityhacks', '@chefmike',
]);

// ─── Mock full-transcript extra paragraphs (per entry) ───────────────────────
const TRANSCRIPT_EXTRA: Record<number, string[]> = {
  1:  ["The first feature we're launching is the new command palette. You'll be able to search every action, every setting, every file in one keystroke. Power users have been asking for this since day one.", "Second up is intelligent threading. Instead of one long chat, the assistant now groups related messages into threads automatically. It's a small change that makes a massive difference to readability.", "We're also shipping offline mode today. No internet? No problem. Everything you worked on in the last 30 days is fully available and syncs the moment you reconnect."],
  2:  ["What she described was spending nearly two hours a day just reformatting notes from different tools into a single document. That's ten hours a week on pure busywork.", "When we showed her the automated transcript pipeline she actually laughed — in a good way. She said it felt like getting a day back every week.", "That kind of feedback is exactly why we keep talking to users at this stage. You can't design your way out of a problem you haven't truly felt yourself."],
  3:  ["Wednesday mornings are now protected time — no meetings, no Slack, just deep work. We tested this for three weeks and the team shipped 30% more before end of week than the same period last quarter.", "The design review is particularly important this Friday because we're locking the navigation spec. Anyone with feedback needs to be in that room.", "One more thing — please fill in the retrospective doc before Thursday EOD. Even two sentences helps. It takes ten minutes and genuinely shapes how we plan the next sprint."],
  4:  ["If you chase revenue before retention you'll paper over every product problem with sales. And eventually you run out of paper.", "Our first 200 customers have been with us for over 14 months. That's the number I'm most proud of. Not the headline ARR, not the press coverage — those 200 people who keep renewing.", "The investors who get this are the ones worth having on your cap table. The ones who only ask about MRR in the first meeting are telling you exactly what they value."],
  5:  ["The old navigation had three levels of nesting and a breadcrumb that nobody could follow. We ran a usability test where 7 out of 8 participants couldn't find the export function within two minutes.", "The new system is flat. Everything lives at one level with search as the primary escape hatch. We went from 340 navigation elements to 42.", "The visual hierarchy overhaul took another month. But the before-and-after is dramatic. What used to feel like a SaaS product from 2014 now feels deliberate and considered."],
  6:  ["What struck me most was the consistency. Every single company he built started with the same ritual — spend the first 90 days doing nothing but customer support. No building, no fundraising, just listening.", "By the end of those 90 days he knew exactly what to build, who to hire first, and which early investors would actually add value beyond the cheque.", "The third acquisition was the fastest — 22 months from first commit to signed term sheet. He says it was the only one where he truly felt in control the whole time."],
  7:  ["The myth goes like this: build audience first, monetise later. But later never comes, or it comes and the audience you built doesn't want to pay for anything.", "The framework I use is what I call minimum viable monetisation. Find ten people who will pay you right now for something you can deliver in a week. That's your product.", "Every creator I know who hit seven figures started with a tiny paid offer, not a massive free audience. The free audience came after the business model was proven."],
  8:  ["The pattern we kept seeing was customers who got through onboarding but never hit their first value moment. They'd set up an account, look around, and leave without doing the one thing that would have made them stay.", "We added a single nudge — a banner that said 'You're 2 steps away from your first insight' — and completion rates went from 34% to 71% overnight.", "Now we instrument every step of the first 14 days and have a dedicated team whose only job is removing friction from that window. Churn has dropped 40%."],
  9:  ["Three months off the schedule, off the algorithm, off the analytics dashboard. I didn't look at a single metric. Honestly it felt irresponsible at first and then it felt incredible.", "The first session back I wrote 11 ideas in an hour. That hadn't happened in two years. I think the lesson is obvious but we all have to learn it ourselves.", "I'm going to build a proper break into every six months going forward. Not a holiday — an actual creative sabbatical. The ROI is undeniable."],
  10: ["Channel three — the one we thought was our worst performer — turned out to be responsible for 60% of customers with lifetime value over $2K. We'd been underspending there by a factor of eight.", "The attribution model we were using was last-click, which basically credits the final touchpoint and ignores everything that warmed the lead up. Classic mistake, but we made it for two years.", "We've rebuilt the model from scratch using first-touch plus assist attribution. The budget reallocation is already showing a 3.2x improvement in blended CAC after just six weeks."],
  11: ["The first customer found me through a blog post I'd written at 2am, three glasses of wine deep, about why I thought the current solution was broken. That post still drives signups today.", "I had no money for ads, no connections in the industry, and no idea how to build a company. What I had was an extremely specific problem and a very loud opinion about it.", "Looking back, the constraint was the advantage. We couldn't afford to be anything other than ruthlessly focused. Every feature, every hire, every decision ran through one filter: does this help that one customer?"],
  12: ["The biggest change in v2.1 is the editor. We rewrote it from scratch after realising the previous architecture couldn't support the collaborative features that keep coming up in user research.", "We also fixed the 23 bugs that were in our 'known issues' doc for longer than six months. I know, I know. But they're gone now.", "The new export pipeline supports seven formats and runs three times faster than before. If you were waiting on that to move your workflow over, now is the time."],
  13: ["The thing about doing it without paid ads is that it forces you to get the product right. You can't buy your way past bad retention. Every customer has to want to stay.", "He started with a waiting list of 40 people. Personal emails to each one, handwritten follow-ups, a Notion doc that tracked every single piece of feedback. Unsexy but unstoppable.", "By month 12 word of mouth was generating more signups than he could onboard comfortably. That's the best problem in business and it only comes from genuinely obsessing over the customer."],
  14: ["The migration took 18 months of on-and-off work. We ran the old and new systems in parallel for the last four of those months, which was painful but meant zero downtime on cutover.", "The team who did the work deserves enormous credit. They maintained both systems, shipped new features, handled on-call, and still found time to write the documentation that's going to save the next team months.", "Next quarter we're tackling the remaining legacy service — the billing engine. It's the scariest one. We're planning a full six-month runway to do it properly."],
  15: ["Clarity means every visual decision earns its place. If you can't explain why an element is there, it shouldn't be there. We removed 60% of the previous brand's graphical elements on that principle alone.", "The typography took the longest. We tested 14 typefaces over four months. The final choice is one nobody expected — it's quieter than you'd think for a brand in our space, but it lets the content breathe.", "The response from the community has been better than we hoped. The rebrand threads on Twitter generated more organic impressions in 48 hours than any campaign we've ever run."],
  16: ["The setup is a $12 LED panel from Amazon, a white foam board from a craft store, and a phone mount that cost me $8. Total investment under $30. Studio rental would have cost $400 a day.", "The trick everyone misses is the angle. Most phone cameras have a sweet spot about 30 degrees above the subject. Shoot straight on and everything looks flat. Tilt down slightly and suddenly there's dimension.", "I've been shooting consistently for 18 months with this exact setup. The brand accounts I work with now pay rates that used to be reserved for photographers with full studio rigs. Lighting is everything."],
  17: ["We start with the legs because it's the least fun and gets people into the mindset early. There's a psychological benefit to tackling the hard thing first — every subsequent circuit feels easier by comparison.", "Rest periods are intentional and short. 20 seconds between movements. Long enough to keep form, not long enough to let your heart rate drop. That's where the calorie burn comes from.", "The last five minutes are where most people quit, which is exactly why we put the core finisher there. Push through those five minutes and you'll understand why this session is different."],
  18: ["Theme one is climate infrastructure. Not EVs, not solar panels — the actual hardware layer that makes large-scale adoption possible. Grid-scale storage, transmission upgrades, industrial electrification.", "Theme two is AI in regulated industries. Healthcare, legal, financial services. The opportunity is enormous precisely because the complexity scares away undercapitalised competitors.", "Theme three is what I'm calling boring SaaS. Workflow tools for industries that have barely been touched by software — construction, agriculture, skilled trades. Boring is beautiful when the competitive dynamics are right."],
  19: ["Five ingredients: pasta, lemon, parmesan, butter, and black pepper. That's it. No cream, despite what every restaurant version adds.", "The technique is everything. You have to emulsify the pasta water with the butter before you add the parmesan or you get a clumpy mess instead of a silky sauce. Thirty seconds of patience makes the difference.", "I've made this dish for two Michelin-starred chefs at dinner parties and neither of them asked what was in it. They just ate it quietly, which in my experience is the highest possible compliment."],
  20: ["The food in Tokyo operates on a different philosophical principle. Every vendor, every hole-in-the-wall, every convenience store is trying to be the best version of what it is. There's no 'good enough'.", "Day three I ended up at a ramen counter with nine seats and a two-hour queue. I nearly left. The bowl that arrived 20 minutes after I sat down is in my top three meals of my entire life.", "The vending machine thing is genuinely a skill. I got it wrong four times before a very patient local woman took pity on me and walked me through the process step by step. Still grateful."],
  21: ["The class component pattern has one genuine advantage — lifecycle methods are explicit. But hooks give you the same control with a fraction of the boilerplate, and they compose in ways class components simply can't.", "We're going to rewrite a real component live. Same behaviour, same props API, a third of the lines of code. The key insight is that useEffect with a proper dependency array replaces componentDidMount, componentDidUpdate, and componentWillUnmount simultaneously.", "By the end of this you'll find class components uncomfortable to read rather than familiar. That's not a bad thing — it means your mental model has updated."],
  22: ["The build was 18 months of small decisions. Four hours every Sunday morning, earphones in, mapping out the architecture while the rest of the city was asleep.", "The first time I played it in public was at a 200-person club in Berlin. Nothing had prepared me for the feeling of 200 people responding in real time to something I'd built in complete isolation.", "I've kept every session file. The final version is about 30% of what I started with. Editing is the work. Anyone can generate material. Very few people can ruthlessly remove what doesn't serve the piece."],
  23: ["The rule we follow is: every component should be explainable in one sentence. If you can't describe what it does in one sentence, it's doing too many things.", "We use a three-tier naming system: atoms, molecules, and templates. Atoms are unstyled primitives. Molecules compose atoms with specific use-case opinions. Templates are page-level layout constraints.", "The system has been running in production for three years across 12 products. The ROI comes from the compound interest — every new feature ships faster because the foundation is solid."],
  24: ["Step one is the setup call, which happens the week before they start. We cover tools, expectations, communication norms, and do a proper 'get to know you' conversation. No agenda items, just talking.", "The first week is entirely listening. They sit in on every meeting relevant to their role, read the last three months of Slack in the channels that matter, and talk to five colleagues. They produce nothing. This is intentional.", "By week three they're doing the job. Not shadowing it — doing it. We've found this three-phase approach gets people productive in under 30 days with dramatically higher satisfaction scores at the 90-day mark."],
};

function getTranscriptBlocks(entry: HistoryEntry): string[] {
  return [entry.transcriptSnippet, ...(TRANSCRIPT_EXTRA[entry.id] ?? [])];
}

// ─── Static data for the panel's right-column ────────────────────────────────
const PANEL_RELATED: RelatedVideo[] = [
  { title: '5 Morning Habits That Changed My Life',  creator: '@productivityhacks', duration: '0:58', views: '2.4M', thumb: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80' },
  { title: 'The Secret to Perfect Pasta Every Time', creator: '@chefmike',           duration: '1:23', views: '892K', thumb: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80' },
  { title: '30-Day Fitness Challenge Results',        creator: '@fitnesswithsarah',  duration: '0:47', views: '1.6M', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
];
const PANEL_DOWNLOAD_FORMATS: DownloadFormat[] = [
  { label: 'Plain Text (.txt)', free: true },
  { label: 'Subtitles (.srt)',  free: true },
  { label: 'WebVTT (.vtt)',     free: true },
  { label: 'JSON (beta)',       free: true },
];

function _likesFromWords(w: number): string {
  if (w > 8000) return '142K';
  if (w > 5000) return '98K';
  if (w > 2000) return '61K';
  if (w > 1000) return '34K';
  return '18K';
}
function _readabilityFromWords(w: number): string {
  if (w > 8000) return 'Grade 6';
  if (w > 4000) return 'Grade 4';
  if (w > 1500) return 'Grade 3';
  return 'Grade 2';
}

// ──����� Discover Transcript Side Panel ──────────────────────────────────────────
function DiscoverTranscriptPanel({
  entry, isDark, border, text, muted, onClose,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string;
  onClose: () => void;
}) {
  const blocks = getTranscriptBlocks(entry);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const panelBg     = isDark ? '#141414' : '#ffffff';
  const hoverBg     = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';

  const videoData: TranscriptDetailVideo = {
    title:       entry.title,
    creator:     entry.creator,
    platform:    entry.platform,
    likes:       _likesFromWords(entry.words),
    duration:    entry.duration,
    language:    'EN',
    date:        entry.date,
    wordCount:   entry.words,
    charCount:   Math.round(entry.words * 5.1),
    sentences:   Math.round(entry.words / 13),
    readability: _readabilityFromWords(entry.words),
    thumbnail:   entry.thumbnail,
    avatar:      'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=200&q=80',
  };

  return (
    <>
      {/* Fixed backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }}
        onClick={onClose}
      />

      {/* Fixed slide-in panel — same design as /results */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 860,
          background: panelBg,
          borderLeft: `1px solid ${border}`,
          boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)',
          animation: 'discoverPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <TranscriptDetailPanel
          video={videoData}
          transcript={blocks}
          related={PANEL_RELATED}
          downloadFormats={PANEL_DOWNLOAD_FORMATS}
          isDark={isDark}
          bg={panelBg}
          border={border}
          text={text}
          muted={muted}
          hoverBg={hoverBg}
          cardBg={innerCardBg}
          onBack={onClose}
        />
      </div>

      <style>{`
        @keyframes discoverPanelIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}

// ─── Platform badge ───────────────────────────────────────────────────────────
function PlatformIconSVG({ platform }: { platform: string }) {
  if (platform === 'YouTube') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
  if (platform === 'TikTok') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" />
    </svg>
  );
  if (platform === 'Instagram') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
  return null;
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontWeight: 500,
      }}
    >
      <PlatformIconSVG platform={platform} />
      {platform}
    </span>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
export interface HistoryEntry {
  id: number; title: string; creator: string; platform: string;
  duration: string; date: string; words: number; thumbnail: string; transcriptSnippet: string;
  avatar: string;
  status: 'complete' | 'failed' | 'processing';
  url?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  bookmarks?: number;
  lastRefresh?: string; // ISO timestamp
}

export const MY_HISTORY: HistoryEntry[] = [
  { id: 1,  platform: 'YouTube',    duration: '0:58', date: 'Feb 24, 2026', words: 2341, title: 'Product launch keynote',       creator: '@productteam',  thumbnail: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=400&q=80',  transcriptSnippet: "Welcome everyone to our biggest launch of the year. Today we're unveiling features that will fundamentally change how you think about productivity...",  avatar: 'https://i.pravatar.cc/80?u=productteam' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0001' },
  { id: 2,  platform: 'TikTok',     duration: '1:44', date: 'Feb 23, 2026', words: 5820, title: 'User interview – Sarah K.',    creator: '@research',     thumbnail: 'https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?w=400&q=80',  transcriptSnippet: "So what I found really interesting in my workflow was the amount of time I was spending just trying to organise all the notes from these sessions...",  avatar: 'https://i.pravatar.cc/80?u=research' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000002' },
  { id: 3,  platform: 'Instagram',  duration: '0:32', date: 'Feb 22, 2026', words: 1102, title: 'Weekly standup recap',          creator: '@teamlead',     thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "Team, quick recap from today: we're blocking Wednesday morning for deep work, shipping is on track, and the design review is Friday at 2pm...",  avatar: 'https://i.pravatar.cc/80?u=teamlead' , status: 'complete', url: 'https://www.instagram.com/reel/mock0003/' },
  { id: 4,  platform: 'YouTube',    duration: '1:51', date: 'Feb 21, 2026', words: 8430, title: 'Investor Q&A session',          creator: '@founders',     thumbnail: 'https://images.unsplash.com/photo-1712971404080-87271ce2e473?w=400&q=80',  transcriptSnippet: "The question everyone keeps asking is how we plan to monetise at scale. The short answer is that we're not chasing revenue first — we're chasing retention...",  avatar: 'https://i.pravatar.cc/80?u=founders' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0004' },
  { id: 5,  platform: 'Instagram',  duration: '1:07', date: 'Feb 20, 2026', words: 3210, title: 'Design review walkthrough',     creator: '@designops',   thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "Let me walk you through the reasoning behind the new navigation system. The old one had three layers of nesting which was just killing discoverability...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'complete', url: 'https://www.instagram.com/reel/mock0005/' },
  { id: 6,  platform: 'YouTube',    duration: '1:33', date: 'Feb 18, 2026', words: 6890, title: 'Podcast Episode 12',            creator: '@tokcast',      thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest today has built three companies from zero to acquisition. The one thing all three had in common? They were all solving a problem the founder personally had...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0006' },
  { id: 7,  platform: 'YouTube',    duration: '0:39', date: 'Feb 16, 2026', words: 8200, title: 'Growth Webinar – Feb',          creator: '@growth',       thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80',  transcriptSnippet: "Before I get into the framework, I want to debunk the biggest growth myth — that you need a huge audience to start monetising. You absolutely do not...",  avatar: 'https://i.pravatar.cc/80?u=growth' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0007' },
  { id: 9,  platform: 'TikTok',     duration: '0:45', date: 'Feb 15, 2026', words: 1890, title: 'Behind the scenes – day one',   creator: '@studiolife',   thumbnail: 'https://images.unsplash.com/photo-1758273706007-f1524d2d963f?w=400&q=80',  transcriptSnippet: "This is what my first day back in the studio looked like after a three-month break. Honestly wasn't sure I still had it but the ideas came flooding in...",  avatar: 'https://i.pravatar.cc/80?u=studiolife' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000009' },
  { id: 10, platform: 'YouTube',    duration: '2:14', date: 'Feb 14, 2026', words: 9120, title: 'Marketing deep-dive Q1',        creator: '@mktgteam',     thumbnail: 'https://images.unsplash.com/photo-1690191795219-d88b1af86e3b?w=400&q=80',  transcriptSnippet: "We spent Q4 running 40 experiments across six channels. The results completely overturned what we thought we knew about our acquisition funnel...",  avatar: 'https://i.pravatar.cc/80?u=mktgteam' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0010' },
  { id: 11, platform: 'Instagram',  duration: '0:55', date: 'Feb 13, 2026', words: 2670, title: 'Founder story – origins',       creator: '@buildersclub', thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "I started this company from a coffee shop in Lisbon with no funding, no team, and honestly no clue what I was doing. But I had one customer who believed in me...",  avatar: 'https://i.pravatar.cc/80?u=buildersclub' , status: 'complete', url: 'https://www.instagram.com/reel/mock0011/' },
  { id: 12, platform: 'TikTok',     duration: '1:02', date: 'Feb 12, 2026', words: 3400, title: 'App walkthrough – v2.1',        creator: '@devlog',       thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "Version 2.1 ships today. Let me show you everything that changed — and more importantly why we made these decisions based on the feedback you all gave us...",  avatar: 'https://i.pravatar.cc/80?u=devlog' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000012' },
  { id: 13, platform: 'YouTube',    duration: '1:28', date: 'Feb 11, 2026', words: 7650, title: 'Podcast Episode 13',            creator: '@tokcast',      thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Today I'm talking with someone who went from $0 to $2M ARR in 18 months without a single paid ad. The secret? They never stopped talking to customers...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'processing', url: 'https://www.youtube.com/watch?v=mock0013' },
  { id: 15, platform: 'Instagram',  duration: '0:29', date: 'Feb 09, 2026', words: 980,  title: 'Brand identity reveal',        creator: '@brandstudio',  thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "After six months of work we're finally ready to show the new brand. Every decision was driven by one word — clarity. Let me show you what we mean...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0015/' },
  { id: 16, platform: 'TikTok',     duration: '0:52', date: 'Feb 08, 2026', words: 2100, title: 'Product photography tips',      creator: '@shotbyme',     thumbnail: 'https://images.unsplash.com/photo-1511881220587-13b89d1da6b8?w=400&q=80',  transcriptSnippet: "You don't need a DSLR to shoot great product photos. Here's how I get consistent studio-quality shots with just my phone and a $12 light from Amazon...",  avatar: 'https://i.pravatar.cc/80?u=shotbyme' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000016' },
  { id: 17, platform: 'YouTube',    duration: '3:05', date: 'Feb 07, 2026', words: 11200, title: 'Full-body HIIT – 30 min',      creator: '@fitwithjess',  thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "No equipment, no excuses. This 30-minute session will hit every major muscle group and keep your heart rate elevated the entire time. Let's get into it...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0017' },
  { id: 19, platform: 'TikTok',     duration: '0:41', date: 'Feb 05, 2026', words: 1740, title: 'Pasta al limone – 5 mins',      creator: '@kitchenlabs',  thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "Five ingredients. Five minutes. This pasta al limone is the dish I make when I have nothing in the fridge and fifteen minutes until my guests arrive...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000019' },
  { id: 20, platform: 'YouTube',    duration: '2:30', date: 'Feb 04, 2026', words: 10800, title: 'Japan vlog – Tokyo day 3',     creator: '@roamingalex',  thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "Day three in Tokyo and I finally figured out how to order from the vending machines. But seriously — the food scene here has completely blown my expectations...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0020' },
  { id: 21, platform: 'Instagram',  duration: '1:10', date: 'Feb 03, 2026', words: 4560, title: 'React hooks masterclass',       creator: '@webdevdaily',  thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "If you're still writing class components in 2026 this video is for you. I'm going to show you how to rewrite them with hooks in a fraction of the code...",  avatar: 'https://i.pravatar.cc/80?u=webdevdaily' , status: 'complete', url: 'https://www.instagram.com/reel/mock0021/' },
  { id: 22, platform: 'TikTok',     duration: '0:36', date: 'Feb 02, 2026', words: 1320, title: 'Live set – Boiler Room',        creator: '@djlunar',      thumbnail: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?w=400&q=80',  transcriptSnippet: "This was the set I'd been building toward for two years. The crowd response in the first ten minutes was something I'll never forget for the rest of my life...",  avatar: 'https://i.pravatar.cc/80?u=djlunar' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000022' },
  { id: 23, platform: 'YouTube',    duration: '1:45', date: 'Feb 01, 2026', words: 7200, title: 'Figma components deep dive',    creator: '@designsystem', thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Component architecture is where most design systems fall apart. Today I'm walking through the exact structure we use to keep 200+ components maintainable...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0023' },
  { id: 25,  platform: 'YouTube',    duration: '2:02', date: 'Jan 30, 2026', words: 8760,  title: 'Podcast Episode 14',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "We talk a lot about product-market fit but almost nobody talks about team-market fit. Today's guest argues it might be the more important of the two...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0025' },
  { id: 26,  platform: 'TikTok',     duration: '0:48', date: 'Jan 29, 2026', words: 2030,  title: 'Morning routine – creator ed.',   creator: '@morningpages',  thumbnail: 'https://images.unsplash.com/photo-1758273706007-f1524d2d963f?w=400&q=80',  transcriptSnippet: "I've tried every morning routine in the book. The only one that's stuck for three years is also the simplest — and it has nothing to do with cold showers...",  avatar: 'https://i.pravatar.cc/80?u=morningpages' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000026' },
  { id: 27,  platform: 'Instagram',  duration: '0:44', date: 'Jan 28, 2026', words: 1870,  title: 'Office tour – new HQ',            creator: '@officedaily',   thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "We moved into our new space last week and I wanted to show you how we've set it up for both focus work and collaboration. The standing desk situation is chef's kiss...",  avatar: 'https://i.pravatar.cc/80?u=officedaily' , status: 'complete', url: 'https://www.instagram.com/reel/mock0027/' },
  { id: 28,  platform: 'YouTube',    duration: '1:58', date: 'Jan 27, 2026', words: 9340,  title: 'TypeScript generics explained',   creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "Generics are one of those TypeScript features that people avoid until they can't anymore. But once it clicks you'll wonder how you ever wrote code without them...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0028' },
  { id: 30,  platform: 'TikTok',     duration: '0:33', date: 'Jan 25, 2026', words: 1450,  title: 'Sourdough – beginner guide',      creator: '@breadclub',     thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "The biggest mistake beginners make with sourdough is not letting the starter mature enough. Here's how to tell when yours is actually ready to bake with...",  avatar: 'https://i.pravatar.cc/80?u=breadclub' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000030' },
  { id: 31,  platform: 'YouTube',    duration: '1:22', date: 'Jan 24, 2026', words: 6100,  title: 'SEO strategy – 2026 update',      creator: '@searchlab',     thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80',  transcriptSnippet: "Google's latest updates have completely reshuffled how content ranks. Here are the three signals that now matter most and how to optimise for all of them...",  avatar: 'https://i.pravatar.cc/80?u=searchlab' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0031' },
  { id: 32,  platform: 'Instagram',  duration: '1:05', date: 'Jan 23, 2026', words: 4320,  title: 'Tailwind CSS deep dive',          creator: '@webdevdaily',   thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Utility-first CSS changed everything about how I build UIs. After two years of daily Tailwind use here are the patterns I come back to on every project...",  avatar: 'https://i.pravatar.cc/80?u=webdevdaily' , status: 'complete', url: 'https://www.instagram.com/reel/mock0032/' },
  { id: 34,  platform: 'TikTok',     duration: '0:58', date: 'Jan 21, 2026', words: 2540,  title: 'Street photography – NYC',        creator: '@shotbyme',      thumbnail: 'https://images.unsplash.com/photo-1511881220587-13b89d1da6b8?w=400&q=80',  transcriptSnippet: "New York is the best city in the world for street photography and I spent three days trying to prove it. Here's everything I shot and the story behind each frame...",  avatar: 'https://i.pravatar.cc/80?u=shotbyme' , status: 'failed', url: 'https://www.tiktok.com/@creator/video/10000000034' },
  { id: 35,  platform: 'YouTube',    duration: '2:48', date: 'Jan 20, 2026', words: 12400, title: 'AI tools for creators – 2026',    creator: '@aicreative',    thumbnail: 'https://images.unsplash.com/photo-1690191795219-d88b1af86e3b?w=400&q=80',  transcriptSnippet: "I tested 22 AI tools this month so you don't have to. Most of them are noise. Six of them have genuinely changed how I work and I'm going to show you each one...",  avatar: 'https://i.pravatar.cc/80?u=aicreative' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0035' },
  { id: 36,  platform: 'Instagram',  duration: '0:37', date: 'Jan 19, 2026', words: 1600,  title: 'Client project reveal – rebrand', creator: '@brandstudio',   thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "Twelve weeks of work. Four rounds of revisions. One very happy client. Here's the full story of this rebrand from initial brief to final handoff...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0036/' },
  { id: 37,  platform: 'YouTube',    duration: '1:37', date: 'Jan 18, 2026', words: 7080,  title: 'Podcast Episode 15',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest scaled a content business to 8 figures using a team of three. The leverage wasn't technology or outsourcing — it was an obsession with systems...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0037' },
  { id: 38,  platform: 'TikTok',     duration: '0:29', date: 'Jan 17, 2026', words: 1230,  title: 'Ice bath recovery – honest take', creator: '@fitwithjess',   thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "I've been doing cold exposure for 90 days. Here's my completely honest assessment: what worked, what was overhyped, and whether I'd recommend it to anyone...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000038' },
  { id: 40,  platform: 'YouTube',    duration: '0:54', date: 'Jan 15, 2026', words: 3870,  title: 'Color theory for UI designers',   creator: '@designsystem',  thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "Color is the fastest way to communicate mood, hierarchy, and brand. But most UI designers are applying it with the same three instincts and ignoring the rest...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0040' },
  { id: 41,  platform: 'TikTok',     duration: '0:46', date: 'Jan 14, 2026', words: 1980,  title: 'Bali vlog day 1',                 creator: '@roamingalex',   thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "I landed in Canggu at 6am with no accommodation booked and roughly a plan. Day one turned into one of the best travel days I've had in years...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000041' },
  { id: 42,  platform: 'Instagram',  duration: '0:53', date: 'Jan 13, 2026', words: 2290,  title: 'Notion workspace tour',           creator: '@productividad', thumbnail: 'https://images.unsplash.com/photo-1766074903112-79661da9ab45?w=400&q=80',  transcriptSnippet: "I've rebuilt my Notion workspace four times in two years. This is the fifth version and for the first time I actually feel like it's working with me, not against me...",  avatar: 'https://i.pravatar.cc/80?u=productividad' , status: 'complete', url: 'https://www.instagram.com/reel/mock0042/' },
  { id: 43,  platform: 'YouTube',    duration: '2:11', date: 'Jan 12, 2026', words: 9650,  title: 'Deep work protocol – 2026',       creator: '@deepfocuslab',  thumbnail: 'https://images.unsplash.com/photo-1712971404080-87271ce2e473?w=400&q=80',  transcriptSnippet: "Cal Newport's deep work framework changed how I think about productivity but I've spent three years adapting it for people who work in teams, not solo...",  avatar: 'https://i.pravatar.cc/80?u=deepfocuslab' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0043' },
  { id: 45,  platform: 'TikTok',     duration: '1:18', date: 'Jan 10, 2026', words: 5600,  title: 'Vintage watch restoration',       creator: '@watchgeek',     thumbnail: 'https://images.unsplash.com/photo-1758273706007-f1524d2d963f?w=400&q=80',  transcriptSnippet: "This 1968 Omega Seamaster came to me with a cracked crystal, a frozen crown, and 56 years of grime inside the case. Let me show you what it looks like now...",  avatar: 'https://i.pravatar.cc/80?u=watchgeek' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000045' },
  { id: 46,  platform: 'YouTube',    duration: '1:50', date: 'Jan 09, 2026', words: 8100,  title: 'Podcast Episode 16',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Today's guest built a bootstrapped SaaS to $500k MRR, turned down a $20M acquisition, and has no regrets. We talk about why and what comes next...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0046' },
  { id: 47,  platform: 'Instagram',  duration: '0:34', date: 'Jan 08, 2026', words: 1480,  title: 'Minimalist room makeover',        creator: '@spacestudio',   thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "The brief was simple: make this room feel twice as big without moving a single wall. The result is my favourite project of the year and cost under $800...",  avatar: 'https://i.pravatar.cc/80?u=spacestudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0047/' },
  { id: 49,  platform: 'TikTok',     duration: '0:50', date: 'Jan 06, 2026', words: 2120,  title: 'Gymshark haul – honest review',   creator: '@fitwithjess',   thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "I ordered six pieces from the new Gymshark drop and I'm giving you the unfiltered take — no brand deal, no affiliate link, just whether they're actually worth it...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000049' },
  { id: 50,  platform: 'YouTube',    duration: '2:22', date: 'Jan 05, 2026', words: 10100, title: 'CSS animations masterclass',      creator: '@webdevdaily',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "CSS animations are more powerful than most developers realise. I'm going to take you from basic transitions to orchestrated multi-step sequences in under an hour...",  avatar: 'https://i.pravatar.cc/80?u=webdevdaily' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0050' },
  { id: 51,  platform: 'Instagram',  duration: '1:03', date: 'Jan 04, 2026', words: 4400,  title: 'Creative block – how I beat it',  creator: '@studiolife',    thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "I went four months without making anything I was proud of. Here's what finally broke the cycle and why I think creative block is a symptom, not the real problem...",  avatar: 'https://i.pravatar.cc/80?u=studiolife' , status: 'failed', url: 'https://www.instagram.com/reel/mock0051/' },
  { id: 53,  platform: 'TikTok',     duration: '0:38', date: 'Jan 02, 2026', words: 1650,  title: 'New Year studio setup',           creator: '@devlog',        thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "I finally upgraded my recording setup for 2026. New mic, new lighting, same chaotic desk — but the audio quality jump is genuinely night and day...",  avatar: 'https://i.pravatar.cc/80?u=devlog' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000053' },
  { id: 54,  platform: 'YouTube',    duration: '1:41', date: 'Jan 01, 2026', words: 7300,  title: 'Predictions for tech in 2026',    creator: '@aicreative',    thumbnail: 'https://images.unsplash.com/photo-1690191795219-d88b1af86e3b?w=400&q=80',  transcriptSnippet: "Every January I make ten predictions and every December I review them publicly. My hit rate last year was 7 out of 10 — let me tell you what I'm calling for 2026...",  avatar: 'https://i.pravatar.cc/80?u=aicreative' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0054' },
  { id: 55,  platform: 'Instagram',  duration: '0:47', date: 'Dec 31, 2025', words: 2000,  title: 'Year-end reflection',             creator: '@morningpages',  thumbnail: 'https://images.unsplash.com/photo-1766074903112-79661da9ab45?w=400&q=80',  transcriptSnippet: "Looking back at everything from this past year — the wins, the pivots, the things I'd do completely differently. This is my most honest video in a long time...",  avatar: 'https://i.pravatar.cc/80?u=morningpages' , status: 'complete', url: 'https://www.instagram.com/reel/mock0055/' },
  { id: 56,  platform: 'YouTube',    duration: '2:05', date: 'Dec 29, 2025', words: 9200,  title: 'Podcast Episode 17',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest is a former Apple designer who now consults for early-stage startups. We spent two hours on what actually makes a product feel premium at any budget...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0056' },
  { id: 57,  platform: 'TikTok',     duration: '0:55', date: 'Dec 27, 2025', words: 2380,  title: 'Christmas haul – tech edition',   creator: '@techunboxed',   thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "Santa was good to me this year. New keyboard, new monitor arm, and one item I didn't ask for but has become my most-used thing in the office already...",  avatar: 'https://i.pravatar.cc/80?u=techunboxed' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000057' },
  { id: 59,  platform: 'YouTube',    duration: '1:32', date: 'Dec 22, 2025', words: 6700,  title: 'Accessibility in design systems', creator: '@designsystem',  thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Accessibility isn't a checklist you run at the end of a project. It's a design philosophy that changes how you think about every interaction from the first sketch...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0059' },
  { id: 60,  platform: 'TikTok',     duration: '0:42', date: 'Dec 20, 2025', words: 1800,  title: 'Boxing day sale picks',           creator: '@shopdiaries',   thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "I've done the research so you don't have to. Here are the five deals that are actually worth clicking on this year and the three that are just repackaged leftovers...",  avatar: 'https://i.pravatar.cc/80?u=shopdiaries' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000060' },
  { id: 61,  platform: 'Instagram',  duration: '1:08', date: 'Dec 18, 2025', words: 4900,  title: 'Tailwind v4 – first look',        creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "I spent a weekend migrating a real project to Tailwind v4 and the experience was mostly smooth with one very surprising gotcha that I want to warn you about...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.instagram.com/reel/mock0061/' },
  { id: 63,  platform: 'YouTube',    duration: '2:19', date: 'Dec 14, 2025', words: 10400, title: 'Podcast Episode 18',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "On today's episode we break down the anatomy of a viral B2B post — why it worked, whether it was repeatable, and what actually drove the pipeline behind it...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0063' },
  { id: 64,  platform: 'TikTok',     duration: '0:31', date: 'Dec 12, 2025', words: 1340,  title: 'Matcha latte – the right way',    creator: '@kitchenlabs',   thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "Most café matcha lattes are using grade C powder and it tastes like green chalk. Here's what ceremonial grade actually costs and why it's worth every penny...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000064' },
  { id: 65,  platform: 'Instagram',  duration: '0:59', date: 'Dec 10, 2025', words: 2600,  title: 'Conference talk – UX Summit',     creator: '@designops',     thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "I gave a 20-minute talk on friction as a design tool — the idea that adding the right amount of resistance in the right places actually improves user outcomes...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'processing', url: 'https://www.instagram.com/reel/mock0065/' },
  { id: 66,  platform: 'YouTube',    duration: '1:26', date: 'Dec 08, 2025', words: 6200,  title: 'Docker for beginners – 2025',     creator: '@devlog',        thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "Containerisation used to intimidate me. Now I run everything in Docker and I can't imagine going back. Here's the absolute minimum you need to know to get started...",  avatar: 'https://i.pravatar.cc/80?u=devlog' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0066' },
  { id: 68,  platform: 'TikTok',     duration: '0:44', date: 'Dec 04, 2025', words: 1900,  title: 'Berlin techno scene – a guide',   creator: '@djlunar',       thumbnail: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?w=400&q=80',  transcriptSnippet: "People think Berghain is the Berlin techno scene. It's not even close. Here's my honest guide to the clubs, the nights, and the DJs you actually need to know about...",  avatar: 'https://i.pravatar.cc/80?u=djlunar' , status: 'failed', url: 'https://www.tiktok.com/@creator/video/10000000068' },
  { id: 69,  platform: 'YouTube',    duration: '2:34', date: 'Dec 02, 2025', words: 11600, title: 'State management in React 2025',  creator: '@webdevdaily',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "Redux, Zustand, Jotai, Context — the state management landscape has never been more fragmented. Here's how I think about the choice for any given project size...",  avatar: 'https://i.pravatar.cc/80?u=webdevdaily' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0069' },
  { id: 70,  platform: 'Instagram',  duration: '0:38', date: 'Nov 30, 2025', words: 1650,  title: 'Print design – process tour',     creator: '@brandstudio',   thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "Before everything went digital I spent six years doing print. I still think the discipline of designing for physical constraints makes you a better screen designer...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0070/' },
  { id: 72,  platform: 'TikTok',     duration: '0:53', date: 'Nov 26, 2025', words: 2270,  title: 'Soho House visit – review',       creator: '@officedaily',   thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "I spent a full working day at Soho House to see if the membership is worth it for freelancers and remote workers. Honest answer: it depends on one thing...",  avatar: 'https://i.pravatar.cc/80?u=officedaily' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000072' },
  { id: 73,  platform: 'YouTube',    duration: '1:47', date: 'Nov 24, 2025', words: 7900,  title: 'Podcast Episode 19',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest turned a newsletter with 400 subscribers into a $1.2M/year media business. The secret ingredient is something most newsletter writers completely ignore...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0073' },
  { id: 74,  platform: 'Instagram',  duration: '0:41', date: 'Nov 22, 2025', words: 1760,  title: 'Typography fundamentals',         creator: '@designsystem',  thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Choosing a typeface is the first typographic decision but it's rarely the most important. Spacing, hierarchy, and contrast do far more work than the font itself...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'complete', url: 'https://www.instagram.com/reel/mock0074/' },
  { id: 76,  platform: 'TikTok',     duration: '1:12', date: 'Nov 18, 2025', words: 5100,  title: 'Marathon training week 8',        creator: '@fitwithjess',   thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "Week 8 of marathon training and things are getting real. I hit my longest run to date, had my first DNS injury scare, and discovered a fuelling strategy that actually works...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000076' },
  { id: 77,  platform: 'YouTube',    duration: '2:00', date: 'Nov 16, 2025', words: 8800,  title: 'Building a second brain',         creator: '@deepfocuslab',  thumbnail: 'https://images.unsplash.com/photo-1690191795219-d88b1af86e3b?w=400&q=80',  transcriptSnippet: "Tiago Forte coined the term but after three years of implementing it I think most people are overcomplicating the system. Here's the lean version that actually sticks...",  avatar: 'https://i.pravatar.cc/80?u=deepfocuslab' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0077' },
  { id: 78,  platform: 'Instagram',  duration: '0:48', date: 'Nov 14, 2025', words: 2060,  title: 'Client feedback – live session',  creator: '@designops',     thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "I recorded a live client feedback session to show how I handle direction changes, scope creep conversations, and the moment a client asks to make the logo bigger...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'processing', url: 'https://www.instagram.com/reel/mock0078/' },
  { id: 80,  platform: 'TikTok',     duration: '0:35', date: 'Nov 10, 2025', words: 1510,  title: 'Kyoto in autumn – 60 seconds',    creator: '@roamingalex',   thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "Maple season in Kyoto lasts about three weeks and if you're not there for it you're genuinely missing the most beautiful thing I've ever seen with my own eyes...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000080' },
  { id: 81,  platform: 'YouTube',    duration: '1:55', date: 'Nov 08, 2025', words: 8500,  title: 'Podcast Episode 20',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Episode 20 and I wanted to do something different. I brought back five previous guests for a 10-minute each rapid-fire round on what's changed since we last spoke...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0081' },
  { id: 82,  platform: 'Instagram',  duration: '1:01', date: 'Nov 06, 2025', words: 4300,  title: 'Svelte vs React in 2025',         creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "I rebuilt the same app in Svelte and React to compare them properly. The performance difference was smaller than I expected. The DX difference was much larger...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.instagram.com/reel/mock0082/' },
  { id: 84,  platform: 'TikTok',     duration: '0:49', date: 'Nov 02, 2025', words: 2100,  title: 'Espresso dialling – for nerds',   creator: '@kitchenlabs',   thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "I spent three months dialling in my espresso recipe and the variables that made the biggest difference were not what the YouTube algorithm told me to obsess over...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000084' },
  { id: 85,  platform: 'YouTube',    duration: '2:08', date: 'Oct 31, 2025', words: 9400,  title: 'Halloween brand campaign review', creator: '@mktgteam',      thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80',  transcriptSnippet: "Every year brands compete to win Halloween and every year the same mistakes keep getting made. Here's my breakdown of this year's hits and spectacular misses...",  avatar: 'https://i.pravatar.cc/80?u=mktgteam' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0085' },
  { id: 86,  platform: 'Instagram',  duration: '0:32', date: 'Oct 29, 2025', words: 1380,  title: 'Interior design on a budget',     creator: '@spacestudio',   thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "The most impactful room transformation I've ever done cost £340 total. Here's the four decisions that made the biggest visual difference and why paint is never one of them...",  avatar: 'https://i.pravatar.cc/80?u=spacestudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0086/' },
  { id: 88,  platform: 'TikTok',     duration: '0:57', date: 'Oct 25, 2025', words: 2450,  title: 'Retro gaming haul – Oct 2025',    creator: '@techunboxed',   thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "Found a charity shop box that had three SNES cartridges and a boxed Game Boy Pocket for £22 combined. I'll let you know what they were actually worth at the end...",  avatar: 'https://i.pravatar.cc/80?u=techunboxed' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000088' },
  { id: 89,  platform: 'YouTube',    duration: '1:38', date: 'Oct 23, 2025', words: 7100,  title: 'Podcast Episode 21',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Today's guest is a chief of staff at a Series C company. The role is still misunderstood so we spent the whole episode on what it actually is and isn't...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0089' },
  { id: 90,  platform: 'Instagram',  duration: '0:43', date: 'Oct 21, 2025', words: 1850,  title: 'Graphic design trends 2026',      creator: '@brandstudio',   thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "I've been tracking design trends across 400 brand identities launched this year. There are three macro shifts happening simultaneously and they're all pointing the same direction...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0090/' },
  { id: 92,  platform: 'TikTok',     duration: '0:51', date: 'Oct 17, 2025', words: 2190,  title: 'Skincare routine – what works',   creator: '@glowwithme',    thumbnail: 'https://images.unsplash.com/photo-1758273706007-f1524d2d963f?w=400&q=80',  transcriptSnippet: "After years of buying into every skincare launch I stripped my routine back to six products. My skin has never been better and I'm spending about 70% less...",  avatar: 'https://i.pravatar.cc/80?u=glowwithme' , status: 'failed', url: 'https://www.tiktok.com/@creator/video/10000000092' },
  { id: 93,  platform: 'YouTube',    duration: '2:27', date: 'Oct 15, 2025', words: 10700, title: 'Next.js 15 – full walkthrough',   creator: '@webdevdaily',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "Next.js 15 is out and there are some significant changes to how the App Router handles caching, server components, and data fetching patterns. Let me walk you through each one...",  avatar: 'https://i.pravatar.cc/80?u=webdevdaily' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0093' },
  { id: 94,  platform: 'Instagram',  duration: '0:46', date: 'Oct 13, 2025', words: 1970,  title: 'Podcast studio build – part 2',   creator: '@studiolife',    thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "Part two of the studio build and this week I treated the room acoustically. The before and after comparison is honestly embarrassing — I should have done this year one...",  avatar: 'https://i.pravatar.cc/80?u=studiolife' , status: 'complete', url: 'https://www.instagram.com/reel/mock0094/' },
  { id: 96,  platform: 'TikTok',     duration: '0:40', date: 'Oct 09, 2025', words: 1720,  title: 'Running gear – autumn picks',     creator: '@fitwithjess',   thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "October means layering up for runs and making terrible footwear choices in the rain. Here's what I'm actually wearing this season and what I'll never buy again...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000096' },
  { id: 97,  platform: 'YouTube',    duration: '1:53', date: 'Oct 07, 2025', words: 8200,  title: 'Podcast Episode 22',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest left a Director-level role at Google to start something with zero market validation. Three years later it's one of the fastest growing HR tools in Europe...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0097' },
  { id: 98,  platform: 'Instagram',  duration: '0:55', date: 'Oct 05, 2025', words: 2370,  title: 'Canva vs Figma – creator view',   creator: '@designops',     thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "I know this debate is contentious but after using both daily for a year I have a clear view: they're solving completely different problems and that's not a bad thing...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'complete', url: 'https://www.instagram.com/reel/mock0098/' },
  { id: 100, platform: 'TikTok',     duration: '0:36', date: 'Oct 01, 2025', words: 1570,  title: 'Bookshelf tour – Q4 reads',       creator: '@morningpages',  thumbnail: 'https://images.unsplash.com/photo-1766074903112-79661da9ab45?w=400&q=80',  transcriptSnippet: "These are the five books I'm starting Q4 with and why I chose each one. I'm also retiring three books from the to-read pile that I've been carrying around for two years...",  avatar: 'https://i.pravatar.cc/80?u=morningpages' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000100' },
  { id: 101, platform: 'YouTube',    duration: '2:15', date: 'Sep 29, 2025', words: 9800,  title: 'Podcast Episode 23',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Today: a deep dive on community-led growth with someone who built a 40,000-member community that now drives 35% of their company's new revenue every month...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0101' },
  { id: 102, platform: 'Instagram',  duration: '0:50', date: 'Sep 27, 2025', words: 2150,  title: 'Portfolio redesign – live crit',  creator: '@brandstudio',   thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "I gave live feedback on 10 designer portfolios sent in by followers. Honest, constructive, and I think pretty useful whether your portfolio is in this video or not...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'failed', url: 'https://www.instagram.com/reel/mock0102/' },
  { id: 104, platform: 'TikTok',     duration: '0:44', date: 'Sep 23, 2025', words: 1890,  title: 'One-pan dinners �� week 3',        creator: '@kitchenlabs',   thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "Week three of the one-pan challenge and I've officially convinced my partner that you don't need to wash four dishes to make a good meal on a Tuesday night...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000104' },
  { id: 105, platform: 'YouTube',    duration: '1:44', date: 'Sep 21, 2025', words: 7600,  title: 'Git workflow for teams',          creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "Trunk-based development, Gitflow, and GitHub flow each solve different problems. Here's how I help teams choose the right branching strategy for where they actually are...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0105' },
  { id: 106, platform: 'Instagram',  duration: '0:37', date: 'Sep 19, 2025', words: 1620,  title: 'Illustration process – editorial', creator: '@studiolife',   thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "This editorial piece for a climate publication started with a brief I hated and ended with the work I'm most proud of this year. Here's how that happened...",  avatar: 'https://i.pravatar.cc/80?u=studiolife' , status: 'complete', url: 'https://www.instagram.com/reel/mock0106/' },
  { id: 108, platform: 'TikTok',     duration: '0:48', date: 'Sep 15, 2025', words: 2060,  title: 'Camping with minimal kit',        creator: '@roamingalex',   thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "I did three nights in the Scottish Highlands with a pack that weighed 7kg. Here's exactly what was in it, what I used every day, and what I'll leave behind next time...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000108' },
  { id: 109, platform: 'YouTube',    duration: '2:20', date: 'Sep 13, 2025', words: 10200, title: 'Podcast Episode 24',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest spent ten years at McKinsey, left to build a direct-to-consumer brand, sold it, and is now writing a book about the strategic mistakes he made along the way...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0109' },
  { id: 110, platform: 'Instagram',  duration: '0:42', date: 'Sep 11, 2025', words: 1800,  title: 'Motion design basics',            creator: '@designsystem',  thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Motion design in UI is either invisible and perfect or visible and distracting. The goal is always the first one and it comes down to understanding five core principles...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'complete', url: 'https://www.instagram.com/reel/mock0110/' },
  { id: 112, platform: 'TikTok',     duration: '1:05', date: 'Sep 07, 2025', words: 4500,  title: 'DJ set – sunset session',         creator: '@djlunar',       thumbnail: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?w=400&q=80',  transcriptSnippet: "This is the set I played for the rooftop sunset party in Lisbon. I'll walk you through the track selection, the transitions that worked, and the one that absolutely didn't...",  avatar: 'https://i.pravatar.cc/80?u=djlunar' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000112' },
  { id: 113, platform: 'YouTube',    duration: '1:29', date: 'Sep 05, 2025', words: 6500,  title: 'Side project to $10k MRR',        creator: '@buildersclub',  thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "I built a side project in 14 days, charged for it on day 15, and hit $10k MRR in four months. Here's every decision I made and what I'd do differently with hindsight...",  avatar: 'https://i.pravatar.cc/80?u=buildersclub' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0113' },
  { id: 114, platform: 'Instagram',  duration: '0:39', date: 'Sep 03, 2025', words: 1690,  title: 'Posture & desk setup tips',       creator: '@deepfocuslab',  thumbnail: 'https://images.unsplash.com/photo-1766074903112-79661da9ab45?w=400&q=80',  transcriptSnippet: "I spent three years with chronic neck pain before I fixed my desk setup. The changes were all free or under £50 and the difference was almost immediate...",  avatar: 'https://i.pravatar.cc/80?u=deepfocuslab' , status: 'processing', url: 'https://www.instagram.com/reel/mock0114/' },
  { id: 116, platform: 'TikTok',     duration: '0:43', date: 'Aug 30, 2025', words: 1860,  title: 'Van life week 12 – Scotland',     creator: '@roamingalex',   thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "Week 12 on the road and Scotland has broken me in the best possible way. The roads are terrifying, the weather is relentless, and I've never felt more alive...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000116' },
  { id: 117, platform: 'YouTube',    duration: '2:03', date: 'Aug 28, 2025', words: 9100,  title: 'Podcast Episode 25',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Episode 25 is a milestone so I brought back my most-downloaded guest. We talked about what changed in their business since we last spoke — and it's a lot...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'processing', url: 'https://www.youtube.com/watch?v=mock0117' },
  { id: 118, platform: 'Instagram',  duration: '0:56', date: 'Aug 26, 2025', words: 2400,  title: 'Rebranding a 30-year-old company', creator: '@brandstudio',  thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "This client had a 30-year legacy to honour and a completely new audience to attract. Getting both right in one rebrand is one of the hardest briefs you can work on...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'complete', url: 'https://www.instagram.com/reel/mock0118/' },
  { id: 120, platform: 'TikTok',     duration: '0:47', date: 'Aug 22, 2025', words: 2020,  title: 'Miso ramen from scratch',         creator: '@kitchenlabs',   thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "Proper miso ramen takes six hours and it's worth every minute. I'll show you the broth, the tare, the toppings, and the one shortcut that doesn't ruin anything...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000120' },
  { id: 121, platform: 'YouTube',    duration: '1:48', date: 'Aug 20, 2025', words: 7800,  title: 'Web performance in 2025',         creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "Core Web Vitals are the baseline but the gap between a good score and a fast-feeling app is still massive. Here are the optimisation patterns that actually move the needle...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0121' },
  { id: 122, platform: 'Instagram',  duration: '0:36', date: 'Aug 18, 2025', words: 1560,  title: 'Capsule wardrobe for creatives',  creator: '@officedaily',   thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  transcriptSnippet: "I wear the same 14 pieces in constant rotation and I've never wasted less decision-making energy on what to wear. Here's how I built it and what I'd buy first...",  avatar: 'https://i.pravatar.cc/80?u=officedaily' , status: 'complete', url: 'https://www.instagram.com/reel/mock0122/' },
  { id: 124, platform: 'TikTok',     duration: '0:54', date: 'Aug 14, 2025', words: 2310,  title: 'Record collection – August haul', creator: '@djlunar',       thumbnail: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?w=400&q=80',  transcriptSnippet: "Found a private seller who was clearing out a garage full of 80s electronic records. The price he named was either a typo or the best day of my life. It was the latter...",  avatar: 'https://i.pravatar.cc/80?u=djlunar' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000124' },
  { id: 125, platform: 'YouTube',    duration: '2:10', date: 'Aug 12, 2025', words: 9600,  title: 'Podcast Episode 26',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest is a product designer who's worked on four unicorn apps. She's never given an interview before and she was brutally honest about what the inside of those companies actually looked like...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0125' },
  { id: 126, platform: 'Instagram',  duration: '0:44', date: 'Aug 10, 2025', words: 1880,  title: 'Wireframing process – live demo',  creator: '@designops',    thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "I wireframe everything before I touch a design tool and it saves me hours every time. Here's my process from brief to validated structure in under an afternoon...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'complete', url: 'https://www.instagram.com/reel/mock0126/' },
  { id: 128, platform: 'TikTok',     duration: '0:52', date: 'Aug 06, 2025', words: 2240,  title: 'Power BI dashboard walkthrough',  creator: '@deepfocuslab',  thumbnail: 'https://images.unsplash.com/photo-1690191795219-d88b1af86e3b?w=400&q=80',  transcriptSnippet: "I built a real-time operations dashboard in Power BI for a 50-person company and I'm walking through every design decision and the data model underneath it...",  avatar: 'https://i.pravatar.cc/80?u=deepfocuslab' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000128' },
  { id: 129, platform: 'YouTube',    duration: '1:57', date: 'Aug 04, 2025', words: 8600,  title: 'Podcast Episode 27',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Today I'm joined by a growth consultant who's taken three companies from pre-product to Series A. We got into the specific playbook she uses in the first 90 days...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0129' },
  { id: 130, platform: 'Instagram',  duration: '0:41', date: 'Aug 02, 2025', words: 1760,  title: 'Logo design – from scratch',      creator: '@brandstudio',   thumbnail: 'https://images.unsplash.com/photo-1643982102543-bc057db646cf?w=400&q=80',  transcriptSnippet: "Start to finish logo design for a sustainable food brand. I'll show you the early sketches, the dead ends, and the moment it finally clicked into the right direction...",  avatar: 'https://i.pravatar.cc/80?u=brandstudio' , status: 'processing', url: 'https://www.instagram.com/reel/mock0130/' },
  { id: 132, platform: 'TikTok',     duration: '0:49', date: 'Jul 29, 2025', words: 2100,  title: 'Algarve trip – hidden beaches',   creator: '@roamingalex',   thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80',  transcriptSnippet: "Everyone goes to Albufeira. I spent a week finding the beaches in the Algarve that aren't on any tourist map. Here's where they are and how to get there without a car...",  avatar: 'https://i.pravatar.cc/80?u=roamingalex' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000132' },
  { id: 133, platform: 'YouTube',    duration: '2:24', date: 'Jul 27, 2025', words: 10500, title: 'Podcast Episode 28',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "A two-hour conversation with someone who's been a solo creator for a decade. They've never taken investment, never hired anyone, and make more money than most funded startups...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'processing', url: 'https://www.youtube.com/watch?v=mock0133' },
  { id: 134, platform: 'Instagram',  duration: '0:35', date: 'Jul 25, 2025', words: 1510,  title: 'Type pairing guide – 2025',       creator: '@designsystem',  thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80',  transcriptSnippet: "Pairing typefaces well is part science, part instinct, and mostly practice. Here are my five favourite working pairs right now and the logic behind each combination...",  avatar: 'https://i.pravatar.cc/80?u=designsystem' , status: 'complete', url: 'https://www.instagram.com/reel/mock0134/' },
  { id: 136, platform: 'TikTok',     duration: '0:55', date: 'Jul 21, 2025', words: 2380,  title: 'Strength training over 40',       creator: '@fitwithjess',   thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80',  transcriptSnippet: "Turning 42 was the year my training finally clicked. Not because I trained harder — because I finally stopped trying to train like I was 26 and started training for who I actually am...",  avatar: 'https://i.pravatar.cc/80?u=fitwithjess' , status: 'failed', url: 'https://www.tiktok.com/@creator/video/10000000136' },
  { id: 137, platform: 'YouTube',    duration: '1:33', date: 'Jul 19, 2025', words: 6700,  title: 'Building with Supabase – full',   creator: '@codewithtom',   thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80',  transcriptSnippet: "I built a full-stack app with auth, real-time subscriptions, and row-level security using Supabase in one weekend. Here's every line of the interesting parts...",  avatar: 'https://i.pravatar.cc/80?u=codewithtom' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0137' },
  { id: 138, platform: 'Instagram',  duration: '0:40', date: 'Jul 17, 2025', words: 1720,  title: 'Ceramics – beginners wheel',      creator: '@studiolife',    thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80',  transcriptSnippet: "I took a ceramics class on a whim and somehow ended up going every week for four months. Here's what nobody tells you about learning to throw on the wheel as an adult...",  avatar: 'https://i.pravatar.cc/80?u=studiolife' , status: 'failed', url: 'https://www.instagram.com/reel/mock0138/' },
  { id: 140, platform: 'TikTok',     duration: '0:57', date: 'Jul 13, 2025', words: 2450,  title: 'Budget PC build – July 2025',     creator: '@techunboxed',   thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80',  transcriptSnippet: "I built a gaming PC for under £600 and it plays everything on high settings. Here's the part list, the build decisions, and the one upgrade I'd add first if I had another £80...",  avatar: 'https://i.pravatar.cc/80?u=techunboxed' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000140' },
  { id: 141, platform: 'YouTube',    duration: '2:06', date: 'Jul 11, 2025', words: 9300,  title: 'Podcast Episode 29',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "The creator economy is maturing and my guest has been at the centre of it for seven years. We talked about what the first generation of creators got right and what's missing now...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0141' },
  { id: 142, platform: 'Instagram',  duration: '0:38', date: 'Jul 09, 2025', words: 1630,  title: 'Dark mode design principles',     creator: '@designops',     thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "Dark mode isn't just inverting your colour palette. Done well it's a completely different visual experience. Done badly it's just a beige-to-grey conversion that gives people headaches...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'complete', url: 'https://www.instagram.com/reel/mock0142/' },
  { id: 144, platform: 'TikTok',     duration: '0:44', date: 'Jul 05, 2025', words: 1890,  title: 'Homemade hot sauce – process',    creator: '@kitchenlabs',   thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80',  transcriptSnippet: "I fermented my first hot sauce last summer and gave bottles to friends as Christmas gifts. Now they're demanding more and I'm starting to think this might be a business...",  avatar: 'https://i.pravatar.cc/80?u=kitchenlabs' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000144' },
  { id: 145, platform: 'YouTube',    duration: '1:40', date: 'Jul 03, 2025', words: 7200,  title: 'Podcast Episode 30',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "Episode 30 and I'm reflecting on what this podcast has become. Then I'm joined by the very first guest from episode 1 to see how their story has evolved over 18 months...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0145' },
  { id: 146, platform: 'Instagram',  duration: '0:46', date: 'Jul 01, 2025', words: 1980,  title: 'Glastonbury photography tips',    creator: '@shotbyme',      thumbnail: 'https://images.unsplash.com/photo-1511881220587-13b89d1da6b8?w=400&q=80',  transcriptSnippet: "Shooting at a festival is genuinely hard — unpredictable light, moving crowds, battery anxiety. Here are the settings and strategies that saved every shot from this year's Glastonbury...",  avatar: 'https://i.pravatar.cc/80?u=shotbyme' , status: 'complete', url: 'https://www.instagram.com/reel/mock0146/' },
  { id: 148, platform: 'TikTok',     duration: '1:01', date: 'Jun 27, 2025', words: 4300,  title: 'Music production – sample packs', creator: '@djlunar',       thumbnail: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?w=400&q=80',  transcriptSnippet: "I released my first sample pack this month and sold 400 copies in the first week with zero paid advertising. Here's exactly what I did and what surprised me about the whole process...",  avatar: 'https://i.pravatar.cc/80?u=djlunar' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000148' },
  { id: 149, platform: 'YouTube',    duration: '2:18', date: 'Jun 25, 2025', words: 10100, title: 'Podcast Episode 31',              creator: '@tokcast',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My longest and most technical episode yet — three hours on the architecture decisions behind a platform that handles 2 billion events per day with a team of twelve engineers...",  avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0149' },
  { id: 150, platform: 'Instagram',  duration: '0:53', date: 'Jun 23, 2025', words: 2270,  title: 'Summer design sprint recap',      creator: '@designops',     thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  transcriptSnippet: "We ran a five-day design sprint with a client who'd been stuck on the same problem for six months. By Friday we had a validated prototype and a very relieved product team...",  avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'complete', url: 'https://www.instagram.com/reel/mock0150/' },
];

const PLATFORMS = ['All', 'TikTok', 'Instagram', 'YouTube'];
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'saves',     label: 'Most saved' },
  { value: 'words-desc',label: 'Most words' },
];

// ─── History Row (list view) ──────────────────────────────────────────────────
function HistoryRow({ entry, isDark, border, text, muted, hoverBg, onSelect, openMenuId, setOpenMenuId }: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onSelect: (entry: HistoryEntry) => void;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isMenuOpen = openMenuId === entry.id;

  const statusBg   = entry.status === 'complete' ? 'rgba(34,197,94,0.12)'  : entry.status === 'failed' ? 'rgba(239,68,68,0.12)'  : 'rgba(245,158,11,0.12)';
  const statusClr  = entry.status === 'complete' ? (isDark ? '#4ade80' : '#16a34a') : entry.status === 'failed' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#fbbf24' : '#d97706');
  const statusLbl  = entry.status === 'complete' ? 'Complete' : entry.status === 'failed' ? 'Failed' : 'In Progress';
  return (
    <div
      className="flex items-center px-4 py-3 cursor-pointer relative group"
      style={{ borderBottom: `1px solid ${border}`, background: hovered ? hoverBg : 'transparent', transition: 'background 0.15s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(entry)}
    >
      {/* Thumbnail */}
      <div className="w-12 aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 relative mr-3">
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <Play className="w-3 h-3 text-white fill-white" />
        </div>
        <PlatformBadge platform={entry.platform} />
        <button
          className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => e.stopPropagation()}
        >
          <Heart className="w-2.5 h-2.5 text-white" />
        </button>
        <span className="absolute bottom-1 right-1 text-[9px] px-1 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
          {formatDuration(entry.duration)}
        </span>
      </div>

      {/* Content column */}
      <div className="flex-shrink-0" style={{ width: 280 }}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="relative flex-shrink-0">
            <img src={entry.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
            {VERIFIED_CREATORS.has(entry.creator) && (
              <span className="absolute flex items-center justify-center rounded-full"
                style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                </svg>
              </span>
            )}
          </div>
          <span className="text-[11px]" style={{ color: muted }}>{entry.creator}</span>
        </div>
        <p className="truncate text-sm" style={{ color: text, fontWeight: 500 }}>{entry.title}</p>
      </div>

      {/* Transcript column */}
      <div className="flex-1 min-w-0">
        {entry.status === 'failed'
          ? <span className="text-[11px]" style={{ color: isDark ? '#f87171' : '#dc2626' }}>Failed to process</span>
          : <p className="text-[11px] truncate" style={{ color: muted }}>{entry.transcriptSnippet}</p>
        }
      </div>

      {/* Date column */}
      <div className="flex-shrink-0 flex items-end flex-col" style={{ width: 80 }}>
        <span className="text-[11px]" style={{ color: text }}>{entry.date}</span>
      </div>

      {/* Duration column */}
      <div className="flex-shrink-0 text-center" style={{ width: 60 }}>
        <span className="text-[12px]" style={{ color: muted }}>{entry.duration}</span>
      </div>

      {/* Status column */}
      <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
          style={{ background: statusBg, color: statusClr }}>
          {statusLbl}
        </span>
      </div>

      {/* Actions column */}
      <div className="flex-shrink-0 relative" style={{ width: 32 }} onClick={e => e.stopPropagation()}>
        <button
          className="w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ color: muted, background: isMenuOpen ? hoverBg : 'transparent' }}
          onClick={e => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : entry.id); }}
          onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
          onMouseLeave={ev => { if (!isMenuOpen) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-7 z-50 rounded-xl overflow-hidden py-1 shadow-lg"
            style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, minWidth: 160 }}>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors"
              style={{ color: text }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              onClick={() => { navigator.clipboard.writeText(entry.transcriptSnippet).catch(() => {}); setOpenMenuId(null); }}
            >
              <Copy className="w-3.5 h-3.5" style={{ color: muted }} />
              Copy Transcript
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors"
              style={{ color: text }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              onClick={() => setOpenMenuId(null)}
            >
              <Download className="w-3.5 h-3.5" style={{ color: muted }} />
              Download
            </button>
            {entry.url && (
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors"
                style={{ color: text }}
                onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                onClick={() => { window.open(entry.url, '_blank'); setOpenMenuId(null); }}
              >
                <ExternalLink className="w-3.5 h-3.5" style={{ color: muted }} />
                View Original
              </button>
            )}
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors"
              style={{ color: text }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              onClick={() => { navigator.clipboard.writeText(window.location.origin + '/discover/' + entry.id).catch(() => {}); setOpenMenuId(null); }}
            >
              <Link2 className="w-3.5 h-3.5" style={{ color: muted }} />
              Share Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── History Card (grid view) ─────────────────────────────────────────────────
function HistoryCard({ entry, isDark, border, text, muted, hoverBg, onSelect, isSelected, onToggleSelect }: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onSelect: (entry: HistoryEntry) => void;
  isSelected?: boolean; onToggleSelect?: (id: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [folderModalFor, setFolderModalFor] = useState<{ id: number; rect: DOMRect; title: string } | null>(null);

  const cardBg = isDark ? '#141414' : '#ffffff';
  const selectedBorder = isSelected ? '2px solid #00b8b2' : `1px solid ${border}`;
  const selectedBg = isSelected ? (isDark ? 'rgba(0,184,178,0.06)' : 'rgba(0,184,178,0.04)') : cardBg;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ border: selectedBorder, background: selectedBg, transition: 'border-color 0.2s ease, background 0.2s ease' }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isSelected ? selectedBg : cardBg; }}
      onClick={() => onSelect(entry)}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white opacity-80" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          {isDark ? (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                color: '#ffffff',
                fontWeight: 600,
                backdropFilter: 'blur(6px)',
              }}
            >
              {entry.platform === 'YouTube' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                </svg>
              )}
              {entry.platform === 'TikTok' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" />
                </svg>
              )}
              {entry.platform === 'Instagram' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              )}
              {entry.platform}
            </span>
          ) : (
            <PlatformBadge platform={entry.platform} />
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>{formatDuration(entry.duration)}</span>
        </div>
        {/* ── Checkbox overlay ── */}
        {onToggleSelect && (
          <button
            className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: isSelected ? '#00b8b2' : 'rgba(0,0,0,0.45)',
              border: `1.5px solid ${isSelected ? '#00b8b2' : 'rgba(255,255,255,0.3)'}`,
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onClick={e => { e.stopPropagation(); onToggleSelect(entry.id); }}
          >
            {isSelected && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
        {/* ── Action overlays ── */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: favourited ? 'rgba(239,68,68,0.25)' : 'rgba(0,0,0,0.45)',
              color: favourited ? '#ef4444' : '#ffffff',
              border: `1px solid ${favourited ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)'}`,
              backdropFilter: 'blur(8px)',
            }}
            onClick={e => {
              e.stopPropagation();
              setFavourited(v => !v);
            }}
            title={favourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.45)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={e => {
              e.stopPropagation();
              setFolderModalFor({ id: entry.id, rect: e.currentTarget.getBoundingClientRect(), title: entry.title });
            }}
            title="Save to folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-shrink-0">
            <img src={entry.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
            {VERIFIED_CREATORS.has(entry.creator) && (
              <span className="absolute flex items-center justify-center rounded-full"
                style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                </svg>
              </span>
            )}
          </div>
          <span className="text-[10px]" style={{ color: muted }}>{entry.creator}</span>
        </div>
        <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{entry.title}</p>
        <p className="text-[10px]" style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {entry.transcriptSnippet}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: muted }}>{entry.date}</span>
          <div className="flex items-center gap-1">

            {/* Copy */}
            <button
              className="p-1 rounded-md transition-colors"
              style={{ color: copied ? '#00b8b2' : muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
              onClick={e => {
                e.stopPropagation();
                navigator.clipboard.writeText(entry.transcriptSnippet).catch(() => {});
                setCopied(true); setTimeout(() => setCopied(false), 2000);
              }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              {copied ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            </button>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                className="p-1 rounded-md transition-colors"
                style={{
                  color: showMenu ? text : muted,
                  background: showMenu ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                  border: `1px solid ${border}`,
                }}
                onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
                title="More options"
                onMouseEnter={ev => { if (!showMenu) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={ev => { if (!showMenu) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
              >
                <MoreHorizontal className="w-2.5 h-2.5" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setShowMenu(false); }} />
                  <div
                    className="absolute bottom-full right-0 mb-1 rounded-xl overflow-hidden z-50 py-1 flex flex-col"
                    style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 148 }}
                  >
                    {[
                      { label: 'Open transcript', icon: <FileText className="w-3 h-3" />, action: () => { onSelect(entry); setShowMenu(false); } },
                      { label: copied ? 'Copied!' : 'Copy snippet', icon: copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />, action: () => { navigator.clipboard.writeText(entry.transcriptSnippet).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); setShowMenu(false); } },
                      { label: favourited ? 'Unfavourite' : 'Favourite', icon: <Heart className="w-3 h-3" style={{ fill: favourited ? '#ef4444' : 'none', color: favourited ? '#ef4444' : 'inherit' }} />, action: () => { setFavourited(v => !v); setShowMenu(false); } },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left transition-colors"
                        style={{ color: muted, background: 'transparent' }}
                        onClick={e => { e.stopPropagation(); item.action(); }}
                        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      {folderModalFor && (
        <SaveToFolderModal type="transcript" refId={folderModalFor.id} name={folderModalFor.title}
          triggerRect={folderModalFor.rect} onClose={() => setFolderModalFor(null)} />
      )}
    </div>
  );
}

// ─── Helper: build TranscriptDetailVideo from a HistoryEntry ─────────────────
function buildVideoFromHistory(entry: HistoryEntry): TranscriptDetailVideo {
  return {
    title:       entry.title,
    creator:     entry.creator,
    platform:    entry.platform,
    likes:       _likesFromWords(entry.words),
    duration:    entry.duration,
    language:    'EN',
    date:        entry.date,
    wordCount:   entry.words,
    charCount:   Math.round(entry.words * 5.1),
    sentences:   Math.round(entry.words / 13),
    readability: _readabilityFromWords(entry.words),
    thumbnail:   entry.thumbnail,
    avatar:      'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=200&q=80',
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function DiscoverPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hybrid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterSearchFocused, setFilterSearchFocused] = useState(false);
  const [activeDurations, setActiveDurations] = useState<string[]>([]);
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [activeDateRanges, setActiveDateRanges] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [freeViewsUsed, setFreeViewsUsed] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [ppDropdownPos, setPpDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const ppBtnRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (entry: HistoryEntry) => {
    if (plan === 'free' && freeViewsUsed >= FREE_LIMITS.discoverViews) {
      openUpgrade();
      return;
    }
    if (plan === 'free') setFreeViewsUsed(v => v + 1);
    setSelectedEntry(entry);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectedEntries = MY_HISTORY.filter(e => selectedIds.has(e.id));

  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest first';

  const filteredHistory = MY_HISTORY.filter(e => {
    const matchP = activePlatform === 'All' || activePlatform === e.platform;
    const q = searchQuery.toLowerCase();
    const matchQ = !q || e.title.toLowerCase().includes(q) || e.creator.toLowerCase().includes(q) || e.transcriptSnippet.toLowerCase().includes(q);
    const [m, s] = e.duration.split(':').map(Number);
    const mins = m + (s || 0) / 60;
    const matchD = activeDurations.length === 0 || (
      (activeDurations.includes('<1 min')  && mins < 1) ||
      (activeDurations.includes('1–3 min') && mins >= 1 && mins < 3) ||
      (activeDurations.includes('3+ min')  && mins >= 3)
    );
    const matchW = activeWords.length === 0 || (
      (activeWords.includes('<1K')   && e.words < 1000) ||
      (activeWords.includes('1K–5K') && e.words >= 1000 && e.words <= 5000) ||
      (activeWords.includes('5K+')   && e.words > 5000)
    );
    const eDate = new Date(e.date);
    const now = new Date('2026-03-01');
    const diffDays = Math.floor((now.getTime() - eDate.getTime()) / 86400000);
    const matchDate = activeDateRanges.length === 0 || (
      (activeDateRanges.includes('Today')      && diffDays === 0) ||
      (activeDateRanges.includes('This week')  && diffDays <= 7) ||
      (activeDateRanges.includes('This month') && eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear())
    );
    return matchP && matchQ && matchD && matchW && matchDate;
  });

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      {/* ══ TOP HEADER ══════════════════════════════════════════════════════ */}
      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        <AppSidebar activePage="discover" collapsed={sidebarCollapsed} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full px-6 pt-6 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                
                <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  Recently scanned transcripts
                </h1>
                <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6, maxWidth: 480 }}>
                  Browse transcripts other users have recently scanned and made public.
                </p>
              </div>

              {/* Free tier usage pill */}
              {plan === 'free' && (
                null
              )}
            </div>
          </div>{/* end max-w page header */}
          </div>

          {/* ── Single-row Filter Bar ────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search — identical style to header */}
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
                onFocus={() => setFilterSearchFocused(true)}
                onBlur={() => setFilterSearchFocused(false)}
                placeholder="Search transcripts or profiles…"
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

            {/* Platform tabs */}
            {(['All', 'TikTok', 'Instagram', 'YouTube'] as const).map(tab => {
              const isActive = activePlatform === tab;
              const tabIcons: Record<string, JSX.Element | null> = {
                All: null,
                TikTok: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>,
                Instagram: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                YouTube: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
              };
              return (
                <button
                  key={tab}
                  onClick={() => { setActivePlatform(tab); setCurrentPage(1); }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 transition-all"
                  style={{
                    background: isActive
                      ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)')
                      : 'transparent',
                    color: isActive ? text : muted,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tabIcons[tab]}
                  {tab}
                </button>
              );
            })}

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            <div className="flex-1" />

            {/* Duration multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeDurations.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeDurations.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeDurations.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeDurations.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
              >
                <Clock className="w-3 h-3" />
                {activeDurations.length === 0 ? 'Duration' : activeDurations.length === 1 ? activeDurations[0] : `${activeDurations.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'duration' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'duration' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 130 }}>
                    {['<1 min', '1–3 min', '3+ min'].map(opt => {
                      const sel = activeDurations.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveDurations(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); setCurrentPage(1); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Words multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeWords.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeWords.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeWords.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'words' ? null : 'words')}
              >
                <FileText className="w-3 h-3" />
                {activeWords.length === 0 ? 'Words' : activeWords.length === 1 ? activeWords[0] : `${activeWords.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'words' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'words' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}>
                    {['<1K', '1K–5K', '5K+'].map(opt => {
                      const sel = activeWords.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); setCurrentPage(1); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Date multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeDateRanges.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeDateRanges.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeDateRanges.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              >
                <Calendar className="w-3 h-3" />
                {activeDateRanges.length === 0 ? 'Date' : activeDateRanges.length === 1 ? activeDateRanges[0] : `${activeDateRanges.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'date' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['Today', 'This week', 'This month'].map(opt => {
                      const sel = activeDateRanges.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); setCurrentPage(1); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sortBy !== 'date-desc' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: sortBy !== 'date-desc' ? '#00b8b2' : muted,
                  border: `1px solid ${sortBy !== 'date-desc' ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: sortBy !== 'date-desc' ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {sortLabel}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); setCurrentPage(1); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                        style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}{sortBy === opt.value && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Clear all */}
            {(activePlatform !== 'All' || activeDurations.length > 0 || activeWords.length > 0 || activeDateRanges.length > 0 || sortBy !== 'date-desc' || searchQuery) && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button
                  className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70 flex-shrink-0"
                  style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setActivePlatform('All'); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setSearchQuery(''); setCurrentPage(1); }}
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </>
            )}

            {/* Per-page selector */}
            <div className="relative flex-shrink-0">
              
              {openDropdown === 'perpage' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute right-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 100 }}>
                    {[30, 50, 100].map(n => (
                      <button key={n} onClick={() => { setItemsPerPage(n); setCurrentPage(1); setOpenDropdown(null); }}
                        className="w-full text-left px-3 py-2 text-xs transition-colors"
                        style={{ color: itemsPerPage === n ? '#00b8b2' : muted, background: itemsPerPage === n ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: itemsPerPage === n ? 500 : 400 }}
                        onMouseEnter={ev => { if (itemsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { if (itemsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{n} per page</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* View toggle */}
            <div className="flex items-center p-0.5 rounded-lg flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}>
              {([
                { mode: 'grid'   as const, icon: <LayoutGrid className="w-3.5 h-3.5" />, title: 'Grid view'   },
                { mode: 'list'   as const, icon: <List       className="w-3.5 h-3.5" />, title: 'List view'   },
                { mode: 'hybrid' as const, icon: <Columns2   className="w-3.5 h-3.5" />, title: 'Hybrid view' },
              ] as const).map(({ mode, icon, title }) => (
                <button
                  key={mode}
                  title={title}
                  onClick={() => setViewMode(mode)}
                  className="p-1.5 rounded-md transition-all"
                  style={{
                    background: viewMode === mode ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                    color: viewMode === mode ? text : muted,
                    boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  }}
                >{icon}</button>
              ))}
            </div>
          </div>{/* end max-w filter row */}
          </div>

          {/* Content — My History */}
          {viewMode === 'hybrid' ? (
            /* ── Hybrid: left list + right detail ──────────────────────── */
            <div className="flex-1 overflow-hidden">
              <div className="flex max-w-[1280px] mx-auto w-full h-full min-h-0 overflow-hidden px-6 py-5">

              {/* Left: compact scrollable list */}
              <div className="flex-shrink-0 flex flex-col" style={{ width: 224, borderRight: `1px solid ${border}` }}>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {filteredHistory.length > 0 ? (
                    <div className="flex flex-col gap-1 py-3 px-3">
                      {paginatedHistory.map(e => (
                        <div
                          key={e.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                          style={{
                            background: selectedEntry?.id === e.id
                              ? (isDark ? 'rgba(255,255,255,0.07)' : '#f0eeeb')
                              : 'transparent',
                            border: `1px solid ${selectedEntry?.id === e.id ? border : 'transparent'}`,
                            transition: 'background 0.1s',
                          }}
                          onClick={() => handleSelect(e)}
                          onMouseEnter={ev => { if (selectedEntry?.id !== e.id) (ev.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (selectedEntry?.id !== e.id) (ev.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                        >
                          <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 30, aspectRatio: '9/16' }}>
                            <ImageWithFallback src={e.thumbnail} alt={e.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <p
                              className="text-[11px] leading-snug"
                              style={{ color: text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}
                            >{e.title.length > 30 ? e.title.slice(0, 30) + '…' : e.title}</p>
                            <div className="flex items-center gap-1">
                              <div className="relative flex-shrink-0">
                                <img src={e.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                                {VERIFIED_CREATORS.has(e.creator) && (
                                  <span className="absolute flex items-center justify-center rounded-full"
                                    style={{ bottom: -1, right: -1, width: 7, height: 7, background: '#1d9bf0', border: '1px solid #fff' }}>
                                    <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                    </svg>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] truncate" style={{ color: muted }}>{e.creator}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px]" style={{ color: muted }}>{e.platform}</span>
                              <span className="text-[9px]" style={{ color: muted }}>·</span>
                              <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: muted }} />
                              <span className="text-[9px]" style={{ color: muted }}>{formatDuration(e.duration)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-2 px-4">
                      <History className="w-6 h-6" style={{ color: muted }} />
                      <p className="text-xs text-center" style={{ color: muted }}>No transcripts match your filters</p>
                    </div>
                  )}

                  {/* Compact pagination */}
                  {filteredHistory.length > itemsPerPage && (() => {
                    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
                    return (
                      <div className="flex items-center justify-center gap-1 px-3 pb-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className="w-6 h-6 rounded-md text-[10px] transition-colors"
                            style={{
                              background: p === currentPage ? (isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb') : 'transparent',
                              color: p === currentPage ? text : muted,
                            }}
                          >{p}</button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right: detail panel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {selectedEntry ? (() => {
                  const videoData   = buildVideoFromHistory(selectedEntry);
                  const panelBg     = isDark ? '#141414' : '#ffffff';
                  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
                  const panelHover  = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
                  return (
                    <TranscriptDetailPanel
                      video={videoData}
                      transcript={getTranscriptBlocks(selectedEntry)}
                      related={PANEL_RELATED}
                      downloadFormats={PANEL_DOWNLOAD_FORMATS}
                      isDark={isDark}
                      bg={panelBg}
                      border={border}
                      text={text}
                      muted={muted}
                      hoverBg={panelHover}
                      cardBg={innerCardBg}
                      onBack={() => setSelectedEntry(null)}
                    />
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', border: `1px solid ${border}` }}>
                      <FileText className="w-5 h-5" style={{ color: muted }} />
                    </div>
                    <p className="text-sm" style={{ color: muted }}>Select a transcript to view</p>
                  </div>
                )}
              </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1280px] mx-auto w-full px-6 py-5">
            {selectedIds.size > 0 && (
              <SelectionBar
                selectedCount={selectedIds.size}
                isDark={isDark}
                accentColor="#00b8b2"
                onDownloadVideos={() => selectedEntries.forEach(e => simulateVideoDownload(e.title))}
                onDownloadCovers={() => selectedEntries.forEach(e => simulateCoverDownload(e.title))}
                onDownloadTranscripts={() => selectedEntries.forEach(e => simulateVideoDownload(e.title + ' - Transcript'))}
                onDownloadData={() => selectedEntries.forEach(e => simulateVideoDownload(e.title + ' - Data'))}
                onDownloadAll={() => simulateZipDownload(selectedEntries.map(e => e.title))}
                onDeselect={() => setSelectedIds(new Set())}
                onSelectPage={() => {
                  const allIds = new Set(filteredHistory.map(e => e.id));
                  setSelectedIds(allIds);
                }}
                totalPageCount={filteredHistory.length}
              />
            )}
            {filteredHistory.length > 0 ? (
              viewMode === 'list' ? (
                <div className="flex flex-col" style={{ borderTop: `1px solid ${border}` }}>
                  {/* Table header */}
                  <div className="flex items-center px-4 py-2 text-[10px] uppercase tracking-wider" style={{ color: muted, borderBottom: `1px solid ${border}` }}>
                    <div style={{ width: 48 }} className="mr-3" />
                    <div style={{ width: 280 }} className="flex-shrink-0">Content</div>
                    <div className="flex-1 min-w-0">Transcript</div>
                    <div style={{ width: 80 }} className="text-right">Date</div>
                    <div style={{ width: 60 }} className="text-center">Duration</div>
                    <div style={{ width: 80 }} className="text-center">Status</div>
                    <div style={{ width: 32 }} />
                  </div>
                  {paginatedHistory.map(e => (
                    <HistoryRow key={e.id} entry={e} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg} onSelect={handleSelect} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                  {paginatedHistory.map(e => (
                    <HistoryCard key={e.id} entry={e} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg} onSelect={handleSelect} isSelected={selectedIds.has(e.id)} onToggleSelect={toggleSelect} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <History className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db' }} />
                <p style={{ color: muted, fontSize: '0.875rem' }}>No transcripts match your filters</p>
                <button
                  className="text-xs"
                  style={{ color: '#00b8b2' }}
                  onClick={() => { setSearchQuery(''); setActivePlatform('All'); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setCurrentPage(1); }}
                >Clear all filters</button>
              </div>
            )}

            {/* ── Rich Pagination Bar ────────────────────────────────── */}
            {filteredHistory.length > 0 && (() => {
              const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
              const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length);
              const endItem   = Math.min(currentPage * itemsPerPage, filteredHistory.length);

              const pages: (number | '…')[] = [];
              if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    pages.push(i);
                  } else if (pages[pages.length - 1] !== '…') {
                    pages.push('…');
                  }
                }
              }

              const navBtn = (disabled: boolean): React.CSSProperties => ({
                width: 32, height: 32, borderRadius: 8, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.12s',
                border: `1px solid ${disabled ? 'transparent' : border}`,
                background: 'transparent',
                color: disabled ? (isDark ? 'rgba(255,255,255,0.18)' : '#d1d5db') : muted,
                flexShrink: 0,
              });

              return (
                <div
                  className="mt-8 mb-2 rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff' }}
                >
                  {/* Single-row pagination: < pages ... last > | X / page ▾ */}
                  <div
                    className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap"
                    style={{ borderBottom: 'none' }}
                  >
                    {/* Left: < · page numbers with smart truncation · > */}
                    <div className="flex items-center gap-0.5">

                      {/* Prev */}
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        title="Previous page"
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'transparent', border: 'none',
                          color: currentPage === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={ev => { if (currentPage !== 1) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = currentPage === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted; }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                      </button>

                      {/* Smart page numbers */}
                      {(() => {
                        const sp: (number | '…')[] = [];
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) sp.push(i);
                        } else if (currentPage <= 4) {
                          sp.push(1, 2, 3, 4, 5, '…', totalPages);
                        } else if (currentPage >= totalPages - 3) {
                          sp.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          sp.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages);
                        }
                        return sp.map((p, i) =>
                          p === '…' ? (
                            <span key={`el-${i}`} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: 12, flexShrink: 0, letterSpacing: 1 }}>···</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setCurrentPage(p as number)}
                              style={{
                                width: 32, height: 32, borderRadius: 8, fontSize: 13,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                                background: currentPage === p ? text : 'transparent',
                                color: currentPage === p ? bg : muted,
                                border: 'none',
                                fontWeight: currentPage === p ? 600 : 400,
                              }}
                              onMouseEnter={ev => { if (currentPage !== p) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                              onMouseLeave={ev => { if (currentPage !== p) { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = muted; } }}
                            >{p}</button>
                          )
                        );
                      })()}

                      {/* Next */}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        title="Next page"
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'transparent', border: 'none',
                          color: currentPage === totalPages ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted,
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={ev => { if (currentPage !== totalPages) { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; } }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = currentPage === totalPages ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted; }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>

                    {/* Right: X / page dropdown */}
                    <div className="relative flex-shrink-0">
                      <button
                        ref={ppBtnRef}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: 'transparent',
                          border: `1px solid ${border}`,
                          color: muted,
                          transition: 'all 0.12s',
                        }}
                        onClick={() => {
                          if (openDropdown === 'pg-pp') {
                            setOpenDropdown(null);
                            setPpDropdownPos(null);
                          } else {
                            const rect = ppBtnRef.current?.getBoundingClientRect();
                            if (rect) {
                              setPpDropdownPos({
                                top: rect.top - 8,
                                right: window.innerWidth - rect.right,
                              });
                            }
                            setOpenDropdown('pg-pp');
                          }
                        }}
                        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.color = text; (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.color = muted; (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <span style={{ color: text, fontWeight: 600 }}>{itemsPerPage}</span>
                        <span style={{ color: muted }}>&thinsp;/ page</span>
                        <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${openDropdown === 'pg-pp' ? 'rotate-180' : ''}`} />
                      </button>

                      {openDropdown === 'pg-pp' && ppDropdownPos && ReactDOM.createPortal(
                        <>
                          <div className="fixed inset-0 z-[9998]" onClick={() => { setOpenDropdown(null); setPpDropdownPos(null); }} />
                          <div
                            className="rounded-xl overflow-hidden py-1"
                            style={{
                              position: 'fixed',
                              top: ppDropdownPos.top,
                              right: ppDropdownPos.right,
                              transform: 'translateY(-100%)',
                              zIndex: 9999,
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
                                onClick={() => { setItemsPerPage(n); setCurrentPage(1); setOpenDropdown(null); setPpDropdownPos(null); }}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs"
                                style={{
                                  color: itemsPerPage === n ? '#00b8b2' : muted,
                                  background: itemsPerPage === n ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                                  fontWeight: itemsPerPage === n ? 600 : 400,
                                  transition: 'background 0.1s',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={ev => { if (itemsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                                onMouseLeave={ev => { if (itemsPerPage !== n) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                              >
                                <span>{n} / page</span>
                                {itemsPerPage === n && (
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
          </div>
          )} {/* end hybrid / list / grid conditional */}

          {/* ── Transcript Side Panel (overlay) — only in grid / list mode ── */}
          {selectedEntry && viewMode !== 'hybrid' && (
            <DiscoverTranscriptPanel
              entry={selectedEntry}
              isDark={isDark}
              border={border}
              text={text}
              muted={muted}
              onClose={() => setSelectedEntry(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}