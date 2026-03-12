import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText, Video, Layers, User, Link2, Sparkles, Download, FolderInput, Users, Globe, ChevronDown, Play, X,
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

// ─── Inline New Transcription View ───────────────────────────────────────────
function InlineNewTranscriptionView({ onBack }: { onBack: () => void }) {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeInputTab, setActiveInputTab] = useState<InputTab>('transcripts');
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
              onClick={() => setActiveInputTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={{
                background: isActive
                  ? (isDark ? '#222222' : '#ffffff')
                  : 'transparent',
                color: isActive ? text : muted,
                boxShadow: isActive
                  ? (isDark ? '0 2px 6px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.1)')
                  : 'none',
              }}
            >
              <span style={{ color: isActive ? tab.color : muted }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tinted Content Area ───────────────────────────────────────────── */}
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
                onClick={() => navigate('/freeresult')}
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

      {/* ── Supported Platforms ─────────────────────────────────────────── */}
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

      {/* ── How It Works ───────────────────────────────────────────────── */}
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
