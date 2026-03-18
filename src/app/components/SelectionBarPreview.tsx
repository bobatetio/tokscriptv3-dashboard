import React, { useState } from 'react';
import { Download, X, ArrowLeft, Search, ChevronDown, Heart, FolderPlus, Play, LayoutGrid, List, Columns, Copy, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { formatCardDate } from '../utils/formatDate';

/* ─── Action definitions ─── */
const ACTIONS = [
  { icon: Download, label: 'Videos' },
  { icon: Download, label: 'Covers' },
  { icon: Download, label: 'Transcripts' },
  { icon: Download, label: 'Data' },
  { icon: Download, label: 'Download All' },
] as const;

/* ─── Global hover animation styles ─── */
const HOVER_CSS = `
  .sb-btn {
    transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sb-close {
    transition: background 0.2s ease, color 0.2s ease;
  }

  /* V1 — Ambient Accent Shadow: fill + brighten on hover */
  .sb-v1 .sb-btn:hover {
    background: var(--sb-hover-fill) !important;
    border-color: var(--sb-border-hover) !important;
    color: var(--sb-text-bright) !important;
  }

  /* V2 — Accent-Tinted Surface: accent tinted fill on hover */
  .sb-v2 .sb-btn:hover {
    background: var(--sb-accent-fill) !important;
    border-color: var(--sb-border-hover) !important;
    color: var(--sb-text-bright) !important;
  }

  /* V3 — Frosted Glass: glass fill + border brighten */
  .sb-v3 .sb-btn:hover {
    background: var(--sb-hover-fill) !important;
    border-color: var(--sb-border-hover) !important;
    color: var(--sb-text-bright) !important;
  }

  /* V4 — Layered Depth: lift + micro shadow */
  .sb-v4 .sb-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    border-color: var(--sb-border-hover) !important;
    color: var(--sb-text-bright) !important;
  }

  /* V5 — Bottom Edge Glow: bottom border + icon accent */
  .sb-v5 .sb-btn {
    position: relative;
    overflow: hidden;
  }
  .sb-v5 .sb-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--sb-accent);
    transform: scaleX(0);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sb-v5 .sb-btn:hover::after {
    transform: scaleX(1);
  }
  .sb-v5 .sb-btn:hover {
    color: var(--sb-text-bright) !important;
  }
  .sb-v5 .sb-btn:hover svg {
    color: var(--sb-accent) !important;
    transition: color 0.22s ease;
  }

  /* Close button hover (all variations) */
  .sb-close:hover {
    background: var(--sb-close-hover) !important;
    color: var(--sb-text-bright) !important;
  }
`;

/* ─── Mock video data for cards ─── */
const MOCK_CARDS = [
  { id: 1, platform: 'YouTube', duration: '14:32', date: 'Mar 8, 2026, 10:15 AM', title: 'How I Built a $10M SaaS in 12 Months', creator: '@tokcast', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80', snippet: 'I want to talk about the exact playbook we used to grow from...' },
  { id: 2, platform: 'TikTok', duration: '0:58', date: 'Mar 7, 2026, 2:30 PM', title: '5 Morning Habits That Changed My Life', creator: '@productivityhacks', thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80', snippet: "Good morning, everyone. I've been doing these five habits for 18..." },
  { id: 3, platform: 'Instagram', duration: '1:23', date: 'Mar 6, 2026, 4:45 PM', title: 'The Secret to Perfect Pasta Every Time', creator: '@chefmike', thumbnail: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80', snippet: "Okay, today I'm settling this once and for all. The number one..." },
  { id: 4, platform: 'YouTube', duration: '22:10', date: 'Mar 5, 2026, 9:00 AM', title: 'React Server Components Explained Simply', creator: '@webdevdaily', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', snippet: 'React Server Components fundamentally change how we...' },
  { id: 6, platform: 'TikTok', duration: '0:45', date: 'Mar 3, 2026, 1:15 PM', title: '30-Day Fitness Challenge Results', creator: '@fitnesswithsarah', thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80', snippet: 'Day 30. I cannot believe I actually made it. My starting weight was...' },
];

const PLATFORM_COLORS: Record<string, { bg: string; color: string }> = {
  YouTube: { bg: '#FF0000', color: '#fff' },
  TikTok: { bg: '#000000', color: '#fff' },
  Instagram: { bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff' },
};

/* ─── CSS variable injector per-variation ─── */
function cssVars(accent: string, isDark: boolean): React.CSSProperties {
  return {
    '--sb-accent': accent,
    '--sb-accent-fill': isDark ? `rgba(0,0,0,0.04)` : `rgba(255,255,255,0.06)`,
    '--sb-text-bright': isDark ? '#222' : '#fff',
    '--sb-hover-fill': isDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
    '--sb-border-hover': isDark ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
    '--sb-close-hover': isDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
  } as React.CSSProperties;
}

/* ─── Shared bar building blocks ─── */

function BarButtons({ isDark }: { isDark: boolean }) {
  const borderColor = isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)';
  const textColor = isDark ? '#666' : '#aaa';
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {ACTIONS.map(({ icon: Icon, label }) => (
        <button key={label}
          className="sb-btn flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs"
          style={{
            whiteSpace: 'nowrap',
            background: 'transparent',
            color: textColor,
            border: `1px solid ${borderColor}`,
            cursor: 'pointer',
            fontWeight: 500,
          }}>
          <Icon size={13} /> {label}
        </button>
      ))}
    </div>
  );
}

function BarDivider({ isDark }: { isDark: boolean }) {
  return <div style={{ width: 1, height: 18, background: isDark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)', flexShrink: 0 }} />;
}

function BarCount({ count, accent }: { count: number; accent: string }) {
  return (
    <span style={{
      color: accent,
      fontWeight: 400,
      fontSize: 11,
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
      opacity: 0.85,
    }}>
      {count} selected
    </span>
  );
}

function BarClose({ isDark }: { isDark: boolean }) {
  return (
    <button className="sb-close flex items-center justify-center p-1.5 rounded-lg"
      style={{ background: 'transparent', color: isDark ? '#888' : '#666', border: 'none', cursor: 'pointer' }}>
      <X size={13} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   V1 — Ambient Accent Shadow
   Clean solid dark bar. Accent-colored box-shadow below ties it to page color.
   Hover: button fill + border brighten. Smooth 0.22s ease.
   ═══════════════════════════════════════════════════════════════════════════════ */
function V1AmbientShadow({ isDark, accent }: { isDark: boolean; accent: string }) {
  const barBg = isDark ? '#ffffff' : '#1a1a1a';
  return (
    <div className="sb-v1" style={{
      ...cssVars(accent, isDark),
      borderRadius: 12,
      boxShadow: `0 4px 20px -6px ${accent}25`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 20px', background: barBg, borderRadius: 12,
      }}>
        <BarCount count={3} accent={accent} />
        <BarDivider isDark={isDark} />
        <BarButtons isDark={isDark} />
        <BarDivider isDark={isDark} />
        <BarClose isDark={isDark} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   V2 — Accent-Tinted Surface
   Uniform bar with whisper of accent color mixed in. Thin inner border.
   Hover: accent-tinted fill on buttons.
   ═══════════════════════════════════════════════════════════════════════════════ */
function V2TintedSurface({ isDark, accent }: { isDark: boolean; accent: string }) {
  // Uniform tint: mix accent at very low opacity into the background
  const barBg = isDark ? '#ffffff' : '#1a1a1a';
  const tintOverlay = isDark ? `${accent}06` : `${accent}0a`;
  return (
    <div className="sb-v2" style={{
      ...cssVars(accent, isDark),
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent tint layer */}
      <div style={{ position: 'absolute', inset: 0, background: tintOverlay, pointerEvents: 'none', borderRadius: 12 }} />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 20px', background: barBg, borderRadius: 12,
        border: `1px solid ${isDark ? `${accent}0f` : `${accent}14`}`,
        position: 'relative',
      }}>
        {/* Tint over the solid bg */}
        <div style={{ position: 'absolute', inset: 0, background: tintOverlay, pointerEvents: 'none', borderRadius: 12 }} />
        <BarCount count={3} accent={accent} />
        <BarDivider isDark={isDark} />
        <BarButtons isDark={isDark} />
        <BarDivider isDark={isDark} />
        <BarClose isDark={isDark} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   V3 — Frosted Dark Glass
   Semi-transparent with backdrop blur. Content slightly bleeds through.
   Hover: glass fill + border brighten.
   ═══════════════════════════════════════════════════════════════════════════════ */
function V3FrostedGlass({ isDark, accent }: { isDark: boolean; accent: string }) {
  const glassBg = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(26,26,26,0.88)';
  return (
    <div className="sb-v3" style={{
      ...cssVars(accent, isDark),
      borderRadius: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 20px', background: glassBg, borderRadius: 12,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(0,0,0,0.05)' : `${accent}14`}`,
      }}>
        <BarCount count={3} accent={accent} />
        <BarDivider isDark={isDark} />
        <BarButtons isDark={isDark} />
        <BarDivider isDark={isDark} />
        <BarClose isDark={isDark} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   V4 — Layered Depth Surface
   Solid dark with inset top highlight and bottom edge. Premium pressed surface.
   Hover: buttons lift 1px with micro drop shadow.
   ═══════════════════════════════════════════════════════════════════════════════ */
function V4LayeredDepth({ isDark, accent }: { isDark: boolean; accent: string }) {
  const barBg = isDark ? '#ffffff' : '#1a1a1a';
  return (
    <div className="sb-v4" style={{
      ...cssVars(accent, isDark),
      borderRadius: 12,
      boxShadow: isDark
        ? `inset 0 1px 0 rgba(0,0,0,0.03), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 4px ${accent}0f`
        : `inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 4px ${accent}0f`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 20px', background: barBg, borderRadius: 12,
      }}>
        <BarCount count={3} accent={accent} />
        <BarDivider isDark={isDark} />
        <BarButtons isDark={isDark} />
        <BarDivider isDark={isDark} />
        <BarClose isDark={isDark} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   V5 — Accent Bottom Edge Glow
   Clean solid dark with a thin 2px accent line along the bottom + matching glow.
   Hover: bottom border slides in on each button, icon turns accent.
   ═══════════════════════════════════════════════════════════════════════════════ */
function V5BottomGlow({ isDark, accent }: { isDark: boolean; accent: string }) {
  const barBg = isDark ? '#ffffff' : '#1a1a1a';
  return (
    <div className="sb-v5" style={{
      ...cssVars(accent, isDark),
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 20px', background: barBg, borderRadius: 12,
      }}>
        <BarCount count={3} accent={accent} />
        <BarDivider isDark={isDark} />
        <BarButtons isDark={isDark} />
        <BarDivider isDark={isDark} />
        <BarClose isDark={isDark} />
      </div>
      {/* Bottom accent edge line */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2,
        background: accent, borderRadius: '2px 2px 0 0', opacity: 0.5,
      }} />
      {/* Glow under bar */}
      <div style={{
        position: 'absolute', bottom: -4, left: '15%', right: '15%', height: 8,
        background: accent, filter: 'blur(8px)', opacity: 0.15, pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ─── Mock helpers (cards, filter bar, page header) ─── */

function MockBadge({ platform, isDark }: { platform: string; isDark: boolean }) {
  if (isDark) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(6px)' }}>
        {platform}
      </span>
    );
  }
  const meta = PLATFORM_COLORS[platform] ?? { bg: '#6b7280', color: '#fff' };
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
      style={{ background: meta.bg, color: meta.color, fontWeight: 600 }}>
      {platform}
    </span>
  );
}

function MockVideoCard({ card, isDark, accentColor, isSelected }: {
  card: typeof MOCK_CARDS[0]; isDark: boolean; accentColor: string; isSelected: boolean;
}) {
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? '#141414' : '#ffffff';
  const textColor = isDark ? '#fff' : '#111';
  const mutedColor = isDark ? '#888' : '#666';

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: isSelected ? `2px solid ${accentColor}` : `1px solid ${border}`,
        background: isSelected ? (isDark ? `${accentColor}0d` : `${accentColor}08`) : cardBg,
      }}>
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '9/16' }}>
        <img src={card.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white opacity-80" />
        </div>
        <div className="absolute top-2 left-2" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: isSelected ? accentColor : 'rgba(0,0,0,0.4)',
            border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
            <Heart size={14} className="text-white" />
          </div>
          <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
            <FolderPlus size={14} className="text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <MockBadge platform={card.platform} isDark={isDark} />
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', fontWeight: 500 }}>{card.duration}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px]" style={{ color: mutedColor }}>{card.creator}</span>
        <p className="text-xs" style={{ color: textColor, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.title}</p>
        <p className="text-[10px]" style={{ color: mutedColor, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.snippet}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: mutedColor }}>{formatCardDate(card.date)}</span>
          <div className="flex items-center gap-1">
            <Copy size={12} style={{ color: mutedColor }} />
            <MoreHorizontal size={12} style={{ color: mutedColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockFilterBar({ isDark, context }: { isDark: boolean; context: 'videos' | 'profiles' | 'q1' }) {
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const mutedColor = isDark ? '#888' : '#666';
  const pillBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const filters = context === 'videos'
    ? ['Platform', 'Duration', 'Words', 'Date', 'Newest first']
    : context === 'profiles'
    ? ['All', 'TikTok', 'Instagram', 'YouTube', 'Duration', 'Words', 'Newest first']
    : ['Duration', 'Words', 'Date', 'Platform', 'Newest first'];

  return (
    <div className="flex items-center gap-2 px-6 py-3" style={{ borderBottom: `1px solid ${border}` }}>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: inputBg, color: mutedColor, width: 180 }}>
        <Search size={13} style={{ opacity: 0.5 }} />
        <span style={{ opacity: 0.5 }}>Search videos...</span>
      </div>
      <div style={{ width: 1, height: 16, background: border }} />
      {filters.map(f => (
        <div key={f} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: pillBg, color: mutedColor, fontWeight: 500, cursor: 'pointer' }}>
          {f} {!['All', 'TikTok', 'Instagram', 'YouTube'].includes(f) && <ChevronDown size={11} />}
        </div>
      ))}
      <div className="flex-1" />
      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${border}` }}>
        <div className="p-1.5" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}><LayoutGrid size={13} style={{ color: mutedColor }} /></div>
        <div className="p-1.5"><List size={13} style={{ color: mutedColor, opacity: 0.4 }} /></div>
        <div className="p-1.5"><Columns size={13} style={{ color: mutedColor, opacity: 0.4 }} /></div>
      </div>
    </div>
  );
}

function PageContextHeader({ isDark, context }: { isDark: boolean; context: 'videos' | 'profiles' | 'q1' }) {
  const textColor = isDark ? '#fff' : '#111';
  const mutedColor = isDark ? '#888' : '#666';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  if (context === 'videos') {
    return (
      <div className="flex items-center gap-3 px-6 py-3" style={{ borderBottom: `1px solid ${border}` }}>
        <span style={{ color: textColor, fontWeight: 700, fontSize: 16 }}>Videos</span>
        <span className="text-xs" style={{ color: mutedColor }}>16 videos</span>
        <div className="flex items-center rounded-lg overflow-hidden ml-3" style={{ border: `1px solid ${border}` }}>
          <div className="px-3 py-1.5 text-xs" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: textColor, fontWeight: 600 }}>All Videos</div>
          <div className="px-3 py-1.5 text-xs" style={{ color: mutedColor }}>Sessions</div>
        </div>
      </div>
    );
  }
  if (context === 'profiles') {
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full" style={{ background: isDark ? '#333' : '#e5e7eb' }} />
          <div>
            <div className="flex items-center gap-2">
              <span style={{ color: textColor, fontWeight: 700, fontSize: 16 }}>@productivityhacks</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f59e0b', color: '#fff', fontWeight: 600 }}>TikTok</span>
            </div>
            <span className="text-xs" style={{ color: mutedColor }}>24 videos · 52.4K words · Scanned 2h ago</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-6 py-3" style={{ borderBottom: `1px solid ${border}` }}>
      <button className="flex items-center gap-1 text-xs" style={{ color: mutedColor, background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={13} /> Collections
      </button>
      <div style={{ width: 1, height: 16, background: border }} />
      <span style={{ color: textColor, fontWeight: 700, fontSize: 16 }}>Q1 Product Reviews</span>
      <span className="text-xs" style={{ color: mutedColor }}>8 videos</span>
    </div>
  );
}

/* ─── Variation definitions ─── */
const VARIATIONS: { id: string; title: string; desc: string; Component: React.FC<{ isDark: boolean; accent: string }> }[] = [
  { id: 'v1', title: 'V1 — Ambient Accent Shadow', desc: 'Clean solid bar with accent-colored shadow below. Hover: subtle fill + border brighten.', Component: V1AmbientShadow },
  { id: 'v2', title: 'V2 — Accent-Tinted Surface', desc: 'Whisper of accent color mixed into the surface. Hover: accent-tinted button fill.', Component: V2TintedSurface },
  { id: 'v3', title: 'V3 — Frosted Dark Glass', desc: 'Semi-transparent glass with backdrop blur. Hover: glass fill + border brighten.', Component: V3FrostedGlass },
  { id: 'v4', title: 'V4 — Layered Depth Surface', desc: 'Inset highlights create premium surface. Hover: buttons lift with micro shadow.', Component: V4LayeredDepth },
  { id: 'v5', title: 'V5 — Accent Bottom Edge Glow', desc: 'Thin accent line along bottom with matching glow. Hover: accent underline slides in per button + icon tints.', Component: V5BottomGlow },
];

type PageContext = 'videos' | 'profiles' | 'q1';

const CONTEXT_META: Record<PageContext, { label: string; accent: string }> = {
  videos: { label: 'Videos', accent: '#00b8b2' },
  profiles: { label: 'Profiles', accent: '#f59e0b' },
  q1: { label: 'Q1 Product Reviews', accent: '#00b8b2' },
};

/* ─── Preview Page ─── */
export function SelectionBarPreview() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [context, setContext] = useState<PageContext>('q1');
  const accent = CONTEXT_META[context].accent;

  const pageBg = isDark ? '#0f0f0f' : '#f5f5f5';
  const textPrimary = isDark ? '#fff' : '#111';
  const textMuted = isDark ? '#888' : '#666';

  const selectedIds = new Set([1, 2, 4]);

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '40px 24px' }}>
      <style>{HOVER_CSS}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs mb-4"
            style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ color: textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Selection Bar — V5 Refined (Round 2)
          </h1>
          <p style={{ color: textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Equal-width buttons (flex: 1), lighter count label (weight 400), 5 distinct background treatments + hover animations.
          </p>

          {/* Context toggle */}
          <div className="flex items-center gap-2">
            <span style={{ color: textMuted, fontSize: 12 }}>Page context:</span>
            {(Object.entries(CONTEXT_META) as [PageContext, typeof CONTEXT_META['videos']][]).map(([key, meta]) => {
              const active = context === key;
              return (
                <button key={key} onClick={() => setContext(key)}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: active ? `${meta.accent}20` : 'transparent',
                    color: active ? meta.accent : textMuted,
                    border: `1px solid ${active ? `${meta.accent}40` : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    cursor: 'pointer', fontWeight: active ? 600 : 500,
                  }}>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {VARIATIONS.map(({ id, title, desc, Component }) => (
            <div key={id}>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ color: textPrimary, fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{title}</h2>
                <p style={{ color: textMuted, fontSize: 12 }}>{desc}</p>
              </div>

              <div className="rounded-2xl overflow-hidden"
                style={{
                  background: isDark ? '#0a0a0a' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}>
                <PageContextHeader isDark={isDark} context={context} />
                <MockFilterBar isDark={isDark} context={context} />
                <div className="px-6 py-5">
                  <div style={{ marginBottom: 12 }}>
                    <Component isDark={isDark} accent={accent} />
                  </div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                    {MOCK_CARDS.map(card => (
                      <MockVideoCard key={card.id} card={card} isDark={isDark} accentColor={accent}
                        isSelected={selectedIds.has(card.id)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
