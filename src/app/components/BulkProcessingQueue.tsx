import React, { useState, useContext } from 'react';
import {
  Play,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  Copy,
  Download,
  X,
  ExternalLink,
  FolderInput,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import type { BulkBatch, BulkVideo } from '../context/BulkProcessingContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BulkProcessingQueueProps {
  batch: BulkBatch;
  onRetryVideo: (videoId: number) => void;
  onRemoveVideo: (videoId: number) => void;
  onClickVideo?: (videoId: number) => void;
  showToast?: (msg: string) => void;
  onMoveToFolder?: (videoId: number) => void;
}

interface MenuPos {
  top: number;
  right: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateUrl(url: string, maxLen = 38): string {
  try {
    const u = new URL(url);
    const path = u.hostname + u.pathname;
    return path.length > maxLen ? path.slice(0, maxLen) + '…' : path;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + '…' : url;
  }
}

// ── PlatformIconSVG ───────────────────────────────────────────────────────────

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

// ── VideoPlatformBadge (dark pill, used on thumbnails) ────────────────────────

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

// ── Status pill ───────────────────────────────────────────────────────────────

type PillVariant = 'pending' | 'downloading' | 'transcribing' | 'completed' | 'failed' | 'unavailable';

interface StatusPillProps {
  variant: PillVariant;
  isDark: boolean;
}

const PILL_CONFIG: Record<PillVariant, { bg: (d: boolean) => string; color: (d: boolean) => string; label: string }> = {
  pending: {
    bg: d => d ? 'rgba(156,163,175,0.12)' : 'rgba(156,163,175,0.10)',
    color: d => d ? '#9ca3af' : '#6b7280',
    label: 'Pending',
  },
  downloading: {
    bg: d => d ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.10)',
    color: d => d ? '#00b8b2' : '#00908b',
    label: 'Processing',
  },
  transcribing: {
    bg: d => d ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.10)',
    color: d => d ? '#00b8b2' : '#00908b',
    label: 'Processing',
  },
  completed: {
    bg: d => d ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.10)',
    color: d => d ? '#4ade80' : '#16a34a',
    label: 'Complete',
  },
  failed: {
    bg: d => d ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.10)',
    color: d => d ? '#f87171' : '#dc2626',
    label: 'Failed',
  },
  unavailable: {
    bg: d => d ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.10)',
    color: d => d ? '#fbbf24' : '#d97706',
    label: 'Unavailable',
  },
};

function StatusPill({ variant, isDark }: StatusPillProps) {
  const cfg = PILL_CONFIG[variant];
  return (
    <span
      className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        background: cfg.bg(isDark),
        color: cfg.color(isDark),
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BulkProcessingQueue({
  batch,
  onRetryVideo,
  onRemoveVideo,
  onClickVideo,
  showToast,
  onMoveToFolder,
}: BulkProcessingQueueProps) {
  const { isDark } = useContext(ThemeContext);

  // Theme tokens
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const cardBg  = isDark ? '#141414' : '#ffffff';

  // Menu state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos]       = useState<MenuPos | null>(null);

  const closeMenu = () => { setOpenMenuId(null); setMenuPos(null); };

  // ── Split videos into two zones ───────────────────────────────────────────

  const completed    = batch.videos.filter(v => v.status === 'completed');
  const nonCompleted = batch.videos.filter(v => v.status !== 'completed');

  // Sort non-completed: failed → unavailable → downloading → transcribing → pending
  const QUEUE_ORDER: Record<string, number> = {
    failed: 0, unavailable: 1, downloading: 2, transcribing: 3, pending: 4,
  };
  const sortedQueue = [...nonCompleted].sort(
    (a, b) => (QUEUE_ORDER[a.status] ?? 9) - (QUEUE_ORDER[b.status] ?? 9)
  );

  // Queue header stats
  const processingCount = nonCompleted.filter(
    v => v.status === 'downloading' || v.status === 'transcribing'
  ).length;
  const waitingCount = nonCompleted.filter(v => v.status === 'pending').length;
  const totalQueue   = nonCompleted.length;
  const doneCount    = completed.length;
  const totalCount   = batch.videos.length;
  const overallPct   = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // ── Build menu items per video ────────────────────────────────────────────

  function getMenuItems(video: BulkVideo) {
    const items: {
      icon: React.ReactNode;
      label: string;
      destructive?: boolean;
      separator?: boolean;
      action: () => void;
    }[] = [];

    if (video.status === 'pending') {
      items.push({
        icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />,
        label: 'Remove from Queue',
        destructive: true,
        action: () => { onRemoveVideo(video.id); showToast?.('Item removed'); closeMenu(); },
      });
    } else if (video.status === 'downloading') {
      items.push({
        icon: <X className="w-3.5 h-3.5 flex-shrink-0" />,
        label: 'Cancel',
        destructive: true,
        action: () => { onRemoveVideo(video.id); closeMenu(); },
      });
    } else if (video.status === 'completed') {
      items.push(
        {
          icon: <Copy className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Copy Transcript',
          action: () => {
            navigator.clipboard.writeText(`[Transcript: ${video.title}]`).catch(() => {});
            showToast?.('Transcript copied to clipboard');
            closeMenu();
          },
        },
        {
          icon: <Download className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Download',
          action: () => {
            const blob = new Blob([`[Transcript: ${video.title}]`], { type: 'text/plain' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `${(video.title || 'transcript').replace(/[^a-z0-9]/gi, '_')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast?.('Transcript downloaded');
            closeMenu();
          },
        },
        {
          icon: <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'View Original',
          action: () => { if (video.url) window.open(video.url, '_blank'); closeMenu(); },
        },
        {
          icon: <FolderInput className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Move to Folder',
          action: () => { onMoveToFolder?.(video.id); closeMenu(); },
        },
        {
          icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Delete',
          destructive: true,
          separator: true,
          action: () => { onRemoveVideo(video.id); showToast?.('Item removed'); closeMenu(); },
        },
      );
    } else if (video.status === 'failed') {
      items.push(
        {
          icon: <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Retry',
          action: () => { onRetryVideo(video.id); showToast?.('Retrying...'); closeMenu(); },
        },
        {
          icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />,
          label: 'Remove',
          destructive: true,
          separator: true,
          action: () => { onRemoveVideo(video.id); showToast?.('Item removed'); closeMenu(); },
        },
      );
    } else if (video.status === 'unavailable') {
      items.push({
        icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />,
        label: 'Remove',
        destructive: true,
        action: () => { onRemoveVideo(video.id); showToast?.('Item removed'); closeMenu(); },
      });
    }
    // transcribing: no menu actions

    return items;
  }

  // ── Menu dropdown renderer (shared) ──────────────────────────────────────

  function renderMenuDropdown(video: BulkVideo) {
    const items = getMenuItems(video);
    if (openMenuId !== video.id || !menuPos || items.length === 0) return null;
    return (
      <>
        <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); closeMenu(); }} />
        <div
          className="fixed z-50 rounded-xl shadow-xl py-1"
          style={{
            background: isDark ? '#141414' : '#ffffff',
            border: `1px solid ${border}`,
            minWidth: 204,
            top: menuPos.top,
            right: menuPos.right,
          }}
          onClick={e => e.stopPropagation()}
        >
          {items.flatMap(opt => [
            opt.separator ? (
              <div key={`sep-${opt.label}`} style={{ height: 1, background: border, margin: '4px 0' }} />
            ) : null,
            <button
              key={opt.label}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left"
              style={{ color: opt.destructive ? '#d95656' : text, background: 'transparent' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              onClick={e => { e.stopPropagation(); opt.action(); }}
            >
              {opt.icon}
              {opt.label}
            </button>,
          ])}
        </div>
      </>
    );
  }

  // ── Three-dot menu button ─────────────────────────────────────────────────

  function renderMenuButton(video: BulkVideo, variant: 'card' | 'row') {
    const items = getMenuItems(video);
    if (items.length === 0) return null;

    const isOpen = openMenuId === video.id;

    if (variant === 'card') {
      return (
        <button
          className="p-1 rounded-md transition-colors"
          style={{
            color: isOpen ? text : muted,
            background: isOpen
              ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb')
              : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
            border: `1px solid ${border}`,
          }}
          onClick={e => {
            e.stopPropagation();
            if (isOpen) {
              closeMenu();
            } else {
              const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setOpenMenuId(video.id);
              setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
            }
          }}
          title="More options"
        >
          <MoreHorizontal className="w-2.5 h-2.5" />
        </button>
      );
    }

    // row variant
    return (
      <button
        className="p-1 rounded-md transition-colors flex-shrink-0"
        style={{
          color: isOpen ? text : muted,
          background: isOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb') : 'transparent',
        }}
        onClick={e => {
          e.stopPropagation();
          if (isOpen) {
            closeMenu();
          } else {
            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
            setOpenMenuId(video.id);
            setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
          }
        }}
        onMouseEnter={ev => { if (!isOpen) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
        onMouseLeave={ev => { if (!isOpen) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        title="More options"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    );
  }

  // ── Zone 1: Completed card ────────────────────────────────────────────────

  function renderCompletedCard(video: BulkVideo) {
    const isNewlyCompleted =
      video.completedAt !== undefined && Date.now() - video.completedAt < 2000;

    return (
      <div
        key={video.id}
        className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
        style={{
          border: `1px solid ${border}`,
          background: cardBg,
          animation: isNewlyCompleted ? 'bulkQueueFadeIn 0.4s ease-out' : undefined,
        }}
        onClick={() => onClickVideo?.(video.id)}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = cardBg; }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={video.thumbnail ?? ''}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }}
          />
          {/* Play icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white opacity-80" />
          </div>
          {/* Bottom bar: platform badge + duration */}
          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            <VideoPlatformBadge platform={video.platform} />
            {video.duration && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}
              >
                {video.duration}
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-3 flex flex-col gap-1.5 flex-1">
          {/* Creator row */}
          <div className="flex items-center gap-1.5">
            {video.avatar && (
              <div className="relative flex-shrink-0">
                <img
                  src={video.avatar}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover"
                />
                {video.verified && (
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      bottom: -1, right: -1,
                      width: 8, height: 8,
                      background: '#1d9bf0',
                      border: '1px solid #fff',
                    }}
                  >
                    <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff" />
                    </svg>
                  </span>
                )}
              </div>
            )}
            <span className="text-[10px] truncate" style={{ color: muted }}>
              {video.creator || ''}
            </span>
          </div>

          {/* Title */}
          <p
            className="text-xs"
            style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}
          >
            {video.title}
          </p>

          {/* Snippet */}
          <p
            className="text-[10px]"
            style={{
              color: muted,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {video.snippet || ''}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-[10px]" style={{ color: muted }}>
              {formatDate(video.completedAt ?? batch.createdAt)}
            </span>
            {renderMenuButton(video, 'card')}
          </div>
        </div>

        {renderMenuDropdown(video)}
      </div>
    );
  }

  // ── Zone 2: Queue row ─────────────────────────────────────────────────────

  function renderQueueRow(video: BulkVideo, isLast: boolean) {
    const showProgress = video.status === 'downloading' || video.status === 'transcribing';
    const showError    = video.status === 'failed';
    const showWarning  = video.status === 'unavailable';
    const progress     = video.progress ?? 0;

    return (
      <div
        key={video.id}
        className="flex items-center gap-3 px-3 relative"
        style={{
          height: 40,
          borderBottom: isLast ? 'none' : `1px solid ${border}`,
        }}
      >
        {/* Platform icon */}
        <span className="flex-shrink-0" style={{ color: muted }}>
          <PlatformIconSVG platform={video.platform} />
        </span>

        {/* URL — flex-1 so it takes remaining space */}
        <span
          className="text-[11px] truncate flex-1 min-w-0"
          style={{ color: muted }}
        >
          {truncateUrl(video.url)}
        </span>

        {/* Progress bar OR error/warning text */}
        {showProgress && (
          <div
            className="flex-shrink-0 rounded-full overflow-hidden"
            style={{ width: 80, height: 3, background: isDark ? '#262626' : '#e5e7eb' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(4, progress)}%`,
                background: '#00b8b2',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}
        {showError && (
          <span className="text-[10px] flex-shrink-0" style={{ color: isDark ? '#f87171' : '#dc2626' }}>
            {video.error || 'Failed'}
          </span>
        )}
        {showWarning && (
          <span className="text-[10px] flex-shrink-0" style={{ color: isDark ? '#fbbf24' : '#d97706' }}>
            Unavailable
          </span>
        )}

        {/* Status pill */}
        <StatusPill variant={video.status} isDark={isDark} />

        {/* Three-dot menu */}
        {renderMenuButton(video, 'row')}

        {renderMenuDropdown(video)}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (batch.videos.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-12"
        style={{ color: muted, fontSize: 13 }}
      >
        No videos in this batch.
      </div>
    );
  }

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes bulkQueueShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes bulkQueueFadeIn {
          0%   { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex flex-col gap-6">

        {/* ── Zone 1: Completed grid ── */}
        {completed.length > 0 && (
          <div className="flex flex-col gap-3">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}
            >
              {completed.map(video => renderCompletedCard(video))}
            </div>
          </div>
        )}

        {/* ── Zone 2: Processing queue ── */}
        {sortedQueue.length > 0 && (
          <div className="flex flex-col gap-2">
            {/* Section header */}
            <div className="flex items-center gap-3 px-1">
              <span
                className="text-xs font-semibold"
                style={{ color: text }}
              >
                Queue
              </span>
              <span className="text-[11px]" style={{ color: muted }}>
                {processingCount > 0 && `${processingCount} processing`}
                {processingCount > 0 && waitingCount > 0 && ' · '}
                {waitingCount > 0 && `${waitingCount} waiting`}
                {processingCount === 0 && waitingCount === 0 && `${totalQueue} item${totalQueue !== 1 ? 's' : ''}`}
              </span>
              {/* Inline overall progress bar */}
              {totalCount > 0 && (
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: 120, height: 3, background: isDark ? '#262626' : '#e5e7eb' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${overallPct}%`,
                      background: '#00b8b2',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Queue rows container */}
            <div
              style={{
                borderRadius: 10,
                border: `1px solid ${border}`,
                overflow: 'hidden',
                background: cardBg,
              }}
            >
              {sortedQueue.map((video, idx) =>
                renderQueueRow(video, idx === sortedQueue.length - 1)
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BulkProcessingQueue;
