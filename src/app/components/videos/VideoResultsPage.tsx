import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  Search, X, ChevronDown, Clock, FileText, Calendar, SlidersHorizontal,
  LayoutGrid, List, Columns2, CheckCheck, Play, Download, ImageDown,
  MoreHorizontal, Loader2, Check, Copy, ExternalLink,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { AppSidebar } from '../AppSidebar';
import { AppHeader } from '../AppHeader';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { HistoryEntry } from '../DiscoverPage';
import { VIDEOS_DATA } from './videoData';
import { VideoDownloadItem } from './types';
import { formatDuration } from '../../utils/formatDuration';
import {
  simulateVideoDownload,
  simulateCoverDownload,
  simulateZipDownload,
} from './downloadUtils';
import { SelectionBar } from '../SelectionBar';

// ─── Verified creators ────────────────────────────────────────────────────────
const VERIFIED_CREATORS = new Set([
  '@tokcast', '@founders', '@engineering', '@productteam',
  '@fitwithjess', '@techbrosam', '@kitchenlabs', '@gamervault',
  '@keynoteking', '@aifuturist', '@productivityhacks', '@chefmike',
]);

// ─── Platform badge ────────────────────────────────────────────────────────────
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

// ─── Duration parser helper ────────────────────────────────────────────────────
function parseDurationSeconds(dur: string): number {
  const parts = dur.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

// ─── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'date-desc',  label: 'Newest first' },
  { value: 'saved-desc', label: 'Most saved'   },
  { value: 'words-desc', label: 'Most words'   },
];

// ─── VideoResultCard ───────────────────────────────────────────────────────────
function VideoResultCard({
  item, isDark, cardBg, border, text, muted, hoverBg, isSelected, onToggleSelect,
}: {
  item: VideoDownloadItem;
  isDark: boolean;
  cardBg: string;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const defaultActionBg = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  const entry = item.entry;
  const isPending     = item.status === 'pending';
  const isDownloading = item.status === 'downloading';
  const isComplete    = item.status === 'complete';

  const shimmerBg = `linear-gradient(90deg,
    ${isDark ? '#1a1a1a' : '#f3f4f6'} 25%,
    ${isDark ? '#222222' : '#e5e7eb'} 50%,
    ${isDark ? '#1a1a1a' : '#f3f4f6'} 75%
  )`;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{
        border: `1px solid ${hovered ? (isDark ? '#333333' : '#d1d5db') : border}`,
        background: hovered ? hoverBg : cardBg,
        transition: 'background 0.12s ease, border-color 0.12s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (isComplete && entry) { simulateVideoDownload(entry.title); }
      }}
    >
      {/* ── Thumbnail ─────────────────────────────────────────────────────── */}
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">

        {/* Pending: shimmer skeleton */}
        {isPending && (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: shimmerBg, backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        {/* Downloading: thumbnail dimmed + spinner + progress */}
        {isDownloading && entry && (
          <>
            <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" style={{ opacity: 0.7 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={28} color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: 'rgba(255,255,255,0.2)' }}>
              <div style={{ height: '100%', width: `${item.progress}%`, background: '#00b8b2', transition: 'width 0.2s ease', borderRadius: '0 2px 2px 0' }} />
            </div>
          </>
        )}

        {/* Complete: full thumbnail + overlays + check badge */}
        {isComplete && entry && (
          <>
            <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
            {/* Play icon — always visible */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white opacity-80" />
            </div>
            {/* Check badge top-right — toggles selection on click */}
            <div
              className="absolute top-2 right-2 z-10 flex items-center justify-center cursor-pointer"
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isSelected ? '#00b8b2' : 'rgba(0,0,0,0.4)',
                border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
              }}
              onClick={e => { e.stopPropagation(); onToggleSelect(item.id); }}
            >
              {isSelected && <Check size={11} color="#ffffff" strokeWidth={3} />}
            </div>
          </>
        )}

        {/* Platform + duration badges (all states) */}
        {entry && (
          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            <PlatformBadge platform={entry.platform} />
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
              {formatDuration(entry.duration)}
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ─────────────────────────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {entry ? (
          <>
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
                <button className="p-1 rounded-md" style={{ color: muted, background: defaultActionBg, border: `1px solid ${border}`, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); simulateVideoDownload(entry.title); }} title="Download video"
                  onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = defaultActionBg; }}
                ><Download className="w-2.5 h-2.5" /></button>
                <button className="p-1 rounded-md" style={{ color: muted, background: defaultActionBg, border: `1px solid ${border}`, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); simulateCoverDownload(entry.title, entry.thumbnail); }} title="Download cover image"
                  onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = defaultActionBg; }}
                ><ImageDown className="w-2.5 h-2.5" /></button>
                <button className="p-1 rounded-md" style={{ color: muted, background: defaultActionBg, border: `1px solid ${border}`, cursor: 'pointer' }} title="More options"
                  onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = defaultActionBg; }}
                ><MoreHorizontal className="w-2.5 h-2.5" /></button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ height: 10, width: '50%', borderRadius: 4, background: shimmerBg, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 28, borderRadius: 4, background: shimmerBg, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 24, borderRadius: 4, background: shimmerBg, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </>
        )}
      </div>
    </div>
  );
}

// ─── VideoResultsPage ──────────────────────────────────────────────────────────
export function VideoResultsPage() {
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [activePlatforms, setActivePlatforms]   = useState<string[]>([]);
  const [activeDurations, setActiveDurations]   = useState<string[]>([]);
  const [activeWords, setActiveWords]           = useState<string[]>([]);
  const [activeDateRanges, setActiveDateRanges] = useState<string[]>([]);
  const [sortBy, setSortBy]                     = useState('date-desc');
  const [viewMode, setViewMode]                 = useState<'grid' | 'list' | 'hybrid'>('grid');
  const [openDropdown, setOpenDropdown]         = useState<string | null>(null);

  // ─── Download items from route state ──────────────────────────────────────
  const links: string[] = (location.state as any)?.links ?? [];

  const [items, setItems] = useState<VideoDownloadItem[]>(() => {
    const count = Math.max(links.length, 6);
    return Array.from({ length: count }, (_, i) => {
      const video = VIDEOS_DATA[i % VIDEOS_DATA.length];
      return {
        id: video.id + i * 1000,
        url: links[i] || `https://example.com/video/${i}`,
        status: 'pending' as const,
        progress: 0,
        entry: video,
      };
    });
  });

  const [selectedIds, setSelectedIds]           = useState<Set<number>>(() => {
    const count = Math.max(links.length, 6);
    return new Set(Array.from({ length: count }, (_, i) => {
      const video = VIDEOS_DATA[i % VIDEOS_DATA.length];
      return video.id + i * 1000;
    }));
  });
  const [listOpenMenuId, setListOpenMenuId]     = useState<number | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Staggered download simulation ────────────────────────────────────────
  useEffect(() => {
    items.forEach((_, i) => {
      setTimeout(() => {
        setItems(prev => prev.map((item, j) =>
          j === i ? { ...item, status: 'downloading', progress: 0 } : item
        ));
        const duration = 500 + Math.random() * 1500;
        const ticks = 5;
        for (let t = 1; t <= ticks; t++) {
          setTimeout(() => {
            setItems(prev => prev.map((item, j) =>
              j === i ? { ...item, progress: Math.min(100, Math.round((t / ticks) * 100)) } : item
            ));
          }, (duration / ticks) * t);
        }
        setTimeout(() => {
          setItems(prev => prev.map((item, j) =>
            j === i ? { ...item, status: 'complete', progress: 100 } : item
          ));
        }, duration);
      }, i * 300);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completedCount  = items.filter(i => i.status === 'complete').length;
  const downloadingCount = items.filter(i => i.status === 'downloading').length;
  const allComplete     = completedCount === items.length;

  // ─── Color tokens (identical to every page) ───────────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const cardBg  = isDark ? '#141414' : '#ffffff';

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort';

  // ─── Filter + sort logic (operates on download items with entries) ────────
  const filteredItems = items
    .filter(item => {
      const e = item.entry;
      if (!e) return true;
      // Search
      const q = searchQuery.toLowerCase();
      const matchQ = !q ||
        e.title.toLowerCase().includes(q) ||
        e.creator.toLowerCase().includes(q) ||
        e.transcriptSnippet.toLowerCase().includes(q);

      // Platform
      const matchP = activePlatforms.length === 0 || activePlatforms.includes(e.platform);

      // Duration
      const secs = parseDurationSeconds(e.duration);
      const matchD = activeDurations.length === 0 || (
        (activeDurations.includes('<1 min')  && secs < 60) ||
        (activeDurations.includes('1–3 min') && secs >= 60 && secs <= 180) ||
        (activeDurations.includes('3+ min')  && secs > 180)
      );

      // Words
      const matchW = activeWords.length === 0 || (
        (activeWords.includes('<1K')   && e.words < 1000) ||
        (activeWords.includes('1K–5K') && e.words >= 1000 && e.words <= 5000) ||
        (activeWords.includes('5K+')   && e.words > 5000)
      );

      // Date
      const eDate = new Date(e.date);
      const now   = new Date('2026-03-12');
      const diffDays = Math.floor((now.getTime() - eDate.getTime()) / 86400000);
      const matchDate = activeDateRanges.length === 0 || (
        (activeDateRanges.includes('Today')      && diffDays === 0) ||
        (activeDateRanges.includes('This week')  && diffDays <= 7) ||
        (activeDateRanges.includes('This month') && eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear())
      );

      return matchQ && matchP && matchD && matchW && matchDate;
    })
    .sort((a, b) => {
      if (!a.entry || !b.entry) return 0;
      if (sortBy === 'words-desc' || sortBy === 'saved-desc') return b.entry.words - a.entry.words;
      return 0;
    });

  const anyFilterActive = activePlatforms.length > 0 || activeDurations.length > 0 ||
    activeWords.length > 0 || activeDateRanges.length > 0 || sortBy !== 'date-desc' || !!searchQuery;

  const clearAll = () => {
    setActivePlatforms([]);
    setActiveDurations([]);
    setActiveWords([]);
    setActiveDateRanges([]);
    setSortBy('date-desc');
    setSearchQuery('');
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>
        <AppHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar activePage="videos" collapsed={sidebarCollapsed} />

          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* ── 1. Page Header ───────────────────────────────────────────── */}
            <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="max-w-[1280px] mx-auto w-full px-6 pt-6 pb-5 flex items-start justify-between">
                <div>
                  <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                    Download Results
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    {!allComplete ? (
                      <>
                        <span className="text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                          Downloading {completedCount + downloadingCount} of {items.length}...
                        </span>
                        <div className="h-1 rounded-full overflow-hidden" style={{ width: 120, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb' }}>
                          <div className="h-full rounded-full" style={{ width: `${(completedCount / items.length) * 100}%`, background: '#00b8b2', transition: 'width 0.3s ease' }} />
                        </div>
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                        All {items.length} videos downloaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          {/* ── 2. Filter Bar ──────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

              {/* Search */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                  border: `1px solid ${border}`,
                  color: muted,
                  width: 220,
                }}
              >
                <Search className="w-3.5 h-3.5 flex-shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search videos…"
                  className="flex-1 bg-transparent outline-none text-xs min-w-0"
                  style={{ color: text }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 hover:opacity-60"
                    style={{ color: muted }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

              {/* Platform multi-select */}
              <div className="relative flex-shrink-0">
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: activePlatforms.length > 0
                      ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                    color: activePlatforms.length > 0 ? '#00b8b2' : muted,
                    border: `1px solid ${activePlatforms.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    fontWeight: activePlatforms.length > 0 ? 500 : 400,
                  }}
                  onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                >
                  {activePlatforms.length === 0
                    ? 'Platform'
                    : activePlatforms.length === 1
                      ? activePlatforms[0]
                      : `${activePlatforms.length} platforms`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'platform' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                    <div
                      className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 148 }}
                    >
                      {['TikTok', 'Instagram', 'YouTube'].map(opt => {
                        const sel = activePlatforms.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={e => {
                              e.stopPropagation();
                              setActivePlatforms(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                            style={{
                              color: sel ? '#00b8b2' : muted,
                              background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                              fontWeight: sel ? 500 : 400,
                            }}
                            onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            {opt}
                            {sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Duration multi-select */}
              <div className="relative flex-shrink-0">
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: activeDurations.length > 0
                      ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                    color: activeDurations.length > 0 ? '#00b8b2' : muted,
                    border: `1px solid ${activeDurations.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    fontWeight: activeDurations.length > 0 ? 500 : 400,
                  }}
                  onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
                >
                  <Clock className="w-3 h-3" />
                  {activeDurations.length === 0
                    ? 'Duration'
                    : activeDurations.length === 1
                      ? activeDurations[0]
                      : `${activeDurations.length} selected`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'duration' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'duration' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                    <div
                      className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 130 }}
                    >
                      {['<1 min', '1–3 min', '3+ min'].map(opt => {
                        const sel = activeDurations.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveDurations(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                            style={{
                              color: sel ? '#00b8b2' : muted,
                              background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                              fontWeight: sel ? 500 : 400,
                            }}
                            onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            {opt}
                            {sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}
                          </button>
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
                    background: activeWords.length > 0
                      ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                    color: activeWords.length > 0 ? '#00b8b2' : muted,
                    border: `1px solid ${activeWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    fontWeight: activeWords.length > 0 ? 500 : 400,
                  }}
                  onClick={() => setOpenDropdown(openDropdown === 'words' ? null : 'words')}
                >
                  <FileText className="w-3 h-3" />
                  {activeWords.length === 0
                    ? 'Words'
                    : activeWords.length === 1
                      ? activeWords[0]
                      : `${activeWords.length} selected`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'words' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'words' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                    <div
                      className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}
                    >
                      {['<1K', '1K–5K', '5K+'].map(opt => {
                        const sel = activeWords.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                            style={{
                              color: sel ? '#00b8b2' : muted,
                              background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                              fontWeight: sel ? 500 : 400,
                            }}
                            onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            {opt}
                            {sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}
                          </button>
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
                    background: activeDateRanges.length > 0
                      ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                    color: activeDateRanges.length > 0 ? '#00b8b2' : muted,
                    border: `1px solid ${activeDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    fontWeight: activeDateRanges.length > 0 ? 500 : 400,
                  }}
                  onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                >
                  <Calendar className="w-3 h-3" />
                  {activeDateRanges.length === 0
                    ? 'Date'
                    : activeDateRanges.length === 1
                      ? activeDateRanges[0]
                      : `${activeDateRanges.length} selected`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'date' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                    <div
                      className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}
                    >
                      {['Today', 'This week', 'This month'].map(opt => {
                        const sel = activeDateRanges.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                            style={{
                              color: sel ? '#00b8b2' : muted,
                              background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                              fontWeight: sel ? 500 : 400,
                            }}
                            onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            {opt}
                            {sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}
                          </button>
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
                    background: sortBy !== 'date-desc'
                      ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
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
                    <div
                      className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{
                            color: sortBy === opt.value ? '#00b8b2' : muted,
                            background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent',
                            fontWeight: sortBy === opt.value ? 500 : 400,
                          }}
                          onMouseEnter={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          {opt.label}
                          {sortBy === opt.value && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Clear all */}
              {anyFilterActive && (
                <>
                  <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                  <button
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70 flex-shrink-0"
                    style={{ color: '#00b8b2', fontWeight: 500 }}
                    onClick={clearAll}
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                </>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

              {/* View toggle */}
              <div
                className="flex items-center p-0.5 rounded-lg flex-shrink-0"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                  border: `1px solid ${border}`,
                }}
              >
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
                  >
                    {icon}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* ── 3. Content ─────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1280px] mx-auto w-full px-6 py-5">
              {filteredItems.length > 0 ? (
                viewMode === 'list' ? (
                  /* ── List view ── */
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff' }}
                  >
                    {/* Header row */}
                    <div
                      className="flex items-center px-4 py-2"
                      style={{ borderBottom: `1px solid ${border}` }}
                    >
                      <div style={{ width: 48, flexShrink: 0, marginRight: 12 }} />
                      <div className="flex-shrink-0 text-[10px] uppercase tracking-wider" style={{ width: 280, color: muted }}>Content</div>
                      <div className="flex-1 min-w-0 text-[10px] uppercase tracking-wider" style={{ color: muted }}>Transcript</div>
                      <div className="flex-shrink-0 text-right text-[10px] uppercase tracking-wider" style={{ width: 80, color: muted }}>Date</div>
                      <div className="flex-shrink-0 text-center text-[10px] uppercase tracking-wider" style={{ width: 60, color: muted }}>Duration</div>
                      <div className="flex-shrink-0 text-center text-[10px] uppercase tracking-wider" style={{ width: 80, color: muted }}>Status</div>
                      <div style={{ width: 32, flexShrink: 0 }} />
                    </div>
                    {/* Data rows */}
                    {filteredItems.map(item => {
                      const e = item.entry;
                      if (!e) return null;
                      const isPending     = item.status === 'pending';
                      const isDownloading = item.status === 'downloading';
                      const isComplete    = item.status === 'complete';
                      const menuOpen      = listOpenMenuId === item.id;

                      const statusPill = (() => {
                        if (isPending)     return { label: 'Pending',    bg: 'rgba(245,158,11,0.12)',  color: isDark ? '#fbbf24' : '#d97706' };
                        if (isDownloading) return { label: 'Processing', bg: 'rgba(245,158,11,0.12)',  color: isDark ? '#fbbf24' : '#d97706' };
                        return                    { label: 'Complete',   bg: 'rgba(34,197,94,0.12)',   color: isDark ? '#4ade80' : '#16a34a' };
                      })();

                      const dateParts = e.date.split(', ');
                      const dateLine1 = dateParts[0] ?? e.date;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center px-4 py-2.5"
                          style={{ borderBottom: `1px solid ${border}` }}
                          onMouseEnter={ev => { (ev.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { (ev.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                        >
                          {/* Thumbnail */}
                          <div className="flex-shrink-0 relative rounded-lg overflow-hidden" style={{ width: 48, aspectRatio: '9/16', marginRight: 12 }}>
                            <ImageWithFallback src={e.thumbnail} alt={e.title} className="w-full h-full object-cover" style={{ opacity: isComplete ? 1 : 0.5 }} />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
                            {isComplete && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white opacity-80" />
                              </div>
                            )}
                            {isDownloading && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={14} color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
                              </div>
                            )}
                            <div className="absolute bottom-1 left-1">
                              <PlatformBadge platform={e.platform} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-shrink-0 flex flex-col gap-0.5" style={{ width: 280 }}>
                            <div className="flex items-center gap-1.5">
                              <div className="relative flex-shrink-0">
                                <img src={e.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                {VERIFIED_CREATORS.has(e.creator) && (
                                  <span className="absolute flex items-center justify-center rounded-full"
                                    style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                                    <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                    </svg>
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px]" style={{ color: muted }}>{e.creator}</span>
                            </div>
                            <p className="text-xs truncate" style={{ color: text, fontWeight: 500 }}>{e.title}</p>
                          </div>

                          {/* Transcript preview */}
                          <div className="flex-1 min-w-0">
                            {isPending || isDownloading ? (
                              <span className="text-[11px]" style={{ color: muted }}>Processing…</span>
                            ) : (
                              <p className="text-[11px]" style={{
                                color: muted, lineHeight: 1.4,
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                              } as React.CSSProperties}>
                                {e.transcriptSnippet}
                              </p>
                            )}
                          </div>

                          {/* Date */}
                          <div className="flex-shrink-0 flex flex-col items-end" style={{ width: 80 }}>
                            <span className="text-[11px]" style={{ color: text }}>{dateLine1}</span>
                          </div>

                          {/* Duration */}
                          <div className="flex-shrink-0 text-center" style={{ width: 60 }}>
                            <span className="text-[11px]" style={{ color: muted }}>{formatDuration(e.duration)}</span>
                          </div>

                          {/* Status pill */}
                          <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                              background: statusPill.bg, color: statusPill.color, fontWeight: 500, whiteSpace: 'nowrap',
                            }}>
                              {statusPill.label}
                            </span>
                          </div>

                          {/* 3-dot menu */}
                          <div className="flex-shrink-0 relative" style={{ width: 32 }}>
                            <button
                              className="flex items-center justify-center w-7 h-7 rounded-lg"
                              style={{
                                color: menuOpen ? text : muted,
                                background: menuOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb') : 'transparent',
                              }}
                              onClick={e2 => { e2.stopPropagation(); setListOpenMenuId(menuOpen ? null : item.id); }}
                              onMouseEnter={ev => { if (!menuOpen) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={ev => { if (!menuOpen) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                            {menuOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={e2 => { e2.stopPropagation(); setListOpenMenuId(null); }} />
                                <div
                                  className="absolute right-0 bottom-full mb-1 rounded-xl overflow-hidden z-50 py-1 flex flex-col"
                                  style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 180 }}
                                >
                                  {[
                                    { label: 'Copy transcript', icon: <Copy className="w-3 h-3" />, action: () => { navigator.clipboard?.writeText(e.transcriptSnippet); setListOpenMenuId(null); } },
                                    { label: 'View original',   icon: <ExternalLink className="w-3 h-3" />, action: () => { window.open(item.url ?? `https://example.com/video/${item.id}`, '_blank'); setListOpenMenuId(null); } },
                                  ].map(menuItem => (
                                    <button
                                      key={menuItem.label}
                                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left"
                                      style={{ color: muted, background: 'transparent' }}
                                      onClick={e2 => { e2.stopPropagation(); menuItem.action(); }}
                                      onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                                      onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                    >
                                      {menuItem.icon}
                                      {menuItem.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Grid view ── */
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}
                  >
                    {filteredItems.map(item => (
                      <VideoResultCard
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        cardBg={cardBg}
                        border={border}
                        text={text}
                        muted={muted}
                        hoverBg={hoverBg}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelect={toggleSelect}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <p style={{ color: muted, fontSize: '0.875rem' }}>No videos match your filters</p>
                  <button
                    className="text-xs"
                    style={{ color: '#00b8b2' }}
                    onClick={clearAll}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          </main>
        </div>
      </div>

      {/* Floating SelectionBar */}
      {selectedIds.size > 0 && (
        <SelectionBar
          selectedCount={selectedIds.size}
          isDark={isDark}
          accentColor="#3b82f6"
          onDownloadVideos={() => {
            const targets = items.filter(i => i.status === 'complete' && i.entry && selectedIds.has(i.id));
            simulateZipDownload(targets.map(i => i.entry!.title), 'videos');
          }}
          onDownloadCovers={() => {
            items.filter(i => i.status === 'complete' && i.entry && selectedIds.has(i.id))
              .forEach(i => simulateCoverDownload(i.entry!.title, i.entry!.thumbnail));
          }}
          onDownloadTranscripts={() => {
            const targets = items.filter(i => i.status === 'complete' && i.entry && selectedIds.has(i.id));
            simulateZipDownload(targets.map(i => i.entry!.title), 'transcripts');
          }}
          onDownloadData={() => {
            const targets = items.filter(i => i.status === 'complete' && i.entry && selectedIds.has(i.id));
            simulateZipDownload(targets.map(i => i.entry!.title), 'data');
          }}
          onDownloadAll={() => {
            const targets = items.filter(i => i.status === 'complete' && i.entry && selectedIds.has(i.id));
            simulateZipDownload(targets.map(i => i.entry!.title), 'all');
          }}
          onDeselect={() => setSelectedIds(new Set())}
          onSelectPage={() => {
            const allIds = new Set(items.map(i => i.id));
            setSelectedIds(allIds);
          }}
          totalPageCount={items.length}
        />
      )}

    </>
  );
}
