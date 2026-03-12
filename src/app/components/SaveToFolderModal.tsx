/**
 * SaveToFolderModal
 * Lightweight floating panel anchored to a trigger element.
 * Shows all folders with toggle checkmarks, plus inline "New folder" creation.
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Check, FolderPlus, Plus, Folder, Zap } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext, FolderItemType, FolderItem } from '../context/FolderContext';
import { UserContext, FREE_LIMITS } from '../context/UserContext';

interface SaveToFolderModalProps {
  type: FolderItemType;
  refId: string | number;
  name: string;
  meta?: string;
  avatar?: string;
  triggerRect: DOMRect;
  onClose: () => void;
  // ── Rich metadata forwarded straight into FolderItem ──────────────────────
  thumbnail?: string;
  platform?: string;
  platforms?: string[];
  videoCount?: number;
}

export function SaveToFolderModal({
  type, refId, name, meta, avatar, triggerRect, onClose,
  thumbnail, platform, platforms, videoCount,
}: SaveToFolderModalProps) {
  const { isDark } = useContext(ThemeContext);
  const { folders, toggleItem, createFolder, isInFolder } = useContext(FolderContext);
  const { plan, openUpgrade } = useContext(UserContext);

  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Colour tokens ────────────────────────────────────────────────────────────
  const panelBg = isDark ? '#141414' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  // ── Position panel ───────────────────────────────────────────────────────────
  const PANEL_W = 224;
  const PANEL_H_EST = 280;
  const GAP = 6;

  const viewportH = window.innerHeight;
  const viewportW = window.innerWidth;

  let top = triggerRect.bottom + GAP;
  let left = triggerRect.right - PANEL_W;

  // Flip above if not enough space below
  if (top + PANEL_H_EST > viewportH - 16) top = triggerRect.top - PANEL_H_EST - GAP;
  // Keep inside viewport horizontally
  if (left < 8) left = 8;
  if (left + PANEL_W > viewportW - 8) left = viewportW - PANEL_W - 8;

  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay to avoid the triggering click from immediately closing
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 100);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle); };
  }, [onClose]);

  // ── Focus new-folder input when shown ────────────────────────────────────────
  useEffect(() => {
    if (newFolderMode) inputRef.current?.focus();
  }, [newFolderMode]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleToggle = (folderId: number) => {
    toggleItem(folderId, { type, refId, name, meta, avatar, thumbnail, platform, platforms, videoCount });
  };

  const handleCreateFolder = () => {
    // Gate: free users can only have FREE_LIMITS.folders folders total
    if (plan === 'free' && folders.length >= FREE_LIMITS.folders) {
      openUpgrade();
      onClose();
      return;
    }
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    const id = createFolder(trimmed);
    toggleItem(id, { type, refId, name, meta, avatar, thumbnail, platform, platforms, videoCount });
    setNewFolderName('');
    setNewFolderMode(false);
  };

  const savedCount = folders.filter(f => isInFolder(f.id, type, refId)).length;

  // ── Render via portal ─────────────────────────────────────────────────────────
  return ReactDOM.createPortal(
    <>
      {/* Invisible overlay to catch outside clicks */}
      <div className="fixed inset-0 z-[998]" onClick={onClose} />

      <div
        ref={panelRef}
        className="fixed z-[999] rounded-xl overflow-hidden flex flex-col"
        style={{
          top, left,
          width: PANEL_W,
          background: panelBg,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="px-3 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
            <span className="text-[12px]" style={{ color: text, fontWeight: 600 }}>
              Save to folder
            </span>
          </div>
          {savedCount > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: muted }}
            >
              {savedCount} folder{savedCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="h-px flex-shrink-0" style={{ background: border }} />

        {/* Item preview */}
        <div
          className="px-3 py-2 flex items-center gap-2 flex-shrink-0"
          style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb'}` }}
        >
          {avatar ? (
            <img src={avatar} alt={name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[9px]"
              style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', color: muted, fontWeight: 600 }}
            >
              {type === 'prompt' ? 'P' : type === 'transcript' ? 'T' : '#'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] truncate" style={{ color: text, fontWeight: 500 }}>{name}</p>
            {meta && <p className="text-[10px] truncate" style={{ color: muted }}>{meta}</p>}
          </div>
        </div>

        {/* Folder list */}
        <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
          {folders.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[11px]" style={{ color: muted }}>No folders yet</p>
            </div>
          ) : (
            folders.map(folder => {
              const checked = isInFolder(folder.id, type, refId);
              const count = folder.items.length;
              return (
                <button
                  key={folder.id}
                  onClick={() => handleToggle(folder.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
                  style={{ background: 'transparent', color: text }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
                  <span className="flex-1 truncate text-[12px]">{folder.name}</span>
                  <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db' }}>
                    {count}
                  </span>
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: checked
                        ? (isDark ? '#ffffff' : '#111111')
                        : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                      border: checked ? 'none' : `1px solid ${isDark ? '#333' : '#d1d5db'}`,
                    }}
                  >
                    {checked && <Check className="w-2.5 h-2.5" style={{ color: isDark ? '#000' : '#fff' }} strokeWidth={3} />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="h-px flex-shrink-0" style={{ background: border }} />

        {/* New folder */}
        <div className="p-2 flex-shrink-0">
          {newFolderMode ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') { setNewFolderMode(false); setNewFolderName(''); }
                }}
                placeholder="Folder name…"
                className="flex-1 text-[12px] px-2.5 py-1.5 rounded-lg outline-none bg-transparent"
                style={{
                  color: text,
                  border: `1px solid ${isDark ? '#333' : '#d1d5db'}`,
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                  caretColor: text,
                }}
              />
              <button
                onClick={handleCreateFolder}
                className="px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
                style={{
                  background: isDark ? '#ffffff' : '#111111',
                  color: isDark ? '#000000' : '#ffffff',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Add
              </button>
            </div>
          ) : plan === 'free' && folders.length >= FREE_LIMITS.folders ? (
            /* Free user at folder limit — show upgrade nudge */
            <button
              onClick={() => { openUpgrade(); onClose(); }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-colors"
              style={{ color: '#00b8b2', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
              Upgrade for more folders
            </button>
          ) : (
            <button
              onClick={() => setNewFolderMode(true)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-colors"
              style={{ color: muted, background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              New folder
            </button>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}