import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { VideoSession } from './types';
import { simulateVideoDownload, simulateCoverDownload, simulateZipDownload } from './downloadUtils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ArrowLeft, Download, ImageDown, Video, Calendar, Link2 } from 'lucide-react';
import { formatDuration } from '../../utils/formatDuration';

interface SessionDetailViewProps {
  session: VideoSession;
  onBack: () => void;
}

export function SessionDetailView({ session, onBack }: SessionDetailViewProps) {
  const { isDark } = useContext(ThemeContext);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const border = isDark ? '#262626' : '#e5e7eb';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#888888' : '#6b7280';
  const cardBg = isDark ? '#141414' : '#ffffff';

  const totalWords = session.videos.reduce((sum, v) => sum + v.words, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1280px] mx-auto w-full px-6 py-5">

        {/* Back + session header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors"
            style={{ color: muted, border: `1px solid ${border}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold" style={{ color: text }}>{session.name}</h2>
            <p className="text-[11px]" style={{ color: muted }}>
              {new Date(session.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Video className="w-4 h-4" />, label: 'Videos', value: session.videos.length.toString() },
            { icon: <Link2 className="w-4 h-4" />, label: 'Source Links', value: session.sourceLinks.length.toString() },
            { icon: <Calendar className="w-4 h-4" />, label: 'Total Words', value: totalWords.toLocaleString() },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,184,178,0.1)', color: '#00b8b2' }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: text }}>{stat.value}</p>
                <p className="text-[10px]" style={{ color: muted }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white"
            style={{ background: '#00b8b2' }}
            onClick={() => simulateZipDownload(session.videos.map(v => v.title), session.name)}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            <Download className="w-3.5 h-3.5" />
            Download All Videos
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
            style={{ background: 'transparent', color: '#00b8b2', border: '1px solid rgba(0,184,178,0.3)' }}
            onClick={() => session.videos.forEach(v => simulateCoverDownload(v.title, v.thumbnail))}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,184,178,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <ImageDown className="w-3.5 h-3.5" />
            Download All Covers
          </button>
        </div>

        {/* Video grid — 4 col */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
          {session.videos.map(v => (
            <div
              key={v.id}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: `1px solid ${hoveredCard === v.id ? (isDark ? '#333' : '#d1d5db') : border}`,
                background: hoveredCard === v.id ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)') : cardBg,
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={() => setHoveredCard(v.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <ImageWithFallback src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                <span className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
                  {formatDuration(v.duration)}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                <p className="text-xs font-semibold" style={{ color: text, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {v.title}
                </p>
                <span className="text-[10px]" style={{ color: muted }}>{v.creator}</span>
                <div className="flex items-center gap-1 mt-auto pt-1">
                  <button
                    className="p-1 rounded-md"
                    style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
                    onClick={e => { e.stopPropagation(); simulateVideoDownload(v.title); }}
                    title="Download video"
                  >
                    <Download className="w-2.5 h-2.5" />
                  </button>
                  <button
                    className="p-1 rounded-md"
                    style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
                    onClick={e => { e.stopPropagation(); simulateCoverDownload(v.title, v.thumbnail); }}
                    title="Download cover"
                  >
                    <ImageDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
