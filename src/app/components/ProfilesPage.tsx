/**
 * ProfilesPage  (/profiles)
 * ──────────────────────────
 * Grid view of all saved creator profiles. Clicking a card navigates
 * to the full CreatorProfilePage (/profile/:creator).
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Users, BadgeCheck, Search, FolderPlus, Heart, ScanLine, X, Link2, UserPlus, ChevronDown, SlidersHorizontal, CheckCheck, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext } from '../context/FolderContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import ContainerUserPlus from '../../imports/Container-765-606';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SaveToFolderModal } from './SaveToFolderModal';

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
  },
];

function parseCount(s: string): number {
  const n = parseFloat(s);
  if (s.endsWith('M')) return n * 1_000_000;
  if (s.endsWith('K')) return n * 1_000;
  return n;
}

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
    LinkedIn: '#0a66c2',
    Spotify: '#1db954',
    'Twitter/X': isDark ? '#ffffff' : '#14171a',
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
      {(hovered || savedCount > 0 || favourited) && (
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
      )}

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Identity row */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl overflow-hidden flex-shrink-0"
            style={{ width: 44, height: 44, background: isDark ? '#222' : '#f3f4f6' }}
          >
            <ImageWithFallback
              src={profile.avatar}
              alt={profile.displayName}
              className="w-full h-full object-cover object-top rounded-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] truncate" style={{ color: text, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {profile.displayName}
              </span>
              {profile.verified && (
                <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3b82f6' }} />
              )}
            </div>
            <span className="text-[11px]" style={{ color: muted }}>{profile.handle}</span>
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

// ─── Scan New Profile Modal ───────────────────────────────────────────────────
function ScanNewProfileModal({ isDark, border, text, muted, onClose }: {
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const bg      = isDark ? '#141414' : '#ffffff';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  function handleScan() {
    if (!url.trim()) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setDone(true); }, 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{ width: 440, background: bg, border: `1px solid ${border}`, boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,184,178,0.12)' }}>
              <ScanLine className="w-3.5 h-3.5" style={{ color: '#00b8b2' }} />
            </div>
            <span className="text-[13px]" style={{ color: text, fontWeight: 600 }}>Scan a new profile</span>
          </div>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,184,178,0.12)' }}>
                <BadgeCheck className="w-5 h-5" style={{ color: '#00b8b2' }} />
              </div>
              <p className="text-[13px] text-center" style={{ color: text, fontWeight: 600 }}>Profile queued for scanning</p>
              <p className="text-[11.5px] text-center" style={{ color: muted, lineHeight: 1.6 }}>
                We'll scan their latest videos and add the profile to your library shortly.
              </p>
              <button
                className="mt-2 px-4 py-2 rounded-xl text-[12px] transition-all"
                style={{ background: '#00b8b2', color: '#fff', fontWeight: 600 }}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] mb-1.5" style={{ color: muted, fontWeight: 500 }}>
                  Channel URL or handle
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: inputBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}
                >
                  <Link2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
                  <input
                    type="text"
                    placeholder="e.g. @mrbeast or youtube.com/c/MrBeast"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleScan(); }}
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-[12px] min-w-0"
                    style={{ color: text, caretColor: '#00b8b2' }}
                  />
                </div>
                <p className="text-[10.5px] mt-1.5" style={{ color: muted }}>
                  Supports YouTube, TikTok, and Instagram channels.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  className="px-3.5 py-2 rounded-xl text-[12px] transition-all"
                  style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', fontWeight: 500 }}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-[12px] flex items-center gap-1.5 transition-all"
                  style={{
                    background: url.trim() ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'),
                    color: url.trim() ? '#fff' : muted,
                    fontWeight: 600,
                    cursor: url.trim() && !scanning ? 'pointer' : 'not-allowed',
                  }}
                  onClick={handleScan}
                  disabled={!url.trim() || scanning}
                >
                  {scanning ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
                      </svg>
                      Scanning…
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-3 h-3" />
                      Scan Profile
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ProfilesPage() {
  const { isDark } = useContext(ThemeContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
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
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>
      <AppHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(c => !c)}
      />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activePage="profiles" collapsed={sidebarCollapsed} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Title bar */}
          <div
            className="flex items-center px-6 py-3 flex-shrink-0"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 flex-shrink-0" style={{ color: muted }} />
              <span className="text-sm" style={{ color: text, fontWeight: 600 }}>Profiles</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: muted }}
              >
                {filteredProfiles.length} creators
              </span>
            </div>
          </div>

          {/* ── Unified Filter Bar ───────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

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
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            >
              {/* ── Scan new profile CTA card ── */}
              <div
                className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                style={{
                  border: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
                  background: isDark ? '#141414' : '#ffffff',
                }}
                onClick={() => setShowScanModal(true)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
              >
                {/* Illustration */}
                <div
                  className="flex items-center justify-center flex-1"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9' }}
                >
                  <div style={{ width: 44, height: 44 }}>
                    <ContainerUserPlus />
                  </div>
                </div>
                {/* Text */}
                <div
                  className="px-3.5 py-3"
                  style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'}` }}
                >
                  <p className="text-xs" style={{ color: text, fontWeight: 600 }}>Scan a new profile</p>
                  <p className="text-[10px] mt-1" style={{ color: muted, lineHeight: 1.5 }}>
                    Add a creator's channel to track their latest videos and transcripts.
                  </p>
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

      {/* Scan modal */}
      {showScanModal && (
        <ScanNewProfileModal
          isDark={isDark}
          border={border}
          text={text}
          muted={muted}
          onClose={() => setShowScanModal(false)}
        />
      )}
    </div>
  );
}