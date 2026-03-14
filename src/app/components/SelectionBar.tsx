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
  const divider = <div style={{ width: 1, height: 20, background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)' }} />;

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, marginBottom: 12, animation: 'slideUp 0.2s ease-out' }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .sel-bar-btn {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .sel-bar-dark .sel-bar-btn:hover:not([disabled]) {
          background: rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.18) !important;
          color: #333 !important;
        }
        .sel-bar-light .sel-bar-btn:hover:not([disabled]) {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.22) !important;
          color: #fff !important;
        }
        .sel-bar-close {
          transition: background 0.2s ease, color 0.2s ease;
        }
        .sel-bar-dark .sel-bar-close:hover {
          background: rgba(0,0,0,0.06) !important;
          color: #333 !important;
        }
        .sel-bar-light .sel-bar-close:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
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
      <div className={isDark ? 'sel-bar-dark' : 'sel-bar-light'} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        padding: '15px 20px',
        borderRadius: 12,
        background: isDark ? '#ffffff' : '#1a1a1a',
      }}>
        {hasSelection ? (
          <span style={{ color: accentColor, fontWeight: 500, fontSize: 11 }}>{selectedCount} selected</span>
        ) : (
          <span style={{ color: isDark ? '#666' : '#aaa', fontWeight: 400, fontSize: 11 }}>0 selected — click items to select</span>
        )}
        {divider}
        <button
          className="sel-bar-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all selected videos"
          onClick={() => { if (hasSelection) onDownloadVideos(); }}
        >
          <Download size={14} /> Videos
        </button>
        <button
          className="sel-bar-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all selected cover images"
          onClick={() => { if (hasSelection) onDownloadCovers(); }}
        >
          <ImageDown size={14} /> Covers
        </button>
        <button
          className="sel-bar-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all video transcripts"
          onClick={() => { if (hasSelection) onDownloadTranscripts(); }}
        >
          <FileText size={14} /> Transcripts
        </button>
        <button
          className="sel-bar-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all video data"
          onClick={() => { if (hasSelection) onDownloadData(); }}
        >
          <Database size={14} /> Data
        </button>
        <button
          className="sel-bar-btn sel-bar-tip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={btnStyle}
          data-tip="Download all content"
          onClick={() => { if (hasSelection) onDownloadAll(); }}
        >
          <Archive size={14} /> Download All
        </button>
        {divider}
        <button
          className="sel-bar-close sel-bar-tip flex items-center justify-center p-1.5 rounded-lg"
          style={{ background: 'transparent', color: isDark ? '#666' : '#aaa', border: 'none', cursor: 'pointer' }}
          data-tip="Deselect all"
          onClick={onDeselect}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
