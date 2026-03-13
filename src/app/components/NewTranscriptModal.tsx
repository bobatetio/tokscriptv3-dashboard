import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText, Video, Layers, User, Link2, Sparkles, Download, FolderInput, Users, Globe, ChevronDown, Play, X, CheckCircle, Film, Image as ImageIcon, ArrowRight,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNewTranscript } from '../context/NewTranscriptContext';
import OutlineSearchMagnifer from '../../imports/OutlineSearchMagnifer';

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

function inferPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('tiktok.com')) return 'TikTok';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
  if (lower.includes('instagram.com')) return 'Instagram';
  return 'TikTok';
}

function generateMockProfile(handle: string, platform: string) {
  const hash = handle.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const followers = [1200000, 542000, 89000, 2400000, 150000][(hash % 5)];
  const following = [340, 1200, 890, 520, 2100][(hash % 5)];
  const videoCount = [214, 347, 89, 1205, 56][(hash % 5)];
  const displayNames = ['Creator', 'Digital Creator', 'Content Studio', 'Official', 'Media'];
  return {
    handle: `@${handle}`,
    displayName: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/[_-]/g, ' '),
    platform,
    followers,
    following,
    videoCount,
    bio: `${displayNames[hash % 5]} | ${platform} creator`,
    verified: hash % 3 === 0,
    avatarUrl: `https://placehold.co/80x80/f59e0b/fff?text=${handle.charAt(0).toUpperCase()}`,
    recentThumbs: [
      `https://placehold.co/120x160/1a1a1a/666?text=1`,
      `https://placehold.co/120x160/1a1a1a/666?text=2`,
      `https://placehold.co/120x160/1a1a1a/666?text=3`,
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

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [profilePhase, setProfilePhase] = useState<'scanning' | 'preview' | 'configure' | 'finalScan' | 'scanDone' | null>(null);
  const [profileProgress, setProfileProgress] = useState(0);
  const [profileDateRange, setProfileDateRange] = useState('All content');
  const [profileTypes, setProfileTypes] = useState({ videos: true, covers: true, data: true });
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [scanDoneOrigin, setScanDoneOrigin] = useState<'initial' | 'final'>('initial');
  const [mockProfile, setMockProfile] = useState<ReturnType<typeof generateMockProfile> | null>(null);

  // ── scanDone transition effect ────────────────────────────────────────────
  React.useEffect(() => {
    if (profilePhase === 'scanDone') {
      const timer = setTimeout(() => {
        if (scanDoneOrigin === 'initial') {
          setProfilePhase('preview');
        } else {
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
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [profilePhase, scanDoneOrigin]);

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
        /* Wizard content — matches ScanWizardModal pattern from CreatorProfilePage */
        <div className="w-full max-w-2xl">
          <div
            className="rounded-2xl p-6"
            style={{
              background: `linear-gradient(180deg, #f59e0b14 0%, ${pageBg} 100%)`,
              border: `1px solid #f59e0b35`,
            }}
          >
            {(profilePhase === 'scanning' || profilePhase === 'finalScan') ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}>
                  <svg className="w-5 h-5 animate-spin" style={{ color: '#f59e0b' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40 20" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: text, fontWeight: 600 }}>
                  {profilePhase === 'finalScan' ? 'Scanning content...' : 'Scanning profiles...'}
                </p>
                <div className="w-full max-w-xs">
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${profileProgress}%`,
                        background: '#f59e0b',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <p className="text-xs text-center mt-2" style={{ color: muted }}>{profileProgress}%</p>
                </div>
              </div>
            ) : profilePhase === 'configure' ? (
              <div className="flex flex-col gap-4">
                {/* Date Range */}
                <div>
                  <p className="text-[12px] mb-1" style={{ color: text, fontWeight: 600 }}>Date Range</p>
                  <p className="text-[11px] mb-3" style={{ color: muted }}>Choose how far back to scan this profile's content.</p>
                  <div className="flex flex-wrap gap-2">
                    {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'All content', 'Custom'].map(range => {
                      const isActive = profileDateRange === range;
                      return (
                        <button
                          key={range}
                          onClick={() => setProfileDateRange(range)}
                          className="px-3 py-1.5 rounded-lg text-[11px] transition-all"
                          style={{
                            background: isActive ? (isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                            color: isActive ? '#f59e0b' : muted,
                            border: `1px solid ${isActive ? 'rgba(245,158,11,0.3)' : border}`,
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                  {profileDateRange === 'Custom' && (
                    <div className="flex items-center gap-2 mt-2.5">
                      <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] outline-none"
                        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, color: text }}
                      />
                      <span className="text-[10px]" style={{ color: muted }}>to</span>
                      <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] outline-none"
                        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, color: text }}
                      />
                    </div>
                  )}
                </div>

                {/* Download Types */}
                <div>
                  <p className="text-[12px] mb-1" style={{ color: text, fontWeight: 600 }}>Download Types</p>
                  <p className="text-[11px] mb-3" style={{ color: muted }}>Select what content to scan and download.</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {([
                      { key: 'videos' as const, label: 'Videos', desc: 'MP4 video files', icon: <Film className="w-4 h-4" /> },
                      { key: 'covers' as const, label: 'Cover Images', desc: 'PNG thumbnails', icon: <ImageIcon className="w-4 h-4" /> },
                      { key: 'data' as const, label: 'Data', desc: 'Metadata & transcripts', icon: <FileText className="w-4 h-4" /> },
                    ]).map(item => {
                      const checked = profileTypes[item.key];
                      return (
                        <button
                          key={item.key}
                          onClick={() => setProfileTypes(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className="flex flex-col rounded-xl overflow-hidden text-center"
                          style={{
                            border: `1px solid ${checked ? 'rgba(245,158,11,0.3)' : border}`,
                            background: checked
                              ? (isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)')
                              : 'transparent',
                          }}
                        >
                          {/* Top: icon + label + desc */}
                          <div className="px-3 pt-3 pb-2 flex flex-col items-center gap-1">
                            <span style={{ color: checked ? '#f59e0b' : muted }}>{item.icon}</span>
                            <span className="text-[11px]" style={{ color: text, fontWeight: 600 }}>{item.label}</span>
                            <span className="text-[10px]" style={{ color: muted }}>{item.desc}</span>
                          </div>
                          {/* Bottom: checkbox indicator */}
                          <div
                            className="flex items-center justify-center py-2"
                            style={{ borderTop: `1px solid ${checked ? 'rgba(245,158,11,0.2)' : border}` }}
                          >
                            <div className="w-3.5 h-3.5 rounded flex items-center justify-center"
                              style={{
                                background: checked ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
                                border: `1.5px solid ${checked ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.18)' : '#d1d5db')}`,
                              }}
                            >
                              {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start Scanning button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!profileTypes.videos && !profileTypes.covers && !profileTypes.data) return;
                      setProfilePhase('finalScan');
                      setProfileProgress(0);
                      let p = 0;
                      const interval = setInterval(() => {
                        p += Math.random() * 12 + 4;
                        if (p >= 100) {
                          clearInterval(interval);
                          setProfileProgress(100);
                          setTimeout(() => {
                            setScanDoneOrigin('final');
                            setProfilePhase('scanDone');
                          }, 500);
                        } else {
                          setProfileProgress(Math.round(p));
                        }
                      }, 500);
                    }}
                    disabled={!profileTypes.videos && !profileTypes.covers && !profileTypes.data}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] transition-all"
                    style={{
                      background: (profileTypes.videos || profileTypes.covers || profileTypes.data)
                        ? '#f59e0b'
                        : (isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'),
                      color: (profileTypes.videos || profileTypes.covers || profileTypes.data)
                        ? '#fff'
                        : muted,
                      fontWeight: 600,
                      cursor: (profileTypes.videos || profileTypes.covers || profileTypes.data) ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Start Scanning
                  </button>
                </div>
              </div>
            ) : profilePhase === 'scanDone' ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                </div>
                <p className="text-sm" style={{ color: text, fontWeight: 600 }}>Scan complete!</p>
                <div className="w-full max-w-xs">
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: '100%', background: '#f59e0b' }} />
                  </div>
                </div>
              </div>
            ) : profilePhase === 'preview' && mockProfile ? (
              <div className="flex flex-col gap-4">
                {/* Profile card */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${border}`,
                  }}
                >
                  {/* Top row: avatar + identity */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={mockProfile.avatarUrl}
                      alt={mockProfile.handle}
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 56, height: 56,
                        border: '2px solid rgba(245,158,11,0.3)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm" style={{ color: text, fontWeight: 600 }}>{mockProfile.handle}</span>
                        {mockProfile.verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />}
                        <span
                          className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                            color: muted,
                            border: `1px solid ${border}`,
                          }}
                        >
                          {mockProfile.platform}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: muted }}>{mockProfile.displayName}</p>
                      <p className="text-[11px] mt-1" style={{ color: muted, lineHeight: 1.5 }}>{mockProfile.bio}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mb-4">
                    {[
                      { label: 'followers', val: formatCount(mockProfile.followers) },
                      { label: 'following', val: formatCount(mockProfile.following) },
                      { label: 'videos', val: formatCount(mockProfile.videoCount) },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-1 text-[11px]">
                        <span style={{ color: text, fontWeight: 600 }}>{s.val}</span>
                        <span style={{ color: muted }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recent videos */}
                  <div>
                    <p className="text-[11px] mb-2" style={{ color: muted, fontWeight: 500 }}>Recent Videos</p>
                    <div className="flex gap-2">
                      {mockProfile.recentThumbs.map((thumb, i) => (
                        <div
                          key={i}
                          className="rounded-lg overflow-hidden flex-shrink-0"
                          style={{ width: 80, height: 112, background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6' }}
                        >
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setProfilePhase('configure')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] transition-all"
                    style={{ background: '#f59e0b', color: '#fff', fontWeight: 600 }}
                  >
                    Continue
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
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
                        setProfilePhase('scanning');
                        setProfileProgress(0);
                        let p = 0;
                        const interval = setInterval(() => {
                          p += Math.random() * 15 + 5;
                          if (p >= 100) {
                            clearInterval(interval);
                            setProfileProgress(100);
                            setTimeout(() => {
                              setScanDoneOrigin('initial');
                              setProfilePhase('scanDone');
                            }, 500);
                          } else {
                            setProfileProgress(Math.round(p));
                          }
                        }, 600);
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
                    style={{ background: currentTab.color }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
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
