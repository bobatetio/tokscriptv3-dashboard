import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText, Video, Layers, User, Link2, Sparkles, Download, FolderInput, Users, Globe, ChevronDown, Play, X, CheckCircle, Film, Image as ImageIcon, ArrowRight, Heart,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNewTranscript } from '../context/NewTranscriptContext';
import OutlineSearchMagnifer from '../../imports/OutlineSearchMagnifer';
import { inferPlatform } from '../utils/inferPlatform';
import { useBulkProcessing } from '../context/BulkProcessingContext';
import type { BulkBatch } from '../context/BulkProcessingContext';
import { useUser } from '../context/UserContext';

// ─── New Transcription constants ─────────────────────────────────────────────
const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian',
  'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic',
  'Hindi', 'Russian',
];
const MAX_LINKS = 50;
function isValidUrl(line: string) {
  try { new URL(line.trim()); return true; } catch { return false; }
}

// ─── Input Tab Types ──────────────────────────────────────────────────────────
type InputTab = 'transcripts' | 'videos' | 'collections' | 'profiles';

const INPUT_TABS: { key: InputTab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'transcripts', label: 'Transcripts', icon: <FileText className="w-4 h-4" />, color: '#00b8b2' },
  { key: 'videos',      label: 'Videos',      icon: <Video className="w-4 h-4" />,    color: '#3b82f6' },
  { key: 'collections', label: 'Collections', icon: <Layers className="w-4 h-4" />,   color: '#8b5cf6' },
  { key: 'profiles',    label: 'Profiles',    icon: <User className="w-4 h-4" />,     color: '#f59e0b' },
];

const TAB_PLATFORMS: Record<InputTab, { name: string; color: string }[]> = {
  transcripts: [
    { name: 'TikTok', color: '#010101' },
    { name: 'YouTube', color: '#FF0000' },
    { name: 'Instagram', color: '#E1306C' },
  ],
  videos: [
    { name: 'TikTok', color: '#010101' },
    { name: 'YouTube', color: '#FF0000' },
    { name: 'Instagram', color: '#E1306C' },
  ],
  collections: [
    { name: 'TikTok', color: '#010101' },
  ],
  profiles: [
    { name: 'TikTok', color: '#010101' },
    { name: 'YouTube', color: '#FF0000' },
    { name: 'Instagram', color: '#E1306C' },
  ],
};

const TAB_STEPS: Record<InputTab, { icon: React.ReactNode; label: string; desc: string }[]> = {
  transcripts: [
    { icon: <Link2 className="w-4 h-4" />, label: 'Paste links', desc: 'Drop up to 50 video URLs from any supported platform.' },
    { icon: <Sparkles className="w-4 h-4" />, label: 'AI transcribes', desc: 'Our engine extracts audio and generates a clean transcript.' },
    { icon: <FileText className="w-4 h-4" />, label: 'Save & export', desc: 'Results land in your library — export as TXT, MD, PDF or DOCX.' },
  ],
  videos: [
    { icon: <Link2 className="w-4 h-4" />, label: 'Paste links', desc: 'Add up to 50 video URLs you want to download.' },
    { icon: <Download className="w-4 h-4" />, label: 'We download', desc: 'Videos are fetched in original quality from the platform.' },
    { icon: <FolderInput className="w-4 h-4" />, label: 'Save to library', desc: 'Downloaded videos appear in your library ready to use.' },
  ],
  collections: [
    { icon: <Link2 className="w-4 h-4" />, label: 'Paste collection link', desc: 'Grab the link to any public TikTok collection.' },
    { icon: <Layers className="w-4 h-4" />, label: 'We scan it', desc: 'Every video in the collection is detected automatically.' },
    { icon: <FolderInput className="w-4 h-4" />, label: 'Import all', desc: 'All videos are added to your library in one batch.' },
  ],
  profiles: [
    { icon: <Link2 className="w-4 h-4" />, label: 'Paste profile links', desc: 'Add creator profile URLs — up to 50 at once.' },
    { icon: <Users className="w-4 h-4" />, label: 'We scan them', desc: 'Public videos from each profile are discovered.' },
    { icon: <FolderInput className="w-4 h-4" />, label: 'Profiles tracked', desc: 'Profiles appear in your library for ongoing monitoring.' },
  ],
};

const TAB_HOW_DESC: Record<InputTab, string> = {
  transcripts: 'Paste video links and get clean transcripts in seconds.',
  videos: 'Download videos from supported platforms to your library.',
  collections: 'Import an entire TikTok collection with a single link.',
  profiles: 'Track creator profiles and monitor new content.',
};

// ─── Profile Wizard Utilities ─────────────────────────────────────────────────
function extractHandle(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('@')) return trimmed.slice(1).toLowerCase();
  try {
    const u = new URL(trimmed);
    const parts = u.pathname.split('/').filter(Boolean);
    const atPart = parts.find(p => p.startsWith('@'));
    if (atPart) return atPart.slice(1).toLowerCase();
    if (parts.length > 0) return parts[parts.length - 1].toLowerCase();
  } catch {}
  return trimmed.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'unknown';
}

function generateMockProfile(handle: string, _platform: string) {
  const hash = handle.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const followers = [1200000, 542000, 89000, 2400000, 150000][(hash % 5)];
  const following = [340, 1200, 890, 520, 2100][(hash % 5)];
  const videoCount = [214, 347, 89, 1205, 56][(hash % 5)];
  const likes = [2400000, 890000, 145000, 8700000, 320000][(hash % 5)];
  const displayNames = [
    'Alex Morgan — Content Creator',
    'Jamie Rivera | Digital Storyteller',
    'Sam Chen • Tech & Lifestyle',
    'Jordan Blake Official Channel',
    'Taylor Kim — Creator & Producer',
  ];
  const bios = [
    `Creating daily content on tech, productivity, and the future of work. ${followers >= 1000000 ? (followers / 1000000).toFixed(1) + 'M' : (followers / 1000).toFixed(0) + 'K'} followers and growing. New videos every Tuesday and Friday.`,
    `Short-form storytelling meets long-form depth. I cover business, creativity, and the spaces in between. Featured in Forbes and Fast Company.`,
    `Building in public. Sharing everything I learn about startups, product, and growing an audience online. DMs open for collaborations.`,
    `Lifestyle and wellness content for busy professionals. ${videoCount}+ videos and counting — come join the community.`,
    `Independent creator documenting the journey from 0 to 1M. Behind-the-scenes, honest breakdowns, and takes on the creator economy.`,
  ];
  const avatarUrls = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=88&h=88&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=88&h=88&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=88&h=88&fit=crop&q=80',
  ];
  const platformSets: string[][] = [
    ['TikTok', 'YouTube', 'Instagram'],
    ['TikTok', 'Instagram'],
    ['YouTube', 'Instagram'],
    ['TikTok', 'YouTube'],
    ['TikTok', 'YouTube', 'Instagram'],
  ];
  return {
    handle: `@${handle}`,
    displayName: displayNames[hash % 5],
    platforms: platformSets[hash % 5],
    followers,
    following,
    videoCount,
    likes,
    bio: bios[hash % 5],
    verified: hash % 3 === 0,
    avatarUrl: avatarUrls[hash % 5],
    recentThumbs: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=534&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&h=534&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546961342-ea5f62d6e429?w=300&h=534&fit=crop&q=80',
    ],
    recentVideos: [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
      'https://media.w3.org/2010/05/bunny/trailer.mp4',
    ],
  };
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

// ─── Inline New Transcription View ───────────────────────────────────────────
function InlineNewTranscriptionView({ onBack }: { onBack: () => void }) {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { close, setPendingVideoLinks, initialTab } = useNewTranscript();
  const [activeInputTab, setActiveInputTab] = useState<InputTab>(
    (initialTab === 'profiles' || initialTab === 'videos' || initialTab === 'collections' || initialTab === 'transcripts')
      ? initialTab as InputTab
      : 'transcripts'
  );
  const [tabValues, setTabValues] = useState<Record<InputTab, string>>({
    transcripts: '',
    videos: '',
    collections: '',
    profiles: '',
  });
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Bulk scan state (transcripts tab) ────────────────────────────────────
  const [bulkScanPhase, setBulkScanPhase] = useState<null | 'scanning' | 'done'>(null);
  const [bulkScanProgress, setBulkScanProgress] = useState(0);
  const [detectedPlatforms, setDetectedPlatforms] = useState<Record<string, number>>({});
  const bulkScanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addBulkBatch, setActiveBatchId } = useBulkProcessing();
  const { plan } = useUser();

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [profilePhase, setProfilePhase] = useState<'preview' | 'configure' | 'finalScan' | 'scanDone' | 'confirmDownload' | 'downloadProcessing' | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const [profileDateRange, setProfileDateRange] = useState('Last 30 days');
  const [profileTypes, setProfileTypes] = useState({ videos: false, covers: false, data: false });
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [mockProfile, setMockProfile] = useState<ReturnType<typeof generateMockProfile> | null>(null);

  // ── Cleanup bulkScan timeout on unmount ───────────────────────────────────
  React.useEffect(() => {
    return () => {
      if (bulkScanTimeoutRef.current) {
        clearTimeout(bulkScanTimeoutRef.current);
      }
    };
  }, []);

  // ── scanDone transition effect (finalScan only) ───────────────────────────
  React.useEffect(() => {
    if (profilePhase === 'scanDone') {
      const timer = setTimeout(() => {
        const handle = extractHandle(lines[0]);
        const platform = inferPlatform(lines[0]);
        sessionStorage.setItem('creatorNavFrom', 'profiles');
        close();
        navigate(`/profile/${handle}`, {
          state: {
            from: 'profiles',
            justScanned: true,
            scanConfig: { dateRange: profileDateRange, types: profileTypes },
            inferredPlatform: platform,
          }
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [profilePhase]);

  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const pageBg  = isDark ? '#0d0d0d' : '#ffffff';
  const cardBg  = isDark ? '#141414' : '#ffffff';

  const currentTab = INPUT_TABS.find(t => t.key === activeInputTab)!;
  const currentValue = tabValues[activeInputTab];
  const setCurrentValue = (v: string) => setTabValues(prev => ({ ...prev, [activeInputTab]: v }));

  const lines        = currentValue.split('\n').filter(l => l.trim() !== '');
  const validLines   = lines.filter(isValidUrl);
  const atLimit      = lines.length >= MAX_LINKS;

  const placeholders: Record<InputTab, string> = {
    transcripts: "Paste up to 50 video links from TikTok, Instagram, YouTube, and more.\nWe'll extract, transcribe, and save them to your library.",
    videos: "Paste up to 50 video links to download.\nSupports TikTok, Instagram, YouTube, and more.",
    collections: "Paste a TikTok collection link...",
    profiles: "Paste profile links from TikTok, Instagram, YouTube...\nOne per line, up to 50 profiles.",
  };

  const buttonLabels: Record<InputTab, string> = {
    transcripts: 'Scan Videos',
    videos: 'Download Videos',
    collections: 'Import Collection',
    profiles: 'Scan Profiles',
  };

  const buttonIcons: Record<InputTab, React.ReactNode> = {
    transcripts: (
      <span style={{ '--fill-0': '#ffffff' } as React.CSSProperties}>
        <OutlineSearchMagnifer className="relative w-3.5 h-3.5 flex-shrink-0" />
      </span>
    ),
    videos: <Download className="w-3.5 h-3.5" />,
    collections: <FolderInput className="w-3.5 h-3.5" />,
    profiles: (
      <span style={{ '--fill-0': '#ffffff' } as React.CSSProperties}>
        <OutlineSearchMagnifer className="relative w-3.5 h-3.5 flex-shrink-0" />
      </span>
    ),
  };

  return (
    <div className="overflow-y-auto flex flex-col items-center justify-start px-6 pt-8 pb-10" style={{ background: pageBg }}>

      {/* ── Pill Tab Row ──────────────────────────────────────────────────── */}
      <div
        className="inline-flex items-center gap-1 p-1 rounded-full mb-6"
        style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}
      >
        {INPUT_TABS.map(tab => {
          const isActive = tab.key === activeInputTab;
          return (
            <button
              key={tab.key}
              onClick={() => { if (!profilePhase) setActiveInputTab(tab.key); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={{
                background: isActive
                  ? (isDark ? '#222222' : '#ffffff')
                  : 'transparent',
                color: isActive ? text : muted,
                boxShadow: isActive
                  ? (isDark ? '0 2px 6px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.1)')
                  : 'none',
                opacity: profilePhase ? 0.5 : 1,
                cursor: profilePhase ? 'default' : 'pointer',
              }}
            >
              <span style={{ color: isActive ? tab.color : muted }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Conditional: Wizard or Normal Content ─────────────────────── */}
      {profilePhase && activeInputTab === 'profiles' ? (
        <div className="w-full max-w-2xl flex flex-col gap-0">
          {/* ── Cream card ── */}
          <div
            className="overflow-hidden"
            style={{
              background: isDark ? '#1a1200' : '#fffcf3',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(245,158,11,0.12)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {/* Profile header — centered */}
            {mockProfile && (profilePhase === 'preview' || profilePhase === 'finalScan' || profilePhase === 'scanDone' || profilePhase === 'configure' || profilePhase === 'confirmDownload' || profilePhase === 'downloadProcessing') && (
              <div className="flex flex-col items-center gap-2 px-6 pt-5 pb-4 text-center">
                {/* Avatar with stacked platform badges */}
                <div className="relative flex-shrink-0" style={{ marginBottom: 6 }}>
                  <img
                    src={mockProfile.avatarUrl}
                    alt={mockProfile.handle}
                    className="rounded-full"
                    style={{ width: 72, height: 72, objectFit: 'cover', border: isDark ? '3px solid #27272a' : '3px solid #e5e7eb' }}
                  />
                  {/* Overlapping platform badges centered at bottom */}
                  <div className="absolute" style={{
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {mockProfile.platforms.map((p, i) => {
                      const bgColor = p === 'TikTok' ? '#010101' : p === 'YouTube' ? '#FF0000' : '#E1306C';
                      const borderColor = isDark ? '#1a1200' : '#fffcf3';
                      return (
                        <div
                          key={p}
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 20, height: 20,
                            background: bgColor,
                            border: `2px solid ${borderColor}`,
                            marginLeft: i > 0 ? -5 : 0,
                            zIndex: mockProfile.platforms.length - i,
                            position: 'relative',
                          }}
                        >
                          {p === 'TikTok' && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                              <path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" />
                            </svg>
                          )}
                          {p === 'YouTube' && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                              <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.84.55 9.38.55 9.38.55s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
                            </svg>
                          )}
                          {p === 'Instagram' && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.25 2.43.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.97-.41 2.43a4.07 4.07 0 0 1-.98 1.51c-.46.46-.9.74-1.51.98-.46.16-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.25-2.43-.41a4.07 4.07 0 0 1-1.51-.98 4.07 4.07 0 0 1-.98-1.51c-.16-.46-.36-1.26-.41-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.97.41-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.16 1.35A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.47 1.35 2.16a5.88 5.88 0 0 0 2.16 1.35c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.16-1.35 5.88 5.88 0 0 0 1.35-2.16c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.35-2.16A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Z"/>
                              <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>
                              <circle cx="18.41" cy="5.59" r="1.44"/>
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Name + handle */}
                <div className="flex flex-col items-center gap-0.5" style={{ marginTop: 4 }}>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: isDark ? '#f9fafb' : '#111827', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {mockProfile.displayName}
                    </span>
                    {mockProfile.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ color: muted, fontSize: 11 }}>{mockProfile.handle}</span>
                </div>
                {/* Bio */}
                <p style={{ color: muted, fontSize: 12, lineHeight: 1.6, maxWidth: 360 }}>{mockProfile.bio}</p>
                {/* Stats — hide Likes if Instagram-only */}
                <div className="flex items-center justify-center gap-5">
                  {[
                    { icon: <Users className="w-3 h-3" />, val: formatCount(mockProfile.followers), label: 'Followers' },
                    { icon: <Video className="w-3 h-3" />, val: formatCount(mockProfile.videoCount), label: 'Videos' },
                    ...(mockProfile.platforms.some(p => p !== 'Instagram') ? [{ icon: <Heart className="w-3 h-3" />, val: formatCount(mockProfile.likes), label: 'Likes' }] : []),
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5" style={{ fontSize: 11 }}>
                      <span style={{ color: '#f59e0b' }}>{s.icon}</span>
                      <span style={{ color: isDark ? '#f9fafb' : '#111827', fontWeight: 700 }}>{s.val}</span>
                      <span style={{ color: muted }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profilePhase === 'configure' ? (
              <div className="flex flex-col gap-4 px-6 pt-4 pb-6" style={{ minHeight: 280 }}>
                {/* Header row: label + inline date range */}
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-center w-full" style={{ color: text, fontWeight: 700 }}>Download types</p>
                  <div className="flex-shrink-0 relative" style={{ marginLeft: -120 }}>
                    <select
                      value={profileDateRange}
                      onChange={e => setProfileDateRange(e.target.value)}
                      className="text-[11px] rounded-lg px-2 py-1 outline-none appearance-none pr-5 cursor-pointer"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}`, color: muted }}
                    >
                      {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'All content', 'Custom'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 10, height: 10, color: muted }} />
                  </div>
                </div>

                {/* Custom date inputs */}
                {profileDateRange === 'Custom' && (
                  <div className="flex items-center gap-2">
                    <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-[12px] outline-none flex-1"
                      style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, color: text }}
                    />
                    <span className="text-[11px]" style={{ color: muted }}>to</span>
                    <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-[12px] outline-none flex-1"
                      style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, color: text }}
                    />
                  </div>
                )}

                {/* Type cards */}
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: 'videos' as const, label: 'Videos', icon: <Film className="w-5 h-5" /> },
                    { key: 'covers' as const, label: 'Cover Images', icon: <ImageIcon className="w-5 h-5" /> },
                    { key: 'data' as const, label: 'Video Data', icon: <FileText className="w-5 h-5" /> },
                  ]).map(item => {
                    const checked = profileTypes[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => setProfileTypes(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className="relative flex flex-col rounded-2xl overflow-hidden text-center"
                        style={{
                          border: `1px solid ${checked ? 'rgba(245,158,11,0.35)' : border}`,
                          background: checked
                            ? (isDark ? 'rgba(245,158,11,0.07)' : 'rgba(245,158,11,0.05)')
                            : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <div
                          className="absolute top-3 left-3 flex items-center justify-center flex-shrink-0"
                          style={{
                            width: 16, height: 16, borderRadius: '50%',
                            border: `2px solid ${checked ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db')}`,
                            background: checked ? '#f59e0b' : 'transparent',
                            transition: 'border-color 0.15s, background 0.15s',
                          }}
                        >
                          {checked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <div className="px-4 pt-8 pb-4 flex flex-col items-center gap-1.5">
                          <span style={{ color: checked ? '#f59e0b' : muted }}>{item.icon}</span>
                          <span className="text-[12px]" style={{ color: text, fontWeight: 600 }}>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : profilePhase === 'confirmDownload' ? (
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center gap-5 rounded-2xl py-8 px-6"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="text-center flex flex-col gap-1">
                    <p style={{ color: text, fontWeight: 700, fontSize: 14 }}>Confirm Download</p>
                    <p style={{ color: muted, fontSize: 13, lineHeight: '1.5' }}>You'll receive an email notification when your download is ready.</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setProfilePhase('configure')}
                      className="flex items-center justify-center text-[12px]"
                      style={{ width: 172, height: 32, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.08)', color: text, fontWeight: 500 }}
                    >Back</button>
                    <button
                      onClick={() => setProfilePhase('downloadProcessing')}
                      className="flex items-center justify-center text-[12px]"
                      style={{ width: 172, height: 32, borderRadius: 14, background: '#eeb900', color: '#fff', fontWeight: 500 }}
                    >Yes, Download</button>
                  </div>
                </div>
              </div>
            ) : profilePhase === 'downloadProcessing' ? (
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center gap-4 rounded-2xl py-8 px-6"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
                  <svg className="w-9 h-9 animate-spin" style={{ color: '#f59e0b' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40 20" strokeLinecap="round" />
                  </svg>
                  <div className="text-center flex flex-col gap-1">
                    <p style={{ color: text, fontWeight: 700, fontSize: 14 }}>Your download is processing</p>
                    <p style={{ color: muted, fontSize: 13, lineHeight: '1.5' }}>This can take minutes to hours. You'll receive an email notification when complete.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setProfilePhase(null); setMockProfile(null); }}
                      className="flex items-center justify-center px-4 h-8 rounded-2xl text-[12px] transition-opacity"
                      style={{ background: '#eeb900', color: '#fff', fontWeight: 500 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                    >
                      Scan Another Profile
                    </button>
                    <button
                      onClick={() => { close(); navigate('/profiles'); }}
                      className="flex items-center justify-center px-4 h-8 rounded-2xl text-[12px] transition-opacity"
                      style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.08)', color: text, fontWeight: 500 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                    >
                      Add Another Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : profilePhase === 'scanDone' ? (
              <div className="px-6 pb-6">
                <div
                  className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  </div>
                  <p style={{ color: isDark ? '#f9fafb' : '#111', fontWeight: 700, fontSize: 14 }}>Scan complete!</p>
                  <div className="w-full" style={{ height: 5, borderRadius: 20, background: '#f59e0b' }} />
                  <p style={{ color: isDark ? '#f9fafb' : '#111', fontWeight: 700, fontSize: 14 }}>100%</p>
                </div>
              </div>
            ) : profilePhase === 'preview' && mockProfile ? (
              /* ── Preview: playable videos + buttons inside card ── */
              <div className="pb-5">
                <div style={{ height: 242, overflow: 'hidden', marginBottom: 16 }}>
                  <div className="flex items-center justify-center gap-3" style={{ height: '100%' }}>
                    {mockProfile.recentThumbs.map((thumb, i) => (
                      <div
                        key={i}
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ width: 136, height: 242, borderRadius: 16, background: '#111', cursor: 'pointer' }}
                        onClick={() => {
                          const vid = videoRefs.current[i];
                          if (!vid) return;
                          if (playingVideo === i) {
                            vid.pause();
                            setPlayingVideo(null);
                          } else {
                            videoRefs.current.forEach(v => { if (v) v.pause(); });
                            const p = vid.play();
                            if (p !== undefined) {
                              p.then(() => setPlayingVideo(i)).catch(() => setPlayingVideo(null));
                            } else {
                              setPlayingVideo(i);
                            }
                          }
                        }}
                      >
                        <video
                          ref={el => { videoRefs.current[i] = el; }}
                          src={mockProfile.recentVideos[i]}
                          poster={thumb}
                          playsInline
                          preload="auto"
                          muted
                          onEnded={() => setPlayingVideo(null)}
                          className="w-full h-full"
                          style={{ objectFit: 'cover', borderRadius: 16 }}
                        />
                        <div className="absolute inset-0 pointer-events-none" style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 40%, transparent 70%)',
                          borderRadius: 16,
                        }} />
                        {playingVideo !== i && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: 'rgba(255,255,255,0.88)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              backdropFilter: 'blur(4px)',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#111" style={{ marginLeft: 2 }}>
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 px-6">
                  <button
                    onClick={() => { setProfilePhase(null); setMockProfile(null); }}
                    className="flex items-center justify-center px-6 py-2.5 rounded-xl text-sm transition-colors"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.08)',
                      color: isDark ? '#e5e7eb' : '#111',
                      fontWeight: 500,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(17,17,17,0.13)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.08)'; }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setProfilePhase('configure')}
                    className="flex items-center justify-center px-6 py-2.5 rounded-xl text-sm transition-opacity"
                    style={{ background: '#eeb900', color: '#fff', fontWeight: 500 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Footer button — configure phase ── */}
          {profilePhase === 'configure' && (profileTypes.videos || profileTypes.covers || profileTypes.data) && (
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => setProfilePhase('confirmDownload')}
                className="flex items-center justify-center text-[12px] transition-opacity"
                style={{ width: 172, height: 32, borderRadius: 14, background: '#eeb900', color: '#fff', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
              >
                Download
              </button>
            </div>
          )}


        </div>
      ) : (
        <>
          {/* ── Tinted Content Area ─────────────────────────────────────── */}
          <div className="w-full max-w-2xl">
            <div
              className="rounded-2xl transition-all"
              style={{
                background: `linear-gradient(180deg, ${currentTab.color}14 0%, ${pageBg} 100%)`,
                border: `1px solid ${isFocused ? `${currentTab.color}55` : `${currentTab.color}35`}`,
                transition: 'border-color 0.2s, background 0.3s',
              }}
            >
              {/* Input area */}
              {bulkScanPhase && activeInputTab === 'transcripts' ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4" style={{ minHeight: 180 }}>
                  {/* Scanning animation */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,184,178,0.1)' }}>
                      <OutlineSearchMagnifer className="w-5 h-5" style={{ color: '#00b8b2' }} />
                    </div>
                    {bulkScanPhase === 'scanning' && (
                      <div className="absolute inset-0 rounded-full border-2 border-transparent"
                        style={{
                          borderTopColor: '#00b8b2',
                          animation: 'spin 1s linear infinite'
                        }} />
                    )}
                    {bulkScanPhase === 'done' && (
                      <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#00b8b2' }}>
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Status text */}
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: text }}>
                      {bulkScanPhase === 'scanning' ? 'Detecting videos...' : 'Ready!'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: muted }}>
                      {bulkScanPhase === 'scanning'
                        ? `Scanning ${validLines.length} URL${validLines.length !== 1 ? 's' : ''}...`
                        : `${validLines.length} video${validLines.length !== 1 ? 's' : ''} detected`}
                    </p>
                  </div>

                  {/* Platform breakdown */}
                  {Object.keys(detectedPlatforms).length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {Object.entries(detectedPlatforms).map(([platform, count]) => (
                        <span key={platform} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: text }}>
                          {count} {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="w-48 h-1.5 rounded-full overflow-hidden"
                    style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${bulkScanProgress}%`, background: '#00b8b2' }} />
                  </div>
                </div>
              ) : (
                <div className="px-5 pt-4 pb-3">
                  <textarea
                    ref={textareaRef}
                    value={currentValue}
                    onChange={(e) => {
                      if (activeInputTab !== 'collections') {
                        const ls = e.target.value.split('\n');
                        if (ls.filter(l => l.trim()).length > MAX_LINKS) return;
                      }
                      setCurrentValue(e.target.value);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholders[activeInputTab]}
                    className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed"
                    style={{ color: isDark ? '#e3e3e3' : '#111111', height: 80, minHeight: 80, maxHeight: 80 }}
                  />
                </div>
              )}

              {/* Bottom bar — actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  {/* Retranslate dropdown — only for transcripts */}
                  {activeInputTab === 'transcripts' && (
                    <div className="relative">
                      <button
                        onClick={() => setLangOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-xs transition-colors"
                        style={{ color: muted }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#cccccc' : '#374151'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Retranslate
                        <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {langOpen && (
                        <div
                          className="absolute left-0 bottom-full mb-2 w-40 rounded-xl shadow-lg overflow-hidden z-50"
                          style={{
                            background: isDark ? '#1a1a1a' : '#ffffff',
                            border: `1px solid ${border}`,
                          }}
                        >
                          <div className="py-1 max-h-52 overflow-y-auto">
                            {LANGUAGES.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                                className="text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between rounded-md"
                                style={{
                                  margin: '2px 6px',
                                  width: 'calc(100% - 12px)',
                                  background: selectedLang === lang
                                    ? (isDark ? 'rgba(255,255,255,0.08)' : '#f0e8e0')
                                    : 'transparent',
                                  color: selectedLang === lang
                                    ? (isDark ? '#ffffff' : '#6b4c3b')
                                    : (isDark ? '#999999' : '#6b7280'),
                                  fontWeight: selectedLang === lang ? 500 : 400,
                                }}
                                onMouseEnter={e => {
                                  if (selectedLang !== lang) {
                                    (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f7f2ee';
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (selectedLang !== lang) {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                  }
                                }}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (activeInputTab === 'profiles' && lines.length > 0) {
                        const handle = extractHandle(lines[0]);
                        const platform = inferPlatform(lines[0]);
                        setMockProfile(generateMockProfile(handle, platform));
                        setProfilePhase('preview');
                        return;
                      }
                      if (activeInputTab === 'transcripts' && validLines.length > 0) {
                        if (bulkScanPhase === 'scanning') return;
                        // Free tier goes to freeresult
                        if (plan === 'free') {
                          navigate('/freeresult');
                          return;
                        }

                        // Pro tier: in-modal scanning animation
                        const platforms: Record<string, number> = {};
                        validLines.forEach(url => {
                          const p = inferPlatform(url);
                          platforms[p] = (platforms[p] || 0) + 1;
                        });
                        setDetectedPlatforms(platforms);
                        setBulkScanPhase('scanning');
                        setBulkScanProgress(0);

                        let p = 0;
                        const interval = setInterval(() => {
                          p += Math.random() * 18 + 8;
                          if (p >= 100) {
                            clearInterval(interval);
                            setBulkScanProgress(100);
                            setBulkScanPhase('done');

                            bulkScanTimeoutRef.current = setTimeout(() => {
                              const batchId = Date.now();
                              const batch: BulkBatch = {
                                id: batchId,
                                name: `Batch — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                                createdAt: batchId,
                                status: 'processing',
                                videos: validLines.map((url, i) => ({
                                  id: batchId + i + 1,
                                  url,
                                  title: url.length > 50 ? url.slice(0, 47) + '...' : url,
                                  platform: inferPlatform(url),
                                  status: 'pending' as const,
                                  progress: 0,
                                })),
                              };
                              addBulkBatch(batch);
                              setActiveBatchId(batchId);

                              // Reset modal state
                              setBulkScanPhase(null);
                              setBulkScanProgress(0);
                              setDetectedPlatforms({});
                              close();
                              navigate('/dashboard');
                            }, 800);
                          } else {
                            setBulkScanProgress(Math.round(p));
                          }
                        }, 500);
                        return;
                      }
                      if (activeInputTab === 'videos' && validLines.length > 0) {
                        setPendingVideoLinks(validLines);
                        close();
                        navigate('/videos/results', { state: { links: validLines } });
                      } else {
                        navigate('/freeresult');
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 h-8 rounded-xl transition-colors text-white text-xs font-medium flex-shrink-0"
                    style={{
                      background: currentTab.color,
                      ...(activeInputTab === 'transcripts' && bulkScanPhase === 'scanning'
                        ? { opacity: 0.5, pointerEvents: 'none' as const }
                        : {}),
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = activeInputTab === 'transcripts' && bulkScanPhase === 'scanning' ? '0.5' : '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = activeInputTab === 'transcripts' && bulkScanPhase === 'scanning' ? '0.5' : '1'; }}
                  >
                    {buttonIcons[activeInputTab]}
                    {buttonLabels[activeInputTab]}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Supported Platforms ───────────────────────────────────── */}
          <div className="w-full max-w-2xl mt-5 flex items-center justify-center gap-1.5">
            <span className="text-[11px]" style={{ color: muted }}>Supports:</span>
            {TAB_PLATFORMS[activeInputTab].map((p, i) => (
              <React.Fragment key={p.name}>
                {i > 0 && <span className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>·</span>}
                <span className="flex items-center gap-1">
                  {p.name === 'TikTok' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.03Z" fill={isDark ? '#ffffff' : '#010101'}/>
                    </svg>
                  )}
                  {p.name === 'YouTube' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.84.55 9.38.55 9.38.55s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" fill="#FF0000"/>
                    </svg>
                  )}
                  {p.name === 'Instagram' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.25 2.43.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.97-.41 2.43a4.07 4.07 0 0 1-.98 1.51c-.46.46-.9.74-1.51.98-.46.16-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.25-2.43-.41a4.07 4.07 0 0 1-1.51-.98 4.07 4.07 0 0 1-.98-1.51c-.16-.46-.36-1.26-.41-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.97.41-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.16 1.35A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.47 1.35 2.16a5.88 5.88 0 0 0 2.16 1.35c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.16-1.35 5.88 5.88 0 0 0 1.35-2.16c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.35-2.16A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Z" fill="#E1306C"/>
                      <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="#E1306C"/>
                      <circle cx="18.41" cy="5.59" r="1.44" fill="#E1306C"/>
                    </svg>
                  )}
                  <span className="text-[11px]" style={{ color: muted }}>{p.name}</span>
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* ── How It Works ─────────────────────────────────────────── */}
          <div className="w-full max-w-2xl mt-8 mb-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
              }}
            >
              <div className="grid grid-cols-2" style={{ minHeight: 220 }}>
                {/* Left column — title + video */}
                <div className="flex flex-col p-5" style={{ borderRight: `1px solid ${border}` }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: text }}>How it works</p>
                  <p className="text-[11px] leading-relaxed mb-4" style={{ color: muted }}>{TAB_HOW_DESC[activeInputTab]}</p>
                  <div
                    className="flex-1 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', aspectRatio: '16/9' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.7)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                {/* Right column — 3 steps */}
                <div className="flex flex-col justify-center p-5 gap-4">
                  {TAB_STEPS[activeInputTab].map((step, i) => (
                    <div key={step.label} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: `${currentTab.color}15`,
                          color: currentTab.color,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: text }}>{step.label}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: muted }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
export default function NewTranscriptModal() {
  const { isOpen, close } = useNewTranscript();
  const { isDark } = useContext(ThemeContext);

  if (!isOpen) return null;

  const muted = isDark ? '#888888' : '#6b7280';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={close}
    >
      <div
        className="relative w-full flex flex-col rounded-2xl overflow-hidden"
        style={{
          maxWidth: 680,
          background: isDark ? '#0d0d0d' : '#ffffff',
          boxShadow: isDark
            ? '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(0,0,0,0.08), 0 24px 80px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg transition-colors"
          style={{ color: muted }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <X className="w-4 h-4" />
        </button>
        <InlineNewTranscriptionView onBack={close} />
      </div>
    </div>
  );
}
