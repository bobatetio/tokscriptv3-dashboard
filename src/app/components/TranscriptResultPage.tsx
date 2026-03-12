/**
 * TranscriptResultPage  (/results)
 * ──────────────────────────────────
 * Renders inside the same app shell (AppSidebar) as Dashboard and Discover.
 * Content is driven entirely by TranscriptDetailPanel — edit that component
 * once and every surface that shows a transcript updates automatically.
 *
 * Data comes from:
 *   navigate('/results', { state: { video: entry } })   ← from DiscoverPage
 *   navigate('/results', { state: { video: item  } })   ← from DashboardPage
 * If no state is passed (direct URL), falls back to the default mock data.
 */
import { useContext, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { AppSidebar } from './AppSidebar';
import {
  TranscriptDetailPanel,
  TranscriptDetailVideo,
  RelatedVideo,
  DownloadFormat,
} from './TranscriptDetailPanel';
import { AppLogo } from './AppLogo';
import { AppHeader } from './AppHeader';
import Rd from '../../imports/Rd';

// ─── Shared mock data (same as DashboardPage so the fallback is consistent) ──
const DEFAULT_VIDEO: TranscriptDetailVideo = {
  title: 'Building Scalable APIs with Go',
  creator: '@techguru',
  platform: 'TikTok',
  likes: '85K',
  duration: '0:58',
  language: 'EN',
  date: 'Feb 18, 2026',
  wordCount: 2341,
  charCount: 11938,
  sentences: 180,
  readability: 'Grade 3',
  thumbnail:
    'https://images.unsplash.com/photo-1758599879795-536d5f203de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBmaWxtaW5nJTIwcGhvbmUlMjBjb250ZW50JTIwY3JlYXRvcnxlbnwxfHx8fDE3NzIwMDExODd8MA&ixlib=rb-4.1.0&q=80&w=800',
  avatar:
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYXZhdGFyJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTI5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
};

const DEFAULT_TRANSCRIPT = [
  "Welcome back to my kitchen! Today we're diving deep into pasta perfection. I'm going to share some professional secrets that will completely transform your pasta game.",
  "First thing first — let's talk about water. You need a large pot. The ratio is crucial: for every 100 grams of pasta, use at least one liter of water.",
  "Salt is your best friend here. Add about 10 grams of coarse sea salt per liter of water. This might seem like a lot, but trust me — this is how you get that restaurant-quality flavor.",
  "While we're waiting for the water to boil, let's prepare our sauce. Today I'm making a classic aglio e olio — garlic and olive oil. Simple ingredients, incredible results.",
  "Here's a pro tip: slice your garlic, don't crush it. Slicing gives you better control over the cooking process and prevents burning. We want golden, not brown.",
  "Start with cold oil and cold garlic in the pan. This is crucial — if you add garlic to hot oil, it will burn immediately and become bitter. We're building flavors slowly.",
  "Now the water is boiling. Drop your pasta in and give it a good stir. Don't add oil to the water — that's a myth! The oil prevents the sauce from sticking later.",
  "Check the package for cooking time, but here's the secret: we're going to undercook it by two minutes. Two full minutes less than the package says.",
  "While the pasta is cooking, get your garlic going over low heat. Watch it carefully — it should sizzle gently and become fragrant. This takes about 3–4 minutes.",
];

const DEFAULT_RELATED: RelatedVideo[] = [
  {
    title: '5 Morning Habits That Changed My Life',
    creator: '@productivityhacks',
    duration: '0:58',
    views: '2.4M',
    thumb:
      'https://images.unsplash.com/photo-1770368787779-8472da646193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwcm91dGluZSUyMGhhYml0cyUyMHByb2R1Y3Rpdml0eXxlbnwxfHx8fDE3NzIwMDExOTB8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    title: 'The Secret to Perfect Pasta Every Time',
    creator: '@chefmike',
    duration: '1:23',
    views: '892K',
    thumb:
      'https://images.unsplash.com/photo-1633253037289-b1cec78fd209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBjaGVmJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzIwMDExOTN8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    title: '30-Day Fitness Challenge Results',
    creator: '@fitnesswithsarah',
    duration: '0:47',
    views: '1.6M',
    thumb:
      'https://images.unsplash.com/photo-1758875570256-6510adffb1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2hhbGxlbmdlJTIwd29ya291dCUyMGdyb3VwfGVufDF8fHx8MTc3MjAwMTE5M3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
];

const DOWNLOAD_FORMATS: DownloadFormat[] = [
  { label: 'Plain Text (.txt)', free: true  },
  { label: 'Subtitles (.srt)',  free: false },
  { label: 'WebVTT (.vtt)',     free: false },
  { label: 'JSON (beta)',       free: false },
];

// ─── Filler paragraphs for entries that only carry a short snippet ────────────
const FILLER_PARAGRAPHS = [
  "The framework I'm about to share has been tested across hundreds of different scenarios and consistently delivers results. Let me walk you through each step carefully.",
  "What most people miss is the importance of consistency over intensity. You don't need to go all-in every single day — you need to show up reliably and build momentum.",
  "Here's where it gets really interesting. The data collected over the past twelve months shows a clear pattern: the people who succeed work the smartest, not the hardest.",
  "One thing that surprised me early on was how much the environment shapes the outcome. Once I started optimising for the right inputs, everything began to fall into place.",
  "Before we wrap up, I want to give you one actionable takeaway you can implement right now. Take fifteen minutes today to audit what you're spending your time on.",
  "The results speak for themselves. After applying this approach consistently for just 30 days, the difference in output quality was measurable, repeatable, and sustainable.",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function likesFromWords(w: number): string {
  if (w > 8000) return '142K';
  if (w > 5000) return '98K';
  if (w > 2000) return '61K';
  if (w > 1000) return '34K';
  return '18K';
}
function readabilityFromWords(w: number): string {
  if (w > 8000) return 'Grade 6';
  if (w > 4000) return 'Grade 4';
  if (w > 1500) return 'Grade 3';
  return 'Grade 2';
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function TranscriptResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Theme tokens (identical to DashboardPage / DiscoverPage) ─────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const cardBg  = isDark ? '#141414' : '#f9fafb';

  // ── Derive video + transcript from route state or fall back to defaults ───
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passed = location.state?.video as any | undefined;

  const video = useMemo<TranscriptDetailVideo>(() => {
    if (!passed) return DEFAULT_VIDEO;
    const words: number = passed.words ?? passed.wordCount ?? 0;
    return {
      title:       passed.title       ?? '',
      creator:     passed.creator     ?? passed.source ?? '',
      platform:    passed.platform    ?? 'TikTok',
      likes:       passed.likes       ?? likesFromWords(words),
      duration:    passed.duration    ?? '',
      language:    passed.language    ?? 'EN',
      date:        passed.date        ?? '',
      wordCount:   words,
      charCount:   passed.charCount   ?? Math.round(words * 5.1),
      sentences:   passed.sentences   ?? Math.round(words / 13),
      readability: passed.readability ?? readabilityFromWords(words),
      thumbnail:   passed.thumbnail   ?? '',
      avatar:
        passed.avatar ??
        'https://images.unsplash.com/photo-1569913486515-b74bf7751574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYXZhdGFyJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTI5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    };
  }, [passed]);

  const transcript = useMemo<string[]>(() => {
    if (!passed) return DEFAULT_TRANSCRIPT;
    const snippet: string = passed.transcriptSnippet ?? passed.transcript?.[0] ?? '';
    if (!snippet) return DEFAULT_TRANSCRIPT;
    const words: number = passed.words ?? passed.wordCount ?? 0;
    const fillerCount = Math.min(FILLER_PARAGRAPHS.length, Math.max(3, Math.round(words / 1200)));
    return [snippet, ...FILLER_PARAGRAPHS.slice(0, fillerCount)];
  }, [passed]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      {/* ══ TOP HEADER ══════════════════════════════════════════════════════ */}
      <AppHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(c => !c)}
        leftSlot={
          <button
            className="flex items-center gap-1.5 p-1.5 rounded-lg transition-colors text-xs"
            style={{ color: muted }}
            onClick={() => navigate(-1)}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        }
      />

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        <AppSidebar activePage="library" collapsed={sidebarCollapsed} />

        {/* ── Detail content — identical shell to DashboardPage's right panel ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TranscriptDetailPanel
            video={video}
            transcript={transcript}
            related={DEFAULT_RELATED}
            downloadFormats={DOWNLOAD_FORMATS}
            isDark={isDark}
            bg={bg}
            border={border}
            text={text}
            muted={muted}
            hoverBg={hoverBg}
            cardBg={cardBg}
            onBack={() => navigate(-1)}
            onViewCreator={(creator) => { sessionStorage.setItem('creatorNavFrom', 'transcript'); navigate(`/profile/${encodeURIComponent(creator)}`, {
              state: { from: 'transcript', videoTitle: video.title, fromPath: location.pathname }
            }); }}
            plan={plan}
            onUpgrade={openUpgrade}
          />
        </div>

      </div>
    </div>
  );
}