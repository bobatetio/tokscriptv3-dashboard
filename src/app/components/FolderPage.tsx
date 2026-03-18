/**
 * FolderPage  (/folder/:id)
 * Shows all items saved to a folder — transcripts, profiles, and prompts
 * in one place, with filter tabs to slice by type.
 *
 * Column layout adapts per tab:
 *   Transcripts → thumbnail + name/duration + platform + added + remove
 *   Profiles    → avatar + name/handle + platforms + video count + added + remove
 *   Prompts     → icon + name + category badge + added + remove
 *   All         → smart mixed view with type badge
 */
import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Folder, FileText, Users, BookOpen,
  Pencil, Trash2, Check, X, ArrowLeft, Search,
  ChevronDown, Clock, SlidersHorizontal, CheckCheck,
  Calendar, LayoutGrid, List, Columns2,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext, FolderItemType, FolderItem } from '../context/FolderContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { formatDuration } from '../utils/formatDuration';

type Tab = 'all' | FolderItemType;

// ── Shared colour helpers passed down to all rows ─────────────────────────────
interface RowColors {
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
}

// ── Tiny platform SVG icons ────────────────────────────────────────────────
function PlatformIcon({ platform, size = 10 }: { platform: string; size?: number }) {
  if (platform === 'YouTube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
    </svg>
  );
  if (platform === 'TikTok') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.6 3.3A4.9 4.9 0 0 1 14.8 0h-3.6v16.4a2.9 2.9 0 0 1-2.9 2.5 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .5 0 .8.1V9.5a6.5 6.5 0 0 0-.8-.1 6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 6.5-6.5V8.2a8.4 8.4 0 0 0 4.9 1.6V6.2a4.9 4.9 0 0 1-3.1-2.9z"/>
    </svg>
  );
  if (platform === 'Instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
  return null;
}

// ── Platform badge (icon + name) ──────────────────────────────────────────────
function PlatformBadge({ platform, isDark }: { platform: string; isDark: boolean }) {
  const colors: Record<string, string> = {
    YouTube: '#ff0000', TikTok: isDark ? '#ffffff' : '#010101', Instagram: '#e1306c',
  };
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
        color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
        fontWeight: 500,
      }}
    >
      <span style={{ color: colors[platform] ?? '#888' }}><PlatformIcon platform={platform} /></span>
      {platform}
    </span>
  );
}

// ── Category badge for prompts ─────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; bgDark: string; textDark: string }> = {
  Hooks:     { bg: 'rgba(251,146,60,0.1)',  text: '#ea580c', bgDark: 'rgba(251,146,60,0.15)',  textDark: '#fb923c' },
  Repurpose: { bg: 'rgba(99,102,241,0.1)',  text: '#6366f1', bgDark: 'rgba(99,102,241,0.15)',  textDark: '#818cf8' },
  Analysis:  { bg: 'rgba(59,130,246,0.1)',  text: '#2563eb', bgDark: 'rgba(59,130,246,0.15)',  textDark: '#60a5fa' },
  Script:    { bg: 'rgba(168,85,247,0.1)',  text: '#7c3aed', bgDark: 'rgba(168,85,247,0.15)',  textDark: '#a78bfa' },
  Summary:   { bg: 'rgba(20,184,166,0.1)',  text: '#0d9488', bgDark: 'rgba(20,184,166,0.15)',  textDark: '#2dd4bf' },
  Engagement:{ bg: 'rgba(236,72,153,0.1)',  text: '#db2777', bgDark: 'rgba(236,72,153,0.15)',  textDark: '#f472b6' },
  SEO:       { bg: 'rgba(16,185,129,0.1)',  text: '#059669', bgDark: 'rgba(16,185,129,0.15)',  textDark: '#34d399' },
};

function CategoryBadge({ category, isDark }: { category: string; isDark: boolean }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] flex-shrink-0"
      style={{
        background: isDark ? (c?.bgDark ?? 'rgba(255,255,255,0.06)') : (c?.bg ?? '#f3f4f6'),
        color: isDark ? (c?.textDark ?? '#888') : (c?.text ?? '#6b7280'),
        fontWeight: 600,
      }}
    >
      {category}
    </span>
  );
}

// ── Remove button (shared) ────────────────────────────────────────────────────
function RemoveBtn({ onRemove, muted }: { onRemove: () => void; muted: string }) {
  return (
    <button
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100"
      style={{ color: muted }}
      onClick={e => { e.stopPropagation(); onRemove(); }}
      title="Remove from folder"
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Added date (shared) ────────────────────────────────────────────────────────
function AddedDate({ date, muted }: { date: string; muted: string }) {
  return (
    <span className="text-[11px] flex-shrink-0 hidden sm:block tabular-nums" style={{ color: muted }}>
      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
    </span>
  );
}

// ── Transcript Row ─────────────────────────────────────────────────────────────
function TranscriptRow({ item, colors, onRemove, showTypeBadge = false }: {
  item: FolderItem; colors: RowColors; onRemove: () => void; showTypeBadge?: boolean;
}) {
  const { isDark, border, text, muted } = colors;
  const navigate = useNavigate();

  return (
    <div
      className="group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      onClick={() => navigate('/dashboard')}
    >
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 rounded-md overflow-hidden"
        style={{ width: 64, height: 36, background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}
      >
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.name} className="w-full object-cover block" style={{ aspectRatio: '9/16' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-4 h-4" style={{ color: muted }} />
          </div>
        )}
      </div>

      {/* Name + duration */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
        {item.meta && (
          <p className="text-[11px] mt-0.5" style={{ color: muted }}>{formatDuration(item.meta)}</p>
        )}
      </div>

      {/* Type badge (All tab only) */}
      {showTypeBadge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 hidden sm:inline"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: muted, fontWeight: 500 }}>
          Video
        </span>
      )}

      {/* Platform badge */}
      {item.platform && <PlatformBadge platform={item.platform} isDark={isDark} />}

      <AddedDate date={item.addedAt} muted={muted} />
      <RemoveBtn onRemove={onRemove} muted={muted} />
    </div>
  );
}

// ── Profile Row ────────────────────────────────────────────────────────────────
function ProfileRow({ item, colors, onRemove, showTypeBadge = false }: {
  item: FolderItem; colors: RowColors; onRemove: () => void; showTypeBadge?: boolean;
}) {
  const { isDark, border, text, muted } = colors;
  const navigate = useNavigate();

  return (
    <div
      className="group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      onClick={() => { sessionStorage.setItem('creatorNavFrom', 'folder'); navigate(`/profile/${item.refId}`); }}
    >
      {/* Avatar */}
      {item.avatar ? (
        <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" style={{ border: `1px solid ${border}` }} />
      ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
          <Users className="w-4 h-4" style={{ color: muted }} />
        </div>
      )}

      {/* Name + handle */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
        {item.meta && <p className="text-[11px] mt-0.5 truncate" style={{ color: muted }}>{item.meta}</p>}
      </div>

      {/* Type badge (All tab only) */}
      {showTypeBadge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 hidden sm:inline"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: muted, fontWeight: 500 }}>
          Profile
        </span>
      )}

      {/* Platform icons */}
      {item.platforms && item.platforms.length > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0 hidden sm:flex">
          {item.platforms.map(p => <PlatformBadge key={p} platform={p} isDark={isDark} />)}
        </div>
      )}

      {/* Video count */}
      {item.videoCount != null && (
        <span
          className="text-[11px] flex-shrink-0 tabular-nums hidden md:block"
          style={{ color: muted, minWidth: 52, textAlign: 'right' }}
        >
          {item.videoCount.toLocaleString()} videos
        </span>
      )}

      <AddedDate date={item.addedAt} muted={muted} />
      <RemoveBtn onRemove={onRemove} muted={muted} />
    </div>
  );
}

// ── Prompt Row ─────────────────────────────────────────────────────────────────
function PromptRow({ item, colors, onRemove, showTypeBadge = false }: {
  item: FolderItem; colors: RowColors; onRemove: () => void; showTypeBadge?: boolean;
}) {
  const { isDark, border, text, muted } = colors;
  const navigate = useNavigate();

  return (
    <div
      className="group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      onClick={() => navigate(`/prompt-base/${item.refId}`)}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}
      >
        <BookOpen className="w-4 h-4" style={{ color: muted }} />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
        {item.meta && (
          <p className="text-[11px] mt-0.5" style={{ color: muted }}>Prompt template</p>
        )}
      </div>

      {/* Type badge (All tab only) */}
      {showTypeBadge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 hidden sm:inline"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: muted, fontWeight: 500 }}>
          Prompt
        </span>
      )}

      {/* Category badge — meta holds the category string */}
      {item.meta && <CategoryBadge category={item.meta} isDark={isDark} />}

      <AddedDate date={item.addedAt} muted={muted} />
      <RemoveBtn onRemove={onRemove} muted={muted} />
    </div>
  );
}

// ── Column header row (adapts per active tab) ─────────────────────────────────
function ColumnHeader({ activeTab, isDark, border, muted }: {
  activeTab: Tab; isDark: boolean; border: string; muted: string;
}) {
  const label = (s: string) => (
    <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 600 }}>{s}</span>
  );

  if (activeTab === 'transcript') return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="flex-shrink-0" style={{ width: 64 }} />
      <div className="flex-1">{label('Name / Duration')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 72 }}>{label('Platform')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 52 }}>{label('Added')}</div>
      <div className="flex-shrink-0" style={{ width: 28 }} />
    </div>
  );

  if (activeTab === 'profile') return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="flex-shrink-0" style={{ width: 36 }} />
      <div className="flex-1">{label('Creator')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 100 }}>{label('Platforms')}</div>
      <div className="flex-shrink-0 hidden md:block" style={{ minWidth: 52, textAlign: 'right' }}>{label('Videos')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 52 }}>{label('Added')}</div>
      <div className="flex-shrink-0" style={{ width: 28 }} />
    </div>
  );

  if (activeTab === 'prompt') return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="flex-shrink-0" style={{ width: 36 }} />
      <div className="flex-1">{label('Prompt')}</div>
      <div className="flex-shrink-0" style={{ minWidth: 72 }}>{label('Category')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 52 }}>{label('Added')}</div>
      <div className="flex-shrink-0" style={{ width: 28 }} />
    </div>
  );

  // 'all' tab
  return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="flex-shrink-0" style={{ width: 52 }} />
      <div className="flex-1">{label('Name')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 52 }}>{label('Type')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 80 }}>{label('Detail')}</div>
      <div className="flex-shrink-0 hidden sm:block" style={{ minWidth: 52 }}>{label('Added')}</div>
      <div className="flex-shrink-0" style={{ width: 28 }} />
    </div>
  );
}

// ── Folder Stat Cards ─────────────────────────────────────────────────────────
function FolderStatCards({ total, transcripts, profiles, prompts, isDark, border, text, muted }: {
  total: number; transcripts: number; profiles: number; prompts: number;
  isDark: boolean; border: string; text: string; muted: string;
}) {
  const stats = [
    { icon: <Folder   className="w-3.5 h-3.5" />, label: 'Total Saved',  value: total,       sub: 'items in folder' },
    { icon: <FileText className="w-3.5 h-3.5" />, label: 'Videos',       value: transcripts, sub: 'saved transcripts' },
    { icon: <Users    className="w-3.5 h-3.5" />, label: 'Profiles',     value: profiles,    sub: 'saved creators' },
    { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Prompts',      value: prompts,     sub: 'saved prompts' },
  ];
  return (
    <div className="grid gap-3 px-6 pt-4 pb-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map(s => (
        <div
          key={s.label}
          className="flex flex-col px-4 pt-3 pb-3 rounded-xl"
          style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
            {s.icon}
            <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{s.label}</span>
          </div>
          <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {s.value}
          </p>
          <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { folders, removeItem, renameFolder, deleteFolder } = useContext(FolderContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('added-desc');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeDurations, setActiveDurations] = useState<string[]>([]);
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [activeDateRanges, setActiveDateRanges] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hybrid'>('list');

  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';
  const cardBg = isDark ? '#141414' : '#ffffff';

  const colors: RowColors = { isDark, border, text, muted };

  const folder = folders.find(f => f.id === Number(id));

  if (!folder) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
        <AppSidebar activePage="dashboard" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} activeFolderId={Number(id)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
             style={isDark ? undefined : { background: '#ffffff' }}>
          <AppHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Folder className="w-10 h-10 mx-auto mb-3" style={{ color: muted }} />
              <p className="text-sm" style={{ color: muted }}>Folder not found</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 text-xs px-4 py-2 rounded-lg"
                style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#fff' }}
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Filter items ─────────────────────────────────────────────────────────────
  const allItems       = folder.items;
  const transcripts    = allItems.filter(i => i.type === 'transcript');
  const profiles       = allItems.filter(i => i.type === 'profile');
  const prompts        = allItems.filter(i => i.type === 'prompt');

  const visibleItems = (activeTab === 'all'       ? allItems
                     : activeTab === 'transcript' ? transcripts
                     : activeTab === 'profile'    ? profiles
                     : prompts
  ).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ── Tabs config ──────────────────────────────────────────────────────────────
  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'all',        label: 'All',         count: allItems.length },
    { key: 'transcript', label: 'Videos',       count: transcripts.length },
    { key: 'profile',    label: 'Profiles',     count: profiles.length },
    { key: 'prompt',     label: 'Prompts',      count: prompts.length },
  ];

  // ── Rename handlers ──────────────────────────────────────────────────────────
  const startRename = () => { setRenameDraft(folder.name); setRenaming(true); };
  const commitRename = () => {
    if (renameDraft.trim()) renameFolder(folder.id, renameDraft.trim());
    setRenaming(false);
  };

  // ── Delete handler ────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (window.confirm(`Delete folder "${folder.name}"? This won't delete the items themselves.`)) {
      deleteFolder(folder.id);
      navigate('/dashboard');
    }
  };

  // ── Render a row for any item type ───────────────────────────────────────────
  const renderRow = (item: FolderItem, isAllTab: boolean) => {
    const key = item.uid;
    const remove = () => removeItem(folder.id, item.type, item.refId);
    if (item.type === 'transcript') return <TranscriptRow key={key} item={item} colors={colors} onRemove={remove} showTypeBadge={isAllTab} />;
    if (item.type === 'profile')    return <ProfileRow    key={key} item={item} colors={colors} onRemove={remove} showTypeBadge={isAllTab} />;
    return                                 <PromptRow     key={key} item={item} colors={colors} onRemove={remove} showTypeBadge={isAllTab} />;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
      <AppSidebar activePage="dashboard" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} activeFolderId={folder.id} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
           style={isDark ? undefined : { background: '#ffffff' }}>
        <AppHeader />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 pt-5 pb-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', color: muted }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  {renaming ? (
                    <div className="flex items-center gap-2">
                      <input autoFocus value={renameDraft}
                        onChange={e => setRenameDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenaming(false); }}
                        className="bg-transparent outline-none border-b"
                        style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', borderColor: isDark ? '#444' : '#d1d5db', minWidth: 160 }}
                      />
                      <button onClick={commitRename}><Check className="w-3.5 h-3.5" style={{ color: muted }} /></button>
                      <button onClick={() => setRenaming(false)}><X className="w-3.5 h-3.5" style={{ color: muted }} /></button>
                    </div>
                  ) : (
                    <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>{folder.name}</h1>
                  )}
                </div>
                <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                  {allItems.length} item{allItems.length !== 1 ? 's' : ''} saved in this folder
                </p>
              </div>
              {/* Folder actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-1">
                <button onClick={startRename}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', color: muted }}
                  title="Rename folder"
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleDelete}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', color: muted }}
                  title="Delete folder"
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#ef4444' : '#dc2626'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Unified Filter Bar ───────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}`, color: muted, width: 220 }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search items…"
                className="flex-1 bg-transparent outline-none text-xs min-w-0"
                style={{ color: text }}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ color: muted }}><X className="w-3 h-3" /></button>}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Duration chip */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeDurations.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeDurations.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeDurations.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
              >
                <Clock className="w-3 h-3" />
                {activeDurations.length > 0 ? `Duration (${activeDurations.length})` : 'Duration'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'duration' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'duration' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['<1 min', '1–3 min', '3+ min'].map(opt => {
                      const sel = activeDurations.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveDurations(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Words chip */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeWords.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeWords.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'words' ? null : 'words')}
              >
                <FileText className="w-3 h-3" />
                {activeWords.length > 0 ? `Words (${activeWords.length})` : 'Words'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'words' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'words' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 130 }}>
                    {['<1K', '1K–5K', '5K+'].map(opt => {
                      const sel = activeWords.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Date chip */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeDateRanges.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeDateRanges.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              >
                <Calendar className="w-3 h-3" />
                {activeDateRanges.length > 0 ? `Date (${activeDateRanges.length})` : 'Date'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'date' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['Today', 'This week', 'This month'].map(opt => {
                      const sel = activeDateRanges.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
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
                  background: sortBy !== 'added-desc' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: sortBy !== 'added-desc' ? '#00b8b2' : muted,
                  border: `1px solid ${sortBy !== 'added-desc' ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {sortBy === 'added-desc' ? 'Recently added' : sortBy === 'added-asc' ? 'Oldest first' : sortBy === 'name-asc' ? 'Name A–Z' : 'Name Z–A'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 160 }}>
                    {[
                      { value: 'added-desc', label: 'Recently added' },
                      { value: 'added-asc',  label: 'Oldest first' },
                      { value: 'name-asc',   label: 'Name A–Z' },
                      { value: 'name-desc',  label: 'Name Z–A' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                        style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'; }}
                        onMouseLeave={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}{sortBy === opt.value && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {(searchQuery || sortBy !== 'added-desc' || activeDurations.length > 0 || activeWords.length > 0 || activeDateRanges.length > 0) && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button className="flex items-center gap-1 text-xs hover:opacity-70 flex-shrink-0" style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setSearchQuery(''); setSortBy('added-desc'); setActiveDurations([]); setActiveWords([]); setActiveDateRanges([]); }}>
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}

            <div className="flex-1" />

            {/* Type tabs — right-aligned */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-colors"
                    style={{
                      background: active ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : 'transparent',
                      color: active ? text : muted,
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {tab.label}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
                      style={{
                        background: active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                        color: active ? text : muted,
                      }}
                    >{tab.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* View Toggle */}
            <div className="flex items-center p-0.5 rounded-lg flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}>
              {([
                { mode: 'grid'   as const, icon: <LayoutGrid className="w-3.5 h-3.5" />, title: 'Grid view'   },
                { mode: 'list'   as const, icon: <List       className="w-3.5 h-3.5" />, title: 'List view'   },
                { mode: 'hybrid' as const, icon: <Columns2   className="w-3.5 h-3.5" />, title: 'Hybrid view' },
              ] as const).map(({ mode, icon, title }) => (
                <button key={mode} title={title} onClick={() => setViewMode(mode)}
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

          {/* ── Stat Cards ────────────────────────────────────────────────── */}
          {allItems.length > 0 && (
            <div className="max-w-[1280px] mx-auto w-full flex-shrink-0">
              <FolderStatCards
                total={allItems.length}
                transcripts={transcripts.length}
                profiles={profiles.length}
                prompts={prompts.length}
                isDark={isDark}
                border={border}
                text={text}
                muted={muted}
              />
            </div>
          )}

          {/* ── Content ───────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto w-full px-6 py-4">
            {visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: isDark ? '#141414' : '#f3f4f6', border: `1px solid ${border}` }}
                >
                  <Folder className="w-5 h-5" style={{ color: muted }} />
                </div>
                <p className="text-sm" style={{ color: text, fontWeight: 600 }}>
                  {activeTab === 'all' ? 'This folder is empty' : `No ${activeTab === 'transcript' ? 'videos' : activeTab + 's'} saved yet`}
                </p>
                <p className="text-xs mt-1" style={{ color: muted }}>
                  {activeTab === 'all'
                    ? 'Save transcripts, profiles, and prompts here'
                    : `Use the folder icon on any ${activeTab} to save it here`}
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>

                  {/* ── Column widths — shared by <thead> and <tbody> ── */}
                  {activeTab === 'transcript' && (
                    <colgroup>
                      <col style={{ width: 96 }} />{/* thumbnail */}
                      <col />{/* name — flexible */}
                      <col style={{ width: 120 }} />{/* platform */}
                      <col style={{ width: 72 }} />{/* added */}
                      <col style={{ width: 44 }} />{/* remove */}
                    </colgroup>
                  )}
                  {activeTab === 'profile' && (
                    <colgroup>
                      <col style={{ width: 60 }} />{/* avatar */}
                      <col />{/* name */}
                      <col style={{ width: 160 }} />{/* platforms */}
                      <col style={{ width: 88 }} />{/* videos */}
                      <col style={{ width: 72 }} />{/* added */}
                      <col style={{ width: 44 }} />{/* remove */}
                    </colgroup>
                  )}
                  {activeTab === 'prompt' && (
                    <colgroup>
                      <col style={{ width: 60 }} />{/* icon */}
                      <col />{/* name */}
                      <col style={{ width: 112 }} />{/* category */}
                      <col style={{ width: 72 }} />{/* added */}
                      <col style={{ width: 44 }} />{/* remove */}
                    </colgroup>
                  )}
                  {activeTab === 'all' && (
                    <colgroup>
                      <col style={{ width: 80 }} />{/* media */}
                      <col />{/* name */}
                      <col style={{ width: 148 }} />{/* platforms */}
                      <col style={{ width: 116 }} />{/* detail */}
                      <col style={{ width: 72 }} />{/* added */}
                      <col style={{ width: 44 }} />{/* remove */}
                    </colgroup>
                  )}

                  {/* ── Header ── */}
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.018)' }}>
                      {activeTab === 'transcript' && (<>
                        <th style={{ padding: '10px 8px 10px 16px' }} />
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Name</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Platform</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Added</span>
                        </th>
                        <th style={{ padding: '10px 16px 10px 0' }} />
                      </>)}

                      {activeTab === 'profile' && (<>
                        <th style={{ padding: '10px 8px 10px 16px' }} />
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Creator</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Platforms</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Videos</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Added</span>
                        </th>
                        <th style={{ padding: '10px 16px 10px 0' }} />
                      </>)}

                      {activeTab === 'prompt' && (<>
                        <th style={{ padding: '10px 8px 10px 16px' }} />
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Prompt</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Category</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Added</span>
                        </th>
                        <th style={{ padding: '10px 16px 10px 0' }} />
                      </>)}

                      {activeTab === 'all' && (<>
                        <th style={{ padding: '10px 8px 10px 16px' }} />
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Name</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Platforms</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 24px 10px 32px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Detail</span>
                        </th>
                        <th className="text-left" style={{ padding: '10px 12px' }}>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 700 }}>Added</span>
                        </th>
                        <th style={{ padding: '10px 16px 10px 0' }} />
                      </>)}
                    </tr>
                  </thead>

                  {/* ── Body ── */}
                  <tbody>
                    {visibleItems.map((item, i) => {
                      const rowBorder = i < visibleItems.length - 1
                        ? `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb'}`
                        : 'none';
                      const hoverBg   = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)';
                      const addedStr  = new Date(item.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                      /* ── Transcript row ── */
                      if (item.type === 'transcript') return (
                        <tr
                          key={item.uid}
                          className="group cursor-pointer"
                          style={{ borderBottom: rowBorder }}
                          onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = hoverBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                          onClick={() => navigate('/dashboard')}
                        >
                          {/* Thumbnail */}
                          <td style={{ padding: '10px 8px 10px 16px', verticalAlign: 'middle' }}>
                            <div className="rounded-md overflow-hidden flex-shrink-0"
                              style={{ width: 36, height: 64, background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
                              {item.thumbnail
                                ? <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover block" />
                                : <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4" style={{ color: muted }} /></div>
                              }
                            </div>
                          </td>
                          {/* Name — duration moves to Detail col in All tab */}
                          <td style={{ padding: '10px 12px 10px 6px', verticalAlign: 'middle', overflow: 'hidden' }}>
                            <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
                            {activeTab !== 'all' && item.meta && <p className="text-[11px] mt-0.5" style={{ color: muted }}>{formatDuration(item.meta)}</p>}
                            {activeTab === 'all' && <p className="text-[11px] mt-0.5 truncate" style={{ color: muted }}>{item.handle ?? '—'}</p>}
                          </td>
                          {/* Platforms col */}
                          <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                            {item.platform && <PlatformBadge platform={item.platform} isDark={isDark} />}
                          </td>
                          {/* Detail col — only rendered in All tab (duration text) */}
                          {activeTab === 'all' && (
                            <td style={{ padding: '10px 12px 10px 32px', verticalAlign: 'middle' }}>
                              {item.meta && <span className="text-[12px] tabular-nums" style={{ color: muted }}>{formatDuration(item.meta)}</span>}
                            </td>
                          )}
                          {/* Added */}
                          <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                            <span className="text-[11px] tabular-nums" style={{ color: muted }}>{addedStr}</span>
                          </td>
                          {/* Remove */}
                          <td style={{ padding: '10px 16px 10px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                              style={{ color: muted }}
                              onClick={e => { e.stopPropagation(); removeItem(folder.id, item.type, item.refId); }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                              title="Remove from folder"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );

                      /* ── Profile row ── */
                      if (item.type === 'profile') return (
                        <tr
                          key={item.uid}
                          className="group cursor-pointer"
                          style={{ borderBottom: rowBorder }}
                          onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = hoverBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                          onClick={() => { sessionStorage.setItem('creatorNavFrom', 'folder'); navigate(`/profile/${item.refId}`); }}
                        >
                          {/* Avatar */}
                          <td style={{ padding: '10px 8px 10px 16px', verticalAlign: 'middle' }}>
                            {item.avatar
                              ? <img src={item.avatar} alt={item.name} className="rounded-full object-cover flex-shrink-0"
                                  style={{ width: 36, height: 36, border: `1px solid ${border}` }} />
                              : <div className="rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ width: 36, height: 36, background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
                                  <Users className="w-4 h-4" style={{ color: muted }} />
                                </div>
                            }
                          </td>
                          {/* Name + handle */}
                          <td style={{ padding: '10px 12px 10px 6px', verticalAlign: 'middle', overflow: 'hidden' }}>
                            <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
                            {item.meta
                              ? <p className="text-[11px] mt-0.5 truncate" style={{ color: muted }}>{item.meta}</p>
                              : activeTab === 'all' && <p className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.28)', fontWeight: 600, letterSpacing: '0.06em' }}>Creator</p>
                            }
                          </td>
                          {/* Platforms */}
                          <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                            <div className="flex items-center gap-1 flex-nowrap">
                              {item.platforms?.map(p => <PlatformBadge key={p} platform={p} isDark={isDark} />)}
                            </div>
                          </td>
                          {/* Video count — Detail col (left-inset in All tab) */}
                          <td style={{ padding: `10px 12px 10px ${activeTab === 'all' ? 32 : 12}px`, verticalAlign: 'middle' }}>
                            {item.videoCount != null && (
                              <span className="text-[12px] tabular-nums" style={{ color: muted }}>
                                {item.videoCount.toLocaleString()} videos
                              </span>
                            )}
                          </td>
                          {/* Added */}
                          <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                            <span className="text-[11px] tabular-nums" style={{ color: muted }}>{addedStr}</span>
                          </td>
                          {/* Remove */}
                          <td style={{ padding: '10px 16px 10px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                              style={{ color: muted }}
                              onClick={e => { e.stopPropagation(); removeItem(folder.id, item.type, item.refId); }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                              title="Remove from folder"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );

                      /* ── Prompt row ── */
                      return (
                        <tr
                          key={item.uid}
                          className="group cursor-pointer"
                          style={{ borderBottom: rowBorder }}
                          onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = hoverBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                          onClick={() => navigate(`/prompt-base/${item.refId}`)}
                        >
                          {/* Icon */}
                          <td style={{ padding: '10px 8px 10px 16px', verticalAlign: 'middle' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
                              <BookOpen className="w-4 h-4" style={{ color: muted }} />
                            </div>
                          </td>
                          {/* Name */}
                          <td style={{ padding: '10px 12px 10px 6px', verticalAlign: 'middle', overflow: 'hidden' }}>
                            <p className="text-[13px] truncate" style={{ color: text, fontWeight: 500 }}>{item.name}</p>
                            {activeTab !== 'all'
                              ? <p className="text-[11px] mt-0.5" style={{ color: muted }}>Prompt template</p>
                              : <p className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.28)', fontWeight: 600, letterSpacing: '0.06em' }}>Prompt</p>
                            }
                          </td>
                          {/* Platforms col — prompts have none; show dash in All tab */}
                          {activeTab === 'all' && (
                            <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                              <span style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)', fontSize: 14 }}>—</span>
                            </td>
                          )}
                          {/* Category — Detail col (left-inset in All tab) */}
                          <td style={{ padding: `10px 12px 10px ${activeTab === 'all' ? 32 : 12}px`, verticalAlign: 'middle' }}>
                            {item.meta && <CategoryBadge category={item.meta} isDark={isDark} />}
                          </td>
                          {/* Added */}
                          <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                            <span className="text-[11px] tabular-nums" style={{ color: muted }}>{addedStr}</span>
                          </td>
                          {/* Remove */}
                          <td style={{ padding: '10px 16px 10px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                              style={{ color: muted }}
                              onClick={e => { e.stopPropagation(); removeItem(folder.id, item.type, item.refId); }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                              title="Remove from folder"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}