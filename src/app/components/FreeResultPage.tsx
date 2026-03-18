/**
 * FreeResultPage  (/freeresult)
 * ──────────────────────────────
 * Shown to unauthenticated users who submit a link from the landing page.
 * No sidebar. Transcript is partially visible; locked features are blurred
 * behind a sign-up upsell overlay. Header provides a way back to home.
 */
import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  ArrowLeft, Download, Sun, Moon, Heart, Clock,
  Globe, Calendar, Copy, ChevronDown, RefreshCw, Zap, X,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatDuration';
import { formatCardDate } from '../utils/formatDate';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppLogo } from './AppLogo';
import Rd from '../../imports/Rd';
import { useExtensionModal } from '../context/ChromeExtensionModalContext';

// ── Mock data (reused from TranscriptResultPage) ──────────────────────────────
const DEFAULT_VIDEO = {
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

const TRANSCRIPT_PARAGRAPHS = [
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

// Paragraphs shown freely vs locked
const FREE_PARAGRAPHS = 3;

const DOWNLOAD_FORMATS = [
  { label: 'Plain Text (.txt)', free: true },
  { label: 'Subtitles (.srt)',  free: false },
  { label: 'WebVTT (.vtt)',     free: false },
  { label: 'JSON (beta)',       free: false },
];

// ── Caption mock data ─────────────────────────────────────────────────────────
const CAPTIONS = [
  { time: '0:02', text: "Welcome back to my kitchen! Today we're diving deep into pasta perfection." },
  { time: '0:07', text: "I'm going to share some professional secrets that will completely transform your pasta game." },
  { time: '0:13', text: "First thing first — let's talk about water. You need a large pot." },
  { time: '0:19', text: "The ratio is crucial: for every 100 grams of pasta, use at least one liter of water." },
  { time: '0:25', text: "Salt is your best friend here. Add about 10 grams of coarse sea salt per liter." },
  { time: '0:31', text: "This might seem like a lot, but trust me — this is how you get that restaurant-quality flavor." },
  { time: '0:37', text: "While we're waiting for the water to boil, let's prepare our sauce." },
  { time: '0:42', text: "Today I'm making a classic aglio e olio — garlic and olive oil. Simple, incredible results." },
  { time: '0:49', text: "Here's a pro tip: slice your garlic, don't crush it." },
  { time: '0:53', text: "Slicing gives you better control and prevents burning. We want golden, not brown." },
];
const FREE_CAPTIONS = 3;

// ── Prompts mock data ─────────────────────────────────────────────────────────
const PROMPTS_DATA = [
  {
    label: 'Blog Post',
    icon: '✍️',
    preview: "Write a structured, SEO-friendly blog post based on this transcript. Include a compelling title, intro hook, 5 clearly defined sections with subheadings, and a conclusion with a CTA.",
  },
  {
    label: 'Newsletter Section',
    icon: '📬',
    preview: "Adapt this transcript into a conversational newsletter section. Keep it warm and direct. End with a teaser that makes readers want to watch the full video.",
  },
  {
    label: 'YouTube Script',
    icon: '🎬',
    preview: "Rewrite this transcript as a polished YouTube script with a strong hook (first 5 seconds), clear mid-section structure, and a compelling end-screen CTA.",
  },
];
const FREE_PROMPTS = 1;

// ── Page ──────────────────────────────────────────────────────────────────────
export function FreeResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useContext(ThemeContext);
  const { open: openExtModal } = useExtensionModal();
  const [activeTab, setActiveTab]   = useState<'transcript' | 'caption' | 'analytics' | 'prompts'>('transcript');
  const [langOpen, setLangOpen]     = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  const openUpgrade = (feature: string) => {
    setUpgradeFeature(feature);
    setUpgradeOpen(true);
  };

  // Theme tokens
  const bg      = isDark ? '#0d0d0d'  : '#ffffff';
  const border  = isDark ? '#262626'  : '#e5e7eb';
  const text    = isDark ? '#ffffff'  : '#111827';
  const muted   = isDark ? '#888888'  : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const cardBg  = isDark ? '#141414'  : '#f9fafb';
  const panelBg = isDark ? '#111111'  : '#ffffff';

  // Derive video from route state or fall back to default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passed = (location.state as any)?.video;
  const video  = passed ?? DEFAULT_VIDEO;

  const visibleParas  = TRANSCRIPT_PARAGRAPHS.slice(0, FREE_PARAGRAPHS);
  const lockedParas   = TRANSCRIPT_PARAGRAPHS.slice(FREE_PARAGRAPHS);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: bg }}>

      {/* ── Upgrade modal ─────────────────────────────────────────────────── */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={() => setUpgradeOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: cardBg, border: `1px solid ${border}` }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setUpgradeOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: muted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
            >
              <span className="text-lg select-none">🔒</span>
            </div>

            {/* Heading */}
            <div>
              <p className="text-sm mb-1" style={{ color: text, fontWeight: 600 }}>
                Unlock {upgradeFeature || 'this feature'}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
                This feature is available on free and paid plans. Create an account or log in to continue.
              </p>
            </div>

            {/* Perks */}
            <ul className="flex flex-col gap-1.5">
              {[
                'Full transcripts, unlimited',
                'Copy & download any format',
                'Captions with timestamps',
                'Virality & hook analytics',
                'Prompt base access',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-[11px]" style={{ color: muted }}>
                  <span style={{ color: '#00b8b2', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigate('/signup')}
                className="flex-1 py-2 rounded-xl text-xs transition-opacity hover:opacity-85"
                style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
              >
                Sign up free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl text-xs transition-colors"
                style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header
        className="flex items-center justify-between px-5 h-[52px] flex-shrink-0 sticky top-0 z-30"
        style={{
          borderBottom: `1px solid ${border}`,
          background: isDark ? 'rgba(13,13,13,0.95)' : 'rgba(249,255,254,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: logo + back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 transition-opacity hover:opacity-75"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <AppLogo />
          </button>

          <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

          <button
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => navigate('/')}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        {/* Right: CTA + Chrome ext + theme */}
        <div className="flex items-center gap-2">
          {/* Chrome extension */}
          <button
            onClick={openExtModal}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors flex-shrink-0"
            style={{
              color: isDark ? text : muted,
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'; }}
          >
            <div style={{ width: 14, height: 14, flexShrink: 0 }}><Rd /></div>
            <span className="whitespace-nowrap">Install Extension</span>
          </button>

          <div className="hidden sm:block w-px h-4 flex-shrink-0" style={{ background: border }} />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: muted }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

          {/* Auth buttons */}
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Sign up free
          </button>
        </div>
      </header>

      {/* ══ UPSELL BANNER ══════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-2.5"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00b8b2' }} />
          <span className="text-xs" style={{ color: muted }}>
            You're viewing a <span style={{ color: text }}>free preview</span> — sign up to unlock full transcripts, downloads, analytics, and more.
          </span>
        </div>
        <button
          onClick={() => navigate('/signup')}
          className="flex-shrink-0 text-xs whitespace-nowrap transition-opacity hover:opacity-75"
          style={{ color: '#00b8b2', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Unlock everything →
        </button>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 w-full flex flex-col gap-6 py-8">

        {/* ── Video info card ─────────────────────────────────────────────── */}
        <div className="flex justify-center px-6">
        <div
          className="flex items-start gap-5 p-5 rounded-2xl w-full"
          style={{ background: panelBg, border: `1px solid ${border}`, maxWidth: 820 }}
        >
          {/* Thumbnail */}
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 90, aspectRatio: '9/16' }}
          >
            <ImageWithFallback
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 2.5L11.5 7L3.5 11.5V2.5Z" fill="#111827" />
                </svg>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <p style={{ color: text, fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.3 }}>
              {video.title}
            </p>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <img src={video.avatar} alt="creator" className="w-full h-full object-cover object-top" />
              </div>
              <span className="text-xs" style={{ color: muted }}>{video.creator}</span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
                style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
              >
                {video.platform ?? 'TikTok'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: muted }}>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {video.likes} likes</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(video.duration)}</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {video.language}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatCardDate(video.date)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: muted }}>
              <span><strong style={{ color: text }}>{video.wordCount}</strong> words</span>
              <span><strong style={{ color: text }}>{video.charCount}</strong> characters</span>
              <span><strong style={{ color: text }}>{video.sentences}</strong> sentences</span>
              <span><strong style={{ color: text }}>{video.readability}</strong> : Readability</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {['Download Video', 'Download HD Cover'].map(label => (
                <button
                  key={label}
                  onClick={() => openUpgrade(label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-colors"
                  style={{
                    color: muted,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* ── Main panel: transcript + right sidebar ───────────────────────── */}
        <div className="flex justify-center px-4">
        <div className="flex gap-5 items-start w-full" style={{ maxWidth: 1100 }}>
          {/* ── LEFT: Transcript panel ────────────────────────────────────── */}
          <div
            className="flex-1 min-w-0 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: panelBg, border: `1px solid ${border}` }}
          >
            {/* Tab bar */}
            <div
              className="flex items-center"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <div className="flex">
                {(['transcript', 'caption', 'analytics', 'prompts'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-3 text-xs capitalize transition-colors border-b-2 -mb-px"
                    style={{
                      borderBottomColor: activeTab === tab ? text : 'transparent',
                      color: activeTab === tab ? text : muted,
                      fontWeight: activeTab === tab ? 600 : 400,
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex-1" />

              {/* Retranslate (locked) */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(o => !o)}
                    className="flex items-center gap-1 text-[11px] transition-colors"
                    style={{ color: muted }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
                  >
                    <RefreshCw className="w-3 h-3" /> Retranslate
                    <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {langOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-36 rounded-xl overflow-hidden z-50"
                      style={{ background: panelBg, border: `1px solid ${border}` }}
                    >
                      {['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setLangOpen(false)}
                          className="w-full text-left px-3 py-2 text-[11px] transition-colors"
                          style={{ color: muted }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Copy — locked for free users */}
                <button
                  onClick={() => openUpgrade('Copy transcript')}
                  className="flex items-center gap-1 text-[11px] transition-colors"
                  style={{ color: muted }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="relative">
              {activeTab === 'transcript' && (
                <div className="p-5">
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: isDark ? '#0d0d0d' : '#f9fafb', border: `1px solid ${border}` }}
                  >
                    <div className="flex flex-col gap-3">
                      {TRANSCRIPT_PARAGRAPHS.map((para, i) => (
                        <p key={i} className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.72)' : '#374151', lineHeight: 1.75 }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Caption tab — preview + blur */}
              {activeTab === 'caption' && (
                <div className="p-5 flex flex-col gap-0">
                  {/* Caption rows in prompt-style container */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: isDark ? '#0d0d0d' : '#f9fafb', border: `1px solid ${border}` }}
                  >
                  {/* Free captions */}
                  {CAPTIONS.slice(0, FREE_CAPTIONS).map((c, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start py-2.5"
                      style={{ borderBottom: `1px solid ${border}` }}
                    >
                      <span
                        className="text-[10px] flex-shrink-0 tabular-nums pt-0.5"
                        style={{ color: muted, minWidth: 32 }}
                      >
                        {c.time}
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.72)' : '#374151', lineHeight: 1.75 }}>{c.text}</p>
                    </div>
                  ))}

                  {/* Locked captions — blurred */}
                  <div className="relative">
                    <div
                      className="flex flex-col gap-0 select-none pointer-events-none"
                      style={{ filter: 'blur(5px)', opacity: 0.45 }}
                    >
                      {CAPTIONS.slice(FREE_CAPTIONS).map((c, i) => (
                        <div
                          key={i}
                          className="flex gap-3 items-start py-2.5"
                          style={{ borderBottom: `1px solid ${border}` }}
                        >
                          <span
                            className="text-[10px] flex-shrink-0 tabular-nums pt-0.5"
                            style={{ color: muted, minWidth: 32 }}
                          >
                            {c.time}
                          </span>
                          <p className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.72)' : '#374151', lineHeight: 1.75 }}>{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="absolute inset-x-0 top-0 h-10 pointer-events-none"
                      style={{ background: `linear-gradient(to bottom, ${panelBg}, transparent)` }}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-5 pt-16"
                      style={{ background: `linear-gradient(to top, ${panelBg} 60%, transparent)` }}
                    >
                      <div
                        className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl text-center"
                        style={{ background: cardBg, border: `1px solid ${border}`, maxWidth: 360 }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <span className="text-lg select-none">🔒</span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: text, fontWeight: 600 }}>Full captions are locked</p>
                          <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
                            Sign up to access all {CAPTIONS.length} timestamped captions and export as .SRT or .VTT.
                          </p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => navigate('/signup')}
                            className="flex-1 px-4 py-2 rounded-xl text-xs transition-opacity hover:opacity-85"
                            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
                          >
                            Sign up free
                          </button>
                          <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 rounded-xl text-xs transition-colors"
                            style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            Log in
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {/* Analytics tab — preview + blur */}
              {activeTab === 'analytics' && (
                <div className="p-5 flex flex-col gap-4">
                  {/* Free: basic stats */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-2.5" style={{ color: muted }}>Basic stats</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Words', value: '2,341' },
                        { label: 'Readability', value: 'Grade 3' },
                        { label: 'Avg. sentence', value: '13 words' },
                        { label: 'Sentences', value: '180' },
                      ].map(s => (
                        <div
                          key={s.label}
                          className="rounded-xl px-3 py-2.5 flex flex-col gap-0.5"
                          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${border}` }}
                        >
                          <span className="text-[10px]" style={{ color: muted }}>{s.label}</span>
                          <span className="text-sm" style={{ color: text, fontWeight: 600 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locked: advanced analytics */}
                  <div className="relative">
                    <div
                      className="flex flex-col gap-4 select-none pointer-events-none"
                      style={{ filter: 'blur(6px)', opacity: 0.5 }}
                    >
                      {/* Performance bars */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: muted }}>Performance analysis</p>
                        <div className="flex flex-col gap-2.5">
                          {[
                            { label: 'Virality Score', value: '87 / 100', pct: 87 },
                            { label: 'Hook Strength', value: 'Very Strong', pct: 92 },
                            { label: 'Pacing Score', value: 'Fast', pct: 74 },
                            { label: 'Engagement Pred.', value: 'High', pct: 81 },
                          ].map(m => (
                            <div key={m.label} className="flex items-center gap-3">
                              <span className="text-[11px] flex-shrink-0" style={{ color: muted, minWidth: 120 }}>{m.label}</span>
                              <div
                                className="flex-1 h-1.5 rounded-full overflow-hidden"
                                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${m.pct}%`, background: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)' }}
                                />
                              </div>
                              <span className="text-[11px] flex-shrink-0 text-right" style={{ color: text, fontWeight: 500, minWidth: 72 }}>{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top keywords */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: muted }}>Top keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['pasta', 'water', 'garlic', 'salt', 'heat', 'sauce', 'boil', 'timing', 'golden'].map(kw => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md text-[10px]"
                              style={{ color: text, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI suggestions */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: muted }}>AI suggestions</p>
                        <ul className="flex flex-col gap-1.5">
                          {[
                            'Hook is in the top 10% for food education content.',
                            'Consider a "pattern interrupt" around the 30-second mark.',
                            'Short sentence bursts work well — keep them under 12 words.',
                          ].map(s => (
                            <li key={s} className="flex gap-2 text-[11px]" style={{ color: muted }}>
                              <span style={{ color: '#00b8b2', flexShrink: 0 }}>→</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Gradient + CTA */}
                    <div
                      className="absolute inset-x-0 top-0 h-10 pointer-events-none"
                      style={{ background: `linear-gradient(to bottom, ${panelBg}, transparent)` }}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-5 pt-16"
                      style={{ background: `linear-gradient(to top, ${panelBg} 60%, transparent)` }}
                    >
                      <div
                        className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl text-center"
                        style={{ background: cardBg, border: `1px solid ${border}`, maxWidth: 360 }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <span className="text-lg select-none">🔒</span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: text, fontWeight: 600 }}>Advanced analytics are locked</p>
                          <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
                            Unlock virality scoring, hook strength, pacing analysis, top keywords, and AI-powered suggestions.
                          </p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => navigate('/signup')}
                            className="flex-1 px-4 py-2 rounded-xl text-xs transition-opacity hover:opacity-85"
                            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
                          >
                            Sign up free
                          </button>
                          <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 rounded-xl text-xs transition-colors"
                            style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            Log in
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prompts tab — preview + blur */}
              {activeTab === 'prompts' && (
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: muted }}>
                    Turn this transcript into content
                  </p>

                  {/* Free: first 2 prompts */}
                  <div className="grid grid-cols-2 gap-3">
                    {PROMPTS_DATA.slice(0, 2).map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 flex flex-col gap-2"
                        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${border}` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.icon}</span>
                          <span className="text-xs" style={{ color: text, fontWeight: 600 }}>{p.label}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color: muted }}>{p.preview}</p>
                      </div>
                    ))}
                  </div>

                  {/* Locked: remaining prompts */}
                  <div className="relative">
                    <div
                      className="grid grid-cols-2 gap-3 select-none pointer-events-none"
                      style={{ filter: 'blur(5px)', opacity: 0.5 }}
                    >
                      {PROMPTS_DATA.slice(2).map((p, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-4 flex flex-col gap-2"
                          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${border}` }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{p.icon}</span>
                            <span className="text-xs" style={{ color: text, fontWeight: 600 }}>{p.label}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: muted }}>{p.preview}</p>
                        </div>
                      ))}
                    </div>

                    <div
                      className="absolute inset-x-0 top-0 h-10 pointer-events-none"
                      style={{ background: `linear-gradient(to bottom, ${panelBg}, transparent)` }}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-5 pt-16"
                      style={{ background: `linear-gradient(to top, ${panelBg} 60%, transparent)` }}
                    >
                      <div
                        className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl text-center"
                        style={{ background: cardBg, border: `1px solid ${border}`, maxWidth: 360 }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <span className="text-lg select-none">🔒</span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: text, fontWeight: 600 }}>
                            {PROMPTS_DATA.length - 2} more formats waiting
                          </p>
                          <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
                            Sign up to unlock all {PROMPTS_DATA.length} content formats — newsletters, scripts, and more.
                          </p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => navigate('/signup')}
                            className="flex-1 px-4 py-2 rounded-xl text-xs transition-opacity hover:opacity-85"
                            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
                          >
                            Sign up free
                          </button>
                          <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 rounded-xl text-xs transition-colors"
                            style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            Log in
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: sidebar ────────────────────────────────────────────── */}
          <div className="flex-shrink-0 flex flex-col gap-4" style={{ width: 240 }}>

            {/* Download Transcript */}
            <div
              className="rounded-2xl p-4"
              style={{ background: panelBg, border: `1px solid ${border}` }}
            >
              <p className="text-xs mb-3" style={{ color: text, fontWeight: 600 }}>
                Download Transcript
              </p>
              <div className="flex flex-col gap-1.5">
                {DOWNLOAD_FORMATS.map(fmt => (
                  <button
                    key={fmt.label}
                    onClick={() => fmt.free ? undefined : openUpgrade(fmt.label)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-left transition-colors"
                    style={{
                      color: text,
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                    }}
                  >
                    <Download className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="flex-1">{fmt.label}</span>
                  </button>
                ))}
              </div>
              
            </div>

            {/* Upsell card */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: panelBg, border: `1px solid ${border}` }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00b8b2' }} />
                <p className="text-xs" style={{ color: text, fontWeight: 600 }}>Unlock everything</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Full transcripts, unlimited',
                  'Copy & download any format',
                  'Captions with timestamps',
                  'Virality & hook analytics',
                  'Prompt base access',
                  'Creator profile insights',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11px]" style={{ color: muted }}>
                    <span style={{ color: '#00b8b2', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 rounded-xl text-xs transition-opacity hover:opacity-85 mt-1"
                style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
              >
                Get started — it's free
              </button>
            </div>

          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable locked-tab placeholder ──────────────────────────────────────────
function LockedTabPlaceholder({
  title, description, isDark, border, text, muted, cardBg, hoverBg, onSignup, onLogin,
}: {
  title: string;
  description: string;
  isDark: boolean;
  bg: string;
  border: string;
  text: string;
  muted: string;
  cardBg: string;
  hoverBg: string;
  onSignup: () => void;
  onLogin: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-10 px-6 rounded-xl text-center"
      style={{ background: cardBg, border: `1px solid ${border}` }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
      >
        <span className="text-lg select-none">🔒</span>
      </div>
      <div>
        <p className="text-xs mb-1.5" style={{ color: text, fontWeight: 600 }}>{title}</p>
        <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: muted }}>{description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSignup}
          className="px-4 py-2 rounded-xl text-xs transition-opacity hover:opacity-85"
          style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
        >
          Sign up free
        </button>
        <button
          onClick={onLogin}
          className="px-4 py-2 rounded-xl text-xs transition-colors"
          style={{ color: text, border: `1px solid ${border}`, background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          Log in
        </button>
      </div>
    </div>
  );
}