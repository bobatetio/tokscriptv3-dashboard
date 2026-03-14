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
}

export function SelectionBar({
  selectedCount, isDark, accentColor,
  onDownloadVideos, onDownloadCovers, onDownloadTranscripts, onDownloadData, onDownloadAll,
  onDeselect,
}: SelectionBarProps) {
  const hasSelection = selectedCount > 0;
  const btnStyle: React.CSSProperties = {
    background: 'transparent',
    color: isDark ? '#666' : '#aaa',
    border: `1px solid ${isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}`,
    cursor: hasSelection ? 'pointer' : 'default',
    opacity: hasSelection ? 1 : 0.5,
    fontWeight: 500,
  };
  const divider = <div style={{ width: 1, height: 18, background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)' }} />;

  /* CSS vars for hover — scoped to .sb-v1 */
  const hoverFill = isDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';
  const borderHover = isDark ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)';
  const textBright = isDark ? '#333' : '#fff';
  const closeHover = isDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, marginBottom: 12, animation: 'slideUp 0.2s ease-out' }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
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
          z-index: 30;
        }
        .sel-bar-tip:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>
      <div
        className="sb-v1"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '11px 20px',
          borderRadius: 12,
          background: isDark ? '#ffffff' : '#1a1a1a',
          boxShadow: `0 4px 20px -6px ${accentColor}25`,
          '--sb-hover-fill': hoverFill,
          '--sb-border-hover': borderHover,
          '--sb-text-bright': textBright,
          '--sb-close-hover': closeHover,
        } as React.CSSProperties}
      >
        {hasSelection ? (
          <span style={{ color: accentColor, fontWeight: 400, fontSize: 11, opacity: 0.85 }}>{selectedCount} selected</span>
        ) : (
          <span style={{ color: isDark ? '#666' : '#aaa', fontWeight: 400, fontSize: 11 }}>0 selected — click items to select</span>
        )}
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
          className="sb-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all content"
          onClick={() => { if (hasSelection) onDownloadAll(); }}
        >
          <Archive size={13} /> Download All
        </button>
        {divider}
        <button
          className="sb-close sel-bar-tip flex items-center justify-center p-1.5 rounded-lg"
          style={{ background: 'transparent', color: isDark ? '#666' : '#aaa', border: 'none', cursor: 'pointer' }}
          data-tip="Deselect all"
          onClick={onDeselect}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
