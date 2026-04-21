/**
 * ProfilesPage  (/profiles)
 * ──────────────────────────
 * Grid view of all saved creator profiles. Clicking a card navigates
 * to the full CreatorProfilePage (/profile/:creator).
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Users, BadgeCheck, Search, FolderPlus, Heart, X, UserPlus, ChevronDown, SlidersHorizontal, CheckCheck, FileText, Film, Globe, Eye } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext } from '../context/FolderContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import ContainerUserPlus from '../../imports/Container-765-606';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SaveToFolderModal } from './SaveToFolderModal';
import { useNewTranscript } from '../context/NewTranscriptContext';

// ─── Profile data ─────────────────────────────────────────────────────────────
const PROFILES_DATA = [
  {
    handle: '@tokcast',
    displayName: 'TokCast',
    bio: 'Weekly deep-dives with builders, founders, and operators. 200+ episodes on growth, product, and craft.',
    platforms: ['YouTube', 'TikTok'],
    followers: '284K',
    videoCount: 214,
    totalWords: '2.4M',
    avatar: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',
    verified: true,
    recentVideos: [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80',
    ],
  },
  {
    handle: '@fitwithjess',
    displayName: 'Fit With Jess',
    bio: 'No-equipment home workouts that actually work. New sessions every Monday & Thursday.',
    platforms: ['YouTube', 'TikTok'],
    followers: '1.2M',
    videoCount: 347,
    totalWords: '890K',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    verified: true,
    recentVideos: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80',
      'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=200&q=80',
    ],
  },
  {
    handle: '@roamingalex',
    displayName: 'Roaming Alex',
    bio: 'Slow travel, honest reviews, and stories from the road. Currently in Southeast Asia.',
    platforms: ['YouTube', 'Instagram'],
    followers: '542K',
    videoCount: 189,
    totalWords: '1.1M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    verified: false,
    recentVideos: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80',
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=200&q=80',
    ],
  },
  {
    handle: '@webdevdaily',
    displayName: 'Web Dev Daily',
    bio: 'Practical tutorials for modern web developers. React, TypeScript, CSS and everything in between.',
    platforms: ['YouTube', 'Instagram'],
    followers: '398K',
    videoCount: 278,
    totalWords: '3.1M',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    verified: true,
    recentVideos: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80',
    ],
  },
  {
    handle: '@techguru',
    displayName: 'Tech Guru',
    bio: 'Breaking down complex tech into plain English. APIs, DevOps, and backend architecture.',
    platforms: ['TikTok', 'YouTube'],
    followers: '218K',
    videoCount: 156,
    totalWords: '1.8M',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
    verified: false,
    recentVideos: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&q=80',
    ],
  },
  {
    handle: '@designsystem',
    displayName: 'Design Systems',
    bio: 'Everything you need to build and maintain scalable design systems. Figma, tokens, and component architecture.',
    platforms: ['YouTube', 'Instagram'],
    followers: '167K',
    videoCount: 94,
    totalWords: '740K',
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400&q=80',
    verified: false,
    recentVideos: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&q=80',
      'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=200&q=80',
    ],
  },
  {
    handle: '@kitchenlabs',
    displayName: 'Kitchen Labs',
    bio: "Food science meets home cooking. We test every technique so you don't have to.",
    platforms: ['TikTok', 'Instagram'],
    followers: '891K',
    videoCount: 412,
    totalWords: '620K',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
    verified: true,
    recentVideos: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80',
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
    ],
  },
];

function parseCount(s: string): number {
  const n = parseFloat(s);
  if (s.endsWith('M')) return n * 1_000_000;
  if (s.endsWith('K')) return n * 1_000;
  return n;
}

function fmtLargeNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ─── Computed profile stats ──────────────────────────────────────────────────
const TOTAL_PROFILES = PROFILES_DATA.length;
const TOTAL_VIDEOS = PROFILES_DATA.reduce((s, p) => s + p.videoCount, 0);
const TOTAL_WORDS = PROFILES_DATA.reduce((s, p) => s + parseCount(p.totalWords), 0);
const TOTAL_FOLLOWERS = PROFILES_DATA.reduce((s, p) => s + parseCount(p.followers), 0);
const PLATFORM_COUNTS = {
  YouTube: PROFILES_DATA.filter(p => p.platforms.includes('YouTube')).length,
  TikTok: PROFILES_DATA.filter(p => p.platforms.includes('TikTok')).length,
  Instagram: PROFILES_DATA.filter(p => p.platforms.includes('Instagram')).length,
};

const PROFILES_SORT_OPTIONS = [
  { value: 'followers-desc', label: 'Most followers' },
  { value: 'followers-asc', label: 'Fewest followers' },
  { value: 'videos-desc', label: 'Most videos' },
  { value: 'videos-asc', label: 'Fewest videos' },
  { value: 'words-desc', label: 'Most words' },
  { value: 'words-asc', label: 'Fewest words' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

// ─── Platform icons ───────────────────────────────────────────────────────────
function PlatformDot({ platform, isDark }: { platform: string; isDark: boolean }) {
  const colors: Record<string, string> = {
    YouTube: '#ff0000',
    TikTok: isDark ? '#ffffff' : '#010101',
    Instagram: '#e1306c',
  };

  const logos: Record<string, JSX.Element> = {
    YouTube: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
      </svg>
    ),
    TikTok: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6 3.3A4.9 4.9 0 0 1 14.8 0h-3.6v16.4a2.9 2.9 0 0 1-2.9 2.5 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .5 0 .8.1V9.5a6.5 6.5 0 0 0-.8-.1 6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 6.5-6.5V8.2a8.4 8.4 0 0 0 4.9 1.6V6.2a4.9 4.9 0 0 1-3.1-2.9z"/>
      </svg>
    ),
    Instagram: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8s0 3.5-.1 4.8c-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1s-3.5 0-4.8-.1c-3.3-.2-4.8-1.7-5-5C2.1 15.5 2 15.2 2 12s0-3.5.1-4.8c.2-3.3 1.7-4.8 5-5 1.3-.1 1.6-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12s0 3.7.1 4.9C.3 21.3 2.7 23.7 7.1 23.9c1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7C24 15.7 24 15.3 24 12s0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
      </svg>
    ),
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
        color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
        fontWeight: 500,
      }}
    >
      {logos[platform] ?? <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors[platform] ?? '#888' }} />}
      {platform}
    </span>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({
  profile, isDark, border, text, muted,
}: {
  profile: typeof PROFILES_DATA[0];
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
}) {
  const navigate = useNavigate();
  const { getFoldersContaining } = useContext(FolderContext);
  const [hovered, setHovered] = useState(false);
  const [folderModal, setFolderModal] = useState<DOMRect | null>(null);
  const [favourited, setFavourited] = useState(false);

  const cardBg  = isDark ? '#141414' : '#ffffff';
  const hoverBg = isDark ? '#181818' : '#fafafa';
  const divider = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';

  const savedCount = getFoldersContaining('profile', profile.handle.replace('@', '')).length;

  return (
    <div
      className="rounded-2xl flex flex-col cursor-pointer overflow-hidden relative"
      style={{
        background: hovered ? hoverBg : cardBg,
        border: `1px solid ${hovered ? (isDark ? '#333333' : '#d1d5db') : border}`,
        transition: 'background 0.12s ease, border-color 0.12s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        sessionStorage.setItem('creatorNavFrom', 'profiles');
        navigate(`/profile/${profile.handle.replace('@', '')}`, { state: { from: 'profiles' } });
      }}
    >
      {/* Save to folder + Favourite buttons */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {/* Favourite button */}
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: favourited
                ? (isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)')
                : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
              color: favourited ? '#ef4444' : muted,
              border: `1px solid ${favourited ? 'rgba(239,68,68,0.3)' : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb')}`,
            }}
            onClick={e => { e.stopPropagation(); setFavourited(v => !v); }}
            title={favourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
          </button>
          {/* Folder button */}
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: savedCount > 0
                ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)')
                : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
              color: savedCount > 0 ? (isDark ? '#ffffff' : '#111111') : muted,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
            }}
            onClick={e => { e.stopPropagation(); setFolderModal(e.currentTarget.getBoundingClientRect()); }}
            title="Save to folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-3">

        {/* Identity row */}
        <div className="flex items-center gap-3">
          <div
            className="relative rounded-xl flex-shrink-0"
            style={{ width: 44, height: 44, background: isDark ? '#222' : '#f3f4f6' }}
          >
            <ImageWithFallback
              src={profile.avatar}
              alt={profile.displayName}
              className="w-full h-full object-cover object-top rounded-full"
            />
            {profile.verified && (
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  bottom: -1, right: -1,
                  width: 16, height: 16,
                  background: '#1d9bf0',
                  border: '1.5px solid #fff',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                </svg>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0" style={{ lineHeight: 1.3 }}>
              <span className="text-[13px] truncate block" style={{ color: text, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {profile.displayName}
              </span>
            <span className="text-[11px] block" style={{ color: muted }}>{profile.handle}</span>
          </div>
        </div>

        {/* Bio */}
        <p
          className="text-[11.5px]"
          style={{
            color: muted,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          {profile.bio}
        </p>

        {/* Platform badges row — separated from action icons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {profile.platforms.map(p => {
            const platformLogos: Record<string, JSX.Element> = {
              YouTube: (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
              ),
              TikTok: (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3.3A4.9 4.9 0 0 1 14.8 0h-3.6v16.4a2.9 2.9 0 0 1-2.9 2.5 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .5 0 .8.1V9.5a6.5 6.5 0 0 0-.8-.1 6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 6.5-6.5V8.2a8.4 8.4 0 0 0 4.9 1.6V6.2a4.9 4.9 0 0 1-3.1-2.9z"/></svg>
              ),
              Instagram: (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8s0 3.5-.1 4.8c-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1s-3.5 0-4.8-.1c-3.3-.2-4.8-1.7-5-5C2.1 15.5 2 15.2 2 12s0-3.5.1-4.8c.2-3.3 1.7-4.8 5-5 1.3-.1 1.6-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12s0 3.7.1 4.9C.3 21.3 2.7 23.7 7.1 23.9c1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7C24 15.7 24 15.3 24 12s0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>
              ),
            };
            return (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                  color: isDark ? 'rgba(255,255,255,0.55)' : '#6b7280',
                  fontWeight: 500,
                }}
                title={p}
              >
                {platformLogos[p] ?? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'block' }} />}
                {p}
              </span>
            );
          })}
        </div>

      </div>

      {/* ── Stats footer ── */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: `1px solid ${divider}` }}
      >
        {[
          { val: profile.followers,          label: 'followers' },
          { val: String(profile.videoCount),  label: 'videos'    },
          { val: profile.totalWords,          label: 'words'     },
        ].map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-3"
            style={{
              borderRight: i < 2 ? `1px solid ${divider}` : 'none',
            }}
          >
            <span className="text-[12px]" style={{ color: text, fontWeight: 600 }}>{s.val}</span>
            <span className="text-[10px] mt-0.5" style={{ color: muted }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Video Preview Collage ── */}
      <div className="relative flex-shrink-0 flex items-start justify-center overflow-hidden" style={{ height: 130 }}>
        {/* Blurred ambient background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${profile.recentVideos[0]})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(22px) saturate(0.6)', transform: 'scale(1.15)',
          opacity: isDark ? 0.45 : 0.35,
        }} />
        {/* Scrim */}
        <div className="absolute inset-0" style={{
          background: isDark ? 'rgba(10,10,10,0.55)' : 'rgba(240,240,240,0.55)'
        }} />
        {/* Top gradient: card-bg → transparent (blends stats into collage) */}
        <div className="absolute inset-x-0 top-0 h-20 z-[5]" style={{
          background: `linear-gradient(to bottom, ${isDark ? '#141414' : '#ffffff'}, transparent)`
        }} />
        {/* Bottom gradient: transparent → card-bg (clean fade at card edge) */}
        <div className="absolute inset-x-0 bottom-0 h-16 z-[5]" style={{
          background: `linear-gradient(to top, ${isDark ? '#141414' : '#ffffff'}, transparent)`
        }} />
        {/* 3 fanned thumbnails */}
        <div className="relative flex items-start justify-center pt-5" style={{ gap: 6, zIndex: 10 }}>
          {/* Left */}
          <div className="rounded-xl overflow-hidden flex-shrink-0 shadow-xl"
            style={{ width: 48, height: 72, transform: 'rotate(-6deg) translateY(6px)', opacity: 0.85,
              border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}` }}>
            <img src={profile.recentVideos[1]} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Center */}
          <div className="rounded-xl overflow-hidden flex-shrink-0 shadow-2xl"
            style={{ width: 56, height: 88, zIndex: 2,
              border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}` }}>
            <img src={profile.recentVideos[0]} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Right */}
          <div className="rounded-xl overflow-hidden flex-shrink-0 shadow-xl"
            style={{ width: 48, height: 72, transform: 'rotate(6deg) translateY(6px)', opacity: 0.85,
              border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}` }}>
            <img src={profile.recentVideos[2]} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Save to folder modal */}
      {folderModal && (
        <SaveToFolderModal
          type="profile"
          refId={profile.handle.replace('@', '')}
          name={profile.displayName}
          meta={profile.handle}
          avatar={profile.avatar}
          platforms={profile.platforms}
          videoCount={profile.videoCount}
          triggerRect={folderModal}
          onClose={() => setFolderModal(null)}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ProfilesPage() {
  const { isDark } = useContext(ThemeContext);
  const { open: openNewTranscript } = useNewTranscript();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ctaHovered, setCtaHovered] = useState(false);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [activeFollowers, setActiveFollowers] = useState<string[]>([]);
  const [activeVideos, setActiveVideos] = useState<string[]>([]);
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('followers-desc');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const bg     = isDark ? '#0d0d0d' : '#ffffff';
  const border = isDark ? '#262626' : '#e5e7eb';
  const text   = isDark ? '#ffffff' : '#111827';
  const muted  = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : '#f5f5f5';

  const hasActiveFilter = activePlatforms.length > 0 || activeFollowers.length > 0 || activeVideos.length > 0 || activeWords.length > 0 || sortBy !== 'followers-desc' || searchQuery.trim() !== '';

  const filteredProfiles = PROFILES_DATA
    .filter(p => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.displayName.toLowerCase().includes(q) && !p.handle.toLowerCase().includes(q) && !p.bio.toLowerCase().includes(q)) return false;
      }
      // Platform filter
      if (activePlatforms.length > 0 && !p.platforms.some(pl => activePlatforms.includes(pl))) return false;
      // Followers filter
      if (activeFollowers.length > 0) {
        const f = parseCount(p.followers);
        const match = activeFollowers.some(r => {
          if (r === '<100K') return f < 100_000;
          if (r === '100K–500K') return f >= 100_000 && f <= 500_000;
          if (r === '500K+') return f > 500_000;
          return false;
        });
        if (!match) return false;
      }
      // Videos filter
      if (activeVideos.length > 0) {
        const v = p.videoCount;
        const match = activeVideos.some(r => {
          if (r === '<100') return v < 100;
          if (r === '100–300') return v >= 100 && v <= 300;
          if (r === '300+') return v > 300;
          return false;
        });
        if (!match) return false;
      }
      // Words filter
      if (activeWords.length > 0) {
        const w = parseCount(p.totalWords);
        const match = activeWords.some(r => {
          if (r === '<1M') return w < 1_000_000;
          if (r === '1M–2M') return w >= 1_000_000 && w <= 2_000_000;
          if (r === '2M+') return w > 2_000_000;
          return false;
        });
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'followers-desc': return parseCount(b.followers) - parseCount(a.followers);
        case 'followers-asc': return parseCount(a.followers) - parseCount(b.followers);
        case 'videos-desc': return b.videoCount - a.videoCount;
        case 'videos-asc': return a.videoCount - b.videoCount;
        case 'words-desc': return parseCount(b.totalWords) - parseCount(a.totalWords);
        case 'words-asc': return parseCount(a.totalWords) - parseCount(b.totalWords);
        case 'name-asc': return a.displayName.localeCompare(b.displayName);
        case 'name-desc': return b.displayName.localeCompare(a.displayName);
        default: return 0;
      }
    });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
      <AppSidebar activePage="profiles" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
           style={isDark ? undefined : { background: '#ffffff' }}>
        <AppHeader />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 pt-5 pb-4">
              <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                Profiles
              </h1>
              <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                Your saved creator profiles — {filteredProfiles.length} creator{filteredProfiles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* ── Unified Filter Bar ───────────────────────────────────── */}
          <div className="flex-shrink-0 px-6" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 py-3">

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}`, color: muted, width: 260 }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search transcripts or profiles…"
                className="flex-1 bg-transparent outline-none text-xs min-w-0"
                style={{ color: text }}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ color: muted }}><X className="w-3 h-3" /></button>}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Platform multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activePlatforms.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activePlatforms.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activePlatforms.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activePlatforms.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
              >
                {activePlatforms.length === 0 ? 'Platform' : activePlatforms.length === 1 ? activePlatforms[0] : `${activePlatforms.length} platforms`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'platform' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 148 }}>
                    {['YouTube', 'TikTok', 'Instagram'].map(opt => {
                      const sel = activePlatforms.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActivePlatforms(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Followers multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeFollowers.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeFollowers.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeFollowers.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeFollowers.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'followers' ? null : 'followers')}
              >
                <Users className="w-3 h-3" />
                {activeFollowers.length === 0 ? 'Followers' : activeFollowers.length === 1 ? activeFollowers[0] : `${activeFollowers.length} ranges`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'followers' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'followers' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['<100K', '100K–500K', '500K+'].map(opt => {
                      const sel = activeFollowers.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveFollowers(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Videos multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeVideos.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeVideos.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeVideos.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeVideos.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'videos' ? null : 'videos')}
              >
                <FileText className="w-3 h-3" />
                {activeVideos.length === 0 ? 'Videos' : activeVideos.length === 1 ? activeVideos[0] : `${activeVideos.length} ranges`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'videos' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'videos' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 130 }}>
                    {['<100', '100–300', '300+'].map(opt => {
                      const sel = activeVideos.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveVideos(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Words multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeWords.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: activeWords.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${activeWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: activeWords.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'words' ? null : 'words')}
              >
                <FileText className="w-3 h-3" />
                {activeWords.length === 0 ? 'Words' : activeWords.length === 1 ? activeWords[0] : `${activeWords.length} ranges`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'words' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'words' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}>
                    {['<1M', '1M–2M', '2M+'].map(opt => {
                      const sel = activeWords.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
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
                  background: sortBy !== 'followers-desc' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: sortBy !== 'followers-desc' ? '#00b8b2' : muted,
                  border: `1px solid ${sortBy !== 'followers-desc' ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {PROFILES_SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Most followers'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 156 }}>
                    {PROFILES_SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                        style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={e => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={e => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}{sortBy === opt.value && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Clear all */}
            {hasActiveFilter && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button className="flex items-center gap-1 text-xs hover:opacity-70 flex-shrink-0" style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setActivePlatforms([]); setActiveFollowers([]); setActiveVideos([]); setActiveWords([]); setSortBy('followers-desc'); setSearchQuery(''); }}>
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}

            <div className="flex-1" />
          </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
           <div className="max-w-[1280px] mx-auto w-full">

            {/* ── Stat Boxes ─────────────────────────────────────── */}
            <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {/* Box 1: Profiles */}
              <div className="flex flex-col px-4 pt-3 pb-3 rounded-xl" style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                  <Users className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Profiles</span>
                </div>
                <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {TOTAL_PROFILES}
                </p>
                <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>total creators</p>
              </div>

              {/* Box 2: Total Videos */}
              <div className="flex flex-col px-4 pt-3 pb-3 rounded-xl" style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                  <Film className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Total Videos</span>
                </div>
                <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {TOTAL_VIDEOS.toLocaleString()}
                </p>
                <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>across all profiles</p>
              </div>

              {/* Box 3: Total Words */}
              <div className="flex flex-col px-4 pt-3 pb-3 rounded-xl" style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                  <FileText className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Total Words</span>
                </div>
                <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {fmtLargeNum(TOTAL_WORDS)}
                </p>
                <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>transcribed words</p>
              </div>

              {/* Box 4: By Platform — mini breakdown */}
              <div className="flex flex-col px-4 pt-3 pb-3 rounded-xl" style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                  <Globe className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>By Platform</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {([
                    { platform: 'YouTube', color: '#ff0000', count: PLATFORM_COUNTS.YouTube },
                    { platform: 'TikTok', color: isDark ? '#ffffff' : '#010101', count: PLATFORM_COUNTS.TikTok },
                    { platform: 'Instagram', color: '#e1306c', count: PLATFORM_COUNTS.Instagram },
                  ] as const).map(row => (
                    <div key={row.platform} className="flex items-center gap-1.5" style={{ fontSize: '0.6875rem' }}>
                      <PlatformDot platform={row.platform} isDark={isDark} />
                      <span style={{ color: muted }}>{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 5: Audience Reach */}
              <div className="flex flex-col px-4 pt-3 pb-3 rounded-xl" style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                  <Eye className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Audience Reach</span>
                </div>
                <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {fmtLargeNum(TOTAL_FOLLOWERS)}
                </p>
                <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>combined followers</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-[26px]" style={{ borderTop: `1px solid ${border}` }} />

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            >
              {/* ── Scan new profile CTA card ── */}
              <div
                className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                style={{
                  border: `1.5px solid ${ctaHovered ? '#f59e0b55' : '#f59e0b35'}`,
                  background: ctaHovered
                    ? `linear-gradient(180deg, #f59e0b22 0%, ${isDark ? '#0d0d0d' : '#ffffff'} 100%)`
                    : `linear-gradient(180deg, #f59e0b14 0%, ${isDark ? '#0d0d0d' : '#ffffff'} 100%)`,
                }}
                onClick={() => openNewTranscript('profiles')}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                {/* Illustration */}
                <div
                  className="flex flex-col items-center justify-center gap-2.5 flex-1"
                  style={{ background: isDark ? 'rgba(245,158,11,0.04)' : '#f59e0b08' }}
                >
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="25" fill="#f59e0b"/>
                    <path d="M18 25H32M25 32L25 18" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-xs" style={{ color: text, fontWeight: 600 }}>Scan new profile</p>
                </div>
              </div>

              {/* ── Existing profile cards ── */}
              {filteredProfiles.map(profile => (
                <ProfileCard
                  key={profile.handle}
                  profile={profile}
                  isDark={isDark}
                  border={border}
                  text={text}
                  muted={muted}
                />
              ))}
            </div>
           </div>
          </div>
        </main>
      </div>

    </div>
  );
}