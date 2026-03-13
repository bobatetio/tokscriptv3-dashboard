import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Search, Clock, CheckCheck, Play, Download, ImageDown,
  SlidersHorizontal, ChevronDown, Calendar, LayoutGrid, List, X,
  FileText, MoreHorizontal, Columns2, Video, Layers,
  Heart, FolderPlus,
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
import { SaveToFolderModal } from './SaveToFolderModal';
import { MOCK_SESSIONS } from './videos/mockData';
import { VideoSession } from './videos/types';
import { SessionTile } from './videos/SessionTile';
import { SessionDetailView } from './videos/SessionDetailView';
import { VIDEOS_DATA } from './videos/videoData';

export { VIDEOS_DATA };

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

// ─── Platform badge ───────────────────────────────────────────────────────────
const PLATFORM_META: Record<string, { color: string; bg: string }> = {
  TikTok:     { color: '#ffffff', bg: '#010101' },
  Instagram:  { color: '#ffffff', bg: '#e1306c' },
  YouTube:    { color: '#ffffff', bg: '#ff0000' },
  'Twitter/X':{ color: '#ffffff', bg: '#14171a' },
  LinkedIn:   { color: '#ffffff', bg: '#0a66c2' },
};

function PlatformBadge({ platform }: { platform: string }) {
  const meta = PLATFORM_META[platform] ?? { color: '#fff', bg: '#6b7280' };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px]"
      style={{ background: meta.bg, color: meta.color, fontWeight: 600 }}>
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
          <PlatformBadge platform={entry.platform} />
          <span className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px]" style={{ color: muted }}>{entry.creator}</span>
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

// ─── Video Row (list view) ────────────────────────────────────────────────────
function VideoRow({
  entry, isDark, border, text, muted, hoverBg, onSelect, isSelected, onToggleSelect,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onSelect: (e: HistoryEntry) => void;
  isSelected: boolean; onToggleSelect: (id: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer"
      style={{
        border: isSelected ? '1px solid #00b8b2' : `1px solid ${border}`,
        borderLeft: isSelected ? '3px solid #00b8b2' : undefined,
        background: isSelected ? (isDark ? 'rgba(0,184,178,0.04)' : 'rgba(0,184,178,0.03)') : (isDark ? '#141414' : '#ffffff'),
        transition: 'background 0.12s ease',
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
      onClick={() => {
        onSelect(entry);
      }}
    >
      {/* Checkbox gutter — always visible */}
      {(
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 32 }}
          onClick={e => { e.stopPropagation(); onToggleSelect(entry.id); }}
        >
          <div
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: isSelected ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
              border: isSelected ? 'none' : `1.5px solid ${border}`,
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

      {/* Thumbnail */}
      <div className="w-12 aspect-[9/16] rounded-xl overflow-hidden flex-shrink-0 relative">
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="absolute bottom-1 right-1 text-[9px] px-1 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>{formatDuration(entry.duration)}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <PlatformBadge platform={entry.platform} />
          <span className="text-[11px]" style={{ color: muted }}>{entry.creator}</span>
        </div>
        <p className="truncate text-sm mb-1" style={{ color: text, fontWeight: 500 }}>{entry.title}</p>
        <p className="text-xs truncate" style={{ color: muted, lineHeight: 1.5 }}>{entry.transcriptSnippet}</p>
      </div>

      {/* Meta */}
      <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
        <div className="flex items-center gap-1" style={{ color: muted }}>
          <Calendar className="w-3 h-3" />
          <span className="text-[11px]">{entry.date}</span>
        </div>
        <span className="text-[11px]" style={{ color: muted }}>{entry.words.toLocaleString()} words</span>
      </div>

      {/* Download button */}
      <button
        className="flex-shrink-0 p-2 rounded-lg"
        style={{ color: muted }}
        onClick={e => { e.stopPropagation(); simulateVideoDownload(entry.title); }}
        title="Download video"
        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Bulk Selection Bar ───────────────────────────────────────────────────────
function BulkSelectionBar({
  selectedIds, isDark, border, onDeselect, allVideos,
}: {
  selectedIds: Set<number>; isDark: boolean; border: string; onDeselect: () => void; allVideos: HistoryEntry[];
}) {
  const hasSelection = selectedIds.size > 0;
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 60,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 20px',
      borderRadius: 9999,
      background: isDark ? '#1a1a1a' : '#ffffff',
      border: `1px solid ${border}`,
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.15)',
    }}>
      {hasSelection ? (
        <span style={{ color: '#00b8b2', fontWeight: 600, fontSize: 13 }}>{selectedIds.size} selected</span>
      ) : (
        <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>0 selected — click videos to select</span>
      )}
      <div style={{ width: 1, height: 20, background: border }} />
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
        style={{ background: hasSelection ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'), color: hasSelection ? '#ffffff' : '#888', fontWeight: 500, border: 'none', cursor: hasSelection ? 'pointer' : 'default', opacity: hasSelection ? 1 : 0.5 }}
        onClick={() => {
          if (!hasSelection) return;
          simulateZipDownload(allVideos.filter(v => selectedIds.has(v.id)).map(v => v.title), 'selected-videos');
        }}
      >
        <Download size={14} /> Download all
      </button>
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
        style={{ background: 'transparent', color: '#888', border: `1px solid ${border}`, cursor: hasSelection ? 'pointer' : 'default', opacity: hasSelection ? 1 : 0.5 }}
        onClick={() => {
          if (!hasSelection) return;
          allVideos.filter(v => selectedIds.has(v.id)).forEach(v => simulateCoverDownload(v.title, v.thumbnail));
        }}
      >
        <ImageDown size={14} /> Covers
      </button>
      <div style={{ width: 1, height: 20, background: border }} />
      <button
        className="flex items-center justify-center p-1.5 rounded-lg"
        style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}
        onClick={onDeselect}
        title="Exit selection mode"
      >
        <X size={14} />
      </button>
    </div>,
    document.body
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function VideosPage() {
  const { isDark } = useContext(ThemeContext);
  const { open: openNewTranscript, videoSessions } = useNewTranscript();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hybrid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
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

  const allSessions = [...videoSessions, ...MOCK_SESSIONS];

  // Clear selection when switching to hybrid view
  useEffect(() => {
    if (viewMode === 'hybrid') {
      setSelectedIds(new Set());
    }
  }, [viewMode]);

  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const sortLabel = VIDEO_SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest first';

  // ─── Filter logic ────────────────────────────────────────────────────────
  const filteredVideos = VIDEOS_DATA.filter(e => {
    const matchP = activePlatforms.length === 0 || activePlatforms.includes(e.platform);
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

  const hasActiveFilter = activePlatforms.length > 0 || activeDurations.length > 0 || activeWords.length > 0 || activeDateRanges.length > 0 || sortBy !== 'date-desc' || !!searchQuery;

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

            {/* Platform */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activePlatforms.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activePlatforms.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activePlatforms.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activePlatforms.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
              >
                {activePlatforms.length === 0 ? 'Platform' : activePlatforms.length === 1 ? activePlatforms[0] : `${activePlatforms.length} platforms`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'platform' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 148 }}>
                    {['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'].map(opt => {
                      const sel = activePlatforms.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActivePlatforms(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); setCurrentPage(1); }}
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
                  onClick={() => { setActivePlatforms([]); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setSearchQuery(''); setCurrentPage(1); }}
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}


            <div className="flex-1" />

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
            <div className="flex flex-1 min-h-0 overflow-hidden">
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
                            <p className="text-[10px] truncate" style={{ color: muted }}>{e.creator}</p>
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
          ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1280px] mx-auto w-full px-6 py-5">

              {filteredVideos.length > 0 ? (
                viewMode === 'list' ? (
                  <div className="flex flex-col gap-2">
                    {paginatedVideos.map(e => (
                      <VideoRow
                        key={e.id} entry={e} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg}
                        onSelect={entry => setSelectedEntry(entry)}
                        isSelected={selectedIds.has(e.id)} onToggleSelect={toggleSelect}
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
                    onClick={() => { setSearchQuery(''); setActivePlatforms([]); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); setSortBy('date-desc'); setCurrentPage(1); }}
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

      {/* Bulk selection bar */}
      {videosTab === 'all' && selectedIds.size > 0 && (
        <BulkSelectionBar
          selectedIds={selectedIds}
          isDark={isDark}
          border={border}
          onDeselect={() => { setSelectedIds(new Set()); }}
          allVideos={VIDEOS_DATA}
        />
      )}
    </div>
  );
}
