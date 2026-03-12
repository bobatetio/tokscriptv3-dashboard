import { forwardRef, useState, useContext } from 'react';
import {
  Zap, ArrowRight, Sparkles, Menu, X,
  Layers, Globe, CheckCircle2, Terminal, Database, PenTool, Cpu, Workflow,
  MessageSquare, Shield, TrendingUp, Users, BookOpen, Hash, Star, ChartNoAxesColumn,
  ChevronDown, Scan, CodeXml, RefreshCw, Moon, Sun,
  Film, Folder, List, Search, ArrowUpDown, ListFilter, Copy, Lock, CheckCheck,
  Play, Heart, ChevronRight, PanelLeft, ArrowLeft, ExternalLink, Download, Calendar, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { formatDuration } from '../utils/formatDuration';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppLogo } from './AppLogo';
import BrokenEssentionalUiHighDefinition from '../../imports/BrokenEssentionalUiHighDefinition';
import BrokenVideoAudioSoundGallery from '../../imports/BrokenVideoAudioSoundGallery';
import BrokenVideoAudioSoundClapperboardText from '../../imports/BrokenVideoAudioSoundClapperboardText';
import BrokenVideoAudioSoundVideoFrameReplace from '../../imports/BrokenVideoAudioSoundVideoFrameReplace';
import BrokenNatureTravelFlame from '../../imports/BrokenNatureTravelFlame';
import AiEssentialsIconSet from '../../imports/AiEssentialsIconSet-72-2308';
import ChromeLogo from '../../imports/Container';
import OutlineSearchMagnifer from '../../imports/OutlineSearchMagnifer';
import { ThemeContext } from '../context/ThemeContext';

// ─── Header ───────────────────────────────────────────────────────────────────
// v2: header centered on horizontal rule at y=68
const LPHeader = forwardRef<HTMLElement>((_, ref) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <>
      <header
        ref={ref}
        className="h-[68px] flex items-center justify-between z-50"
        style={{
          position: 'fixed',
          top: '34px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '910px',
          maxWidth: 'calc(100% - 32px)',
          borderRadius: '16px',
          padding: '0 32px',
          background: isDark ? 'rgba(17, 17, 17, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.6)' : '0 1px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-full" style={{ width: '140px' }}>
          <AppLogo height={28} />
        </div>
        {/* Nav — desktop */}
        <nav className="hidden lg:flex items-center gap-7">
          {['Home', 'Features', 'Pricing', 'FAQs'].map((item) => (
            <span key={item} className="text-sm cursor-pointer transition-colors" style={{ color: isDark ? '#E3E3E3' : '#111827' }}>
              {item}
            </span>
          ))}
        </nav>
        {/* Actions — desktop */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: isDark ? '#888888' : '#6b7280' }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="px-4 py-2 rounded-[8px] text-sm transition-colors"
            style={{ border: `1px solid ${isDark ? '#262626' : '#111111'}`, color: isDark ? '#E3E3E3' : '#111111', background: 'transparent' }}
            onClick={() => navigate('/login')}>
            Log in
          </button>
          <button
            className="px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ background: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff' }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
        {/* Mobile right side */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={toggle}
            className="p-2 transition-colors"
            style={{ color: isDark ? '#888888' : '#6b7280' }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="p-2"
            style={{ color: isDark ? '#E3E3E3' : '#374151' }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>
      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-4 top-[88px] z-40 border shadow-lg rounded-2xl px-5 py-4 flex flex-col gap-3"
          style={{ background: isDark ? '#111111' : '#ffffff', borderColor: isDark ? '#262626' : '#e5e7eb' }}
        >
          {['Home', 'How it works', 'Pricing', 'FAQs'].map((item) => (
            <span key={item} className="text-sm cursor-pointer py-2 border-b last:border-0" style={{ color: isDark ? '#E3E3E3' : '#374151', borderColor: isDark ? '#262626' : '#f3f4f6' }}>
              {item}
            </span>
          ))}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 py-2 rounded-[8px] text-sm" style={{ border: `1px solid ${isDark ? '#262626' : '#111111'}`, color: isDark ? '#E3E3E3' : '#111111' }} onClick={() => navigate('/login')}>Log in</button>
            <button
              className="flex-1 py-2 rounded-[8px] text-sm font-medium"
              style={{ background: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff' }}
              onClick={() => navigate('/signup')}
            >Get Started</button>
          </div>
        </div>
      )}
    </>
  );
});
LPHeader.displayName = 'LPHeader';

// ─── Hero Chat Input ──────────────────────────────────────────────────────────
function HeroChatInput() {
  const [value, setValue] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const MAX = 1000;

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic',
    'Hindi', 'Russian',
  ];

  return (
    <div className="w-full max-w-2xl mb-14">
      <div className="border rounded-2xl transition-colors" style={{ background: isDark ? '#111111' : '#ffffff', borderColor: focused ? (isDark ? '#E3E3E3' : '#111111') : (isDark ? '#262626' : '#e5e7eb') }}>
        {/* Top row — textarea */}
        <div className="flex items-start gap-3 px-5 pt-4 pb-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste up to 50 video links here..."
            rows={2}
            className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
            style={{ color: isDark ? '#e3e3e3' : '#111111' }}
          />
        </div>

        {/* Bottom row — actions + count + send */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Retranslate dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs text-[#c3c3c3] hover:text-gray-600 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                Retranslate
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="py-1 max-h-52 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className={`text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between rounded-md ${
                          selectedLang === lang
                            ? 'bg-[#f0e8e0] text-[#6b4c3b] font-medium'
                            : 'text-gray-500 hover:bg-[#f7f2ee]'
                        }`}
                        style={{ margin: '2px 6px', width: 'calc(100% - 12px)' }}
                      >
                        {lang}
                        {selectedLang === lang && null}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: isDark ? '#c3c3c3' : '#9ca3af' }}>{value.trim() === '' ? 0 : value.split('\n').filter(line => line.trim() !== '').length}/50</span>
            <button
              onClick={() => navigate('/freeresult')}
              className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-black hover:bg-gray-800 transition-colors text-white text-xs font-medium flex-shrink-0"
            >
              <span style={{ '--fill-0': '#ffffff' } as React.CSSProperties}>
                <OutlineSearchMagnifer className="relative w-3.5 h-3.5 flex-shrink-0" />
              </span>
              Scan Videos
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mt-3 flex items-center justify-center gap-1.5">
        <span className="text-xs" style={{ color: '#9ca3af' }}>Try it with this example:</span>
        <button
          onClick={() => setValue('https://www.tiktok.com/@bradonlamar/video/7386531492462723358')}
          className="text-xs transition-colors"
          style={{ color: '#00b8b2', textDecoration: 'underline', textUnderlineOffset: 3 }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#00d4cc')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#00b8b2')}
        >
          @bradonlamar video
        </button>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function LPHero() {
  const { isDark } = useContext(ThemeContext);
  const decoColor   = isDark ? '#262626' : '#d1d5db';
  const starFill    = isDark ? '#0d0d0d'  : 'white';
  const stripBorder = isDark ? '1px solid #262626' : '1px solid #e0e0e0';

  return (
    <section className="w-full pt-[120px] md:pt-[128px] pb-0 relative" style={{ backgroundColor: isDark ? '#0d0d0d' : '#ffffff' }}>
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-transparent rounded-full mb-4" style={{ border: `1px solid ${isDark ? '#262626' : 'rgba(156,163,175,0.4)'}` }}>
          <div className="w-5 h-5 flex-shrink-0 solaris-icon"><AiEssentialsIconSet /></div>
          <span className="text-sm" style={{ color: isDark ? '#888888' : '#6b7280' }}>AI Powered</span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6 tracking-tight text-center font-bold"
          style={{ fontSize: '60px', lineHeight: '1.15', color: isDark ? '#E3E3E3' : '#000000' }}
        >
          Turn any viral video into your next script
        </h1>

        {/* Subtitle */}
        <p className="text-base mb-9 leading-relaxed text-center" style={{ color: isDark ? '#888888' : 'rgba(30,30,30,0.75)' }}>
          Turn TikToks, Reels, and Shorts into actionable scripts without the manual grind.
        </p>

        {/* Chat Input Box */}
        <HeroChatInput />
      </div>

      {/* ── Feature strip ─────────────────────────────────────────────────────── */}
      <h2 className="text-center mt-8 mb-4 px-4" style={{ color: isDark ? '#E3E3E3' : '#111827' }}>Try our latest AI features!</h2>
      <div className="w-full relative" style={{ borderTop: stripBorder, borderBottom: stripBorder, overflow: 'visible' }}>
        {/* 4-pointed stars — centered on the border lines where the fixed vertical lines cross */}
        {[
          { key: 'tl', style: { top: -8,    left:  '60.5px' } },
          { key: 'tr', style: { top: -8,    right: '60.5px' } },
          { key: 'bl', style: { bottom: -8, left:  '60.5px' } },
          { key: 'br', style: { bottom: -8, right: '60.5px' } },
        ].map(({ key, style }) => (
          <span
            key={key}
            aria-hidden
            className="hidden lg:block absolute pointer-events-none"
            style={{ ...style, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
        <div className="px-5 md:px-12 lg:px-[84px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 relative">
          {[
            { icon: <BrokenVideoAudioSoundGallery className="relative w-[18px] h-[18px] flex-shrink-0 solaris-icon" />, title: 'Save cover image', desc: 'Download HD cover images' },
            { icon: <BrokenEssentionalUiHighDefinition className="relative w-[18px] h-[18px] flex-shrink-0 solaris-icon" />, title: 'Download HD video', desc: 'No watermarks, full quality' },
            { icon: <BrokenVideoAudioSoundClapperboardText className="relative w-[18px] h-[18px] flex-shrink-0 solaris-icon" />, title: 'Generate Viral Hooks', desc: 'Create viral hooks instantly' },
            { icon: <BrokenVideoAudioSoundVideoFrameReplace className="relative w-[18px] h-[18px] flex-shrink-0 solaris-icon" />, title: 'Rewrite scripts', desc: 'Turn transcripts to viral videos' },
            { icon: <BrokenNatureTravelFlame className="relative w-[18px] h-[18px] flex-shrink-0 solaris-icon" />, title: 'Analyze Virality', desc: 'Learn why video went viral' },
          ].map((item, i, arr) => (
            <div key={item.title} className="relative flex flex-col gap-2 py-5 px-4 lg:px-5">
              {/* Vertical divider — desktop only, floats in the middle and doesn't touch the horizontal borders */}
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px"
                  style={{ height: '85%', backgroundColor: decoColor }}
                />
              )}
              {item.icon}
              <div className="min-w-0">
                <p className="text-sm" style={{ fontWeight: 500, color: isDark ? '#E3E3E3' : '#1f2937' }}>{item.title}</p>
                <p className="mt-0.5 leading-relaxed text-[14px]" style={{ color: isDark ? '#888888' : '#6b7280' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Mockup Section ─────────────────────────────────────────────────
const MOCK_TRANSCRIPT_LINES = [
  "Welcome back! Today we're diving deep into this topic. I've been working on this for months and I'm excited to finally share it with you.",
  "First, let's set some context. The key thing to understand here is that everything starts with the fundamentals — if you nail the basics, everything else follows.",
  "Here's the approach I use every single time: start small, iterate fast, and always keep the end user in mind. It sounds simple, but most people skip this step.",
  "The results speak for themselves. After applying this method for 90 days straight, I saw a 3x improvement in output quality with half the effort.",
  "So here's what I want you to take away from today's video: consistency beats perfection every single time. Show up, do the work, and trust the process.",
];

const RELATED_MOCKS = [
  { title: '5 Morning Habits That Changed My Life', tag: '@productivityhacks', duration: '0:58', views: '2.4M', thumb: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=200&q=80' },
  { title: 'The Secret to Perfect Content', tag: '@chefmike', duration: '1:23', views: '892K', thumb: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=200&q=80' },
];

function AppMockup() {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isSignedIn = typeof window !== 'undefined' && !!localStorage.getItem('tokscript_user');
  const [activeNav, setActiveNav] = useState<'singles'|'collections'|'bulk'|'folders'>('singles');
  const [selectedTranscript, setSelectedTranscript] = useState<{ id: number; title: string; tag: string; duration: string; date: string; thumbnail: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'Transcript'|'Caption'|'Analytics'>('Transcript');

  const bg         = isDark ? '#0d0d0d' : '#ffffff';
  const sidebarBg  = isDark ? '#111111' : '#f9fafb';
  const border     = isDark ? '#262626' : '#e5e7eb';
  const text       = isDark ? '#ffffff' : '#111827';
  const muted      = isDark ? '#888888' : '#6b7280';
  const cardBg     = isDark ? '#141414' : '#ffffff';
  const hoverBg    = isDark ? 'rgba(255,255,255,0.04)' : '#f3f2f0';
  const accent     = '#00F2EA';
  const sectionBg  = isDark ? '#0d0d0d' : '#ffffff';

  const thumbs = [
    'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=200&q=80',
    'https://images.unsplash.com/photo-1712971404080-87271ce2e473?w=200&q=80',
    'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=200&q=80',
    'https://images.unsplash.com/photo-1605568985653-3d8e43f4efa6?w=200&q=80',
    'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=200&q=80',
    'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=200&q=80',
    'https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?w=200&q=80',
  ];

  const transcripts = [
    { id:1,  title:'Usability Test – Onboarding',   tag:'@ux',          duration:'31:44',   date:'Feb 5'  },
    { id:2,  title:'Demo Day Spring 2026',            tag:'@demos',       duration:'1:08:11', date:'Feb 6'  },
    { id:3,  title:'Brand Voice Workshop',            tag:'@brand',       duration:'22:10',   date:'Feb 7'  },
    { id:4,  title:'Hiring Panel – Engineering',     tag:'@people',      duration:'55:46',   date:'Feb 8'  },
    { id:5,  title:'Finance Review Q4',               tag:'@finance',     duration:'41:30',   date:'Feb 9'  },
    { id:6,  title:'Support Team Sync',               tag:'@support',     duration:'17:22',   date:'Feb 10' },
    { id:7,  title:'Roadmap Planning 2026',           tag:'@product',     duration:'39:05',   date:'Feb 11' },
    { id:8,  title:'Marketing Q1 Debrief',            tag:'@marketing',   duration:'26:18',   date:'Feb 12' },
    { id:9,  title:'All-Hands February',              tag:'@company',     duration:'1:14:00', date:'Feb 13' },
    { id:10, title:'Backend Architecture Talk',       tag:'@engineering', duration:'48:55',   date:'Feb 14' },
    { id:11, title:'Customer Feedback Roundup',       tag:'@cx',          duration:'33:40',   date:'Feb 15' },
    { id:12, title:'Growth Webinar – Feb',            tag:'@growth',      duration:'57:12',   date:'Feb 16' },
    { id:13, title:'Team Strategy Sprint',            tag:'@strategy',    duration:'1:02:30', date:'Feb 17' },
    { id:14, title:'Podcast Episode 12',              tag:'@tokcast',     duration:'44:07',   date:'Feb 18' },
    { id:15, title:'Sales call – Acme Corp',          tag:'@sales',       duration:'29:55',   date:'Feb 19' },
    { id:16, title:'Design review walkthrough',       tag:'@designops',   duration:'21:18',   date:'Feb 20' },
    { id:17, title:'Investor Q&A session',            tag:'@founders',    duration:'52:44',   date:'Feb 21' },
    { id:18, title:'Weekly standup recap',            tag:'@teamlead',    duration:'8:05',    date:'Feb 22' },
    { id:19, title:'User interview – Sarah K.',      tag:'@research',    duration:'38:10',   date:'Feb 23' },
    { id:20, title:'Product launch keynote',          tag:'@productteam', duration:'14:32',   date:'Feb 24' },
  ].map((t, i) => ({ ...t, thumbnail: thumbs[i % thumbs.length] }));

  const navItems = [
    { key:'singles',     label:'Singles',     icon:<Film    className="w-3.5 h-3.5" />, count:20 },
    { key:'collections', label:'Collections', icon:<Layers  className="w-3.5 h-3.5" />, count:3  },
    { key:'bulk',        label:'Bulk',        icon:<List    className="w-3.5 h-3.5" />, count:2  },
    { key:'folders',     label:'Folders',     icon:<Folder  className="w-3.5 h-3.5" />, count:4  },
  ];

  return (
    <section style={{ backgroundColor: sectionBg, borderBottomColor: border, position: 'relative' }} className="w-full py-8 md:py-12 border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          
          
          
        </div>

        {/* Browser chrome */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${border}` }}>
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: isDark ? '#111111' : '#ffffff', borderBottom: `1px solid ${isDark ? '#262626' : '#e5e7eb'}` }}>
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-md text-[11px] w-56" style={{ background: isDark ? '#0d0d0d' : '#ffffff', border: `1px solid ${isDark ? '#262626' : '#e5e7eb'}`, color: isDark ? '#888888' : '#6b7280' }}>
                {selectedTranscript ? `app.tokscript.com/results/${selectedTranscript.id}` : 'app.tokscript.com/dashboard'}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {[32, 24, 40].map(w => (
                <div key={w} className="h-4 rounded" style={{ width: w, background: isDark ? '#262626' : '#d1d5db' }} />
              ))}
            </div>
          </div>

          {/* Dashboard layout */}
          <div className="flex" style={{ background: bg, height: 520, overflow: 'hidden', position: 'relative' }}>

            {/* Sidebar */}
            <div className="flex-shrink-0 hidden md:flex flex-col" style={{ width: 212, background: sidebarBg, borderRight: `1px solid ${border}` }}>

              {/* Logo row */}
              <div className="flex items-center justify-between px-3.5" style={{ height: 52, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
                <div
                  className="rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ width: 28, height: 28, background: isDark ? '#ffffff' : '#111111', borderRadius: 6 }}
                >
                  <span style={{ color: isDark ? '#111111' : '#ffffff', fontSize: 14, fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>T</span>
                </div>
                <button style={{ color: muted, lineHeight: 0 }}>
                  <PanelLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* New Transcription */}
              <div className="px-3 pt-3 pb-2" style={{ flexShrink: 0 }}>
                <div className="w-full flex items-center justify-center gap-1 rounded-lg py-2 cursor-pointer" style={{ background: isDark ? '#1a1a1a' : '#111827', color: '#ffffff', border: `1px solid ${isDark ? '#333333' : 'transparent'}`, fontSize: 11.5, fontWeight: 500 }}>
                  + New Transcript
                </div>
              </div>

              {/* Dashboard link */}
              <div className="px-2 pt-1 pb-0" style={{ flexShrink: 0 }}>
                <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-left" style={{ color: muted, fontSize: 11.5 }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
                  Dashboard
                </button>
              </div>

              {/* LIBRARY label */}
              <div className="px-3.5 pt-3 pb-1" style={{ fontSize: 9.5, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
                LIBRARY
              </div>

              {/* Nav items */}
              <div className="flex flex-col gap-px px-2 pb-2" style={{ flexShrink: 0 }}>
                {navItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveNav(item.key as typeof activeNav)}
                    className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left"
                    style={{
                      background: activeNav === item.key ? (isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6') : 'transparent',
                      color: activeNav === item.key ? text : muted,
                      fontSize: 11.5,
                      fontWeight: activeNav === item.key ? 500 : 400,
                      transition: 'background 0.1s',
                    }}
                  >
                    <span className="flex items-center gap-2">{item.icon}{item.label}</span>
                    <span className="flex items-center gap-1">
                      {item.key === 'singles'
                        ? <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: isDark ? '#262626' : '#f3f4f6', color: muted }}>{item.count}</span>
                        : <ChevronRight className="w-3 h-3" style={{ color: isDark ? '#444444' : '#d1d5db' }} />
                      }
                    </span>
                  </button>
                ))}
              </div>

              {/* FOLDERS label */}
              <div className="flex items-center justify-between px-3.5 pt-1 pb-1" style={{ flexShrink: 0 }}>
                <span style={{ fontSize: 9.5, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>FOLDERS</span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: muted }}><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>

              {/* Folder items */}
              <div className="flex flex-col gap-px px-2 pb-2" style={{ flexShrink: 0 }}>
                {['Client Projects','Internal Training','Archived Interviews','Event Recordings'].map(f => (
                  <button key={f} className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-left" style={{ color: muted, fontSize: 11 }}>
                    <Folder className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{f}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              {/* View first-time user */}
              <div className="px-2.5 pb-2" style={{ flexShrink: 0 }}>
                <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg" style={{ border: `1px solid ${border}`, color: muted, fontSize: 10.5 }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  View first-time user
                </button>
              </div>

              {/* User profile */}
              <div className="flex items-center gap-2 px-2.5 py-2.5" style={{ borderTop: `1px solid ${border}`, flexShrink: 0 }}>
                <div className="rounded-full flex-shrink-0 overflow-hidden" style={{ width: 26, height: 26, background: '#e5e7eb' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=52&h=52&fit=crop&crop=face&q=80" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 11, fontWeight: 600, color: text }}>James Brown</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: muted }}>james@alignui.com</div>
                </div>
                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
              </div>
            </div>

            {/* Main content — always-visible list + right panel */}
            <div className="flex-1 flex min-w-0 overflow-hidden">

              {/* ── List panel ── */}
              <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: 185, borderRight: `1px solid ${border}` }}>
                {/* List header */}
                <div className="flex items-center flex-shrink-0 px-3.5 gap-2" style={{ height: 48, borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: text }}>Singles</span>
                  <span style={{ fontSize: 10.5, color: muted }}>(20)</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 cursor-pointer" style={{ color: muted }} />
                    <ArrowUpDown className="w-3.5 h-3.5 cursor-pointer" style={{ color: muted }} />
                    <ListFilter className="w-3.5 h-3.5 cursor-pointer" style={{ color: muted }} />
                  </div>
                </div>
                {/* List rows */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  {transcripts.map(t => (
                    <button
                      key={t.id}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5"
                      style={{
                        borderBottom: `1px solid ${border}`,
                        background: selectedTranscript?.id === t.id ? (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6') : 'transparent',
                        transition: 'background 0.1s',
                      }}
                      onClick={() => { setSelectedTranscript(t); setActiveTab('Transcript'); }}
                      onMouseEnter={e => { if (selectedTranscript?.id !== t.id) (e.currentTarget as HTMLElement).style.background = hoverBg; }}
                      onMouseLeave={e => { if (selectedTranscript?.id !== t.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <div className="flex-shrink-0 relative rounded-md overflow-hidden" style={{ width: 36, height: 48 }}>
                        <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 left-0.5 text-white rounded" style={{ fontSize: 6.5, background: 'rgba(0,0,0,0.75)', padding: '1px 2.5px', lineHeight: '11px' }}>{formatDuration(t.duration)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate mb-0.5" style={{ fontSize: 11, fontWeight: 500, color: text }}>{t.title}</p>
                        <p className="mb-1" style={{ fontSize: 10, color: muted }}>{t.tag}</p>
                        <p style={{ fontSize: 9.5, color: muted }}>
                          {(['356K','1.8M','991K','2.2M','678K','504K','1.1M','288K','912K','3.4M','739K','1.3M','876K','422K','1.6M','543K','294K','187K','765K','2.1M'])[t.id - 1] ?? '100K'} views
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Right panel ── */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {selectedTranscript ? (
                  <>
                    {/* Detail header */}
                    <div className="flex items-center flex-shrink-0 px-4 gap-2" style={{ height: 48, borderBottom: `1px solid ${border}` }}>
                      <button
                        onClick={() => { setSelectedTranscript(null); setActiveTab('Transcript'); }}
                        className="flex items-center gap-1 flex-shrink-0"
                        style={{ color: muted, fontSize: 10.5 }}
                      >
                        <ArrowLeft className="w-3 h-3" /> Back
                      </button>
                      <span style={{ color: border, fontSize: 14 }}>|</span>
                      <span className="truncate" style={{ fontSize: 11.5, fontWeight: 600, color: text }}>{selectedTranscript.title}</span>
                    </div>

                    {/* Two-col detail */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Left: video info + transcript */}
                      <div className="flex-1 overflow-y-auto px-3.5 py-3" style={{ scrollbarWidth: 'none' }}>
                        {/* Video info card */}
                        <div className="rounded-xl mb-2.5 p-3" style={{ border: `1px solid ${border}`, background: cardBg }}>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 rounded-lg overflow-hidden relative" style={{ width: 52, height: 68 }}>
                              <img src={selectedTranscript.thumbnail} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                <div className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.9)' }}>
                                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 1.5L7 4L2 6.5V1.5Z" fill="#111827"/></svg>
                                </div>
                              </div>
                              <span className="absolute bottom-0.5 right-0.5 text-white rounded" style={{ fontSize: 7, background: 'rgba(0,0,0,0.72)', padding: '1px 3px', lineHeight: '12px' }}>{formatDuration(selectedTranscript.duration)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="mb-1" style={{ fontSize: 11.5, fontWeight: 600, color: text }}>{selectedTranscript.title}</p>
                              <p className="mb-1.5" style={{ fontSize: 10.5, color: muted }}>{selectedTranscript.tag}</p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5" style={{ fontSize: 10, color: muted }}>
                                <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" /> 85K likes</span>
                                <span className="flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> EN</span>
                                <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {selectedTranscript.date}</span>
                              </div>
                              <div className="flex gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${border}` }}>
                                {['View on TikTok', 'Download HD Cover'].map(btn => (
                                  <button key={btn} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ border: `1px solid ${border}`, fontSize: 9.5, color: muted }}>
                                    <ExternalLink className="w-2 h-2" />{btn}
                                  </button>
                                ))}
                                <button className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ border: `1px solid ${border}`, fontSize: 9.5, color: muted }}>
                                  <Lock className="w-2 h-2" /> Download Video
                                  <span className="rounded-full px-1" style={{ fontSize: 8, background: isDark ? '#262626' : '#f3f4f6', color: muted }}>Sign in</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Transcript card with tabs */}
                        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}`, background: cardBg }}>
                          <div className="flex items-center justify-between px-3" style={{ borderBottom: `1px solid ${border}` }}>
                            <div className="flex">
                              {(['Transcript', 'Caption', 'Analytics'] as const).map(tab => (
                                <button
                                  key={tab}
                                  onClick={() => setActiveTab(tab)}
                                  style={{
                                    fontSize: 10.5, padding: '7px 10px',
                                    color: activeTab === tab ? text : muted,
                                    borderBottom: activeTab === tab ? `2px solid ${text}` : '2px solid transparent',
                                    fontWeight: activeTab === tab ? 500 : 400,
                                    marginBottom: -1,
                                  }}
                                >{tab}</button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2.5" style={{ fontSize: 9.5, color: muted }}>
                              <span className="flex items-center gap-0.5 cursor-pointer"><RefreshCw className="w-2.5 h-2.5" /> Retranslate</span>
                              <span className="flex items-center gap-0.5 cursor-pointer"><Copy className="w-2.5 h-2.5" /> Copy</span>
                            </div>
                          </div>
                          <div className="p-3">
                            {activeTab === 'Transcript' && (
                              <div className="flex flex-col gap-2.5">
                                {MOCK_TRANSCRIPT_LINES.map((line, i) => (
                                  <p key={i} style={{ fontSize: 10.5, color: text, lineHeight: 1.65 }}>{line}</p>
                                ))}
                              </div>
                            )}
                            {activeTab === 'Caption' && (
                              <div className="flex flex-col gap-1.5">
                                {MOCK_TRANSCRIPT_LINES.slice(0, 3).map((line, i) => (
                                  <div key={i} className="flex gap-2.5 pb-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                                    <span style={{ fontSize: 9, color: muted, fontFamily: 'monospace', width: 28, flexShrink: 0, marginTop: 2 }}>{`0:${String(i * 8).padStart(2, '0')}`}</span>
                                    <p style={{ fontSize: 10.5, color: text, lineHeight: 1.6 }}>{line}</p>
                                  </div>
                                ))}
                                <div className="flex items-center gap-2 mt-1 p-2 rounded-lg" style={{ background: isDark ? '#141414' : '#f9fafb', border: `1px solid ${border}` }}>
                                  <Lock className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
                                  <p style={{ fontSize: 9.5, color: muted }}>Sign in to see full captions with timestamps</p>
                                </div>
                              </div>
                            )}
                            {activeTab === 'Analytics' && (
                              <div className="flex flex-col gap-2.5">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                                  {[
                                    { label: 'Virality Score', value: '—', locked: true },
                                    { label: 'Hook Strength', value: '—', locked: true },
                                    { label: 'Engagement', value: '9.4%', locked: false },
                                    { label: 'Readability', value: 'Grade 2', locked: false },
                                  ].map(m => (
                                    <div key={m.label} className="rounded-lg p-2 text-center" style={{ background: isDark ? '#141414' : '#f9fafb', border: `1px solid ${border}` }}>
                                      <div style={{ fontSize: m.locked ? 12 : 11, color: m.locked ? muted : text, marginBottom: 2 }}>
                                        {m.locked ? <Lock className="w-3 h-3 mx-auto" style={{ color: muted }} /> : m.value}
                                      </div>
                                      <div style={{ fontSize: 8.5, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                                      {m.locked && <div style={{ fontSize: 8.5, color: muted }}>Sign in</div>}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: isDark ? '#141414' : '#f9fafb', border: `1px solid ${border}` }}>
                                  <Shield className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: muted }} />
                                  <div className="flex-1 min-w-0">
                                    <p style={{ fontSize: 10, fontWeight: 500, color: text }} className="mb-0.5">Virality analysis is a Pro feature</p>
                                    <p style={{ fontSize: 9.5, color: muted }}>Sign in to unlock hook strength, virality scoring, and AI-powered content suggestions.</p>
                                  </div>
                                  <button className="flex-shrink-0 px-2 py-1 rounded text-white" style={{ background: isDark ? '#333333' : '#111827', fontSize: 9.5 }}>Unlock</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right sidebar */}
                      <div className="flex-shrink-0 overflow-y-auto px-2.5 py-3 flex flex-col gap-2.5" style={{ width: 168, borderLeft: `1px solid ${border}`, scrollbarWidth: 'none' }}>
                        {/* About Creator */}
                        <div className="rounded-xl p-3" style={{ border: `1px solid ${border}`, background: cardBg }}>
                          <p style={{ fontSize: 10.5, fontWeight: 600, color: text }} className="mb-2.5">About the Creator</p>
                          <div className="flex items-center gap-2 mb-2.5">
                            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 26, height: 26 }}>
                              <img src="https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&h=100&fit=crop&crop=face&q=80" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="truncate" style={{ fontSize: 10, fontWeight: 500, color: text }}>{selectedTranscript.tag}</span>
                                <div className="flex-shrink-0 rounded-full flex items-center justify-center" style={{ width: 11, height: 11, background: '#00F2EA' }}>
                                  <svg width="6" height="6" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                              </div>
                              <p style={{ fontSize: 9.5, color: muted }}>Content Creator</p>
                            </div>
                          </div>
                          <button className="w-full py-1.5 rounded-lg" style={{ border: `1px solid ${border}`, fontSize: 9.5, color: text }}>View More Videos</button>
                        </div>
                        {/* Download Transcript */}
                        <div className="rounded-xl p-3" style={{ border: `1px solid ${border}`, background: cardBg }}>
                          <p style={{ fontSize: 10.5, fontWeight: 600, color: text }} className="mb-2">Download Transcript</p>
                          <div className="flex flex-col gap-1">
                            {[
                              { label: 'Plain Text (.txt)', free: true },
                              { label: 'Subtitles (.srt)', free: false },
                              { label: 'WebVTT (.vtt)', free: false },
                              { label: 'JSON (beta)', free: false },
                            ].map(item => (
                              <button key={item.label} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left" style={{ border: `1px solid ${item.free ? border : 'transparent'}`, background: item.free ? 'transparent' : isDark ? '#141414' : '#f9fafb', fontSize: 9.5, color: item.free ? text : muted }}>
                                <Download className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="flex-1 truncate">{item.label}</span>
                                {!item.free && <Lock className="w-2 h-2 flex-shrink-0" style={{ color: isDark ? '#444444' : '#d1d5db' }} />}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Related Videos */}
                        <div className="rounded-xl p-3" style={{ border: `1px solid ${border}`, background: cardBg }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <p style={{ fontSize: 10.5, fontWeight: 600, color: text }}>Related Videos</p>
                            <span style={{ fontSize: 9.5, color: accent, cursor: 'pointer' }}>View all</span>
                          </div>
                          <p style={{ fontSize: 9.5, color: muted }} className="mb-2.5">Videos similar to this one</p>
                          <div className="flex flex-col gap-2.5">
                            {RELATED_MOCKS.map(rel => (
                              <div key={rel.title} className="flex gap-2 cursor-pointer">
                                <div className="flex-shrink-0 rounded overflow-hidden" style={{ width: 30, height: 40 }}>
                                  <img src={rel.thumb} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 mb-0.5" style={{ fontSize: 9.5, color: text, lineHeight: 1.4 }}>{rel.title}</p>
                                  <p style={{ fontSize: 9, color: accent }}>{rel.tag}</p>
                                  <div className="flex items-center gap-0.5" style={{ fontSize: 9, color: muted }}>
                                    <Eye className="w-2 h-2" /> {rel.views}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Empty state */
                  <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ background: bg }}>
                    <div className="flex items-center justify-center rounded-xl mb-1" style={{ width: 44, height: 44, background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: muted }}>
                        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: text }}>Select a transcript</p>
                    <p style={{ fontSize: 11, color: muted }}>Click any item in the list to view its transcript</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help button */}
            <div className="absolute flex items-center justify-center" style={{ bottom: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: isDark ? '#262626' : '#374151', cursor: 'pointer', zIndex: 5, color: 'white', fontSize: 12, fontWeight: 600 }}>
              ?
            </div>
          </div>
        </div>

        {/* Sign-in CTA */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(isSignedIn ? '/dashboard' : '/login')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 active:scale-95"
            style={{ background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff' }}
          >
            <Lock className="w-3.5 h-3.5" style={{ color: isDark ? '#111827' : '#ffffff' }} />
            {isSignedIn ? 'Enter your dashboard' : 'Sign in to access your full dashboard'}
          </button>
        </div>
      </div>
      {/* Stars at bottom border × vertical decorative lines — desktop only */}
      {[{ side: 'left', style: { left: '60px' } }, { side: 'right', style: { right: '60px' } }].map(({ side, style }) => (
        <div key={side} aria-hidden className="hidden lg:block" style={{ position: 'absolute', bottom: '-8px', width: '16px', height: '16px', pointerEvents: 'none', zIndex: 10000, ...style }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={sectionBg} stroke={border} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────��────────────────────
function StatsSection() {
  const { isDark } = useContext(ThemeContext);
  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#f3f4f6';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';

  const stats = [
    { value: '2.6M', label: 'Videos Downloaded', suffix: '+' },
    { value: '190K', label: 'Profiles Analyzed', suffix: '+' },
    { value: '120K', label: 'Hours Saved', suffix: '+' },
    { value: '84M', label: 'Minutes of videos processed total', suffix: '+' },
  ];

  return (
    <section className="w-full py-12 md:py-16" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl mb-3 tracking-tight" style={{ color: text }}>Don't Just Take Our Word For It</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: muted }}>
            The data speaks for itself. We've helped our community save over 120,000 hours of manual work while generating $10M+ in tracked sales.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="text-4xl mb-1 tracking-tight" style={{ color: text }}>
                {stat.value}<span className="text-[#00F2EA]">{stat.suffix}</span>
              </div>
              <div className="text-sm capitalize" style={{ color: muted }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What You Can Do Section ─────────────────────────────────────────────────
function WhatYouCanDoSection() {
  const { isDark } = useContext(ThemeContext);
  const bg        = isDark ? '#0d0d0d' : '#ffffff';
  const border    = isDark ? '#262626' : '#e5e7eb';
  const cardBg    = isDark ? '#141414' : '#ffffff';
  const rowBg     = isDark ? '#1a1a1a' : '#f3f4f6';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#888888' : '#6b7280';
  const iconBg    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const iconColor = isDark ? '#ffffff' : '#111111';
  const dotColor  = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
  const tagBg     = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  // ── Inline mockup panels ──────────────────────────────────────────────────
  const BulkMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <Layers className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>Bulk Import</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>50 links max</span>
      </div>
      {[
        { label: 'tiktok.com/@creator/video/1', status: 'Done', platform: 'TK' },
        { label: 'instagram.com/reel/abc123/', status: 'Done', platform: 'IG' },
        { label: 'youtube.com/shorts/xyz789', status: 'Processing…', platform: 'YT' },
        { label: 'tiktok.com/@brand/video/2', status: 'Queued', platform: 'TK' },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: iconBg, color: muted, fontWeight: 600 }}>{row.platform}</span>
          <span className="flex-1 text-[11px] truncate" style={{ color: muted }}>{row.label}</span>
          <span className="text-[10px]" style={{ color: row.status === 'Processing…' ? text : muted }}>{row.status}</span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px]" style={{ color: muted }}>2 / 4 complete</span>
        <div className="flex-1 mx-3 h-1 rounded-full overflow-hidden" style={{ background: border }}>
          <div className="h-full rounded-full w-1/2" style={{ background: iconColor, opacity: 0.4 }} />
        </div>
        <span className="text-[10px]" style={{ color: muted }}>50%</span>
      </div>
    </div>
  );

  const PlaylistMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <ListFilter className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>Collection Import</span>
        </div>
      </div>
      <div className="rounded-lg px-3 py-2.5 flex items-center gap-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
        <Globe className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
        <span className="text-[11px] truncate flex-1" style={{ color: muted }}>tiktok.com/@creator/collection/summer-tips</span>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { title: '5 Morning habits that changed my life', dur: '0:47' },
          { title: 'Why I wake up at 5am every day', dur: '1:02' },
          { title: 'My evening wind-down routine', dur: '0:55' },
          { title: 'Productivity stack for creators', dur: '1:18' },
        ].map((v, i) => (
          <div key={v.title} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
            <span className="text-[10px] w-4 text-center" style={{ color: muted }}>{i + 1}</span>
            <Play className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
            <span className="flex-1 text-[11px] truncate" style={{ color: text }}>{v.title}</span>
            <span className="text-[10px]" style={{ color: muted }}>{v.dur}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center" style={{ color: muted }}>4 videos detected · Auto-importing all</p>
    </div>
  );

  const HistoryMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <Folder className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>My Library</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['Saved', 'Research', 'Hooks'].map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>{tag}</span>
          ))}
        </div>
      </div>
      {[
        { title: 'How I grew to 100k followers', src: 'TikTok', date: 'Today', bookmarked: true },
        { title: 'The real reason people scroll', src: 'Instagram', date: 'Yesterday', bookmarked: true },
        { title: 'Algorithm secrets revealed', src: 'YouTube', date: '2 days ago', bookmarked: false },
      ].map((row) => (
        <div key={row.title} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: text }}>{row.title}</p>
            <p className="text-[10px]" style={{ color: muted }}>{row.src} · {row.date}</p>
          </div>
          {row.bookmarked && <Heart className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />}
          <Download className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
        </div>
      ))}
    </div>
  );

  const HDMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <Film className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>HD Download</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>No watermark</span>
      </div>
      <div className="rounded-xl flex items-center justify-center" style={{ background: rowBg, border: `1px solid ${border}`, height: 80 }}>
        <div className="flex flex-col items-center gap-1">
          <Play className="w-6 h-6" style={{ color: muted }} />
          <span className="text-[9px]" style={{ color: muted }}>Preview</span>
        </div>
      </div>
      {[
        { label: 'Quality', value: '1080p HD' },
        { label: 'Format', value: 'MP4' },
        { label: 'Cover image', value: 'PNG · 1080×1920' },
        { label: 'Watermark', value: 'Removed ✓' },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <span className="text-[11px]" style={{ color: muted }}>{row.label}</span>
          <span className="text-[11px]" style={{ color: text }}>{row.value}</span>
        </div>
      ))}
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg py-2 text-[11px] flex items-center justify-center gap-1.5" style={{ background: rowBg, border: `1px solid ${border}`, color: text }}>
          <Film className="w-3 h-3" /> Video
        </button>
        <button className="flex-1 rounded-lg py-2 text-[11px] flex items-center justify-center gap-1.5" style={{ background: rowBg, border: `1px solid ${border}`, color: text }}>
          <Eye className="w-3 h-3" /> Cover
        </button>
      </div>
    </div>
  );

  const URLMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <Zap className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>Quick URL</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: muted }}>Original URL</p>
        <div className="rounded-lg px-3 py-2.5 flex items-center gap-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <Globe className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
          <span className="text-[11px] truncate" style={{ color: muted }}>tiktok.com/@user/video/7298340192</span>
        </div>
      </div>
      <div className="flex items-center gap-2 py-1">
        <div className="flex-1 h-px" style={{ background: border }} />
        <ArrowUpDown className="w-3 h-3" style={{ color: muted }} />
        <div className="flex-1 h-px" style={{ background: border }} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: muted }}>Just prepend</p>
        <div className="rounded-lg px-3 py-2.5 flex items-center gap-2" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <Globe className="w-3 h-3 flex-shrink-0" style={{ color: iconColor }} />
          <span className="text-[11px] truncate" style={{ color: text }}>
            <span style={{ fontWeight: 600 }}>tokscript.com/</span>tiktok.com/@user/video/7298340192
          </span>
        </div>
      </div>
      <div className="rounded-lg px-3 py-2.5 flex items-center justify-between" style={{ background: rowBg, border: `1px solid ${border}` }}>
        <span className="text-[11px]" style={{ color: muted }}>Result</span>
        <span className="text-[11px]" style={{ color: text }}>Transcript ready ✓</span>
      </div>
    </div>
  );

  const ExtensionMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
          <Globe className="w-3 h-3" style={{ color: iconColor }} />
        </div>
        <span className="text-xs" style={{ color: text, fontWeight: 500 }}>Tokscript Extension</span>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>Active</span>
      </div>
      <div className="rounded-lg px-3 py-2.5" style={{ background: rowBg, border: `1px solid ${border}` }}>
        <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: muted }}>Current video</p>
        <p className="text-xs truncate" style={{ color: text }}>How I made $10k from one TikTok video</p>
        <p className="text-[10px]" style={{ color: muted }}>@finance.creator · 2:14</p>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { icon: <Copy className="w-3 h-3" />, label: 'Copy transcript to clipboard' },
          { icon: <Download className="w-3 h-3" />, label: 'Download as .txt file' },
          { icon: <ExternalLink className="w-3 h-3" />, label: 'Open in Tokscript dashboard' },
        ].map((btn) => (
          <button key={btn.label} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 w-full text-left" style={{ background: rowBg, border: `1px solid ${border}`, color: text }}>
            <span style={{ color: muted }}>{btn.icon}</span>
            <span className="text-[11px]">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const PromptBaseMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
            <BookOpen className="w-3 h-3" style={{ color: iconColor }} />
          </div>
          <span className="text-xs" style={{ color: text, fontWeight: 500 }}>Prompt Base</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>50+ prompts</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {['All', 'Hooks', 'Repurpose', 'Analysis', 'Summary'].map((cat, idx) => (
          <span key={cat} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: idx === 0 ? iconBg : tagBg, color: idx === 0 ? text : muted, fontWeight: idx === 0 ? 600 : 400, border: idx === 0 ? `1px solid ${border}` : '1px solid transparent' }}>
            {cat}
          </span>
        ))}
      </div>
      {[
        { title: 'Viral Hook Generator',      category: 'Hooks',     desc: 'Turn any transcript into 5 scroll-stopping opening hooks.',     uses: '8.4K' },
        { title: 'Executive Summary',          category: 'Summary',   desc: 'Condense any transcript into a crisp 3-paragraph summary.',     uses: '11.3K' },
        { title: 'LinkedIn Thread Converter',  category: 'Repurpose', desc: 'Convert a video into a high-performing LinkedIn thread.',       uses: '6.2K' },
      ].map((p) => (
        <div key={p.title} className="rounded-lg px-3 py-2.5 flex flex-col gap-1.5" style={{ background: rowBg, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
              <span className="text-[11px]" style={{ color: text, fontWeight: 500 }}>{p.title}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>{p.category}</span>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: muted }}>{p.desc}</p>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[9px]" style={{ color: muted }}>{p.uses} uses</span>
            <span className="text-[9px] flex items-center gap-0.5" style={{ color: muted }}>Apply <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>
      ))}
    </div>
  );

  const AIMockup = () => (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: iconBg }}>
          <Cpu className="w-3 h-3" style={{ color: iconColor }} />
        </div>
        <span className="text-xs" style={{ color: text, fontWeight: 500 }}>AI Agents</span>
      </div>
      <div className="rounded-lg px-3 py-2.5" style={{ background: rowBg, border: `1px solid ${border}` }}>
        <p className="text-[10px] mb-1 uppercase tracking-wide" style={{ color: muted }}>Source transcript</p>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: text }}>"The secret to going viral isn't posting more — it's posting smarter. Here's what the algorithm actually rewards…"</p>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Viral Hook Generator' },
          { label: 'Viral Script Writer' },
          { label: 'Virality Explainer' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: rowBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" style={{ color: muted }} />
              <span className="text-[11px]" style={{ color: text }}>{item.label}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: tagBg, color: muted }}>Ready</span>
          </div>
        ))}
      </div>
      <button className="w-full rounded-lg py-2 text-[11px] flex items-center justify-center gap-1.5" style={{ background: rowBg, border: `1px solid ${border}`, color: text }}>
        <Zap className="w-3 h-3" style={{ color: muted }} /> Run all agents
      </button>
    </div>
  );

  const features = [
    {
      icon: <Layers className="w-[15px] h-[15px]" />,
      title: 'Bulk Importing',
      tag: 'Save hours',
      desc: 'Bulk import up to 50 TikTok, Instagram, or YouTube Shorts links at once to quickly download transcripts in bulk. Save time and manage large volumes efficiently.',
      bullets: ['Bulk import up to 50 video links at once', 'TikTok, Instagram & YouTube Shorts support', 'Bulk export all transcripts simultaneously', 'Individual or batch processing options'],
      cta: 'Start bulk importing',
      mockup: <BulkMockup />,
    },
    {
      icon: <ListFilter className="w-[15px] h-[15px]" />,
      title: 'Collection & Playlist Importing',
      tag: 'One link, all videos',
      desc: 'Paste a single link to a public TikTok collection or creator playlist to automatically import and transcribe every video within it.',
      bullets: ['Public TikTok collection importing', 'Creator playlist auto-detection', 'Series and topic-based organization', 'Automatic metadata preservation'],
      cta: 'Import a playlist',
      mockup: <PlaylistMockup />,
    },
    {
      icon: <Folder className="w-[15px] h-[15px]" />,
      title: 'History, Folders & Bookmarking',
      tag: 'Stay organized',
      desc: 'Access a complete transcript history for every video — logging download dates, sources, and durations. Organize your library with custom bookmark folders.',
      bullets: ['Complete download history with metadata', 'Custom bookmark folders', 'Re-download in TXT, XML, PDF formats', 'Bulk export and sharing capabilities'],
      cta: 'Organise your library',
      mockup: <HistoryMockup />,
    },
    {
      icon: <Film className="w-[15px] h-[15px]" />,
      title: 'HD Video & Cover Image Download',
      tag: 'No watermarks',
      desc: 'Download TikTok, Instagram Reels, and YouTube Shorts in HD quality with no watermarks. Instantly save high-resolution cover images across all platforms.',
      bullets: ['HD video downloads without watermarks', 'Cover image extraction and download', 'Multiple platform support', 'Original quality preservation'],
      cta: 'Download HD videos',
      mockup: <HDMockup />,
    },
    {
      icon: <Zap className="w-[15px] h-[15px]" />,
      title: 'Quick URL Download',
      tag: 'Instant access',
      desc: 'Instant transcripts — just prepend "tokscript.com/" to any video URL. No login needed, works with every supported platform automatically.',
      bullets: ['Instant URL-based downloading', 'No need to visit the main website', 'Works with all supported platforms', 'Automatic redirect and processing'],
      cta: 'Try instant downloads',
      mockup: <URLMockup />,
    },
    {
      icon: <Globe className="w-[15px] h-[15px]" />,
      title: 'Chrome Extension',
      tag: 'While you browse',
      desc: 'Copy video transcripts to your clipboard or download them as .txt files while watching TikTok, Instagram Reels, or YouTube Shorts — no URL copying needed.',
      bullets: ['One-click transcript download', 'Instant clipboard copying', 'Works while you browse natively', 'No URL copying required'],
      cta: 'Add to Chrome',
      mockup: <ExtensionMockup />,
    },
    {
      icon: <Cpu className="w-[15px] h-[15px]" />,
      title: 'AI Agents',
      tag: 'Go viral faster',
      desc: 'AI-powered virality tools — hooks, viral script writing, and video breakdown. Designed for those who want to win attention and grow fast.',
      bullets: ['Viral Hook Generator', 'Viral Script Writer', 'Virality Explainer & breakdown', 'One-click content transformation'],
      cta: 'Try AI tools',
      mockup: <AIMockup />,
    },
    {
      icon: <BookOpen className="w-[15px] h-[15px]" />,
      title: 'Prompt Base',
      tag: '50+ expert prompts',
      desc: 'A curated library of expert AI prompts built specifically for short-form video content. Browse by category, apply directly to any transcript, and turn raw text into polished output in seconds.',
      bullets: ['50+ prompts across 7 categories — Hooks, Repurpose, SEO, and more', 'Apply any prompt directly to your transcript with one click', 'Community-powered: sorted by real usage counts and verified results', 'From viral hooks to LinkedIn threads, email newsletters, and full scripts'],
      cta: 'Browse the Prompt Base',
      mockup: <PromptBaseMockup />,
    },
  ];

  const decoColor = isDark ? '#262626' : '#d1d5db';
  const starFill  = isDark ? '#0d0d0d'  : 'white';

  return (
    <section className="w-full py-14 md:py-24 relative" style={{ background: bg, overflow: 'visible' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Section header */}
        <div className="text-center mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: muted, fontWeight: 500 }}>
            Everything in one place
          </p>
          <h2 className="text-3xl tracking-tight mb-4" style={{ color: text }}>
            What you can do with Tokscript
          </h2>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: muted }}>
            From bulk imports to AI-powered virality analysis — every tool you need to turn video content into your competitive edge.
          </p>
        </div>

        {/* Alternating rows */}
        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((feat, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={feat.title} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Text side — left on even, right on odd */}
                <div className={isEven ? 'order-1' : 'order-1 md:order-2'}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg, color: iconColor }}>
                      {feat.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: tagBg, color: muted, fontWeight: 500 }}>
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl tracking-tight mb-3" style={{ color: text }}>{feat.title}</h3>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: muted }}>{feat.desc}</p>
                  <div className="flex flex-col gap-2.5">
                    {feat.bullets.map((b) => (
                      <div key={b} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]" style={{ background: dotColor }} />
                        <span className="text-sm leading-relaxed" style={{ color: muted }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-80 active:opacity-60"
                    style={{
                      background: isDark ? '#ffffff' : '#111111',
                      color: isDark ? '#111111' : '#ffffff',
                      fontWeight: 500,
                    }}
                    onClick={() => window.location.href = '/signup'}
                  >
                    {feat.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
                {/* Mockup side — right on even, left on odd */}
                <div className={isEven ? 'order-2' : 'order-2 md:order-1'}>
                  {feat.mockup}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ─── Feature Pills Row ─────────────���────────────────────────────────────────
function FeaturePillsRow() {
  const features = [
    { icon: <Zap className="w-4 h-4 text-[#00F2EA]" />, title: 'Instant generation', desc: 'Generate complete templates and workflows in seconds using natural language.' },
    { icon: <Layers className="w-4 h-4 text-[#00F2EA]" />, title: 'Smart templates', desc: 'Browse 316+ pre-built templates for marketing, engineering, and ops teams.' },
    { icon: <CodeXml className="w-4 h-4 text-[#00F2EA]" />, title: 'Code-ready output', desc: 'Get clean, production-ready code you can drop directly into your project.' },
    { icon: <Globe className="w-4 h-4 text-[#00F2EA]" />, title: 'Works everywhere', desc: 'Integrate with your existing stack — GitHub, Slack, Notion, and 100+ tools.' },
  ];

  return (
    null
  );
}

// ─── Workflow Section ───────────────────────────────────────────────────────
function WorkflowSection() {
  const { isDark } = useContext(ThemeContext);
  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const cardBg = isDark ? '#141414' : '#f9fafb';
  const rowBg  = isDark ? '#1a1a1a' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';
  const subtext = isDark ? '#888888' : '#4b5563';

  const items = [
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00F2EA]" />, text: 'Describe your task in plain English and let AI do the heavy lifting' },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00F2EA]" />, text: 'Pick from hundreds of ready-made templates or customize from scratch' },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00F2EA]" />, text: 'Iterate in real time with context-aware suggestions and smart edits' },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00F2EA]" />, text: 'Export or deploy directly to your favourite platform in one click' },
  ];

  return (
    null
  );
}

// ─── Landing Discover Section ─────────────────────────────────────────────────
interface LPVideo {
  id: number; title: string; creator: string; platform: string;
  duration: string; date: string; thumbnail: string; snippet: string;
}

const LP_PLATFORM_BG: Record<string, string> = {
  TikTok: '#010101', Instagram: '#e1306c', YouTube: '#ff0000',
};

function LPVideoCard({ v, isDark, border, text, muted }: {
  v: LPVideo; isDark: boolean; border: string; text: string; muted: string;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all cursor-pointer"
      style={{ border: `1px solid ${border}`, background: cardBg }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = cardBg; }}
      onClick={() => navigate('/signup')}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
        <ImageWithFallback src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white opacity-80" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          {isDark ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#ffffff', fontWeight: 600, backdropFilter: 'blur(6px)' }}>
              {v.platform === 'YouTube' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                </svg>
              )}
              {v.platform === 'TikTok' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" />
                </svg>
              )}
              {v.platform === 'Instagram' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              )}
              {v.platform}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: LP_PLATFORM_BG[v.platform] ?? '#6b7280', color: '#ffffff', fontWeight: 600 }}>
              {v.platform}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>{formatDuration(v.duration)}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px]" style={{ color: muted }}>{v.creator}</span>
        <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{v.title}</p>
        <p className="text-[10px]" style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {v.snippet}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="text-[10px]" style={{ color: muted }}>{v.date}</span>
          <button
            className="p-1 rounded-md transition-colors"
            style={{ color: copied ? '#00b8b2' : muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
            onClick={e => { e.stopPropagation(); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'; }}
            onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
          >
            {copied ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function LandingDiscoverSection() {
  const { isDark } = useContext(ThemeContext);
  const navigate   = useNavigate();

  const bg     = isDark ? '#111111' : '#f9fafb';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';

  const RECENT: LPVideo[] = [
    { id: 1,  platform: 'TikTok',    title: 'Viral pasta al limone',         creator: '@morgancooks',   duration: '0:42', date: 'Mar 2, 2026',  thumbnail: 'https://images.unsplash.com/photo-1589714379796-37d4bc8655c0?w=400&q=80', snippet: "Five ingredients, five minutes — this is the pasta recipe TikTok can't stop making. Here's the exact technique that keeps it from turning greasy..." },
    { id: 2,  platform: 'Instagram', title: 'Capsule wardrobe guide 2026',   creator: '@stylebylex',    duration: '0:38', date: 'Mar 2, 2026',  thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80', snippet: "Stop buying clothes you never wear. My 27-piece capsule has covered every occasion for 8 months straight and here's exactly what's in it..." },
    { id: 3,  platform: 'YouTube',   title: 'Full review – new iPhone',      creator: '@techbreakdown', duration: '1:12', date: 'Mar 1, 2026',  thumbnail: 'https://images.unsplash.com/photo-1693681866052-8f4c1bbb21a4?w=400&q=80', snippet: "After three weeks of daily use here's my honest verdict. The camera is genuinely impressive but there are two things that still disappoint me..." },
    { id: 4,  platform: 'TikTok',    title: 'Shoulder finisher routine',     creator: '@gymcoachpro',   duration: '0:55', date: 'Mar 1, 2026',  thumbnail: 'https://images.unsplash.com/photo-1770177132209-e67de0b6dad8?w=400&q=80', snippet: "Three moves, ten minutes, you will not need another shoulder workout today. Do these as a finisher after your press and thank me later..." },
    { id: 5,  platform: 'Instagram', title: 'Small space decorating hacks',  creator: '@homebyamara',   duration: '0:45', date: 'Mar 1, 2026',  thumbnail: 'https://images.unsplash.com/photo-1643889037313-7bda0ccc3d69?w=400&q=80', snippet: "Living in 400 square feet taught me tricks no interior designer will tell you — because they want you to buy expensive furniture instead..." },
    { id: 6,  platform: 'TikTok',    title: 'Learn flexbox in 60 seconds',  creator: '@codewithmax',   duration: '1:00', date: 'Feb 28, 2026', thumbnail: 'https://images.unsplash.com/photo-1762330907825-2864a45c124d?w=400&q=80', snippet: "If CSS layout has ever confused you this is the only 60 seconds you need. Justify-content, align-items — demystified right now..." },
    { id: 7,  platform: 'YouTube',   title: 'Solo trip to Kyoto – day one', creator: '@roamingalex',   duration: '2:10', date: 'Feb 28, 2026', thumbnail: 'https://images.unsplash.com/photo-1511881220587-13b89d1da6b8?w=400&q=80', snippet: "I landed with no hotel booked and ¥30,000 in my pocket. What followed was the most unexpectedly magical 72 hours I've ever had traveling solo..." },
    { id: 8,  platform: 'TikTok',    title: 'My 5am morning routine',       creator: '@mindsetam',     duration: '0:33', date: 'Feb 27, 2026', thumbnail: 'https://images.unsplash.com/photo-1758598497628-942ad38a6dc4?w=400&q=80', snippet: "People ask how I'm productive before 9am. It's not discipline — it's a system. And it took me three years to simplify it down to this..." },
  ];

  const POPULAR: LPVideo[] = [
    { id: 9,  platform: 'YouTube',   title: '$0 to $10K/month journey',      creator: '@sarahbuilds',   duration: '1:45', date: 'Feb 24, 2026', thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80', snippet: "Before I get into the framework, I want to debunk the biggest growth myth — that you need a huge audience to start monetising. You absolutely do not..." },
    { id: 10, platform: 'TikTok',    title: 'Full day of eating – cut',      creator: '@nutritionbyk',  duration: '0:58', date: 'Feb 22, 2026', thumbnail: 'https://images.unsplash.com/photo-1605568985653-3d8e43f4efa6?w=400&q=80', snippet: "This is exactly what I eat on a cut at 2,100 calories. High protein, actually filling, and nothing I'd dread eating every single day..." },
    { id: 11, platform: 'Instagram', title: 'Figma auto-layout secrets',     creator: '@designhacks',   duration: '0:52', date: 'Feb 21, 2026', thumbnail: 'https://images.unsplash.com/photo-1695903096358-8912486294e8?w=400&q=80', snippet: "Auto-layout is where most Figma users leave 80% of the power on the table. Here are the settings nobody talks about in tutorials..." },
    { id: 12, platform: 'TikTok',    title: 'Index funds explained simply',  creator: '@investearly',   duration: '1:15', date: 'Feb 20, 2026', thumbnail: 'https://images.unsplash.com/photo-1745509267945-b25cbb4d50ef?w=400&q=80', snippet: "If you don't understand index funds yet this is literally the only explainer you need to watch. I'm going to make this so simple..." },
    { id: 13, platform: 'YouTube',   title: 'I built an app in 24 hours',   creator: '@startupstory',  duration: '1:30', date: 'Feb 19, 2026', thumbnail: 'https://images.unsplash.com/photo-1692106979244-a2ac98253f6b?w=400&q=80', snippet: "Here's the full breakdown — the idea, the build, the launch, and whether it made any money. Spoiler: the result genuinely surprised me..." },
    { id: 14, platform: 'Instagram', title: '5-minute morning stretch',      creator: '@fitwithjamie',  duration: '0:35', date: 'Feb 18, 2026', thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80', snippet: "Do these five stretches before you look at your phone and I guarantee your mornings will feel completely different within two weeks..." },
    { id: 15, platform: 'TikTok',    title: 'AI voice tools compared 2026', creator: '@aivoiceking',   duration: '0:47', date: 'Feb 17, 2026', thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80', snippet: "I tested every major AI voice generator for 30 days straight. The gaps in quality are massive and most people are using the wrong one entirely..." },
    { id: 16, platform: 'YouTube',   title: 'The 2-minute rule for focus',  creator: '@focuslab',      duration: '1:08', date: 'Feb 16, 2026', thumbnail: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=400&q=80', snippet: "This one habit eliminated my procrastination almost completely. It works because of how your brain processes the start of any task..." },
  ];

  return (
    <section className="w-full py-14 md:py-20" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: muted, fontWeight: 500 }}>Discover</p>
            <h2 className="text-3xl tracking-tight mb-2" style={{ color: text }}>See what's being scanned</h2>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: muted }}>
              Browse real transcripts the community is pulling from TikTok, Instagram Reels, and YouTube Shorts right now.
            </p>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="hidden sm:flex flex-shrink-0 items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
            style={{ color: muted }}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recently scanned */}
        

        {/* Most popular */}
        <div className="mb-10 md:mb-12">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {POPULAR.map(v => (
              <LPVideoCard key={v.id} v={v} isDark={isDark} border={border} text={text} muted={muted} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-80 active:opacity-60"
            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
          >
            Sign up to explore more <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

// ─── Integrations ───────────────────────────────────────────────────────────
function IntegrationsSection() {
  const { isDark } = useContext(ThemeContext);
  const bg          = isDark ? '#0d0d0d' : '#ffffff';
  const border      = isDark ? '#262626' : '#f3f4f6';
  const text        = isDark ? '#ffffff' : '#111827';
  const muted       = isDark ? '#888888' : '#6b7280';
  const cardBg      = isDark ? '#141414' : '#f9fafb';
  const cardBorder  = isDark ? '#262626' : '#f3f4f6';
  const availableBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const soonBg      = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const notionFill  = isDark ? '#ffffff' : '#111111';

  const integrations = [
    {
      name: 'Zapier',
      status: 'Available',
      logo: (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FF4A00', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 61 61" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '72%', height: '72%' }}>
            <path d="M38.1248 30.5134C38.1238 32.78 37.7088 34.9487 36.9536 36.9527C34.9507 37.7079 32.78 38.1228 30.5125 38.1257H30.4866C28.221 38.1228 26.0503 37.7088 24.0473 36.9536C23.2921 34.9507 22.8762 32.78 22.8752 30.5134V30.4866C22.8762 28.221 23.2912 26.0503 24.0454 24.0483C26.0484 23.2921 28.22 22.8762 30.4866 22.8752H30.5125C32.78 22.8762 34.9507 23.2921 36.9536 24.0483C37.7088 26.0503 38.1238 28.221 38.1248 30.4866V30.5134ZM60.5764 25.4168H42.7728L55.361 12.8277C54.3719 11.4381 53.2689 10.1347 52.0661 8.93197V8.93101C50.8634 7.72922 49.56 6.62806 48.1713 5.63903L35.5822 18.2281V0.424556C33.9348 0.147588 32.2423 0.000958366 30.5153 0H30.4837C28.7567 0.000958366 27.0652 0.147588 25.4168 0.424556V18.2281L12.8277 5.63903C11.4381 6.62806 10.1357 7.73018 8.93485 8.93293L8.92814 8.93772C7.72731 10.1386 6.6271 11.44 5.63807 12.8277L18.2281 25.4168H0.424556C0.424556 25.4168 0 28.7606 0 30.4895V30.5105C0 32.2394 0.14663 33.9338 0.424556 35.5832H18.2281L5.63807 48.1723C7.61805 50.9506 10.0494 53.3829 12.8277 55.3619L25.4168 42.7719V60.5764C27.0643 60.8524 28.7539 60.9981 30.478 61H30.5211C32.2461 60.9981 33.9377 60.8524 35.5822 60.5764V42.7719L48.1723 55.3619C49.5609 54.3729 50.8634 53.2708 52.0661 52.069L52.069 52.0661C53.2698 50.8634 54.3729 49.56 55.361 48.1723L42.7709 35.5832H60.5764C60.8534 33.9367 60.9981 32.2471 61 30.522V30.478C60.9981 28.7529 60.8534 27.0633 60.5764 25.4168Z" fill="white"/>
          </svg>
        </div>
      ),
    },
    {
      name: 'Slack',
      status: 'Available',
      logo: (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffffff', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 61 61" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '72%', height: '72%' }}>
            <path clipRule="evenodd" fillRule="evenodd" fill="#36C5F0" d="M22.3653 0C18.9933 0.00248726 16.2643 2.7335 16.2668 6.09876C16.2643 9.46402 18.9958 12.195 22.3678 12.1975H28.4688V6.10124C28.4713 2.73598 25.7398 0.00497452 22.3653 0C22.3678 0 22.3678 0 22.3653 0ZM22.3653 16.2667H6.101C2.72901 16.2692 -0.00248543 19.0002 6.81098e-06 22.3654C-0.00497766 25.7307 2.72651 28.4617 6.09851 28.4667H22.3653C25.7373 28.4642 28.4688 25.7332 28.4663 22.3679C28.4688 19.0002 25.7373 16.2692 22.3653 16.2667Z"/>
            <path clipRule="evenodd" fillRule="evenodd" fill="#2EB67D" d="M61 22.3654C61.0025 19.0002 58.271 16.2692 54.899 16.2667C51.527 16.2692 48.7955 19.0002 48.798 22.3654V28.4667H54.899C58.271 28.4642 61.0025 25.7332 61 22.3654ZM44.7332 22.3654V6.09876C44.7357 2.73598 42.0067 0.00497452 38.6347 0C35.2627 0.00248726 32.5312 2.7335 32.5337 6.09876V22.3654C32.5287 25.7307 35.2602 28.4617 38.6322 28.4667C42.0042 28.4642 44.7357 25.7332 44.7332 22.3654Z"/>
            <path clipRule="evenodd" fillRule="evenodd" fill="#ECB22E" d="M38.6322 61C42.0042 60.9975 44.7357 58.2665 44.7332 54.9012C44.7357 51.536 42.0042 48.805 38.6322 48.8025H32.5312V54.9012C32.5287 58.264 35.2602 60.995 38.6322 61ZM38.6322 44.7308H54.899C58.271 44.7284 61.0025 41.9973 61 38.6321C61.005 35.2668 58.2735 32.5358 54.9015 32.5308H38.6347C35.2627 32.5333 32.5312 35.2643 32.5337 38.6296C32.5312 41.9973 35.2602 44.7284 38.6322 44.7308Z"/>
            <path clipRule="evenodd" fillRule="evenodd" fill="#E01E5A" d="M6.81098e-06 38.6321C-0.00248543 41.9973 2.72901 44.7284 6.101 44.7308C9.473 44.7284 12.2045 41.9973 12.202 38.6321V32.5333H6.101C2.72901 32.5358 -0.00248543 35.2668 6.81098e-06 38.6321ZM16.2668 38.6321V54.8988C16.2619 58.264 18.9933 60.995 22.3653 61C25.7373 60.9975 28.4688 58.2665 28.4663 54.9012V38.6371C28.4713 35.2718 25.7398 32.5408 22.3678 32.5358C18.9933 32.5358 16.2643 35.2668 16.2668 38.6321Z"/>
          </svg>
        </div>
      ),
    },
    {
      name: 'Discord',
      status: 'Coming soon',
      logo: (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#5865F2', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 61 46.246" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '78%', height: '78%' }}>
            <path d="M51.6391 3.83354C47.7511 2.05916 43.5819 0.751876 39.2227 0.00314085C39.1434 -0.0113095 39.0641 0.0248027 39.0232 0.0970289C38.487 1.04558 37.893 2.28305 37.4771 3.25569C32.7885 2.55753 28.124 2.55753 23.5316 3.25569C23.1156 2.26143 22.5001 1.04558 21.9615 0.0970289C21.9206 0.0272125 21.8413 -0.0088997 21.7619 0.00314085C17.4051 0.749484 13.2359 2.05677 9.34554 3.83354C9.31186 3.84798 9.283 3.87208 9.26384 3.90335C1.3557 15.6546 -0.810665 27.1169 0.252083 38.4372C0.256892 38.4925 0.288148 38.5455 0.331428 38.5792C5.54899 42.3903 10.6031 44.704 15.5633 46.2375C15.6427 46.2616 15.7268 46.2328 15.7773 46.1677C16.9507 44.574 17.9966 42.8935 18.8934 41.1263C18.9463 41.0228 18.8958 40.9 18.7877 40.8591C17.1286 40.2332 15.5489 39.47 14.0293 38.6033C13.9091 38.5335 13.8995 38.3625 14.0101 38.2806C14.3298 38.0423 14.6497 37.7943 14.9551 37.5439C15.0103 37.4982 15.0873 37.4885 15.1522 37.5174C25.1353 42.0509 35.9431 42.0509 45.8083 37.5174C45.8733 37.4861 45.9503 37.4958 46.0079 37.5415C46.3133 37.7919 46.6331 38.0423 46.9553 38.2806C47.0659 38.3625 47.0587 38.5335 46.9385 38.6033C45.4189 39.4868 43.8392 40.2332 42.1777 40.8567C42.0696 40.8977 42.0214 41.0228 42.0744 41.1263C42.9904 42.8911 44.0363 44.5715 45.188 46.1653C45.2361 46.2328 45.3227 46.2616 45.402 46.2375C50.3863 44.704 55.4404 42.3903 60.658 38.5792C60.7037 38.5455 60.7325 38.4949 60.7374 38.4396C62.0092 25.3521 58.607 13.9837 51.7184 3.90575C51.7015 3.87208 51.6728 3.84798 51.6391 3.83354ZM20.3842 31.5443C17.3786 31.5443 14.9021 28.7998 14.9021 25.4292C14.9021 22.0586 17.3306 19.3141 20.3842 19.3141C23.4618 19.3141 25.9143 22.0827 25.8662 25.4292C25.8662 28.7998 23.4377 31.5443 20.3842 31.5443ZM40.6533 31.5443C37.6478 31.5443 35.1713 28.7998 35.1713 25.4292C35.1713 22.0586 37.5997 19.3141 40.6533 19.3141C43.731 19.3141 46.1834 22.0827 46.1354 25.4292C46.1354 28.7998 43.731 31.5443 40.6533 31.5443Z" fill="white"/>
          </svg>
        </div>
      ),
    },
    {
      name: 'Notion',
      status: 'Coming soon',
      logo: (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#121212', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 54 56.2053" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '62%', height: '62%' }}>
            <g>
              <path clipRule="evenodd" fillRule="evenodd" fill="#111111" d="M19.2989 1.15004C10.4996 1.83018 3.01812 2.4253 2.67805 2.46781C1.70035 2.68035 0.807665 3.31798 0.382578 4.21066L0 4.97582L0.0425087 23.4246L0.0850174 41.8734L0.63763 43.0211C0.9777 43.6587 3.10313 46.6343 5.44111 49.6525C10.0746 55.6887 10.4146 55.9863 12.1575 56.1988C12.6676 56.2413 16.5359 56.0713 20.6592 55.8162C24.8251 55.5612 31.5415 55.1361 35.5373 54.9235C52.6683 53.8608 51.7756 53.9458 52.7958 53.0957C54.0286 52.0755 53.901 53.7758 53.986 31.3312C54.0286 12.3298 53.986 11.0546 53.6885 10.5019C53.3909 9.82181 52.7958 9.39672 44.9742 3.9131C39.7456 0.214845 39.3631 0.0448097 37.0251 0.00230104C36.0474 -0.0402077 28.0557 0.512405 19.2989 1.15004Z"/>
              <path clipRule="evenodd" fillRule="evenodd" fill="white" d="M19.2989 1.15004C10.4996 1.83018 3.01812 2.4253 2.67805 2.46781C1.70035 2.68035 0.807665 3.31798 0.382578 4.21066L0 4.97582L0.0425087 23.4246L0.0850174 41.8734L0.63763 43.0211C0.9777 43.6587 3.10313 46.6343 5.44111 49.6525C10.0746 55.6887 10.4146 55.9863 12.1575 56.1988C12.6676 56.2413 16.5359 56.0713 20.6592 55.8162C24.8251 55.5612 31.5415 55.1361 35.5373 54.9235C52.6683 53.8608 51.7756 53.9458 52.7958 53.0957C54.0286 52.0755 53.901 53.7758 53.986 31.3312C54.0286 12.3298 53.986 11.0546 53.6885 10.5019C53.3909 9.82181 52.7958 9.39672 44.9742 3.9131C39.7456 0.214845 39.3631 0.0448097 37.0251 0.00230104C36.0474 -0.0402077 28.0557 0.512405 19.2989 1.15004ZM39.0655 3.57303C39.8306 3.9131 45.2293 7.65387 45.9944 8.37652C46.207 8.58906 46.292 8.8016 46.1644 8.88662C45.9519 9.09916 12.4976 11.0971 11.5199 10.927C11.0948 10.8845 10.4571 10.6295 10.0746 10.3744C8.54425 9.31171 4.76097 6.20857 4.76097 5.99603C4.76097 5.40091 4.63345 5.40091 19.5115 4.29568C22.3596 4.12564 27.078 3.78558 29.9261 3.53052C36.0899 3.06293 37.9178 3.06293 39.0655 3.57303ZM49.6927 13.18C49.9477 13.4351 50.1603 13.9026 50.2453 14.3702C50.2878 14.7953 50.3303 22.7019 50.2878 31.8838C50.2453 47.612 50.2028 48.6323 49.9052 49.0573C49.7352 49.3549 49.3951 49.6525 49.0975 49.7375C48.3749 50.035 13.3477 52.0329 12.6251 51.8204C12.285 51.7354 11.8174 51.4378 11.6049 51.1828L11.1798 50.7577L11.1373 33.7542C11.0948 21.8093 11.1373 16.5382 11.2648 16.0706C11.3498 15.7305 11.6474 15.3054 11.8599 15.1354C12.1575 14.9229 14.2404 14.7528 21.3819 14.3277C26.3979 14.0727 34.177 13.6051 38.5979 13.3075C49.2251 12.6699 49.1826 12.6699 49.6927 13.18Z"/>
              <path clipRule="evenodd" fillRule="evenodd" fill="white" d="M40.2991 19.0031C38.3862 19.1306 36.6859 19.3007 36.5159 19.4282C35.9207 19.7257 35.5807 20.2358 35.4956 20.7885C35.4531 21.3411 35.6232 21.4261 37.5361 21.6811L38.3437 21.7662V29.2902C38.3437 33.7536 38.3012 36.6867 38.1737 36.6017C38.0887 36.5167 35.6232 32.6909 32.6476 28.185C29.672 23.594 27.2065 19.8533 27.1639 19.8533C27.1214 19.8108 25.2085 19.8958 22.8706 20.0658C20.0225 20.2358 18.4497 20.4484 18.1521 20.6184C17.642 20.8735 17.0469 21.8087 17.0469 22.4038C17.0469 22.7864 17.727 22.9989 19.1298 22.9989H19.895V44.5933L18.6622 44.9759C17.7695 45.231 17.4295 45.401 17.2594 45.7836C17.0044 46.3787 17.0044 46.8888 17.3019 46.8888C17.3869 46.8888 19.3849 46.8038 21.6803 46.6337C26.1862 46.3787 26.6963 46.2512 27.1639 45.316C27.334 45.0609 27.4615 44.7634 27.4615 44.6358C27.4615 44.5933 26.8239 44.3808 26.1012 44.2108C25.3361 44.0407 24.5709 43.8282 24.4009 43.8282C24.1033 43.7432 24.1033 43.1905 24.1033 35.624V27.5048L29.4594 35.879C35.0706 44.6783 35.7507 45.6986 36.6434 46.1236C37.7061 46.6763 40.4267 46.2937 41.7869 45.401L42.212 45.1459L42.2545 33.1585L42.297 21.1285L43.2322 20.9585C44.3375 20.7459 44.8476 20.2358 44.8476 19.3432C44.8476 18.7905 44.8051 18.748 44.2949 18.7905C43.9974 18.7905 42.1695 18.9181 40.2991 19.0031Z"/>
            </g>
          </svg>
        </div>
      ),
    },
    {
      name: 'Airtable',
      status: 'Coming soon',
      logo: (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f3f3f3', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 55.9989 46.8473" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68%', height: '68%' }}>
            <path d="M25.0076 0.591443L4.12951 9.23042C2.96848 9.71091 2.98051 11.3603 4.14882 11.8234L25.114 20.1373C26.956 20.8679 29.0074 20.8679 30.8495 20.1373L51.815 11.8231C52.983 11.3603 52.9956 9.71123 51.834 9.23074L30.9565 0.591127C29.0517 -0.197042 26.9121 -0.197042 25.0073 0.591127" fill="#FCB400"/>
            <path d="M29.8398 24.6776V45.4472C29.8398 46.4348 30.836 47.1115 31.7542 46.7475L55.1158 37.6796C55.3764 37.5764 55.5999 37.3972 55.7573 37.1653C55.9148 36.9334 55.999 36.6596 55.9989 36.3793V15.6101C55.9989 14.6222 55.0028 13.9458 54.0846 14.3098L30.723 23.3777C30.4625 23.481 30.239 23.6602 30.0815 23.8921C29.9241 24.1239 29.8399 24.3977 29.8398 24.678" fill="#18BFFF"/>
            <path d="M24.3846 25.7483L17.4514 29.0959L16.7475 29.4362L2.11187 36.4488C1.18445 36.8964 0 36.2203 0 35.1897V15.696C0 15.3232 0.191183 15.0013 0.44757 14.7591C0.552752 14.6544 0.67208 14.5649 0.80208 14.4932C1.15153 14.2834 1.65037 14.2273 2.07452 14.3951L24.2682 23.1889C25.3963 23.6364 25.4849 25.2172 24.3846 25.7486" fill="#F82B60"/>
            <path d="M24.3824 25.7485L17.4492 29.096L0.445312 14.7589C0.550515 14.6543 0.669843 14.5649 0.799823 14.4934C1.14927 14.2835 1.64812 14.2275 2.07226 14.3952L24.2659 23.189C25.394 23.6366 25.4826 25.2173 24.3824 25.7488" fill="black" fillOpacity="0.25"/>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-14 md:py-20" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-xs uppercase tracking-wider mb-3 block" style={{ color: muted, fontWeight: 500 }}>Integrations</span>
          <h2 className="text-3xl mb-4 tracking-tight" style={{ color: text }}>We integrate everywhere</h2>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: muted }}>
            Seamlessly connect TokScript with the tools you already use. Save time and automate your content workflow with our growing list of integrations.
          </p>
        </div>
        <div className="flex items-stretch gap-3 md:gap-4">
          {integrations.map((integration) => {
            const isAvailable = integration.status === 'Available';
            return (
              <div
                key={integration.name}
                className="flex flex-col items-center gap-3 p-4 md:p-5 rounded-xl flex-1 min-w-0"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, opacity: isAvailable ? 1 : 0.55 }}
              >
                <div className="w-11 h-11 flex items-center justify-center">
                  {integration.logo}
                </div>
                <span className="text-xs" style={{ color: text, fontWeight: 500 }}>{integration.name}</span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    background: isAvailable ? availableBg : soonBg,
                    color: isAvailable ? text : muted,
                    border: `1px solid ${cardBorder}`,
                    fontWeight: isAvailable ? 500 : 400,
                  }}
                >
                  {integration.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Workflow Automation block */}
        <div
          className="mt-8 md:mt-10 rounded-2xl p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-wider mb-3 block" style={{ color: muted, fontWeight: 500 }}>Workflow Automation</span>
            <h3 className="text-xl md:text-2xl mb-3 tracking-tight" style={{ color: text }}>
              Create powerful automated workflows that trigger when transcripts are extracted or when AI analysis is complete.
            </h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: muted }}>
              Set up notifications, save results to databases, or automatically share insights with your team.
            </p>
            <ul className="flex flex-col gap-2">
              {['Automatic notifications', 'Data synchronization', 'Custom triggers'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: muted }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: muted }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 flex flex-col items-start md:items-center gap-3">
            <button
              className="px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{
                background: text,
                color: bg,
                fontWeight: 500,
              }}
            >
              Explore automations
            </button>
            <span className="text-xs" style={{ color: muted }}>No setup required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Chrome Extension ────────────────────────────────────────────────────────
function ChromeExtensionSection() {
  const { isDark } = useContext(ThemeContext);
  const bg         = isDark ? '#111111' : '#f9fafb';
  const border     = isDark ? '#262626' : '#f3f4f6';
  const cardBg     = isDark ? '#141414' : '#ffffff';
  const cardBorder = isDark ? '#262626' : '#e5e7eb';
  const text       = isDark ? '#ffffff' : '#111827';
  const muted      = isDark ? '#888888' : '#6b7280';
  const pillBg     = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const pillBorder = isDark ? '#262626' : '#e5e7eb';
  const dotBg      = isDark ? '#262626' : '#e5e7eb';

  const features = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      label: 'One-click extraction',
      desc: 'Extract transcripts from any TikTok video instantly while you browse, without leaving the page.',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
      label: 'Real-time analysis',
      desc: 'AI analysis runs automatically as soon as a transcript is captured — results appear in seconds.',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      label: 'Instant AI chat',
      desc: 'Open a conversation with any transcript right from the extension popup and ask anything.',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      label: 'Smart notifications',
      desc: 'Get alerted when trending content matches your saved topics or keyword filters.',
    },
  ];

  return (
    <section className="w-full py-14 md:py-20" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs uppercase tracking-wider mb-3 block" style={{ color: muted, fontWeight: 500 }}>Chrome Extension</span>
          <h2 className="text-3xl mb-4 tracking-tight" style={{ color: text }}>
            Enhance Your Experience with<br className="hidden sm:block" /> Our Chrome Extension
          </h2>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: muted }}>
            Install the TokScript extension and extract, analyse, and act on TikTok transcripts without ever switching tabs.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${cardBorder}`, background: cardBg }}>
          <div className="flex flex-col lg:flex-row">

            {/* Left — feature list + CTA */}
            <div className="flex-1 p-7 md:p-10 flex flex-col justify-between gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((f) => (
                  <div key={f.label} className="flex gap-3.5">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: pillBg, border: `1px solid ${pillBorder}`, color: muted }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-sm mb-1" style={{ color: text, fontWeight: 500 }}>{f.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: muted }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                <button
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-80"
                  style={{ background: text, color: bg, fontWeight: 500 }}
                >
                  <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', position: 'relative' }}>
                    <div style={{ transform: 'scale(1.6)', transformOrigin: 'center center', width: 18.295, height: 18.295, flexShrink: 0 }}>
                      <ChromeLogo />
                    </div>
                  </div>
                  Add to Chrome
                </button>
                <span className="text-xs" style={{ color: muted }}>Works on all Chromium browsers</span>
              </div>
            </div>

            {/* Right — browser + popup mockup */}
            <div
              className="lg:w-72 xl:w-80 flex-shrink-0 flex items-center justify-center p-8 md:p-10"
              style={{ borderTop: `1px solid ${cardBorder}`, borderLeft: 'none' }}
            >
              <style>{`@media (min-width: 1024px) { .ext-right-panel { border-left: 1px solid ${cardBorder} !important; border-top: none !important; } }`}</style>
              <div className="ext-right-panel w-full h-full flex items-center justify-center p-8 md:p-10" style={{ background: isDark ? '#111111' : '#f9fafb', margin: '-2rem', borderTop: `1px solid ${cardBorder}` }}>
                <div className="w-full max-w-[200px]">
                  {/* Browser top bar */}
                  <div className="rounded-t-xl overflow-hidden" style={{ borderTop: `1px solid ${cardBorder}`, borderLeft: `1px solid ${cardBorder}`, borderRight: `1px solid ${cardBorder}`, borderBottom: 'none' }}>
                    <div className="px-3 py-2 flex items-center gap-2" style={{ background: isDark ? '#1a1a1a' : '#e5e7eb' }}>
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full" style={{ background: dotBg }}/>)}
                      </div>
                      <div className="flex-1 h-3 rounded" style={{ background: dotBg }}/>
                    </div>
                    {/* Page content skeleton */}
                    <div className="p-3 space-y-2" style={{ background: cardBg }}>
                      {['w-full','w-4/5','w-3/5'].map((w, i) => (
                        <div key={i} className={`h-1.5 rounded-full ${w}`} style={{ background: isDark ? '#222' : '#f3f4f6' }}/>
                      ))}
                      <div className="h-14 rounded-lg mt-2" style={{ background: isDark ? '#1a1a1a' : '#efefef' }}/>
                      <div className="h-1.5 rounded-full w-full" style={{ background: isDark ? '#222' : '#f3f4f6' }}/>
                      <div className="h-1.5 rounded-full w-2/3" style={{ background: isDark ? '#222' : '#f3f4f6' }}/>
                    </div>
                  </div>
                  {/* Extension popup overlay */}
                  
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Feature Deep Dive ──────────────────────────────────────────────────────
function FeatureDeepDive() {
  const { isDark } = useContext(ThemeContext);
  const bg       = isDark ? '#111111' : '#f9fafb';
  const border   = isDark ? '#262626' : '#f3f4f6';
  const cardBg   = isDark ? '#141414' : '#ffffff';
  const toolbarBg = isDark ? '#1a1a1a' : '#f9fafb';
  const innerBorder = isDark ? '#262626' : '#e5e7eb';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#888888' : '#6b7280';

  return (
    null
  );
}

// ─── 3-Column Feature Cards ───────────────────────────────────────────────
function FeatureCards() {
  const cards = [
    { icon: <MessageSquare className="w-5 h-5 text-[#00F2EA]" />, title: 'Conversational AI', desc: 'Natural back-and-forth dialogue that understands nuance, context, and complex instructions without losing track.' },
    { icon: <Shield className="w-5 h-5 text-[#00F2EA]" />, title: 'Enterprise security', desc: 'SOC 2 Type II certified with end-to-end encryption, SAML SSO, and granular access controls for every team.' },
    { icon: <TrendingUp className="w-5 h-5 text-[#00F2EA]" />, title: 'Usage analytics', desc: 'Real-time insights into how your team uses AI — track ROI, identify top performers, and optimise your workflow.' },
    { icon: <Users className="w-5 h-5 text-[#00F2EA]" />, title: 'Team workspaces', desc: 'Collaborate with colleagues in shared spaces, leave inline comments, and manage permissions with ease.' },
    { icon: <BookOpen className="w-5 h-5 text-[#00F2EA]" />, title: 'Knowledge base', desc: 'Upload your docs, brand guidelines, and past work so AI always writes in your voice with full context.' },
    { icon: <Hash className="w-5 h-5 text-[#00F2EA]" />, title: 'Custom prompts', desc: 'Save and reuse your favourite prompts as shortcuts, shareable snippets, or automated workflow triggers.' },
  ];

  return (
    null
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const { isDark } = useContext(ThemeContext);
  const bg      = isDark ? '#111111' : '#f9fafb';
  const border  = isDark ? '#262626' : '#f3f4f6';
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const cardBorder = isDark ? '#262626' : '#f3f4f6';
  const divider = isDark ? '#262626' : '#f3f4f6';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Head of Marketing, Horizon™',
      avatar: 'https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE5MTI3MTZ8MA&ixlib=rb-4.1.0&q=80&w=400',
      quote: "Solaris cut our content production time in half. Our team ships landing pages and email campaigns in minutes instead of days.",
      stars: 5,
    },
    {
      name: 'James Rodriguez',
      role: 'Engineering Lead, Catalyst™',
      avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTk1ODE0NXww&ixlib=rb-4.1.0&q=80&w=400',
      quote: "The API documentation generator alone saves us 5+ hours per sprint. It's become a core part of our engineering workflow.",
      stars: 5,
    },
    {
      name: 'Priya Nair',
      role: 'Product Manager, Synergy™',
      avatar: 'https://images.unsplash.com/photo-1638452033979-14fba9e17fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGRldmVsb3BlciUyMGNvZGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzE5NzU0NDZ8MA&ixlib=rb-4.1.0&q=80&w=400',
      quote: "I use Solaris for roadmaps, spec docs, and stakeholder updates. It understands my product context better than any other AI tool.",
      stars: 5,
    },
  ];

  return (
    <section className="w-full py-14 md:py-20" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-xs uppercase tracking-wider mb-3 block" style={{ color: muted, fontWeight: 500 }}>Testimonials</span>
          <h2 className="text-3xl mb-3 tracking-tight" style={{ color: text }}>Build for impact, designed for change</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: muted }}>Trusted by product, engineering, and marketing teams at the world's fastest-growing companies.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex gap-1">
                {Array(t.stars).fill(null).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: muted }}>"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid ${divider}` }}>
                <ImageWithFallback src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: text }}>{t.name}</p>
                  <p className="text-[10px]" style={{ color: muted }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Big Numbers ──────────────────────────────────────────────────────────────
function BigNumbers() {
  const numbers = [
    { value: '4.8M', label: 'outputs generated', sub: 'Last 30 days' },
    { value: '12K', label: 'teams onboarded', sub: 'And growing daily' },
    { value: '98%', label: 'satisfaction score', sub: 'From NPS surveys' },
    { value: '3.2x', label: 'productivity lift', sub: 'Average across users' },
  ];

  return (
    null
  );
}

// ─── Teams Section ────────────────────────────────────────────────────────────
function TeamsSection() {
  const { isDark } = useContext(ThemeContext);
  const bg        = isDark ? '#111111' : '#f9fafb';
  const border    = isDark ? '#262626' : '#f3f4f6';
  const cardBg    = isDark ? '#141414' : '#ffffff';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#888888' : '#6b7280';
  const iconBg    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const iconColor = isDark ? '#ffffff' : '#111111';

  const audiences = [
    {
      icon: <ChartNoAxesColumn className="w-5 h-5" style={{ color: iconColor }} />,
      title: 'TikTok Ads',
      body: "If you're struggling to come up with ideas or need to know what a video is talking about, you can easily download any video's transcript to quickly generate new ideas or use for SEO and topic creation.",
    },
    {
      icon: <Film className="w-5 h-5" style={{ color: iconColor }} />,
      title: 'UGC Creators',
      body: "If you're struggling with what to say in your videos or just want a quick reminder of what works, you can now download any transcript and reuse it for future video ideas.",
    },
    {
      icon: <Cpu className="w-5 h-5" style={{ color: iconColor }} />,
      title: 'AI',
      body: 'Easily download any TikTok, Reels, or Shorts transcript so you can feed it into ChatGPT, Claude, Bard, and more — to create User Generated Video Scripts and ideas for your next video.',
    },
  ];

  return (
    <section className="w-full py-16 md:py-24" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Top prose block */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: muted }}>About TokScript</p>
          <h2 className="mb-5 tracking-tight" style={{ color: text }}>
            Free Video Transcript Generator
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: muted }}>
            Download video transcripts (captions) for free — instantly, without uploading any files.
            Quick and simple. No catch.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            Download any video's captions, transcripts, and words for your TikTok, Instagram Reels,
            and YouTube Shorts in seconds. Add your video link, hit start, and instantly get any script
            within seconds. Perfect for UGC creators, Media Buyers, Ads Experts, Creators, and
            Influencers who need help coming up with ideas or understanding what videos are saying.
          </p>
        </div>

        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: muted }}>Who it's for</p>

        {/* Audience cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                {a.icon}
              </div>
              <div>
                <h3 className="text-sm mb-2" style={{ color: text }}>{a.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>{a.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-xs mt-10 leading-relaxed max-w-2xl" style={{ color: muted }}>
          Easily and instantly download any video transcripts from your favourite TikTok, YouTube Shorts,
          and Instagram Reels videos — no account, no extensions, no uploads required.
        </p>
      </div>
    </section>
  );
}

// ─── Pricing Section ─────────────────────────────────────────────────────────
function FinalCTA() {
  const { isDark } = useContext(ThemeContext);
  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const cardBg = isDark ? '#141414' : '#ffffff';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';

  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      priceNote: null,
      badge: null,
      desc: 'For testing the basics.',
      highlight: false,
      iconBg: isDark ? '#1c1c1c' : '#f3f4f6',
      features: [
        '5 transcripts per day',
        'TikTok, Reels & Shorts',
        'Basic Chrome Extension',
      ],
      excluded: ['AI Agents', 'Bulk Import'],
    },
    {
      name: 'Annual Plan',
      price: '$39',
      period: '/year',
      priceNote: 'Just $3.25 / month',
      badge: 'Recommended · Saves $81',
      desc: 'Serious creators wanting the best value.',
      highlight: true,
      iconBg: isDark ? '#222222' : '#f3f4f6',
      features: [
        'Viral Hook Generator',
        'Viral Script Writer',
        'Virality Explainer',
        'Unlimited transcripts',
        'Bulk import (50 videos)',
        'All platforms supported',
        'HD downloads (no watermark)',
      ],
      excluded: [],
    },
    {
      name: 'Monthly Plan',
      price: '$10',
      period: '/month',
      priceNote: '$120 billed per year',
      badge: null,
      desc: 'Full power with flexible billing.',
      highlight: false,
      iconBg: isDark ? '#1c1c1c' : '#f3f4f6',
      features: [
        'All 3 AI Agents (unlimited)',
        'Unlimited transcripts',
        'Bulk import (50 videos)',
        'All platforms supported',
        'HD downloads (no watermark)',
      ],
      excluded: [],
    },
  ];

  const starDivider = (
    <div
      aria-hidden
      className="w-full relative hidden lg:block"
      style={{ borderTop: `1px solid ${border}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
    >
      {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
        <span
          key={side}
          className="absolute"
          style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={isDark ? '#0d0d0d' : '#ffffff'} stroke={border} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <>
      {starDivider}
      <section className="w-full py-16 md:py-24" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-10 md:mb-14 max-w-lg text-center mx-auto">
          <span className="text-xs uppercase tracking-wider mb-3 block" style={{ color: muted, fontWeight: 500 }}>Pricing</span>
          <h2 className="text-3xl mb-4 tracking-tight" style={{ color: text }}>
            Simple, transparent pricing
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            Pick a plan that fits your workflow. No hidden fees, no surprises — just fast, accurate transcripts whenever you need them.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: cardBg,
                border: `1px solid ${plan.highlight ? (isDark ? '#444444' : '#d1d5db') : border}`,
              }}
            >
              {/* Icon */}
              

              {/* Badge */}
              {plan.badge && (
                <div className="mb-4">
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: isDark ? '#262626' : '#f3f4f6', color: muted, border: `1px solid ${border}` }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}
              {!plan.badge && null}

              {/* Plan name + price */}
              <p className="text-sm mb-2" style={{ color: muted }}>{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="tracking-tight" style={{ color: text, fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{plan.price}</span>
                <span className="text-sm" style={{ color: muted }}>{plan.period}</span>
              </div>
              {plan.priceNote
                ? <p className="text-xs mb-3" style={{ color: isDark ? '#555555' : '#9ca3af' }}>{plan.priceNote}</p>
                : <div className="mb-3" />
              }
              <p className="text-xs leading-relaxed mb-5" style={{ color: muted }}>{plan.desc}</p>

              {/* Divider */}
              <div className="mb-4" style={{ height: 1, background: border }} />

              {/* Feature list */}
              <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: isDark ? '#555555' : '#9ca3af' }}>Including</p>
              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span style={{ color: muted, fontSize: 13, lineHeight: 1, flexShrink: 0 }}>✦</span>
                    <span className="text-sm" style={{ color: muted }}>{f}</span>
                  </li>
                ))}
                {plan.excluded.length > 0 && (
                  <>
                    <li className="pt-2">
                      <p className="text-xs uppercase tracking-widest mb-2.5" style={{ color: isDark ? '#3a3a3a' : '#d1d5db' }}>Not included</p>
                    </li>
                    {plan.excluded.map((f) => (
                      <li key={f} className="flex items-center gap-2.5" style={{ opacity: 0.4 }}>
                        <span style={{ color: muted, fontSize: 11, lineHeight: 1, flexShrink: 0 }}>✕</span>
                        <span className="text-sm" style={{ color: muted }}>{f}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>

              {/* CTA */}
              <button
                className="w-full py-3 rounded-xl text-sm transition-all"
                style={
                  plan.highlight
                    ? {
                        background: isDark ? '#ffffff' : '#111111',
                        color: isDark ? '#111111' : '#ffffff',
                        border: 'none',
                      }
                    : {
                        background: 'transparent',
                        border: `1px solid ${border}`,
                        color: muted,
                      }
                }
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
    {starDivider}
    </>
  );
}

// ─── Trusted Logos ─────────────────────────────────────────────────────────
function TrustedLogos() {
  const { isDark } = useContext(ThemeContext);
  const bg     = isDark ? '#111111' : '#f9fafb';
  const border = isDark ? '#262626' : '#f3f4f6';
  const muted  = isDark ? '#888888' : '#9ca3af';
  const dotBg  = isDark ? '#262626' : '#d1d5db';

  const logos = ['Synergy™', 'Horizon™', 'Catalyst™', 'Phoenix™', 'Nexus™', 'Apex™'];
  return (
    <section className="w-full py-10 md:py-12" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <p className="text-xs text-center mb-6 uppercase tracking-widest font-medium" style={{ color: muted }}>Trusted by 200,000+ users worldwide</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-nowrap overflow-x-auto">
          {logos.map((logo) => (
            <div key={logo} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity" style={{ color: muted }}>
              <div className="w-5 h-5 rounded" style={{ background: dotBg }} />
              <span className="text-sm font-medium">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ───────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'What is TokScript?', a: 'TokScript is an AI-powered platform that allows users to generate transcripts for TikTok, Instagram Reels, and YouTube Shorts videos. It offers features like bulk importing, cloud storage, team collaboration, and AI agents to enhance content creation and management.' },
  { q: 'Who can use TokScript?', a: "TokScript is designed for content creators, social media managers, marketing teams, agencies, and businesses who want to streamline their video content creation process. Whether you're a solo creator or part of a large team, our platform scales to meet your needs." },
  { q: 'How does TokScript work?', a: 'Simply upload your video links or import them in bulk, and our AI analyzes the content to generate engaging scripts. You can then customize, save to your cloud library, and share with your team. Our AI agents can also help optimize scripts for better engagement and virality.' },
  { q: 'Does TokScript only work for TikTok?', a: 'No, TokScript works across multiple platforms including TikTok, Instagram Reels, and YouTube Shorts. Our AI is trained to understand the unique requirements and audience preferences of each platform.' },
  { q: 'Are the scripts original?', a: 'Yes, all scripts generated by TokScript are original content created by our AI based on your input videos. Each script is unique and tailored to your specific content, helping you maintain authenticity while saving time.' },
  { q: 'Can I customize the scripts?', a: 'Absolutely! All generated scripts are fully customizable. You can edit, rewrite, add your own style, and save multiple versions. Our platform also offers AI-powered suggestions to help you optimize scripts for maximum engagement.' },
  { q: 'How long does it take to download a transcript?', a: 'Generally, it takes about 5–10 seconds. For longer videos (around 5 minutes), it can take roughly 30 seconds. Times vary based on internet speed and video length.' },
  { q: 'Will it work on any video?', a: 'We can download transcripts for TikTok, YouTube Shorts, and Instagram Reels as long as there is spoken audio in the video. If the creator has disabled auto-transcribe or there is no speech, we cannot extract a transcript.' },
  { q: 'Do I need a TikTok, YouTube, or Instagram account?', a: "Absolutely not! You don't need an account on those platforms — you only need the link to the video." },
  { q: 'Do I need to install extensions?', a: 'No. You just paste the link into the input field on our website. A Chrome extension is available for added convenience, but it is not required.' },
  { q: 'Is it free?', a: 'Yes! We offer free transcripts using automated speech recognition. While these may not be 100% accurate, they are suitable for most purposes.' },
  { q: 'What does the paid subscription offer?', a: 'The paid subscription includes over 10 additional features not available on free accounts, such as AI Agents (Viral Hook Writer, Script Writer, Video Analyzer) and bulk processing.' },
];

function FAQSection() {
  const { isDark } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const cardBg = isDark ? '#141414' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const starDivider = (
    <div
      aria-hidden
      className="w-full relative hidden lg:block"
      style={{ borderTop: `1px solid ${border}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
    >
      {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
        <span
          key={side}
          className="absolute"
          style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={isDark ? '#0d0d0d' : '#ffffff'} stroke={border} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <>
      {starDivider}
      <section className="w-full py-20 md:py-28" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: muted }}>Support</p>
          <h2 className="mb-3" style={{ color: text }}>Frequently asked questions</h2>
          <p className="text-sm" style={{ color: muted }}>
            Everything you need to know about TokScript. Can't find the answer?{' '}
            <a href="mailto:support@tokscript.com" className="underline underline-offset-2" style={{ color: muted }}>
              Reach out to our team.
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: cardBg,
                  border: `1px solid ${isOpen ? (isDark ? '#444444' : '#d1d5db') : border}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  style={{ background: 'transparent', cursor: 'pointer' }}
                >
                  <span className="text-sm" style={{ color: text }}>{item.q}</span>
                  <span
                    style={{
                      color: muted,
                      transition: 'transform 0.25s',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                      fontSize: 20,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <p className="text-sm px-5 pb-5" style={{ color: muted, lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    {starDivider}
    </>
  );
}

// ─── Full Footer ───────────────────────────────────────────────────────────
function LPFooter() {
  const { isDark } = useContext(ThemeContext);
  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#9ca3af' : '#6b7280';

  const productLinks = ['Features', 'Pricing', 'API', 'Integrations', 'Legal'];
  const companyLinks = ['About', 'Contact', 'Privacy', 'Terms', 'Featurebase help center'];

  const SocialIcon = ({ path, label }: { path: string; label: string }) => (
    <a href="#" aria-label={label} className="transition-opacity hover:opacity-70">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill={muted} />
      </svg>
    </a>
  );

  return (
    <footer className="w-full pt-10 pb-8" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-6 md:px-8">

        {/* Top: logo + tagline + two link columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <AppLogo size={28} />
              
            </div>
            <p className="text-sm leading-relaxed" style={{ color: muted }}>
              The most advanced TikTok transcription tool. Turn your videos into accurate transcripts instantly with AI-powered technology.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <p className="text-sm mb-4" style={{ color: text, fontWeight: 700 }}>Product</p>
              <ul className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-opacity hover:opacity-70" style={{ color: muted }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm mb-4" style={{ color: text, fontWeight: 700 }}>Company</p>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-opacity hover:opacity-70" style={{ color: muted }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: social icons + CTA + copyright */}
        <div className="pt-8 flex flex-col gap-6" style={{ borderTop: `1px solid ${border}` }}>
          {/* Social icons + copyright on the same row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <SocialIcon label="Twitter" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              <SocialIcon label="Facebook" path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              <SocialIcon label="LinkedIn" path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              <SocialIcon label="Instagram" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </div>
            <p className="text-sm" style={{ color: muted }}>
              © 2025 TokScript. All rights reserved.
            </p>
          </div>

          {/* Legal disclaimer */}
          <p className="text-xs leading-relaxed" style={{ color: isDark ? '#555555' : '#9ca3af' }}>
            <span style={{ color: muted }}>LEGAL DISCLAIMER:</span>{' '}
            Tokscript is not affiliated with, endorsed by, or sponsored by TikTok, TikTok USDS Joint Venture LLC, ByteDance, Instagram, Meta, YouTube, or Google. All trademarks belong to their respective owners.
          </p>
        </div>

      </div>
    </footer>
  );
}

// ─── Main LandingPage export ──────────────────────────────────────────────────
export function LandingPage() {
  const HEADER_H = 68;
  const { isDark } = useContext(ThemeContext);

  const decoColor = isDark ? '#262626' : '#d1d5db';
  const starFill  = isDark ? '#0d0d0d'  : 'white';

  return (
    <div className={`min-h-screen${isDark ? ' solaris-dark' : ''}`} style={{ background: isDark ? '#0d0d0d' : '#ffffff' }}>
      {/* Decorative lines — desktop only */}
      <div aria-hidden className="hidden lg:block" style={{ position: 'fixed', top: 0, left: 68, width: 1, bottom: 0, backgroundColor: decoColor, pointerEvents: 'none', zIndex: 9999 }} />
      <div aria-hidden className="hidden lg:block" style={{ position: 'fixed', top: 0, right: 68, width: 1, bottom: 0, backgroundColor: decoColor, pointerEvents: 'none', zIndex: 9999 }} />
      {/* Horizontal line — two segments with 32px gap on each side of the header pill */}
      <div aria-hidden style={{ position: 'fixed', top: '67.5px', left: 0, width: 'calc(50% - 487px)', height: '1px', backgroundColor: decoColor, pointerEvents: 'none', zIndex: 30 }} />
      <div aria-hidden style={{ position: 'fixed', top: '67.5px', left: 'calc(50% + 487px)', right: 0, height: '1px', backgroundColor: decoColor, pointerEvents: 'none', zIndex: 30 }} />
      {/* Stars where horizontal line meets the vertical decorative lines — desktop only */}
      {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
        <div key={side} aria-hidden className="hidden lg:block" style={{ position: 'fixed', top: `${HEADER_H - 8}px`, width: '16px', height: '16px', pointerEvents: 'none', zIndex: 10000, ...style }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
      {/* Circles at the inner ends of the horizontal line segments — desktop only, solid filled */}
      <div aria-hidden className="solaris-hr-circle-left hidden lg:block" style={{ position: 'fixed', top: '67.5px', left: 'calc(50% - 487px)', transform: 'translate(-50%, -50%)', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: decoColor, pointerEvents: 'none', zIndex: 31 }} />
      <div aria-hidden className="solaris-hr-circle-right hidden lg:block" style={{ position: 'fixed', top: '67.5px', left: 'calc(50% + 487px)', transform: 'translate(-50%, -50%)', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: decoColor, pointerEvents: 'none', zIndex: 31 }} />

      <LPHeader />
      <LPHero />
      <AppMockup />
      <TrustedLogos />

      {/* ── Section divider: TrustedLogos → StatsSection ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <StatsSection />

      {/* ── Section divider: StatsSection → WhatYouCanDoSection ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <WhatYouCanDoSection />
      <FeaturePillsRow />
      <WorkflowSection />

      {/* ── Section divider: WorkflowSection → LandingDiscoverSection ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <LandingDiscoverSection />

      {/* ── Section divider: LandingDiscoverSection → IntegrationsSection ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <IntegrationsSection />
      <FeatureDeepDive />
      <FeatureCards />

      {/* ── Section divider: FeatureCards → Testimonials ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <Testimonials />

      {/* ── Section divider: Testimonials → BigNumbers ── */}
      <div
        aria-hidden
        className="w-full relative hidden lg:block"
        style={{ borderTop: `1px solid ${decoColor}`, overflow: 'visible', pointerEvents: 'none', zIndex: 10000 }}
      >
        {[{ side: 'left', style: { left: '60.5px' } }, { side: 'right', style: { right: '60.5px' } }].map(({ side, style }) => (
          <span
            key={side}
            className="absolute"
            style={{ ...style, top: -8, zIndex: 10001, width: 16, height: 16 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
              <path d="M 8 0 C 8 4, 12 8, 16 8 C 12 8, 8 12, 8 16 C 8 12, 4 8, 0 8 C 4 8, 8 4, 8 0 Z" fill={starFill} stroke={decoColor} strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>

      <BigNumbers />
      <TeamsSection />
      <FinalCTA />
      <ChromeExtensionSection />
      <FAQSection />
      <LPFooter />
    </div>
  );
}