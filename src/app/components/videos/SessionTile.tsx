import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { VideoSession } from './types';
import { Video, Calendar } from 'lucide-react';

interface SessionTileProps {
  session: VideoSession;
  onClick: () => void;
}

export function SessionTile({ session, onClick }: SessionTileProps) {
  const { isDark } = useContext(ThemeContext);
  const [hovered, setHovered] = useState(false);

  const border = isDark ? '#262626' : '#e5e7eb';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#888888' : '#6b7280';
  const cardBg = isDark ? '#141414' : '#ffffff';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  // Get up to 3 thumbnails for the fanned preview
  const thumbs = session.videos.slice(0, 3).map(v => v.thumbnail);
  const firstThumb = thumbs[0] || '';

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all"
      style={{
        border: `1px solid ${hovered ? (isDark ? '#333' : '#d1d5db') : border}`,
        background: hovered ? hoverBg : cardBg,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient thumbnail area with fanned cards */}
      <div className="relative overflow-hidden" style={{ height: 120 }}>
        {/* Blurred background wash */}
        {firstThumb && (
          <div className="absolute inset-0">
            <ImageWithFallback
              src={firstThumb}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(20px) saturate(1.2)', transform: 'scale(1.3)', opacity: 0.4 }}
            />
            <div className="absolute inset-0" style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }} />
          </div>
        )}

        {/* Fanned portrait thumbnails */}
        <div className="absolute inset-0 flex items-center justify-center">
          {thumbs.map((thumb, i) => {
            const offsets = [0, -18, 18]; // center, left-tilt, right-tilt
            const rotations = [0, -8, 8];
            const zIndexes = [3, 2, 1]; // center on top
            return (
              <div
                key={i}
                className="absolute rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: 48,
                  height: 72,
                  transform: `translateX(${offsets[i]}px) rotate(${rotations[i]}deg) ${hovered ? 'translateY(-2px)' : ''}`,
                  zIndex: zIndexes[i],
                  transition: 'transform 0.2s ease',
                  border: `2px solid ${isDark ? '#1a1a1a' : '#ffffff'}`,
                }}
              >
                <ImageWithFallback src={thumb} alt="" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Info below */}
      <div className="px-3.5 py-3 flex flex-col gap-1">
        <p className="text-xs font-semibold truncate" style={{ color: text }}>{session.name}</p>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px]" style={{ color: muted }}>
            <Video className="w-3 h-3" />
            {session.videos.length} videos
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: muted }}>
            <Calendar className="w-3 h-3" />
            {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full self-start"
          style={{
            background: session.status === 'complete' ? 'rgba(0,184,178,0.1)' : 'rgba(245,158,11,0.1)',
            color: session.status === 'complete' ? '#00b8b2' : '#f59e0b',
          }}
        >
          {session.status === 'complete' ? 'Complete' : session.status === 'partial' ? 'Partial' : 'Downloading'}
        </span>
      </div>
    </div>
  );
}
