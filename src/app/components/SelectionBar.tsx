import React from 'react';
import { Download, ImageDown, FileText, Database, Archive, X } from 'lucide-react';

interface SelectionBarProps {
  selectedCount: number;
  isDark: boolean;
  accentColor: string;
  onDownloadVideos: () => void;
  onDownloadCovers: () => void;
  onDownloadTranscripts: () => void;
  onDownloadData: () => void;
  onDownloadAll: () => void;
  onDeselect: () => void;
  onSelectPage?: () => void;        // unused — kept for backwards compat
  totalPageCount?: number;           // unused — kept for backwards compat
}

export function SelectionBar({
  selectedCount, isDark, accentColor,
  onDownloadVideos, onDownloadCovers, onDownloadTranscripts, onDownloadData, onDownloadAll,
  onDeselect, onSelectPage, totalPageCount,
}: SelectionBarProps) {
  const hasSelection = selectedCount > 0;

  const btnStyle: React.CSSProperties = {
    background: 'transparent',
    color: isDark ? '#999' : '#555',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    cursor: hasSelection ? 'pointer' : 'default',
    opacity: hasSelection ? 1 : 0.5,
    fontWeight: 500,
  };

  const divider = (
    <div style={{ width: 1, height: 18, background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)' }} />
  );

  const hoverFill    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const borderHover  = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)';
  const textBright   = isDark ? '#ffffff' : '#111111';
  const closeHover   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50, animation: 'sbSlideUp 0.22s ease-out' }}>
      <style>{`
        @keyframes sbSlideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .sb-btn {
          transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1), color 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sb-v1 .sb-btn:hover:not([disabled]) {
          background: var(--sb-hover-fill) !important;
          border-color: var(--sb-border-hover) !important;
          color: var(--sb-text-bright) !important;
        }
        .sb-close {
          transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1), color 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sb-v1 .sb-close:hover {
          background: var(--sb-close-hover) !important;
          color: var(--sb-text-bright) !important;
        }
        .sb-all-btn {
          transition: opacity 0.18s ease, filter 0.18s ease;
        }
        .sb-v1 .sb-all-btn:hover {
          opacity: 0.85 !important;
          filter: brightness(1.08);
        }
        .sel-bar-tip {
          position: relative;
        }
        .sel-bar-tip::after {
          content: attr(data-tip);
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: #111;
          color: #eee;
          font-size: 11px;
          font-weight: 400;
          white-space: nowrap;
          padding: 5px 10px;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 60;
        }
        .sel-bar-tip:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>
      <div
        className="sb-v1"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '11px 20px',
          whiteSpace: 'nowrap',
          borderRadius: 12,
          background: isDark ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.18)',
          '--sb-hover-fill': hoverFill,
          '--sb-border-hover': borderHover,
          '--sb-text-bright': textBright,
          '--sb-close-hover': closeHover,
        } as React.CSSProperties}
      >
        {/* Count badge */}
        <span style={{ color: accentColor, fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {selectedCount} selected
        </span>

        {divider}

        <button
          className="sb-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all selected videos"
          onClick={() => { if (hasSelection) onDownloadVideos(); }}
        >
          <Download size={13} /> Videos
        </button>
        <button
          className="sb-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all selected cover images"
          onClick={() => { if (hasSelection) onDownloadCovers(); }}
        >
          <ImageDown size={13} /> Covers
        </button>
        <button
          className="sb-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all video transcripts"
          onClick={() => { if (hasSelection) onDownloadTranscripts(); }}
        >
          <FileText size={13} /> Transcripts
        </button>
        <button
          className="sb-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all video data"
          onClick={() => { if (hasSelection) onDownloadData(); }}
        >
          <Database size={13} /> Data
        </button>
        <button
          className="sb-all-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: accentColor,
            color: '#fff',
            border: 'none',
            cursor: hasSelection ? 'pointer' : 'default',
            opacity: hasSelection ? 1 : 0.5,
            fontWeight: 600,
          }}
          data-tip="Download all content"
          onClick={() => { if (hasSelection) onDownloadAll(); }}
        >
          <Archive size={13} /> Download All
        </button>

        {divider}

        <button
          className="sb-close sel-bar-tip flex items-center justify-center p-1.5 rounded-lg"
          style={{ background: 'transparent', color: isDark ? '#777' : '#999', border: 'none', cursor: 'pointer' }}
          data-tip="Deselect all"
          onClick={onDeselect}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
