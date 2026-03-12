import React, { useContext, useEffect, useRef, useState } from 'react';
import { FileText, Zap, Share2, CheckCircle, Info, Trash2, Check } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export interface Notification {
  id: string;
  type: 'transcript' | 'system' | 'share' | 'tip' | 'success';
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'transcript',
    title: 'Transcript ready',
    body: 'Your recording "Product Sync – March 3" has finished processing.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'share',
    title: 'Shared with you',
    body: 'Alex shared "Q4 Strategy Call" transcript with you.',
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Export complete',
    body: 'Your PDF export of "Design Review" is ready to download.',
    timestamp: new Date(Date.now() - 58 * 60 * 1000),
    read: false,
  },
  {
    id: '4',
    type: 'tip',
    title: 'Try Prompt Base',
    body: 'Discover community prompts to get more from your transcripts.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'System update',
    body: 'Tokscript has been updated to v2.4.0 with improved speaker detection.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    type: 'transcript',
    title: 'Transcript ready',
    body: '"Customer Interview – Feb 28" is ready to review.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotifIcon({ type, isDark }: { type: Notification['type']; isDark: boolean }) {
  const base = 'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0';

  const styles: Record<Notification['type'], { bg: string; color: string; Icon: React.ElementType }> = {
    transcript: { bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#111111', Icon: FileText },
    share:      { bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#111111', Icon: Share2 },
    success:    { bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#111111', Icon: CheckCircle },
    tip:        { bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#111111', Icon: Zap },
    system:     { bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#111111', Icon: Info },
  };

  const { bg, color, Icon } = styles[type];
  return (
    <div className={base} style={{ background: bg, color }}>
      <Icon className="w-3.5 h-3.5" />
    </div>
  );
}

interface Props {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export function NotificationsDropdown({ anchorRef, onClose }: Props) {
  const { isDark } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const bg       = isDark ? '#141414' : '#ffffff';
  const border   = isDark ? '#262626' : '#e5e7eb';
  const text     = isDark ? '#ffffff' : '#111111';
  const muted    = isDark ? '#888888' : '#6b7280';
  const hoverBg  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const unreadBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const tabActiveBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed   = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div
      ref={panelRef}
      className="absolute z-50 flex flex-col"
      style={{
        top: 'calc(100% + 8px)',
        right: 0,
        width: 360,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        boxShadow: isDark
          ? '0 16px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        maxHeight: 520,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: text }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full text-xs px-1.5 py-0.5"
              style={{
                background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
                color: text,
                minWidth: 20,
                lineHeight: 1,
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
              style={{ color: muted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
              style={{ color: muted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-4 py-2">
        {(['all', 'unread'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="text-xs px-3 py-1 rounded-md transition-colors capitalize"
            style={{
              background: filter === tab ? tabActiveBg : 'transparent',
              color: filter === tab ? text : muted,
            }}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1" style={{ maxHeight: 380 }}>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            >
              <Check className="w-4 h-4" style={{ color: muted }} />
            </div>
            <span className="text-sm" style={{ color: muted }}>
              {filter === 'unread' ? 'No unread notifications' : 'All caught up'}
            </span>
          </div>
        ) : (
          displayed.map(n => (
            <div
              key={n.id}
              className="group flex items-start gap-3 px-4 py-3 transition-colors cursor-default relative"
              style={{
                background: !n.read ? unreadBg : 'transparent',
                borderBottom: `1px solid ${border}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = !n.read ? unreadBg : 'transparent'; }}
              onClick={() => markRead(n.id)}
            >
              <NotifIcon type={n.type} isDark={isDark} />

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs leading-snug" style={{ color: text }}>
                    {n.title}
                  </span>
                  <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: muted }}>
                    {timeAgo(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: muted }}>
                  {n.body}
                </p>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#00b8b2' }}
                />
              )}

              {/* Dismiss button */}
              <button
                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all flex-shrink-0 mt-0.5"
                style={{ color: muted }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = text; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                title="Dismiss"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
