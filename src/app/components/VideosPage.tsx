import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  Search, Clock, CheckCheck, Play, Download, ImageDown,
  SlidersHorizontal, ChevronDown, Calendar, LayoutGrid, List, X,
  FileText, MoreHorizontal, Columns2, Video, Layers,
  Heart, FolderPlus, Copy, ExternalLink, FolderInput, Trash2,
  Eye, MessageCircle, Share2, TrendingUp, MoreVertical, Bookmark,
  RefreshCw,
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
import { AppHeader } from './AppHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HistoryEntry } from './DiscoverPage';
import { useNewTranscript } from '../context/NewTranscriptContext';
import { simulateVideoDownload, simulateCoverDownload, simulateZipDownload } from './videos/downloadUtils';
import { SelectionBar } from './SelectionBar';
import { SaveToFolderModal } from './SaveToFolderModal';
import { MOCK_SESSIONS } from './videos/mockData';
import { VideoSession } from './videos/types';
import { SessionTile } from './videos/SessionTile';
import { SessionDetailView } from './videos/SessionDetailView';
import { VIDEOS_DATA } from './videos/videoData';

export { VIDEOS_DATA };

// ─── Verified creators ────────────────────────────────────────────────────────
const VERIFIED_CREATORS = new Set([
  '@tokcast', '@founders', '@engineering', '@productteam',
  '@fitwithjess', '@techbrosam', '@kitchenlabs', '@gamervault',
  '@keynoteking', '@aifuturist', '@productivityhacks', '@chefmike',
]);

// ─── Sort options ─────────────────────────────────────────────────────────────
const VIDEO_SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'saves',     label: 'Most saved' },
  { value: 'words-desc',label: 'Most words' },
];

// ─── Panel static data ────────────────────────────────────────────────────────
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

// ─── Helper functions ─────────────────────────────────────────────────────────
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

// ─── Analytics helper functions ───────────────────────────────────────────────
function formatCount(n: number | undefined): string {
  if (n == null || n === 0) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

function formatRelativeRefresh(isoDate: string | undefined): string {
  if (!isoDate) return '—';
  const now = new Date();
  const then = new Date(isoDate);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '<1m';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
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

function PlatformBadge({ platform, isDark }: { platform: string; isDark: boolean }) {
  return (
    <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}>
      <PlatformIconSVG platform={platform} />
    </span>
  );
}

function VideoPlatformBadge({ platform }: { platform?: string }) {
  if (!platform) return null;
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

// ─── Build TranscriptDetailVideo from a HistoryEntry ─────────────────────────
function buildVideoFromEntry(entry: HistoryEntry): TranscriptDetailVideo {
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

// ─── Videos Transcript Side Panel ────────────────────────────────────────────
function VideosTranscriptPanel({
  entry, isDark, border, text, muted, onClose,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const panelBg     = isDark ? '#141414' : '#ffffff';
  const hoverBg     = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';

  const videoData = buildVideoFromEntry(entry);

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 860,
          background: panelBg,
          borderLeft: `1px solid ${border}`,
          boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)',
          animation: 'videosPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <TranscriptDetailPanel
          video={videoData}
          transcript={[entry.transcriptSnippet]}
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
        @keyframes videosPanelIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}

// ─── Video Card (grid view) ───────────────────────────────────────────────────
function VideoCard({
  entry, isDark, border, text, muted, hoverBg, onSelect, isSelected, onToggleSelect,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onSelect: (e: HistoryEntry) => void;
  isSelected: boolean; onToggleSelect: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [folderModalFor, setFolderModalFor] = useState<{ id: number; rect: DOMRect; title: string } | null>(null);

  const cardBg = isDark ? '#141414' : '#ffffff';

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{
        border: isSelected ? '2px solid #00b8b2' : `1px solid ${hovered ? (isDark ? '#333333' : '#d1d5db') : border}`,
        background: isSelected
          ? (isDark ? 'rgba(0,184,178,0.05)' : 'rgba(0,184,178,0.03)')
          : (hovered ? hoverBg : cardBg),
        transition: 'background 0.12s ease, border-color 0.12s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        onSelect(entry);
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />

        {/* Play icon — only on hover */}
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
              <Play className="w-4 h-4 text-white fill-white" style={{ marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Checkbox top-left — always visible */}
        {(
          <div
            className="absolute top-2 left-2 flex items-center justify-center"
            style={{ width: 28, height: 28 }}
            onClick={e => { e.stopPropagation(); onToggleSelect(entry.id); }}
          >
            <div
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: isSelected ? '#00b8b2' : 'rgba(0,0,0,0.4)',
                border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
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
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setFolderModalFor({ id: entry.id, rect, title: entry.title });
            }}
            title="Save to folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom row: platform badge + duration */}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <VideoPlatformBadge platform={entry.platform} />
          <span className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      {/* Card body */}
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
        <p className="text-[10px]"
          style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {entry.transcriptSnippet}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: muted }}>{entry.date}</span>
          <div className="flex items-center gap-1">

            {/* Download video */}
            <button
              className="p-1 rounded-md"
              style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
              onClick={e => { e.stopPropagation(); simulateVideoDownload(entry.title); }}
              title="Download video"
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              <Download className="w-2.5 h-2.5" />
            </button>

            {/* Download cover */}
            <button
              className="p-1 rounded-md"
              style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
              onClick={e => { e.stopPropagation(); simulateCoverDownload(entry.title, entry.thumbnail); }}
              title="Download cover image"
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              <ImageDown className="w-2.5 h-2.5" />
            </button>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                className="p-1 rounded-md"
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
                    style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 160 }}
                  >
                    {[
                      { label: 'Open transcript',        icon: <FileText className="w-3 h-3" />,  action: () => { onSelect(entry); setShowMenu(false); } },
                      { label: 'Download video',         icon: <Download className="w-3 h-3" />,  action: () => { simulateVideoDownload(entry.title); setShowMenu(false); } },
                      { label: 'Download cover image',   icon: <ImageDown className="w-3 h-3" />, action: () => { simulateCoverDownload(entry.title, entry.thumbnail); setShowMenu(false); } },
                      { label: 'Remove from library',    icon: <X className="w-3 h-3" />,         action: () => { setShowMenu(false); } },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left"
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
        <SaveToFolderModal
          type="transcript"
          refId={folderModalFor.id}
          name={folderModalFor.title}
          triggerRect={folderModalFor.rect}
          onClose={() => setFolderModalFor(null)}
        />
      )}
    </div>
  );
}

// ─── Table Header (list view) ─────────────────────────────────────────────────
function VideoListHeader({ muted, border, isDark }: { muted: string; border: string; isDark: boolean }) {
  const th = (content: React.ReactNode, width: number | string, align: 'left' | 'center' | 'right' = 'left', mr = 0) => (
    <div
      className="flex-shrink-0 flex items-center"
      style={{
        width: typeof width === 'number' ? width : undefined,
        flex: width === 'flex' ? 1 : undefined,
        minWidth: width === 'flex' ? 0 : undefined,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        marginRight: mr,
      }}
    >
      <span
        className="text-[10px] uppercase tracking-wider"
        style={{ color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {content}
      </span>
    </div>
  );

  return (
    <div
      className="flex items-center px-3 py-2"
      style={{ borderBottom: `1px solid ${border}`, minWidth: 1460, background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }}
    >
      {/* 1. Checkbox */}
      <div style={{ width: 28, flexShrink: 0, marginRight: 8 }} />
      {/* 2. Video content */}
      {th('Video', 220, 'left', 16)}
      {/* 3. Posted at */}
      {th('Posted at', 110, 'left', 16)}
      {/* 4. Duration - clock icon */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 52, marginRight: 16 }}>
        <Clock style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 5. Views - eye icon */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 56, marginRight: 16 }}>
        <Eye style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 6. Virality - trending up icon */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 52, marginRight: 16 }}>
        <TrendingUp style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 7. Likes - heart icon */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
        <Heart style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 8. Comments - message icon */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
        <MessageCircle style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 9. Shares - share icon */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
        <Share2 style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 10. Bookmarks - bookmark icon */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 56, marginRight: 16 }}>
        <Bookmark style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 11. Engagement */}
      {th('Eng.', 60, 'right', 16)}
      {/* 12. Transcript */}
      {th('Transcript', 200, 'left', 16)}
      {/* 13. Status */}
      {th('Status', 76, 'center', 16)}
      {/* 14. Last refresh */}
      <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 48, marginRight: 8 }}>
        <RefreshCw style={{ width: 12, height: 12, color: muted }} />
      </div>
      {/* 15. Menu */}
      <div style={{ width: 28, flexShrink: 0 }} />
    </div>
  );
}

// ─── Video Row (list view) ────────────────────────────────────────────────────
function VideoRow({
  entry, isDark, border, text, muted, hoverBg, onSelect, isSelected, onToggleSelect, openMenuId, setOpenMenuId, medianViews, index,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onSelect: (e: HistoryEntry) => void;
  isSelected: boolean; onToggleSelect: (id: number) => void;
  openMenuId: number | null; setOpenMenuId: (id: number | null) => void;
  medianViews: number;
  index: number;
}) {
  const [folderModalFor, setFolderModalFor] = useState<{ id: number; rect: DOMRect; title: string } | null>(null);
  const status = entry.status || 'complete';

  const statusPill = (() => {
    if (status === 'failed') return {
      label: 'Failed',
      bg: 'rgba(239,68,68,0.12)',
      color: isDark ? '#f87171' : '#dc2626',
    };
    if (status === 'processing') return {
      label: 'Processing',
      bg: 'rgba(245,158,11,0.12)',
      color: isDark ? '#fbbf24' : '#d97706',
    };
    return {
      label: 'Complete',
      bg: 'rgba(34,197,94,0.12)',
      color: isDark ? '#4ade80' : '#16a34a',
    };
  })();

  const menuOpen = openMenuId === entry.id;

  // Social metrics (optional fields)
  const views = entry.views;
  const likes = entry.likes;
  const comments = entry.comments;
  const shares = entry.shares;
  const bookmarks = entry.bookmarks;
  const lastRefresh = entry.lastRefresh;

  const noData = status === 'failed' || (views == null || views === 0);
  const noEngagement = status === 'processing' && (likes ?? 0) === 0 && (comments ?? 0) === 0 && (shares ?? 0) === 0 && (bookmarks ?? 0) === 0;

  const viralityInfo = (() => {
    if (views == null || views === 0) return null;
    const factor = views / (medianViews || 1);
    const label = factor.toFixed(1) + 'x';
    if (factor < 0.5) return { label, color: isDark ? '#f87171' : '#dc2626', bg: 'rgba(239,68,68,0.15)' };
    if (factor < 1.0) return { label, color: isDark ? '#fbbf24' : '#d97706', bg: 'rgba(245,158,11,0.15)' };
    return { label, color: isDark ? '#4ade80' : '#16a34a', bg: 'rgba(34,197,94,0.15)' };
  })();

  const engagementStr = (() => {
    if (!views || views === 0) return '—';
    const total = (likes ?? 0) + (comments ?? 0) + (shares ?? 0) + (bookmarks ?? 0);
    return ((total / views) * 100).toFixed(1) + '%';
  })();

  const [postedDate, postedTime] = (() => {
    try {
      const d = new Date(entry.date);
      const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return [date, time];
    } catch {
      return [entry.date, ''];
    }
  })();

  return (
    <>
      <div
        className="flex items-center px-3 py-2 cursor-pointer"
        style={{
          borderBottom: `1px solid ${border}`,
          background: isSelected ? (isDark ? 'rgba(0,184,178,0.04)' : 'rgba(0,184,178,0.03)')
            : index % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)')
            : 'transparent',
          transition: 'background 0.1s ease',
          minWidth: 1460,
        }}
        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = index % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)') : 'transparent'; }}
        onClick={() => onSelect(entry)}
      >
        {/* 1. Checkbox */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 28, marginRight: 8 }}
          onClick={e => { e.stopPropagation(); onToggleSelect(entry.id); }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: isSelected ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
            border: isSelected ? 'none' : `1.5px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isSelected && (
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>

        {/* 2. Content: thumbnail + text block */}
        <div className="flex-shrink-0 flex items-start gap-2" style={{ width: 220, marginRight: 16 }}>
          <div className="flex-shrink-0 relative rounded overflow-hidden" style={{ width: 30, aspectRatio: '9/16' }}>
            <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play style={{ width: 8, height: 8, color: '#fff', fill: '#fff', opacity: 0.85 }} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <p
              style={{
                fontSize: 11, fontWeight: 500, color: text, lineHeight: 1.3,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              } as React.CSSProperties}
            >
              {entry.title}
            </p>
            <div className="flex items-center gap-1">
              <div className="relative flex-shrink-0">
                <img src={entry.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                {VERIFIED_CREATORS.has(entry.creator) && (
                  <span className="absolute flex items-center justify-center rounded-full"
                    style={{ bottom: -2, right: -2, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                    <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                    </svg>
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11, color: muted, fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.creator}</span>
              <PlatformBadge platform={entry.platform} isDark={isDark} />
            </div>
          </div>
        </div>

        {/* 3. Posted at */}
        <div className="flex-shrink-0 flex flex-col justify-center" style={{ width: 110, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: text, lineHeight: 1.3 }}>{postedDate}</span>
          <span style={{ fontSize: 10, color: muted, lineHeight: 1.3 }}>{postedTime}</span>
        </div>

        {/* 4. Duration */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 52, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>{formatDuration(entry.duration)}</span>
        </div>

        {/* 5. Views */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 56, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: noData ? muted : text, fontWeight: 400 }}>{noData ? '—' : formatCount(views)}</span>
        </div>

        {/* 6. Virality */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 52, marginRight: 16 }}>
          {!noData && viralityInfo ? (
            <span style={{
              fontSize: 10, fontWeight: 600, color: viralityInfo.color, background: viralityInfo.bg,
              padding: '1px 5px', borderRadius: 4,
            }}>
              {viralityInfo.label}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: muted }}>—</span>
          )}
        </div>

        {/* 7. Likes */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>{(noData || noEngagement) ? '—' : formatCount(likes)}</span>
        </div>

        {/* 8. Comments */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>{(noData || noEngagement) ? '—' : formatCount(comments)}</span>
        </div>

        {/* 9. Shares */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 52, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>{(noData || noEngagement) ? '—' : formatCount(shares)}</span>
        </div>

        {/* 10. Bookmarks */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 56, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>
            {(noData || noEngagement) ? '—' : formatCount(bookmarks)}
          </span>
        </div>

        {/* 11. Engagement */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 60, marginRight: 16 }}>
          <span style={{ fontSize: 11, color: muted }}>{(noData || noEngagement) ? '—' : engagementStr}</span>
        </div>

        {/* 12. Transcript */}
        <div className="flex-shrink-0 min-w-0" style={{ width: 200, marginRight: 16 }}>
          {status === 'failed' ? (
            <span style={{ fontSize: 11, color: isDark ? '#f87171' : '#dc2626' }}>Failed to process</span>
          ) : (
            <p style={{
              fontSize: 11, color: muted, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            } as React.CSSProperties}>
              {entry.transcriptSnippet}
            </p>
          )}
        </div>

        {/* 13. Status */}
        <div className="flex-shrink-0 flex justify-center" style={{ width: 76, marginRight: 16 }}>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 999,
            background: statusPill.bg,
            color: statusPill.color,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {statusPill.label}
          </span>
        </div>

        {/* 14. Last refresh */}
        <div className="flex-shrink-0 flex items-center justify-end" style={{ width: 48, marginRight: 8 }}>
          <span style={{ fontSize: 11, color: muted }}>{formatRelativeRefresh(lastRefresh)}</span>
        </div>

        {/* 15. Menu */}
        <div className="flex-shrink-0 relative flex items-center justify-center" style={{ width: 28 }}>
          <button
            className="flex items-center justify-center w-6 h-6 rounded-md"
            style={{
              color: menuOpen ? text : muted,
              background: menuOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb') : 'transparent',
            }}
            onClick={e => { e.stopPropagation(); setOpenMenuId(menuOpen ? null : entry.id); }}
            onMouseEnter={ev => { if (!menuOpen) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={ev => { if (!menuOpen) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <MoreVertical style={{ width: 14, height: 14 }} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenMenuId(null); }} />
              <div
                className="absolute right-0 bottom-full mb-1 rounded-xl overflow-hidden z-50 py-1 flex flex-col"
                style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 180 }}
              >
                {[
                  { label: 'Copy transcript', icon: <Copy className="w-3 h-3" />, action: () => { navigator.clipboard?.writeText(entry.transcriptSnippet); setOpenMenuId(null); } },
                  { label: 'Download video', icon: <Download className="w-3 h-3" />, action: () => { simulateVideoDownload(entry.title); setOpenMenuId(null); } },
                  { label: 'View original', icon: <ExternalLink className="w-3 h-3" />, action: () => { window.open(entry.url ?? `https://example.com/video/${entry.id}`, '_blank'); setOpenMenuId(null); } },
                  { label: 'Move to folder', icon: <FolderInput className="w-3 h-3" />, action: () => { const rect = document.getElementById(`row-menu-${entry.id}`)?.getBoundingClientRect() ?? new DOMRect(); setFolderModalFor({ id: entry.id, rect, title: entry.title }); setOpenMenuId(null); } },
                ].map(item => (
                  <button
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left"
                    style={{ color: muted, background: 'transparent' }}
                    onClick={e => { e.stopPropagation(); item.action(); }}
                    onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div style={{ height: 1, background: border, margin: '2px 12px' }} />
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left"
                  style={{ color: isDark ? '#f87171' : '#dc2626', background: 'transparent' }}
                  onClick={e => { e.stopPropagation(); setOpenMenuId(null); }}
                  onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {folderModalFor && (
        <SaveToFolderModal
          type="transcript"
          refId={folderModalFor.id}
          name={folderModalFor.title}
          triggerRect={folderModalFor.rect}
          onClose={() => setFolderModalFor(null)}
        />
      )}
    </>
  );
}

// ─── Bulk Selection Bar ───────────────────────────────────────────────────────

// ─── Main Page ────────────────────────────────────────────────────────────────
export function VideosPage() {
  const { isDark } = useContext(ThemeContext);
  const { open: openNewTranscript, videoSessions } = useNewTranscript();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hybrid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [activeDurations, setActiveDurations] = useState<string[]>([]);
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [activeDateRanges, setActiveDateRanges] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [ppDropdownPos, setPpDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const ppBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [ctaHovered, setCtaHovered] = useState(false);
  const [videosTab, setVideosTab] = useState<'all' | 'sessions'>('all');
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [listOpenMenuId, setListOpenMenuId] = useState<number | null>(null);

  const allSessions = [...videoSessions, ...MOCK_SESSIONS];

  // Clear selection when switching to hybrid view
  useEffect(() => {
    if (viewMode === 'hybrid') {
      setSelectedIds(new Set());
    }
  }, [viewMode]);

  // Inject always-visible scrollbar styles for the list view table
  useEffect(() => {
    const id = 'videos-table-scrollbar-styles';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    const track = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
    const thumb = isDark ? 'rgba(255,255,255,0.25)' : '#b0b5bd';
    const thumbHover = isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
    style.textContent = `
      .videos-table-scroll { scrollbar-width: thin; scrollbar-color: ${thumb} ${track}; }
      .videos-table-scroll::-webkit-scrollbar { width: 6px; height: 12px; }
      .videos-table-scroll::-webkit-scrollbar-track { background: ${track}; }
      .videos-table-scroll::-webkit-scrollbar-thumb { background: ${thumb}; border-radius: 4px; }
      .videos-table-scroll::-webkit-scrollbar-thumb:hover { background: ${thumbHover}; }
      .videos-table-scroll::-webkit-scrollbar-corner { background: ${track}; }
    `;
    return () => { style?.remove(); };
  }, [isDark]);

  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const sortLabel = VIDEO_SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest first';

  // ─── Median views for virality computation ──────────────────────────────
  const medianViews = useMemo(() => {
    const validViews = VIDEOS_DATA
      .filter(v => (v as any).status !== 'failed' && ((v as any).views ?? 0) > 0)
      .map(v => (v as any).views as number)
      .sort((a, b) => a - b);
    if (validViews.length === 0) return 1;
    const mid = Math.floor(validViews.length / 2);
    return validViews.length % 2 === 0
      ? (validViews[mid - 1] + validViews[mid]) / 2
      : validViews[mid];
  }, []);

  // ─── Filter logic ────────────────────────────────────────────────────────
  const filteredVideos = VIDEOS_DATA.filter(e => {
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

  const paginatedVideos = filteredVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const hasActiveFilter = activePlatform !== 'All' || activeDurations.length > 0 || activeWords.length > 0 || activeDateRanges.length > 0 || sortBy !== 'date-desc' || !!searchQuery;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activePage="videos" collapsed={sidebarCollapsed} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Title bar */}
          <div className="flex items-center px-6 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-3">
              <Video className="w-4 h-4 flex-shrink-0" style={{ color: muted }} />
              <span className="text-sm" style={{ color: text, fontWeight: 600 }}>Videos</span>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: muted }}>
                {filteredVideos.length} videos
              </span>

              {/* Segmented toggle */}
              <div
                className="inline-flex items-center p-0.5 rounded-lg ml-4"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}
              >
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all"
                  style={{
                    background: videosTab === 'all' ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                    color: videosTab === 'all' ? text : muted,
                    fontWeight: videosTab === 'all' ? 500 : 400,
                    boxShadow: videosTab === 'all' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  }}
                  onClick={() => { setVideosTab('all'); setActiveSession(null); }}
                >
                  <Video className="w-3 h-3" />
                  All Videos
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all"
                  style={{
                    background: videosTab === 'sessions' ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                    color: videosTab === 'sessions' ? text : muted,
                    fontWeight: videosTab === 'sessions' ? 500 : 400,
                    boxShadow: videosTab === 'sessions' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  }}
                  onClick={() => setVideosTab('sessions')}
                >
                  <Layers className="w-3 h-3" />
                  Sessions
                </button>
              </div>
            </div>
          </div>

          {videosTab === 'all' ? (
          <>
          {/* Filter bar */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                border: `1px solid ${border}`,
                color: muted, width: 220,
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
                <button onClick={() => setSearchQuery('')} className="flex-shrink-0" style={{ color: muted }}>
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

            {/* Duration */}
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
                          className="w-full flex items-center justify-between px-3 py-2 text-xs"
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

            {/* Words */}
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
                          className="w-full flex items-center justify-between px-3 py-2 text-xs"
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

            {/* Date */}
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
                          className="w-full flex items-center justify-between px-3 py-2 text-xs"
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

            {/* Sort */}
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
                    {VIDEO_SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); setCurrentPage(1); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs"
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
            {hasActiveFilter && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button
                  className="flex items-center gap-1 text-xs hover:opacity-70 flex-shrink-0"
                  style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setActivePlatform('All'); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setSearchQuery(''); setCurrentPage(1); }}
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}

            {/* Per-page button — only in filter row as spacer, actual portal used in pagination */}
            <div className="relative flex-shrink-0">
              {openDropdown === 'perpage' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute right-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 100 }}>
                    {[12, 24, 30, 50, 100].map(n => (
                      <button key={n} onClick={() => { setItemsPerPage(n); setCurrentPage(1); setOpenDropdown(null); }}
                        className="w-full text-left px-3 py-2 text-xs"
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

          </div>
          </div>

          {/* ── Content ── */}
          {viewMode === 'hybrid' ? (
            /* Hybrid: left compact list + right detail */
            <div className="flex-1 overflow-hidden">
            <div className="flex max-w-[1280px] mx-auto w-full h-full min-h-0 overflow-hidden px-6 py-5">
              {/* Left pane */}
              <div className="flex-shrink-0 flex flex-col" style={{ width: 224, borderRight: `1px solid ${border}` }}>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {filteredVideos.length > 0 ? (
                    <div className="flex flex-col gap-1 py-3 px-3">
                      {paginatedVideos.map(e => (
                        <div
                          key={e.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                          style={{
                            background: selectedEntry?.id === e.id ? (isDark ? 'rgba(255,255,255,0.07)' : '#f0eeeb') : 'transparent',
                            border: `1px solid ${selectedEntry?.id === e.id ? border : 'transparent'}`,
                            transition: 'background 0.1s',
                          }}
                          onClick={() => setSelectedEntry(e)}
                          onMouseEnter={ev => { if (selectedEntry?.id !== e.id) (ev.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (selectedEntry?.id !== e.id) (ev.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                        >
                          <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 30, aspectRatio: '9/16' }}>
                            <ImageWithFallback src={e.thumbnail} alt={e.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <p className="text-[11px] leading-snug"
                              style={{ color: text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}>
                              {e.title.length > 30 ? e.title.slice(0, 30) + '…' : e.title}
                            </p>
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
                      <Video className="w-6 h-6" style={{ color: muted }} />
                      <p className="text-xs text-center" style={{ color: muted }}>No videos match your filters</p>
                    </div>
                  )}

                  {/* Compact pagination */}
                  {filteredVideos.length > itemsPerPage && (() => {
                    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
                    return (
                      <div className="flex items-center justify-center gap-1 px-3 pb-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className="w-6 h-6 rounded-md text-[10px]"
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
                  const videoData   = buildVideoFromEntry(selectedEntry);
                  const panelBg     = isDark ? '#141414' : '#ffffff';
                  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
                  const panelHover  = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
                  return (
                    <TranscriptDetailPanel
                      video={videoData}
                      transcript={[selectedEntry.transcriptSnippet]}
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
                    <p className="text-sm" style={{ color: muted }}>Select a video to view</p>
                  </div>
                )}
              </div>
            </div>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto">
            <div className={viewMode === 'list' ? 'w-full px-6 py-5' : 'max-w-[1280px] mx-auto w-full px-6 py-5'}>

              {/* Selection bar */}
              {selectedIds.size > 0 && (
                <SelectionBar
                  selectedCount={selectedIds.size}
                  isDark={isDark}
                  accentColor="#3b82f6"
                  onDeselect={() => { setSelectedIds(new Set()); }}
                  onDownloadVideos={() => {
                    const selected = VIDEOS_DATA.filter(v => selectedIds.has(v.id));
                    simulateZipDownload(selected.map(v => v.title), 'selected-videos');
                  }}
                  onDownloadCovers={() => {
                    VIDEOS_DATA.filter(v => selectedIds.has(v.id)).forEach(v => simulateCoverDownload(v.title, v.thumbnail));
                  }}
                  onDownloadTranscripts={() => {
                    const selected = VIDEOS_DATA.filter(v => selectedIds.has(v.id));
                    simulateZipDownload(selected.map(v => v.title), 'selected-transcripts');
                  }}
                  onDownloadData={() => {
                    const selected = VIDEOS_DATA.filter(v => selectedIds.has(v.id));
                    simulateZipDownload(selected.map(v => v.title), 'selected-data');
                  }}
                  onDownloadAll={() => {
                    const selected = VIDEOS_DATA.filter(v => selectedIds.has(v.id));
                    simulateZipDownload(selected.map(v => v.title), 'selected-all');
                  }}
                  onSelectPage={() => {
                    const allIds = new Set(filteredVideos.map(v => v.id));
                    setSelectedIds(allIds);
                  }}
                  totalPageCount={filteredVideos.length}
                />
              )}

              {filteredVideos.length > 0 ? (
                viewMode === 'list' ? (
                  <div
                    className="rounded-2xl videos-table-scroll"
                    style={{ border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff', maxHeight: 'calc(100vh - 220px)', overflowX: 'scroll', overflowY: 'auto' }}
                  >
                    <VideoListHeader muted={muted} border={border} isDark={isDark} />
                    {paginatedVideos.map((e, i) => (
                      <VideoRow
                        key={e.id} entry={e} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg}
                        onSelect={entry => setSelectedEntry(entry)}
                        isSelected={selectedIds.has(e.id)} onToggleSelect={toggleSelect}
                        openMenuId={listOpenMenuId} setOpenMenuId={setListOpenMenuId}
                        medianViews={medianViews}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  /* Grid view */
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                    {/* Blue CTA card */}
                    <div
                      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                      style={{
                        border: `1.5px solid ${ctaHovered ? '#3b82f655' : '#3b82f635'}`,
                        background: ctaHovered
                          ? `linear-gradient(180deg, #3b82f622 0%, ${bg} 100%)`
                          : `linear-gradient(180deg, #3b82f614 0%, ${bg} 100%)`,
                      }}
                      onClick={openNewTranscript}
                      onMouseEnter={() => setCtaHovered(true)}
                      onMouseLeave={() => setCtaHovered(false)}
                    >
                      <div className="flex items-center justify-center flex-1"
                        style={{ background: isDark ? 'rgba(59,130,246,0.04)' : '#3b82f608', minHeight: 180 }}>
                        <div className="flex items-center justify-center rounded-xl"
                          style={{ width: 44, height: 44, background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)' }}>
                          <Download className="w-6 h-6" style={{ color: '#3b82f6' }} />
                        </div>
                      </div>
                      <div className="px-3.5 py-3" style={{ borderTop: '1px solid #3b82f620' }}>
                        <p className="text-xs" style={{ color: text, fontWeight: 600 }}>Download new videos</p>
                        <p className="text-[10px] mt-1" style={{ color: muted, lineHeight: 1.5 }}>
                          Paste video links to download and save to your library.
                        </p>
                      </div>
                    </div>

                    {paginatedVideos.map(e => (
                      <VideoCard
                        key={e.id} entry={e} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg}
                        onSelect={entry => setSelectedEntry(entry)}
                        isSelected={selectedIds.has(e.id)} onToggleSelect={toggleSelect}
                      />
                    ))}
                  </div>
                )
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Video className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db' }} />
                  <p style={{ color: muted, fontSize: '0.875rem' }}>No videos match your filters</p>
                  <button
                    className="text-xs"
                    style={{ color: '#00b8b2' }}
                    onClick={() => { setSearchQuery(''); setActivePlatform('All'); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setCurrentPage(1); }}
                  >Clear all filters</button>
                </div>
              )}

              {/* Rich pagination bar */}
              {filteredVideos.length > 0 && (() => {
                const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
                const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, filteredVideos.length);
                const endItem   = Math.min(currentPage * itemsPerPage, filteredVideos.length);

                void startItem; void endItem;

                return (
                  <div
                    className="mt-8 mb-2 rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff' }}
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap">
                      {/* Left: prev + page numbers + next */}
                      <div className="flex items-center gap-0.5">
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

                      {/* Right: per-page portal dropdown */}
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

          {/* Transcript side panel (overlay) — only in grid/list mode */}
          {selectedEntry && viewMode !== 'hybrid' && (
            <VideosTranscriptPanel
              entry={selectedEntry}
              isDark={isDark}
              border={border}
              text={text}
              muted={muted}
              onClose={() => setSelectedEntry(null)}
            />
          )}
          </>
          ) : activeSession ? (
            <SessionDetailView session={activeSession} onBack={() => setActiveSession(null)} />
          ) : (
            /* Sessions grid */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[1280px] mx-auto w-full px-6 py-5">
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                  {/* CTA tile — start new download */}
                  <div
                    className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${isDark ? '#00b8b233' : '#00b8b235'}`,
                      background: `linear-gradient(180deg, rgba(0,184,178,0.06) 0%, ${bg} 100%)`,
                    }}
                    onClick={openNewTranscript}
                  >
                    <div className="flex items-center justify-center flex-1"
                      style={{ background: 'rgba(0,184,178,0.04)', minHeight: 120 }}>
                      <div className="flex items-center justify-center rounded-xl"
                        style={{ width: 44, height: 44, background: 'rgba(0,184,178,0.08)' }}>
                        <Download className="w-6 h-6" style={{ color: '#00b8b2' }} />
                      </div>
                    </div>
                    <div className="px-3.5 py-3" style={{ borderTop: '1px solid rgba(0,184,178,0.15)' }}>
                      <p className="text-xs font-semibold" style={{ color: text }}>Start a new download</p>
                      <p className="text-[10px] mt-1" style={{ color: muted }}>Paste video links to download a new batch.</p>
                    </div>
                  </div>

                  {allSessions.map(session => (
                    <SessionTile
                      key={session.id}
                      session={session}
                      onClick={() => setActiveSession(session)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
